import { interpolate, useCurrentFrame } from "remotion";
import { body, display } from "../fonts";
import { colors } from "../theme";
import { clamp, EASE_OUT, popScale } from "../util/anim";

type CommonProps = {
  text: string;
  fontSize?: number;
  color?: string;
  weight?: number;
  font?: "display" | "body";
  delay?: number;
  align?: "center" | "left";
  lineHeight?: number;
  letterSpacing?: number;
  maxWidth?: number;
};

// Single text block: fades up + slight scale pop.
export const MotionText: React.FC<CommonProps> = ({
  text,
  fontSize = 96,
  color = colors.white,
  weight = 700,
  font = "display",
  delay = 0,
  align = "center",
  lineHeight = 1.16,
  letterSpacing = -0.5,
  maxWidth = 1500,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        fontFamily: font === "display" ? display : body,
        fontSize,
        fontWeight: weight,
        color,
        textAlign: align,
        lineHeight,
        letterSpacing,
        maxWidth,
        opacity: p,
        scale: popScale(p, 0.9),
        translate: `0px ${interpolate(p, [0, 1], [26, 0])}px`,
      }}
    >
      {text}
    </div>
  );
};

// Phrase split into 어절 (space-separated words), each staggered in.
export const MotionWords: React.FC<
  CommonProps & { stagger?: number; accentWords?: string[] }
> = ({
  text,
  fontSize = 110,
  color = colors.white,
  weight = 700,
  font = "display",
  delay = 0,
  align = "center",
  lineHeight = 1.18,
  letterSpacing = -0.5,
  maxWidth = 1560,
  stagger = 4,
  accentWords = [],
}) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${fontSize * 0.12}px ${fontSize * 0.28}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth,
        fontFamily: font === "display" ? display : body,
        fontWeight: weight,
        lineHeight,
        letterSpacing,
      }}
    >
      {words.map((w, i) => {
        const d = delay + i * stagger;
        const p = interpolate(frame, [d, d + 13], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const isAccent = accentWords.includes(w);
        return (
          <span
            key={i}
            style={{
              fontSize,
              color: isAccent ? colors.accent : color,
              opacity: p,
              display: "inline-block",
              translate: `0px ${interpolate(p, [0, 1], [fontSize * 0.4, 0])}px`,
              scale: popScale(p, 0.8),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
