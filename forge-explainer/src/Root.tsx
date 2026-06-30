import "./index.css";
import { Composition } from "remotion";
import { ForgeExplainer } from "./Composition";

// Audio (narration extracted from base.mp4) is 1190.1s.
const FPS = 30;
const DURATION_IN_FRAMES = Math.ceil(1190.1 * FPS); // 35703

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
