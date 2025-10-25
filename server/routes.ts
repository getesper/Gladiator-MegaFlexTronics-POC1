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
      console.log("POST /api/analyses - Creating analysis", req.body);
      
      const bodySchema = z.object({
        videoURL: z.string(),
        videoName: z.string(),
        duration: z.number(),
        category: z.string().optional(),
      });

      const { videoURL, videoName, duration, category } = bodySchema.parse(req.body);
      console.log("Parsed request:", { videoName, duration, category });

      // Normalize the video URL to object path
      const videoPath = objectStorageService.normalizeObjectEntityPath(videoURL);
      console.log("Normalized video path:", videoPath);

      // Analyze the video and calculate scores
      console.log("Starting video analysis...");
      const analysisData = await analyzeVideo(videoPath, videoName, duration, category);
      console.log("Analysis complete, storing in database...");

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
