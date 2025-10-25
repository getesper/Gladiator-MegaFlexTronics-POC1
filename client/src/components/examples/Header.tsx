import { Header } from "../Header";

export default function HeaderExample() {
  return (
    <Header onNewAnalysis={() => console.log("New analysis clicked")} />
  );
}
