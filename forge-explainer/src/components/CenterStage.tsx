import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { layout } from "../theme";
import { clamp, EASE_OUT } from "../util/anim";
import { SCENES } from "../scenes";

// Wraps a scene with a fade-in (and a short fade-out near its end) and keeps it
// in the safe area above the subtitle band.
const SceneWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const fadeOut = interpolate(frame, [dur - 5, dur], [1, 0], clamp);
  const opacity = Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: layout.centerPaddingBottom,
        paddingLeft: layout.safeX,
        paddingRight: layout.safeX,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const CenterStage: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {SCENES.map((s) => {
        const from = Math.round((s.startMs / 1000) * fps);
        const to = Math.round((s.endMs / 1000) * fps);
        const dur = Math.max(1, to - from);
        const Comp = s.render;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} layout="none">
            <SceneWrap dur={dur}>
              <Comp startMs={s.startMs} />
            </SceneWrap>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
