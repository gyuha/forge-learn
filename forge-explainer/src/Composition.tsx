import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "./components/Background";
import { CenterStage } from "./components/CenterStage";
import { SubtitleTrack } from "./components/SubtitleTrack";

export const ForgeExplainer: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("narration.mp3")} />
      <Background />
      <CenterStage />
      <SubtitleTrack />
    </AbsoluteFill>
  );
};
