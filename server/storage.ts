import { type VideoAnalysis, type InsertVideoAnalysis, videoAnalyses } from "@shared/schema";
import { db } from "../db/index";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getVideoAnalysis(id: string): Promise<VideoAnalysis | undefined>;
  getAllVideoAnalyses(): Promise<VideoAnalysis[]>;
  updateVideoAnalysis(id: string, updates: Partial<InsertVideoAnalysis>): Promise<VideoAnalysis>;
  deleteVideoAnalysis(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const [result] = await db.insert(videoAnalyses).values(analysis).returning();
    return result;
  }

  async getVideoAnalysis(id: string): Promise<VideoAnalysis | undefined> {
    const [result] = await db.select().from(videoAnalyses).where(eq(videoAnalyses.id, id));
    return result;
  }

  async getAllVideoAnalyses(): Promise<VideoAnalysis[]> {
    return db.select().from(videoAnalyses).orderBy(desc(videoAnalyses.createdAt));
  }

  async updateVideoAnalysis(id: string, updates: Partial<InsertVideoAnalysis>): Promise<VideoAnalysis> {
    const [result] = await db.update(videoAnalyses)
      .set(updates)
      .where(eq(videoAnalyses.id, id))
      .returning();
    return result;
  }

  async deleteVideoAnalysis(id: string): Promise<void> {
    await db.delete(videoAnalyses).where(eq(videoAnalyses.id, id));
  }
}

export const storage = new DatabaseStorage();
