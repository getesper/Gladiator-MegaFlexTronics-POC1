// MoveNet Pose Estimation - Higher accuracy than MediaPipe BlazePose
// Optimized for fitness and bodybuilding analysis
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export interface MoveNetKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

export interface MoveNetPose {
  keypoints: MoveNetKeypoint[];
  score: number;
}

export class MoveNetAnalyzer {
  private detector: poseDetection.PoseDetector | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Loading MoveNet Thunder model (highest accuracy)...');
    
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig: poseDetection.MoveNetModelConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // Highest accuracy
      enableSmoothing: true,
      minPoseScore: 0.25,
    };

    this.detector = await poseDetection.createDetector(model, detectorConfig);
    this.isInitialized = true;
    console.log('MoveNet Thunder model loaded successfully');
  }

  async detectPose(
    videoElement: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ): Promise<MoveNetPose | null> {
    if (!this.detector) {
      await this.initialize();
    }

    if (!this.detector) return null;

    try {
      const poses = await this.detector.estimatePoses(videoElement, {
        maxPoses: 1,
        flipHorizontal: false,
      });

      if (poses.length === 0) return null;

      const pose = poses[0];
      return {
        keypoints: pose.keypoints.map(kp => ({
          x: kp.x,
          y: kp.y,
          score: kp.score || 0,
          name: kp.name || 'unknown',
        })),
        score: pose.score || 0,
      };
    } catch (error) {
      console.error('Error detecting pose with MoveNet:', error);
      return null;
    }
  }

  // Convert MoveNet 17-keypoint format to MediaPipe-like 33-keypoint format
  // for backward compatibility with existing visualization code
  convertToMediaPipeFormat(moveNetPose: MoveNetPose): any {
    const keypointMap: Record<string, string> = {
      'nose': 'nose',
      'left_eye': 'left_eye',
      'right_eye': 'right_eye',
      'left_ear': 'left_ear',
      'right_ear': 'right_ear',
      'left_shoulder': 'left_shoulder',
      'right_shoulder': 'right_shoulder',
      'left_elbow': 'left_elbow',
      'right_elbow': 'right_elbow',
      'left_wrist': 'left_wrist',
      'right_wrist': 'right_wrist',
      'left_hip': 'left_hip',
      'right_hip': 'right_hip',
      'left_knee': 'left_knee',
      'right_knee': 'right_knee',
      'left_ankle': 'left_ankle',
      'right_ankle': 'right_ankle',
    };

    const mediaPipeLandmarks: any[] = [];
    
    // MoveNet has 17 keypoints, MediaPipe has 33
    // We'll fill the common ones and leave the rest empty
    for (const kp of moveNetPose.keypoints) {
      if (keypointMap[kp.name]) {
        mediaPipeLandmarks.push({
          x: kp.x,
          y: kp.y,
          z: 0,
          visibility: kp.score,
        });
      }
    }

    return mediaPipeLandmarks;
  }

  // Draw skeleton overlay (compatible with existing drawing code)
  drawSkeleton(
    ctx: CanvasRenderingContext2D,
    pose: MoveNetPose,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const minConfidence = 0.3;

    // Draw connections
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle'],
      ['nose', 'left_eye'],
      ['nose', 'right_eye'],
      ['left_eye', 'left_ear'],
      ['right_eye', 'right_ear'],
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    for (const [start, end] of connections) {
      const startKp = pose.keypoints.find(kp => kp.name === start);
      const endKp = pose.keypoints.find(kp => kp.name === end);

      if (startKp && endKp && startKp.score > minConfidence && endKp.score > minConfidence) {
        ctx.beginPath();
        ctx.moveTo(startKp.x, startKp.y);
        ctx.lineTo(endKp.x, endKp.y);
        ctx.stroke();
      }
    }

    // Draw keypoints
    for (const kp of pose.keypoints) {
      if (kp.score > minConfidence) {
        ctx.fillStyle = kp.score > 0.7 ? '#00ff00' : '#ffff00';
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

// Export singleton instance
export const moveNetAnalyzer = new MoveNetAnalyzer();
