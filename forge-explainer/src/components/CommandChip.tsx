import { interpolate, useCurrentFrame } from "remotion";
import { mono } from "../fonts";
import { colors } from "../theme";
import { clamp, EASE_OUT, popScale } from "../util/anim";

// A pill rendering a forge command like /fg-ask. The leading slash and the
// "fg-" prefix are tinted with the accent color.
export const CommandChip: React.FC<{
  command: string; // e.g. "/fg-ask" or "/forge:fg-ask"
  fontSize?: number;
  delay?: number;
  active?: boolean;
  dim?: boolean;
}> = ({ command, fontSize = 56, delay = 0, active = true, dim = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });

  const padV = fontSize * 0.42;
  const padH = fontSize * 0.7;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: mono,
        fontSize,
        fontWeight: 600,
        letterSpacing: 0.5,
        padding: `${padV}px ${padH}px`,
        borderRadius: fontSize * 0.34,
        background: dim ? "#0E0E10" : colors.panel,
        border: `2px solid ${active && !dim ? colors.accent : colors.border}`,
        color: dim ? colors.faint : colors.white,
        boxShadow: active && !dim ? `0 0 ${fontSize}px rgba(255,138,0,0.22)` : "none",
        opacity: p,
        scale: popScale(p, 0.84),
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: dim ? colors.faint : colors.accent }}>{command}</span>
    </div>
  );
};
