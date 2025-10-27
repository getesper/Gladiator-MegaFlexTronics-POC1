// BodyPix Body Part Segmentation
// Segments body into 24 distinct parts for muscle region identification
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs-backend-webgl';

export interface BodyPartSegmentation {
  data: Int32Array;
  width: number;
  height: number;
  allPoses: Array<{
    score: number;
    keypoints: Array<{
      score: number;
      part: string;
      position: { x: number; y: number };
    }>;
  }>;
}

// 24 Body Parts from BodyPix
export const BODY_PARTS = [
  'left_face',
  'right_face',
  'left_upper_arm_front',
  'left_upper_arm_back',
  'right_upper_arm_front',
  'right_upper_arm_back',
  'left_lower_arm_front',
  'left_lower_arm_back',
  'right_lower_arm_front',
  'right_lower_arm_back',
  'left_hand',
  'right_hand',
  'torso_front',
  'torso_back',
  'left_upper_leg_front',
  'left_upper_leg_back',
  'right_upper_leg_front',
  'right_upper_leg_back',
  'left_lower_leg_front',
  'left_lower_leg_back',
  'right_lower_leg_front',
  'right_lower_leg_back',
  'left_foot',
  'right_foot',
];

// Color map for visualizing different body parts
export const BODY_PART_COLORS: Record<number, string> = {
  0: '#FF6B6B',  // left_face
  1: '#FF8E53',  // right_face
  2: '#4ECDC4',  // left_upper_arm_front (bicep)
  3: '#45B7D1',  // left_upper_arm_back (tricep)
  4: '#96CEB4',  // right_upper_arm_front
  5: '#88D8B0',  // right_upper_arm_back
  6: '#FFEAA7',  // left_lower_arm_front (forearm)
  7: '#FDCB6E',  // left_lower_arm_back
  8: '#DFE6E9',  // right_lower_arm_front
  9: '#B2BEC3',  // right_lower_arm_back
  10: '#F8A5C2', // left_hand
  11: '#F78FB3', // right_hand
  12: '#6C5CE7', // torso_front (chest/abs)
  13: '#A29BFE', // torso_back
  14: '#00B894', // left_upper_leg_front (quad)
  15: '#00D2D3', // left_upper_leg_back (hamstring)
  16: '#55EFC4', // right_upper_leg_front
  17: '#81ECEC', // right_upper_leg_back
  18: '#FD79A8', // left_lower_leg_front (calf)
  19: '#FF7675', // left_lower_leg_back
  20: '#E17055', // right_lower_leg_front
  21: '#D63031', // right_lower_leg_back
  22: '#FFA502', // left_foot
  23: '#FF6348', // right_foot
};

export class BodyPartSegmenter {
  private net: bodyPix.BodyPix | null = null;
  
  async initialize(): Promise<void> {
    if (this.net) return;
    
    console.log('Loading BodyPix model (optimized for accuracy)...');
    this.net = await bodyPix.load({
      architecture: 'ResNet50',  // Higher accuracy than MobileNetV1
      outputStride: 16,          // Balance of speed and accuracy
      multiplier: 1.0,           // Maximum multiplier for best accuracy
      quantBytes: 4              // Higher precision (4 bytes instead of 2)
    });
    console.log('BodyPix model loaded successfully with optimized settings');
  }
  
  async segmentBodyParts(
    imageElement: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ): Promise<BodyPartSegmentation | null> {
    if (!this.net) {
      await this.initialize();
    }
    
    if (!this.net) return null;
    
    try {
      const segmentation = await this.net.segmentPersonParts(imageElement, {
        flipHorizontal: false,
        internalResolution: 'high',  // Higher resolution for better accuracy
        segmentationThreshold: 0.6,   // Higher threshold for more confident predictions
      });
      
      return segmentation as BodyPartSegmentation;
    } catch (error) {
      console.error('Error segmenting body parts:', error);
      return null;
    }
  }
  
  async segmentMultiplePeople(
    imageElement: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ): Promise<any[] | null> {
    if (!this.net) {
      await this.initialize();
    }
    
    if (!this.net) return null;
    
    try {
      const segmentation = await this.net.segmentMultiPersonParts(imageElement, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.5,
        maxDetections: 5,
        scoreThreshold: 0.3,
        nmsRadius: 20,
      });
      
      return segmentation;
    } catch (error) {
      console.error('Error segmenting multiple people:', error);
      return null;
    }
  }
  
  drawBodyPartSegmentation(
    ctx: CanvasRenderingContext2D,
    segmentation: BodyPartSegmentation,
    opacity: number = 0.6
  ): void {
    const { data, width, height } = segmentation;
    
    // Create ImageData for the segmentation overlay
    const imageData = ctx.createImageData(width, height);
    
    for (let i = 0; i < data.length; i++) {
      const partId = data[i];
      
      if (partId >= 0) {
        // Get color for this body part
        const color = BODY_PART_COLORS[partId] || '#999999';
        const rgb = this.hexToRgb(color);
        
        const pixelIndex = i * 4;
        imageData.data[pixelIndex] = rgb.r;
        imageData.data[pixelIndex + 1] = rgb.g;
        imageData.data[pixelIndex + 2] = rgb.b;
        imageData.data[pixelIndex + 3] = opacity * 255; // Alpha
      }
    }
    
    // Draw to canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);
    
    // Scale to match canvas size
    ctx.drawImage(tempCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  
  drawBodyPartOutlines(
    ctx: CanvasRenderingContext2D,
    segmentation: BodyPartSegmentation,
    lineWidth: number = 2
  ): void {
    const { data, width, height } = segmentation;
    
    ctx.lineWidth = lineWidth;
    
    // Find edges between different body parts
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const index = y * width + x;
        const currentPart = data[index];
        const rightPart = data[index + 1];
        const bottomPart = data[index + width];
        
        // Draw edge if adjacent pixels are different parts
        if (currentPart !== rightPart && currentPart >= 0 && rightPart >= 0) {
          const scaleX = ctx.canvas.width / width;
          const scaleY = ctx.canvas.height / height;
          
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(x * scaleX, y * scaleY);
          ctx.lineTo((x + 1) * scaleX, y * scaleY);
          ctx.stroke();
        }
        
        if (currentPart !== bottomPart && currentPart >= 0 && bottomPart >= 0) {
          const scaleX = ctx.canvas.width / width;
          const scaleY = ctx.canvas.height / height;
          
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(x * scaleX, y * scaleY);
          ctx.lineTo(x * scaleX, (y + 1) * scaleY);
          ctx.stroke();
        }
      }
    }
  }
  
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }
  
  getBodyPartName(partId: number): string {
    return BODY_PARTS[partId] || 'unknown';
  }
  
  getMuscleGroupFromPart(partId: number): string {
    const partName = this.getBodyPartName(partId);
    
    // Map body parts to muscle groups
    if (partName.includes('upper_arm_front')) return 'Biceps';
    if (partName.includes('upper_arm_back')) return 'Triceps';
    if (partName.includes('lower_arm')) return 'Forearms';
    if (partName.includes('upper_leg_front')) return 'Quadriceps';
    if (partName.includes('upper_leg_back')) return 'Hamstrings';
    if (partName.includes('lower_leg')) return 'Calves';
    if (partName === 'torso_front') return 'Chest & Abs';
    if (partName === 'torso_back') return 'Back';
    if (partName.includes('hand')) return 'Hands';
    if (partName.includes('foot')) return 'Feet';
    if (partName.includes('face')) return 'Face';
    
    return 'Unknown';
  }
  
  // Calculate muscle region statistics from segmentation
  calculateMuscleStats(segmentation: BodyPartSegmentation): Record<string, number> {
    const { data, width, height } = segmentation;
    const totalPixels = width * height;
    const musclePixelCounts: Record<string, number> = {};
    
    // Count pixels for each muscle group
    for (let i = 0; i < data.length; i++) {
      const partId = data[i];
      if (partId >= 0) {
        const muscleGroup = this.getMuscleGroupFromPart(partId);
        musclePixelCounts[muscleGroup] = (musclePixelCounts[muscleGroup] || 0) + 1;
      }
    }
    
    // Convert to percentages
    const musclePercentages: Record<string, number> = {};
    for (const [muscle, count] of Object.entries(musclePixelCounts)) {
      musclePercentages[muscle] = (count / totalPixels) * 100;
    }
    
    return musclePercentages;
  }
}

// Export a singleton instance
export const bodyPartSegmenter = new BodyPartSegmenter();
