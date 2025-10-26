import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import Anthropic from '@anthropic-ai/sdk';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// "claude-sonnet-4-20250514"
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface VisionAnalysisInput {
  frameBase64: string;
  measurements: {
    shoulderWidth?: number;
    bodyFat?: number;
    muscleBalance?: number;
  };
  detectedPoses: string[];
}

export interface VisionAnalysisResult {
  muscleDefinition: string;
  vascularity: string;
  conditioningNotes: string;
  overallImpression: string;
}

export interface CoachingInput {
  overallScore: number;
  muscularityScore: number;
  symmetryScore: number;
  conditioningScore: number;
  posingScore: number;
  aestheticsScore: number;
  measurements: any;
  detectedPoses: string[];
}

export interface CoachingResult {
  strengths: string[];
  areasToImprove: string[];
  specificRecommendations: string[];
  trainingFocus: string;
}

export async function analyzeVision(
  model: string,
  input: VisionAnalysisInput
): Promise<VisionAnalysisResult> {
  const prompt = `Analyze this bodybuilding pose image and provide detailed feedback on:
1. Muscle Definition: Assess muscle separation, striations, and definition quality
2. Vascularity: Evaluate visible vascularity and conditioning
3. Overall Conditioning: Rate dryness, hardness, and contest readiness

Context:
- Detected poses: ${input.detectedPoses.join(", ")}
- Shoulder width: ${input.measurements.shoulderWidth || "N/A"}
- Body fat estimate: ${input.measurements.bodyFat || "N/A"}%
- Muscle balance: ${input.measurements.muscleBalance || "N/A"}

Provide specific, actionable observations in JSON format:
{
  "muscleDefinition": "detailed assessment",
  "vascularity": "vascularity evaluation",
  "conditioningNotes": "conditioning analysis",
  "overallImpression": "summary"
}`;

  if (model === "gpt-4o") {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 1024,
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: { url: `data:image/jpeg;base64,${input.frameBase64}` } 
          }
        ]
      }]
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  if (model === "gemini-2.5-pro") {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            muscleDefinition: { type: "string" },
            vascularity: { type: "string" },
            conditioningNotes: { type: "string" },
            overallImpression: { type: "string" },
          },
          required: ["muscleDefinition", "vascularity", "conditioningNotes", "overallImpression"],
        },
      },
      contents: [
        {
          inlineData: {
            data: input.frameBase64,
            mimeType: "image/jpeg",
          },
        },
        prompt,
      ],
    });

    return JSON.parse(response.text || "{}");
  }

  if (model === "claude-sonnet-4") {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: input.frameBase64
            }
          },
          {
            type: "text",
            text: prompt + "\n\nRespond with valid JSON only."
          }
        ]
      }]
    });

    const textBlock = response.content.find((block: any) => block.type === "text") as any;
    return JSON.parse(textBlock?.text || "{}");
  }

  throw new Error(`Unsupported vision model: ${model}`);
}

export async function generateCoaching(
  model: string,
  input: CoachingInput
): Promise<CoachingResult> {
  const prompt = `As an expert bodybuilding coach, analyze this competitor's performance:

Scores (out of 100):
- Overall: ${input.overallScore}
- Muscularity: ${input.muscularityScore}
- Symmetry: ${input.symmetryScore}
- Conditioning: ${input.conditioningScore}
- Posing: ${input.posingScore}
- Aesthetics: ${input.aestheticsScore}

Detected Poses: ${input.detectedPoses.join(", ")}
Measurements: ${JSON.stringify(input.measurements)}

Provide personalized coaching in JSON format:
{
  "strengths": ["strength 1", "strength 2", ...],
  "areasToImprove": ["area 1", "area 2", ...],
  "specificRecommendations": ["recommendation 1", "recommendation 2", ...],
  "trainingFocus": "overall training focus summary"
}`;

  if (model === "gpt-4o") {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }]
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  if (model === "gemini-2.5-flash") {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            strengths: { type: "array", items: { type: "string" } },
            areasToImprove: { type: "array", items: { type: "string" } },
            specificRecommendations: { type: "array", items: { type: "string" } },
            trainingFocus: { type: "string" },
          },
          required: ["strengths", "areasToImprove", "specificRecommendations", "trainingFocus"],
        },
      },
      contents: prompt,
    });

    return JSON.parse(response.text || "{}");
  }

  if (model === "claude-sonnet-4") {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: prompt + "\n\nRespond with valid JSON only."
      }]
    });

    const textBlock = response.content.find((block: any) => block.type === "text") as any;
    return JSON.parse(textBlock?.text || "{}");
  }

  throw new Error(`Unsupported coaching model: ${model}`);
}

export interface PoseIdentificationInput {
  frameBase64: string;
}

export interface PoseIdentificationResult {
  poseName: string;
  confidence: number;
  quality: number;
  notes: string;
}

export async function identifyPoseFromFrame(
  model: string,
  input: PoseIdentificationInput
): Promise<PoseIdentificationResult> {
  const prompt = `You are an expert IFBB bodybuilding judge. Analyze this image and identify the specific bodybuilding pose being performed.

MANDATORY BODYBUILDING POSES:
1. frontDoubleBiceps - Front-facing with both arms raised, biceps flexed
2. frontLatSpread - Front-facing with arms at sides/hips, spreading lats wide
3. sideChest - Side view with chest expanded, one arm across body
4. backDoubleBiceps - Back-facing with both arms raised, showing back muscles
5. backLatSpread - Back-facing with arms spread, showing lat width
6. sideTriceps - Side view showing triceps, arm extended behind
7. absAndThighs - Front-facing with hands behind head or relaxed, showing abs
8. mostMuscular - Front-facing with arms/fists clenched, flexing everything
9. generalPose - Transition or relaxed pose, not a specific mandatory pose

Respond with JSON only:
{
  "poseName": "exact name from list above",
  "confidence": 0-100,
  "quality": 0-100,
  "notes": "brief explanation of what you see"
}

Quality criteria: muscle visibility, proper form, lighting, camera angle`;

  if (model === "gpt-4o") {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 512,
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: { url: `data:image/jpeg;base64,${input.frameBase64}` } 
          }
        ]
      }]
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  if (model === "gemini-2.5-pro") {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            poseName: { type: "string" },
            confidence: { type: "number" },
            quality: { type: "number" },
            notes: { type: "string" },
          },
          required: ["poseName", "confidence", "quality", "notes"],
        },
      },
      contents: [
        {
          inlineData: {
            data: input.frameBase64,
            mimeType: "image/jpeg",
          },
        },
        prompt,
      ],
    });

    return JSON.parse(response.text || "{}");
  }

  if (model === "claude-sonnet-4") {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: input.frameBase64
            }
          },
          {
            type: "text",
            text: prompt
          }
        ]
      }]
    });

    const textBlock = response.content.find((block: any) => block.type === "text") as any;
    return JSON.parse(textBlock?.text || "{}");
  }

  throw new Error(`Unsupported model for pose identification: ${model}`);
}
