import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { analyzeVideo } from "./poseAnalysis";
import { insertVideoAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import { analyzeVision, generateCoaching, identifyPoseFromFrame, analyzeMuscleGroups } from "./ai/aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

  // Serve video files from object storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      console.log("GET /objects - Request path:", req.path);
      console.log("GET /objects - Full URL:", req.url);
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      console.log("GET /objects - File retrieved successfully");
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error retrieving object from path:", req.path);
      console.error("Error details:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get presigned URL for video upload
  app.post("/api/objects/upload", async (req, res) => {
    try {
      console.log("POST /api/objects/upload - Generating presigned URL");
      const { filename } = req.body;
      const uploadURL = await objectStorageService.getObjectEntityUploadURL(filename);
      console.log("Generated upload URL successfully");
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Create video analysis after upload
  app.post("/api/analyses", async (req, res) => {
    try {
      console.log("POST /api/analyses - Creating analysis");
      
      // Accept either real analysis from client or generate synthetic
      const bodySchema = z.object({
        videoURL: z.string(),
        videoName: z.string(),
        duration: z.number(),
        category: z.string().optional(),
        // Real analysis data from client (optional)
        muscularityScore: z.number().optional(),
        symmetryScore: z.number().optional(),
        conditioningScore: z.number().optional(),
        posingScore: z.number().optional(),
        aestheticsScore: z.number().optional(),
        measurements: z.any().optional(),
        detectedPoses: z.array(z.any()).optional(),
        muscleGroups: z.any().optional(),
        recommendations: z.array(z.any()).optional(),
        judgeNotes: z.array(z.any()).optional(),
      });

      const requestData = bodySchema.parse(req.body);
      console.log("Real analysis data received:", !!requestData.detectedPoses);

      // Normalize the video URL to object path
      const videoPath = objectStorageService.normalizeObjectEntityPath(requestData.videoURL);

      // If client provided real analysis data, use it
      let analysisData;
      if (requestData.detectedPoses && requestData.measurements) {
        console.log("Using real analysis data from client");
        
        // Build poseScores from detectedPoses
        const poseScores: Record<string, number> = {};
        requestData.detectedPoses.forEach((pose: any) => {
          poseScores[pose.poseName] = pose.score;
        });

        const overallScore = Math.round(
          ((requestData.muscularityScore || 0) +
            (requestData.symmetryScore || 0) +
            (requestData.conditioningScore || 0) +
            (requestData.posingScore || 0) +
            (requestData.aestheticsScore || 0)) / 5
        );

        analysisData = {
          videoUrl: videoPath,
          videoName: requestData.videoName,
          category: requestData.category || "bodybuilding",
          duration: requestData.duration,
          overallScore,
          muscularityScore: requestData.muscularityScore || 0,
          symmetryScore: requestData.symmetryScore || 0,
          conditioningScore: requestData.conditioningScore || 0,
          posingScore: requestData.posingScore || 0,
          aestheticsScore: requestData.aestheticsScore || 0,
          measurements: requestData.measurements,
          poseScores,
          detectedPoses: requestData.detectedPoses,
          muscleGroups: requestData.muscleGroups || {},
          recommendations: requestData.recommendations || [],
          judgeNotes: requestData.judgeNotes || [],
        };
      } else {
        // Fallback to synthetic data if client didn't provide analysis
        console.log("No real analysis data - using synthetic fallback");
        analysisData = await analyzeVideo(videoPath, requestData.videoName, requestData.duration, requestData.category);
      }

      // Store analysis in database
      const analysis = await storage.createVideoAnalysis(analysisData);
      console.log("Analysis stored with ID:", analysis.id);

      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating analysis:", error);
      res.status(500).json({ error: "Failed to create analysis" });
    }
  });

  // Get all video analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllVideoAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  // Get single video analysis
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getVideoAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  });

  // Delete video analysis
  app.delete("/api/analyses/:id", async (req, res) => {
    try {
      await storage.deleteVideoAnalysis(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting analysis:", error);
      res.status(500).json({ error: "Failed to delete analysis" });
    }
  });

  // AI Vision Analysis (analyzes key frames for muscle definition)
  app.post("/api/analyses/:id/vision", async (req, res) => {
    try {
      console.log(`POST /api/analyses/${req.params.id}/vision - Running vision analysis`);
      
      const bodySchema = z.object({
        model: z.string(),
        frameBase64: z.string(),
      });

      const { model, frameBase64 } = bodySchema.parse(req.body);
      
      // Get the analysis to extract measurements and poses
      const analysis = await storage.getVideoAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      // Run vision analysis
      const visionResult = await analyzeVision(model, {
        frameBase64,
        measurements: analysis.measurements as any || {},
        detectedPoses: (analysis.detectedPoses as any[])?.map(p => p.poseName) || [],
      });

      // Update analysis with vision results
      await storage.updateVideoAnalysis(req.params.id, {
        vlmAnalysis: JSON.stringify({
          muscleDefinition: visionResult.muscleDefinition,
          vascularity: visionResult.vascularity,
          conditioningNotes: visionResult.conditioningNotes,
          overallImpression: visionResult.overallImpression,
        }),
      });

      res.json(visionResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error in vision analysis:", error);
      res.status(500).json({ error: "Failed to run vision analysis" });
    }
  });

  // VLM Pose Re-Identification (uses VLM to correctly identify poses from frames)
  app.post("/api/analyses/:id/identify-poses", async (req, res) => {
    try {
      console.log(`POST /api/analyses/${req.params.id}/identify-poses - Re-identifying poses with VLM`);
      
      const bodySchema = z.object({
        model: z.string().default("gpt-4o"),
      });

      const { model } = bodySchema.parse(req.body);
      
      // Get the analysis
      const analysis = await storage.getVideoAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      const detectedPoses = analysis.detectedPoses as any[] || [];
      
      if (detectedPoses.length === 0) {
        return res.status(400).json({ error: "No poses found to re-identify" });
      }

      console.log(`Re-identifying ${detectedPoses.length} poses using ${model}`);

      // Re-identify each pose using VLM
      const reidentifiedPoses = await Promise.all(
        detectedPoses.map(async (pose) => {
          if (!pose.frameSnapshot) {
            console.warn(`Pose at ${pose.timestamp}s has no frame snapshot, skipping`);
            return pose;
          }

          try {
            // Extract base64 from data URL
            const base64Data = pose.frameSnapshot.split(",")[1] || pose.frameSnapshot;
            
            const result = await identifyPoseFromFrame(model, {
              frameBase64: base64Data
            });

            return {
              ...pose,
              poseName: result.poseName,
              score: Math.round(result.quality),
              confidence: result.confidence,
              vlmNotes: result.notes,
            };
          } catch (error) {
            console.error(`Error identifying pose at ${pose.timestamp}s:`, error);
            return pose; // Keep original if identification fails
          }
        })
      );

      // Update analysis with corrected poses
      const updatedPoseScores: Record<string, number> = {};
      reidentifiedPoses.forEach(pose => {
        updatedPoseScores[pose.poseName] = Math.max(
          updatedPoseScores[pose.poseName] || 0,
          pose.score
        );
      });

      await storage.updateVideoAnalysis(req.params.id, {
        detectedPoses: reidentifiedPoses as any,
        poseScores: updatedPoseScores as any,
      });

      console.log(`Successfully re-identified poses. Found: ${Object.keys(updatedPoseScores).join(", ")}`);

      res.json({
        message: "Poses re-identified successfully",
        detectedPoses: reidentifiedPoses,
        summary: {
          totalPoses: reidentifiedPoses.length,
          uniquePoses: Object.keys(updatedPoseScores).length,
          poseTypes: Object.keys(updatedPoseScores),
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error re-identifying poses:", error);
      res.status(500).json({ error: "Failed to re-identify poses" });
    }
  });

  // AI Coaching Feedback (generates recommendations from measurements)
  app.post("/api/analyses/:id/coaching", async (req, res) => {
    try {
      console.log(`POST /api/analyses/${req.params.id}/coaching - Generating coaching feedback`);
      
      const bodySchema = z.object({
        model: z.string(),
      });

      const { model } = bodySchema.parse(req.body);
      
      // Get the analysis
      const analysis = await storage.getVideoAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      // Generate coaching feedback
      const coachingResult = await generateCoaching(model, {
        overallScore: analysis.overallScore,
        muscularityScore: analysis.muscularityScore,
        symmetryScore: analysis.symmetryScore,
        conditioningScore: analysis.conditioningScore,
        posingScore: analysis.posingScore,
        aestheticsScore: analysis.aestheticsScore,
        measurements: analysis.measurements,
        detectedPoses: (analysis.detectedPoses as any[])?.map(p => p.poseName) || [],
      });

      // Update analysis with coaching results
      await storage.updateVideoAnalysis(req.params.id, {
        coachingFeedback: JSON.stringify(coachingResult),
      });

      res.json(coachingResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error generating coaching:", error);
      res.status(500).json({ error: "Failed to generate coaching feedback" });
    }
  });

  // Detailed Muscle Analysis (VLM analyzes individual muscle groups)
  app.post("/api/analyses/:id/muscle-analysis", async (req, res) => {
    try {
      console.log(`POST /api/analyses/${req.params.id}/muscle-analysis - Running detailed muscle analysis`);
      
      const bodySchema = z.object({
        model: z.string(),
        frameBase64: z.string(),
      });

      const { model, frameBase64 } = bodySchema.parse(req.body);
      
      // Get the analysis
      const analysis = await storage.getVideoAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      // Run detailed muscle analysis
      const muscleAnalysisResult = await analyzeMuscleGroups(model, {
        frameBase64,
      });

      // Update analysis with muscle analysis results
      await storage.updateVideoAnalysis(req.params.id, {
        muscleAnalysis: muscleAnalysisResult as any,
      });

      console.log("Muscle analysis complete");
      res.json(muscleAnalysisResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error in muscle analysis:", error);
      res.status(500).json({ error: "Failed to run muscle analysis" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
