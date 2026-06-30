import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Black explainer backdrop with a subtle, slowly drifting amber glow and a
// near-invisible dot grid for depth. Intentionally quiet so foreground text
// and graphics stay the focus.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow vertical/horizontal drift of the glow center (no randomness).
  const t = frame / 60;
  const gx = 50 + Math.sin(t * 0.5) * 12;
  const gy = 42 + Math.cos(t * 0.37) * 10;
  const glow = interpolate(Math.sin(t * 0.6), [-1, 1], [0.1, 0.22]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* faint dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1.4px, transparent 1.4px)",
          backgroundSize: "46px 46px",
          opacity: 0.6,
        }}
      />
      {/* drifting amber glow */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,138,0,${glow}), rgba(255,138,0,0) 42%)`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
