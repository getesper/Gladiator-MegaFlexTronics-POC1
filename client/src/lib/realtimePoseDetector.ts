// Real-time MediaPipe Pose Detection for Smooth Skeleton Tracking
// Uses the MediaPipe Pose library loaded from CDN

declare const window: Window & {
  Pose: any;
};

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export class RealtimePoseDetector {
  private pose: any | null = null;
  private isProcessing: boolean = false;
  private lastDetectionTime: number = 0;
  private throttleMs: number = 50; // Detect at max 20 FPS for smoothness

  async initialize(): Promise<void> {
    if (this.pose) return;

    // Wait for MediaPipe to be available
    if (typeof window.Pose === 'undefined') {
      throw new Error('MediaPipe Pose library not loaded');
    }

    this.pose = new window.Pose({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    this.pose.setOptions({
      modelComplexity: 1,        // Balance of speed and accuracy
      smoothLandmarks: true,     // Enable landmark smoothing for fluid tracking
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    console.log('Real-time pose detector initialized');
  }

  async detectPose(
    videoElement: HTMLVideoElement
  ): Promise<PoseLandmark[] | null> {
    if (!this.pose) {
      await this.initialize();
    }

    // Throttle detection to avoid overwhelming the system
    const now = Date.now();
    if (this.isProcessing || now - this.lastDetectionTime < this.throttleMs) {
      return null;
    }

    try {
      this.isProcessing = true;
      this.lastDetectionTime = now;

      return new Promise((resolve) => {
        this.pose.onResults((results: any) => {
          if (results.poseLandmarks) {
            resolve(results.poseLandmarks as PoseLandmark[]);
          } else {
            resolve(null);
          }
          this.isProcessing = false;
        });

        this.pose.send({ image: videoElement });
      });
    } catch (error) {
      console.error('Error detecting pose:', error);
      this.isProcessing = false;
      return null;
    }
  }

  cleanup(): void {
    if (this.pose) {
      this.pose.close();
      this.pose = null;
    }
  }
}

// Export singleton instance
export const realtimePoseDetector = new RealtimePoseDetector();
