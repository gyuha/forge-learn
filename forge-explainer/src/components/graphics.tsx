import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { body, display, mono } from "../fonts";
import { colors, sizes } from "../theme";
import { clamp, EASE_OUT, popScale } from "../util/anim";
import { Icon, IconName } from "./Icon";

// ----- small primitives ----------------------------------------------------

export const DotRow: React.FC<{
  count: number;
  delay?: number;
  size?: number;
  gap?: number;
  color?: string;
}> = ({ count, delay = 0, size = 30, gap = 22, color = colors.accent }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap, justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const d = delay + i * 4;
        const p = interpolate(frame, [d, d + 11], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size,
              background: color,
              opacity: p,
              scale: popScale(p, 0.2),
              boxShadow: `0 0 ${size * 0.7}px rgba(255,138,0,0.35)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const LabeledIcon: React.FC<{
  name: IconName;
  label: string;
  delay?: number;
  iconSize?: number;
  color?: string;
  labelColor?: string;
}> = ({ name, label, delay = 0, iconSize = 120, color = colors.accent, labelColor = colors.white }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 13], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
        opacity: p,
        scale: popScale(p, 0.8),
        translate: `0px ${interpolate(p, [0, 1], [22, 0])}px`,
      }}
    >
      <div
        style={{
          width: iconSize * 1.7,
          height: iconSize * 1.7,
          borderRadius: 36,
          border: `2px solid ${colors.border}`,
          background: colors.panel,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={name} size={iconSize} color={color} />
      </div>
      <div
        style={{
          fontFamily: body,
          fontWeight: 700,
          fontSize: sizes.sub,
          color: labelColor,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ----- composed graphics ----------------------------------------------------

export const BigNumber: React.FC<{
  value: string;
  label: string;
  unit?: string;
  dots?: number;
}> = ({ value, label, unit, dots }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: sizes.bigNumber,
            lineHeight: 0.9,
            color: colors.accent,
            opacity: p,
            scale: popScale(p, 0.7),
            textShadow: "0 0 90px rgba(255,138,0,0.4)",
          }}
        >
          {value}
        </span>
        {unit ? (
          <span
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: sizes.heroSm,
              color: colors.white,
              opacity: interpolate(frame, [8, 22], [0, 1], clamp),
            }}
          >
            {unit}
          </span>
        ) : null}
      </div>
      <div
        style={{
          fontFamily: body,
          fontWeight: 700,
          fontSize: sizes.title,
          color: colors.white,
          opacity: interpolate(frame, [10, 24], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [10, 24], [18, 0], { ...clamp, easing: EASE_OUT })}px`,
        }}
      >
        {label}
      </div>
      {dots ? (
        <div style={{ marginTop: 26 }}>
          <DotRow count={dots} delay={18} />
        </div>
      ) : null}
    </div>
  );
};

export const NotationCompare: React.FC<{
  left: string;
  right: string;
  caption: string;
}> = ({ left, right, caption }) => {
  const frame = useCurrentFrame();
  const Chip: React.FC<{ cmd: string; delay: number; tag: string }> = ({ cmd, delay, tag }) => {
    const p = interpolate(frame, [delay, delay + 12], [0, 1], { ...clamp, easing: EASE_OUT });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: p,
          scale: popScale(p, 0.86),
        }}
      >
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: sizes.label, color: colors.dim }}>
          {tag}
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 60,
            fontWeight: 600,
            color: colors.white,
            background: colors.panel,
            border: `2px solid ${colors.accent}`,
            borderRadius: 22,
            padding: "26px 40px",
            boxShadow: "0 0 60px rgba(255,138,0,0.2)",
          }}
        >
          <span style={{ color: colors.accent }}>{cmd}</span>
        </div>
      </div>
    );
  };
  const eqP = interpolate(frame, [12, 24], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <Chip cmd={left} delay={0} tag="문서 표기" />
        <div style={{ opacity: eqP, scale: popScale(eqP, 0.5) }}>
          <Icon name="equals" size={84} color={colors.accentSoft} strokeWidth={2.2} />
        </div>
        <Chip cmd={right} delay={16} tag="플러그인 환경" />
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: sizes.title,
          color: colors.white,
          opacity: interpolate(frame, [30, 44], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [30, 44], [20, 0], { ...clamp, easing: EASE_OUT })}px`,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

export type Criterion = { n: string; text: string; revealMs: number };

// Four achievement criteria. `sceneStartMs` lets us reference absolute cue
// timings; each row reveals at its cue and the live one glows in accent.
export const CriteriaList: React.FC<{
  heading: string;
  items: Criterion[];
  sceneStartMs: number;
  primaryIndex?: number; // stays accent + "오늘의 핵심" badge
}> = ({ heading, items, sceneStartMs, primaryIndex = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = sceneStartMs + (frame / fps) * 1000;
  const headP = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: EASE_OUT });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: sizes.title,
          color: colors.white,
          opacity: headP,
          translate: `0px ${interpolate(headP, [0, 1], [18, 0])}px`,
        }}
      >
        {heading}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 1180 }}>
        {items.map((it, i) => {
          const revealFrame = ((it.revealMs - sceneStartMs) / 1000) * fps;
          const p = interpolate(frame, [revealFrame, revealFrame + 12], [0, 1], {
            ...clamp,
            easing: EASE_OUT,
          });
          const next = items[i + 1];
          const live = nowMs >= it.revealMs && (!next || nowMs < next.revealMs);
          const isPrimary = i === primaryIndex;
          const active = live || isPrimary;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "22px 34px",
                borderRadius: 20,
                background: active ? "rgba(255,138,0,0.10)" : colors.panel,
                border: `2px solid ${active ? colors.accent : colors.border}`,
                opacity: p,
                translate: `${interpolate(p, [0, 1], [40, 0])}px 0px`,
              }}
            >
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 64,
                  color: colors.accent,
                  width: 64,
                  textAlign: "center",
                }}
              >
                {it.n}
              </span>
              <span
                style={{
                  fontFamily: body,
                  fontWeight: 700,
                  fontSize: sizes.sub,
                  color: colors.white,
                  flex: 1,
                }}
              >
                {it.text}
              </span>
              {isPrimary ? (
                <span
                  style={{
                    fontFamily: body,
                    fontWeight: 700,
                    fontSize: 28,
                    color: colors.bg,
                    background: colors.accent,
                    borderRadius: 999,
                    padding: "8px 18px",
                  }}
                >
                  오늘의 핵심
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type Step = { n: string; label: string; code?: string };

export const StepLines: React.FC<{ steps: Step[]; gap?: number }> = ({ steps, gap = 28 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, width: 1240 }}>
      {steps.map((s, i) => {
        const d = i * 10;
        const p = interpolate(frame, [d, d + 13], [0, 1], { ...clamp, easing: EASE_OUT });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "26px 36px",
              borderRadius: 22,
              background: colors.panel,
              border: `2px solid ${colors.border}`,
              opacity: p,
              translate: `${interpolate(p, [0, 1], [44, 0])}px 0px`,
            }}
          >
            <span
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 56,
                color: colors.accent,
                width: 60,
                textAlign: "center",
              }}
            >
              {s.n}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontFamily: body, fontWeight: 700, fontSize: sizes.sub, color: colors.white }}>
                {s.label}
              </span>
              {s.code ? (
                <span style={{ fontFamily: mono, fontSize: 38, color: colors.accentSoft }}>
                  {s.code}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const BranchMain: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: EASE_OUT });
  const W = 1000;
  const y = 70;
  const dotXs = [120, 320, 520, 720, 900];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <svg width={W} height={220} viewBox={`0 0 ${W} 220`}>
        {/* main line */}
        <line
          x1={60}
          y1={y}
          x2={60 + (W - 120) * draw}
          y2={y}
          stroke={colors.accent}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* feature branch */}
        <path
          d={`M ${dotXs[1]} ${y} C ${dotXs[1] + 80} ${y}, ${dotXs[2] - 40} ${y + 90}, ${dotXs[3]} ${y + 90}`}
          stroke={colors.faint}
          strokeWidth={5}
          fill="none"
          strokeDasharray="1000"
          strokeDashoffset={1000 - 1000 * draw}
          strokeLinecap="round"
        />
        {dotXs.map((x, i) => {
          const p = interpolate(frame, [6 + i * 4, 6 + i * 4 + 10], [0, 1], { ...clamp, easing: EASE_OUT });
          return (
            <circle key={i} cx={x} cy={y} r={14 * p} fill={colors.accent} />
          );
        })}
        <circle
          cx={dotXs[3]}
          cy={y + 90}
          r={12 * interpolate(frame, [24, 34], [0, 1], clamp)}
          fill={colors.faint}
        />
        <text
          x={60}
          y={y - 30}
          fill={colors.white}
          fontFamily={mono}
          fontSize={42}
          fontWeight={700}
          opacity={interpolate(frame, [10, 22], [0, 1], clamp)}
        >
          main
        </text>
      </svg>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: sizes.title,
          color: colors.white,
          textAlign: "center",
          maxWidth: 1400,
          opacity: interpolate(frame, [28, 42], [0, 1], clamp),
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// Brand idle mark for not-yet-authored ranges (placeholder during expansion).
export const ForgeMark: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.9, 1.05]);
  const glow = interpolate(Math.sin(frame / 18), [-1, 1], [0.25, 0.5]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ scale: pulse }}>
        <Icon name="bolt" size={150} color={colors.accent} fill strokeWidth={1} />
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 150,
          color: colors.white,
          letterSpacing: -2,
          textShadow: `0 0 80px rgba(255,138,0,${glow})`,
        }}
      >
        forge
      </div>
      <div style={{ fontFamily: body, fontWeight: 700, fontSize: sizes.label, color: colors.dim }}>
        사용법 워크플로우
      </div>
    </div>
  );
};
