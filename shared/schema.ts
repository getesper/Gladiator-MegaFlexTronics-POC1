import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videoAnalyses = pgTable("video_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoUrl: text("video_url").notNull(),
  videoName: text("video_name").notNull(),
  category: text("category").notNull().default("bodybuilding"),
  duration: real("duration").notNull(),
  overallScore: integer("overall_score").notNull(),
  muscularityScore: integer("muscularity_score").notNull(),
  symmetryScore: integer("symmetry_score").notNull(),
  conditioningScore: integer("conditioning_score").notNull(),
  posingScore: integer("posing_score").notNull(),
  aestheticsScore: integer("aesthetics_score").notNull(),
  measurements: jsonb("measurements").notNull(),
  poseScores: jsonb("pose_scores").notNull(),
  muscleGroups: jsonb("muscle_groups").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  judgeNotes: jsonb("judge_notes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVideoAnalysisSchema = createInsertSchema(videoAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;
export type VideoAnalysis = typeof videoAnalyses.$inferSelect;
