// MediaPipe Pose Skeleton Visualization
// Draws body landmarks and connections on canvas during video playback

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

const POSE_CONNECTIONS = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  
  // Torso
  [9, 10], // mouth
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  [11, 23], [12, 24], // shoulder to hip
  [23, 24], // hips
  
  // Left leg
  [23, 25], [25, 27], [27, 29], [27, 31],
  
  // Right leg
  [24, 26], [26, 28], [28, 30], [28, 32],
];

export function drawPoseSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  color: string = "#00ff00",
  lineWidth: number = 3
) {
  if (!landmarks || landmarks.length === 0) return;

  ctx.save();
  
  // Draw connections (bones)
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  
  POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    
    if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
      ctx.beginPath();
      ctx.moveTo(start.x * canvasWidth, start.y * canvasHeight);
      ctx.lineTo(end.x * canvasWidth, end.y * canvasHeight);
      ctx.stroke();
    }
  });
  
  // Draw landmarks (joints)
  ctx.fillStyle = color;
  landmarks.forEach((landmark, index) => {
    if (landmark.visibility > 0.5) {
      const x = landmark.x * canvasWidth;
      const y = landmark.y * canvasHeight;
      
      // Larger dots for key joints
      const isKeyJoint = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].includes(index);
      const radius = isKeyJoint ? 6 : 4;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // White center for better visibility
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, radius / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = color;
    }
  });
  
  ctx.restore();
}

export function findClosestPose(
  detectedPoses: Array<{ timestamp: number; landmarks?: any }>,
  currentTime: number
): any | null {
  if (!detectedPoses || detectedPoses.length === 0) return null;
  
  // Find pose with timestamp closest to current video time
  let closest = detectedPoses[0];
  let minDiff = Math.abs(closest.timestamp - currentTime);
  
  for (const pose of detectedPoses) {
    const diff = Math.abs(pose.timestamp - currentTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = pose;
    }
  }
  
  // Only return if within 1 second of the timestamp
  if (minDiff <= 1.0 && closest.landmarks) {
    return closest.landmarks;
  }
  
  return null;
}
