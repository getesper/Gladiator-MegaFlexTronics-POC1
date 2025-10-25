import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { analyzeVideo } from "./poseAnalysis";
import { insertVideoAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

  // Serve video files from object storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error retrieving object:", error);
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
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
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

  const httpServer = createServer(app);

  return httpServer;
}
