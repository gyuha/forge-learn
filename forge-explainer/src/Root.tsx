import "./index.css";
import { Composition } from "remotion";
import { ForgeExplainer } from "./Composition";

// Audio (narration, forge 사용 매뉴얼 12분 버전, Edge TTS ko-KR-SunHiNeural) is 746.136s.
const FPS = 30;
const DURATION_IN_FRAMES = Math.ceil(746.136 * FPS); // 22385

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ForgeExplainer"
        component={ForgeExplainer}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
