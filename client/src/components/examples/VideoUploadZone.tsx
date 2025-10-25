import { VideoUploadZone } from "../VideoUploadZone";

export default function VideoUploadZoneExample() {
  return (
    <VideoUploadZone
      onVideoSelect={(file) => console.log("Video selected:", file.name)}
    />
  );
}
