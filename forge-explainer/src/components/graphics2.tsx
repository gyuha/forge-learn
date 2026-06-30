import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { body, display, mono } from "../fonts";
import { colors, sizes } from "../theme";
import { clamp, EASE_OUT, popScale } from "../util/anim";
import { Icon, IconName } from "./Icon";

// reveal progress 0..1 given a reveal frame
const rp = (frame: number, rf: number, dur = 12) =>
  interpolate(frame, [rf, rf + dur], [0, 1], { ...clamp, easing: EASE_OUT });

const useNowMs = (sceneStartMs: number) => {
  const { fps } = useVideoConfig();
  return sceneStartMs + (useCurrentFrame() / fps) * 1000;
};

const Arrow: React.FC<{ delay?: number; size?: number; dir?: "right" | "down" }> = ({
  delay = 0,
  size = 56,
  dir = "right",
}) => {
  const frame = useCurrentFrame();
  const p = rp(frame, delay, 10);
  return (
    <div style={{ opacity: p, scale: popScale(p, 0.5), rotate: dir === "down" ? "90deg" : "0deg" }}>
      <Icon name="arrow" size={size} color={colors.accent} strokeWidth={2} />
    </div>
  );
};

// ---------------------------------------------------------------------------

export const SituationBadge: React.FC<{ n: string; title: string }> = ({ n, title }) => {
  const frame = useCurrentFrame();
  const p1 = rp(frame, 0, 12);
  const p2 = rp(frame, 8, 14);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div
        style={{
          fontFamily: body,
          fontWeight: 700,
          fontSize: 40,
          color: colors.bg,
          background: colors.accent,
          borderRadius: 999,
          padding: "12px 34px",
          opacity: p1,
          scale: popScale(p1, 0.7),
        }}
      >
        상황 {n}
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 92,
          color: colors.white,
          letterSpacing: -0.5,
          textAlign: "center",
          maxWidth: 1500,
          opacity: p2,
          translate: `0px ${interpolate(p2, [0, 1], [22, 0])}px`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// Row of command cards joined by arrows; reveal/highlight by absolute time.
export const CommandFlow: React.FC<{
  items: { cmd: string; label: string; atMs: number }[];
  sceneStartMs: number;
  caption?: { text: string; atMs: number };
}> = ({ items, sceneStartMs, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = useNowMs(sceneStartMs);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        {items.map((it, i) => {
          const rf = ((it.atMs - sceneStartMs) / 1000) * fps;
          const p = rp(frame, rf, 12);
          const next = items[i + 1];
          const active = nowMs >= it.atMs && (!next || nowMs < next.atMs);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  padding: "30px 38px",
                  borderRadius: 22,
                  background: active ? "rgba(255,138,0,0.12)" : colors.panel,
                  border: `2px solid ${active ? colors.accent : colors.border}`,
                  boxShadow: active ? "0 0 50px rgba(255,138,0,0.25)" : "none",
                  opacity: p,
                  scale: popScale(p, 0.82),
                }}
              >
                <span style={{ fontFamily: mono, fontSize: 48, fontWeight: 600, color: colors.accent }}>
                  {it.cmd}
                </span>
                <span style={{ fontFamily: body, fontWeight: 700, fontSize: 34, color: colors.white }}>
                  {it.label}
                </span>
              </div>
              {next ? <Arrow delay={rf + 8} /> : null}
            </div>
          );
        })}
      </div>
      {caption ? (
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 60,
            color: colors.white,
            textAlign: "center",
            opacity: rp(frame, ((caption.atMs - sceneStartMs) / 1000) * fps, 14),
          }}
        >
          {caption.text}
        </div>
      ) : null}
    </div>
  );
};

type LoopNode = { key: string; sub: string; atMs: number };
export const LoopDiagram: React.FC<{
  nodes: LoopNode[];
  sceneStartMs: number;
  sealAtMs: number;
}> = ({ nodes, sceneStartMs, sealAtMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = useNowMs(sceneStartMs);
  const sealRf = ((sealAtMs - sceneStartMs) / 1000) * fps;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
      {nodes.map((n, i) => {
        const rf = ((n.atMs - sceneStartMs) / 1000) * fps;
        const p = rp(frame, rf, 12);
        const next = nodes[i + 1];
        const active = nowMs >= n.atMs && (!next || nowMs < next.atMs) && nowMs < sealAtMs;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                width: 200,
                height: 200,
                borderRadius: 28,
                justifyContent: "center",
                background: active ? "rgba(255,138,0,0.14)" : colors.panel,
                border: `2px solid ${active ? colors.accent : colors.border}`,
                boxShadow: active ? "0 0 55px rgba(255,138,0,0.3)" : "none",
                opacity: p,
                scale: popScale(p, 0.8),
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 40, fontWeight: 600, color: colors.accent }}>
                {n.key}
              </span>
              <span style={{ fontFamily: body, fontWeight: 700, fontSize: 27, color: colors.white, whiteSpace: "nowrap" }}>
                {n.sub}
              </span>
            </div>
            <Arrow delay={next ? ((next.atMs - sceneStartMs) / 1000) * fps : sealRf} size={48} />
          </div>
        );
      })}
      {/* seal endcap */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: rp(frame, sealRf, 12),
          scale: popScale(rp(frame, sealRf, 12), 0.7),
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 999,
            background: colors.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 50px rgba(255,138,0,0.45)",
          }}
        >
          <Icon name="check" size={64} color={colors.bg} strokeWidth={2.4} />
        </div>
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 30, color: colors.accentSoft }}>봉인</span>
      </div>
    </div>
  );
};

type Level = { lvl: string; title: string; desc: string; atMs: number };
export const TrustLadder: React.FC<{ levels: Level[]; sceneStartMs: number }> = ({
  levels,
  sceneStartMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = useNowMs(sceneStartMs);
  // render top-to-bottom as L3, L2, L1 (ascending automation upward)
  const ordered = [...levels].reverse();
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 1180 }}>
        {ordered.map((lv) => {
          const rf = ((lv.atMs - sceneStartMs) / 1000) * fps;
          const p = rp(frame, rf, 12);
          const idx = levels.findIndex((x) => x.lvl === lv.lvl);
          const next = levels[idx + 1];
          const active = nowMs >= lv.atMs && (!next || nowMs < next.atMs);
          return (
            <div
              key={lv.lvl}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 36px",
                borderRadius: 22,
                background: active ? "rgba(255,138,0,0.12)" : colors.panel,
                border: `2px solid ${active ? colors.accent : colors.border}`,
                opacity: p,
                translate: `${interpolate(p, [0, 1], [50, 0])}px 0px`,
              }}
            >
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 64,
                  color: colors.accent,
                  width: 100,
                  textAlign: "center",
                }}
              >
                {lv.lvl}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
                <span style={{ fontFamily: display, fontWeight: 700, fontSize: 46, color: colors.white }}>
                  {lv.title}
                </span>
                <span style={{ fontFamily: body, fontWeight: 700, fontSize: 32, color: colors.dim }}>
                  {lv.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingBottom: 8 }}>
        <Icon name="arrow" size={50} color={colors.accentSoft} strokeWidth={2} />
        <span
          style={{
            writingMode: "vertical-rl",
            fontFamily: body,
            fontWeight: 700,
            fontSize: 30,
            color: colors.accentSoft,
            transform: "rotate(180deg)",
          }}
        >
          자동화 강도
        </span>
        <div style={{ width: 4 }} />
      </div>
    </div>
  );
};

type Stage = { key: string; ko: string; atMs: number; badge?: boolean };
export const Pipeline: React.FC<{ stages: Stage[]; sceneStartMs: number }> = ({
  stages,
  sceneStartMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = useNowMs(sceneStartMs);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, justifyContent: "center" }}>
      {stages.map((s, i) => {
        const rf = ((s.atMs - sceneStartMs) / 1000) * fps;
        const p = rp(frame, rf, 12);
        const next = stages[i + 1];
        const active = nowMs >= s.atMs && (!next || nowMs < next.atMs);
        const emph = s.badge;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                width: 250,
                height: 150,
                borderRadius: 22,
                justifyContent: "center",
                background: emph ? "rgba(255,138,0,0.14)" : colors.panel,
                border: `2px solid ${emph || active ? colors.accent : colors.border}`,
                boxShadow: emph ? "0 0 50px rgba(255,138,0,0.28)" : "none",
                opacity: p,
                scale: popScale(p, 0.82),
              }}
            >
              {emph ? (
                <div
                  style={{
                    position: "absolute",
                    top: -22,
                    right: -18,
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    background: colors.accent,
                    color: colors.bg,
                    fontFamily: display,
                    fontWeight: 900,
                    fontSize: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  1
                </div>
              ) : null}
              <span style={{ fontFamily: mono, fontSize: 34, fontWeight: 600, color: colors.accent }}>
                {s.key}
              </span>
              <span style={{ fontFamily: body, fontWeight: 700, fontSize: 30, color: colors.white }}>
                {s.ko}
              </span>
            </div>
            {next ? <Arrow delay={rf + 8} size={44} /> : null}
          </div>
        );
      })}
    </div>
  );
};

export type Point = { label: string; sub?: string; atMs: number; tone?: "accent" | "warn" };
export const PointList: React.FC<{
  heading?: string;
  items: Point[];
  sceneStartMs: number;
  numbered?: boolean;
  width?: number;
}> = ({ heading, items, sceneStartMs, numbered = true, width = 1320 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headP = rp(frame, 0, 14);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      {heading ? (
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 58,
            color: colors.white,
            opacity: headP,
            translate: `0px ${interpolate(headP, [0, 1], [16, 0])}px`,
            textAlign: "center",
          }}
        >
          {heading}
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width }}>
        {items.map((it, i) => {
          const rf = ((it.atMs - sceneStartMs) / 1000) * fps;
          const p = rp(frame, rf, 12);
          const warn = it.tone === "warn";
          const marker = warn ? colors.danger : colors.accent;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "16px 30px",
                borderRadius: 18,
                background: colors.panel,
                border: `2px solid ${warn ? colors.danger : colors.border}`,
                opacity: p,
                translate: `${interpolate(p, [0, 1], [44, 0])}px 0px`,
              }}
            >
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 44,
                  color: marker,
                  width: 52,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {warn ? "!" : numbered ? String(i + 1) : "•"}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left", flex: 1 }}>
                <span style={{ fontFamily: body, fontWeight: 700, fontSize: 40, color: colors.white }}>
                  {it.label}
                </span>
                {it.sub ? (
                  <span style={{ fontFamily: body, fontWeight: 700, fontSize: 28, color: colors.dim }}>
                    {it.sub}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Verification gate: pass states unlock, blocked states lock.
export const Gate: React.FC<{ sceneStartMs: number }> = ({ sceneStartMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rf = (ms: number) => ((ms - sceneStartMs) / 1000) * fps;
  const Pill: React.FC<{ text: string; ok: boolean; delay: number }> = ({ text, ok, delay }) => {
    const p = rp(frame, delay, 12);
    return (
      <div
        style={{
          fontFamily: body,
          fontWeight: 700,
          fontSize: 38,
          color: ok ? colors.ok : colors.danger,
          background: colors.panel,
          border: `2px solid ${ok ? colors.ok : colors.danger}`,
          borderRadius: 16,
          padding: "16px 28px",
          opacity: p,
          scale: popScale(p, 0.8),
        }}
      >
        {text}
      </div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: sizes.title,
          color: colors.white,
          opacity: rp(frame, 0, 14),
        }}
      >
        검증 게이트
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Pill text="예스" ok delay={rf(927300)} />
          <Pill text="스킵" ok delay={rf(929000)} />
          <Pill text="해당 없음" ok delay={rf(930800)} />
        </div>
        <Arrow delay={rf(931500)} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: rp(frame, rf(931800), 12),
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: "rgba(61,220,132,0.14)",
              border: `2px solid ${colors.ok}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="check" size={70} color={colors.ok} strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: body, fontWeight: 700, fontSize: 32, color: colors.ok }}>봉인 가능</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: rp(frame, rf(932634), 14) }}>
        <Pill text="펜딩" ok={false} delay={rf(932634)} />
        <Pill text="실패" ok={false} delay={rf(934000)} />
        <Icon name="cross" size={44} color={colors.danger} strokeWidth={2.4} />
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 38, color: colors.danger }}>봉인 차단</span>
      </div>
    </div>
  );
};

export const FailurePaths: React.FC<{ sceneStartMs: number }> = ({ sceneStartMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rf = (ms: number) => ((ms - sceneStartMs) / 1000) * fps;
  const Box: React.FC<{ children: React.ReactNode; delay: number; tone?: "warn" | "ok" | "neutral"; w?: number }> = ({
    children,
    delay,
    tone = "neutral",
    w = 560,
  }) => {
    const p = rp(frame, delay, 12);
    const c = tone === "warn" ? colors.danger : tone === "ok" ? colors.ok : colors.border;
    return (
      <div
        style={{
          width: w,
          fontFamily: body,
          fontWeight: 700,
          fontSize: 36,
          color: colors.white,
          background: colors.panel,
          border: `2px solid ${c}`,
          borderRadius: 18,
          padding: "22px 30px",
          textAlign: "center",
          opacity: p,
          translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
        }}
      >
        {children}
      </div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <Box delay={rf(948480)} tone="warn" w={760}>
        <span style={{ color: colors.danger }}>실패</span> = 검증이 돌았고 망가짐 (펜딩과 다름)
      </Box>
      <div style={{ fontFamily: body, fontWeight: 700, fontSize: 34, color: colors.danger, opacity: rp(frame, rf(960693), 12) }}>
        봉인 지름길 없음 · 스킵으로 못 속임
      </div>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: body, fontWeight: 700, fontSize: 32, color: colors.accentSoft, opacity: rp(frame, rf(970174), 12) }}>
            경로 ①
          </span>
          <Box delay={rf(970174)} w={520}>고치고 다시 실행</Box>
          <Arrow delay={rf(973000)} dir="down" size={44} />
          <Box delay={rf(974352)} tone="ok" w={520}>재검증 후 봉인</Box>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: body, fontWeight: 700, fontSize: 32, color: colors.accentSoft, opacity: rp(frame, rf(981262), 12) }}>
            경로 ②
          </span>
          <Box delay={rf(981262)} w={520}>계획 자체가 틀림</Box>
          <Arrow delay={rf(984000)} dir="down" size={44} />
          <Box delay={rf(985000)} w={520}>
            <span style={{ color: colors.accent, fontFamily: mono }}>/fg-ask</span> 로 다시 다듬기
          </Box>
        </div>
      </div>
    </div>
  );
};

type SkillGroup = { label: string; skills: string[] };
export const SkillGrid: React.FC<{ groups: SkillGroup[]; core: string[] }> = ({ groups, core }) => {
  const frame = useCurrentFrame();
  let idx = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: body, fontWeight: 700, fontSize: 30, color: colors.dim, letterSpacing: 1 }}>
            {g.label}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", maxWidth: 1600 }}>
            {g.skills.map((s) => {
              const p = rp(frame, idx++ * 2.2, 12);
              const isCore = core.includes(s);
              return (
                <span
                  key={s}
                  style={{
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 600,
                    color: isCore ? colors.accent : colors.dim,
                    background: isCore ? "rgba(255,138,0,0.12)" : colors.panel,
                    border: `2px solid ${isCore ? colors.accent : colors.border}`,
                    borderRadius: 14,
                    padding: "12px 22px",
                    opacity: p,
                    scale: popScale(p, 0.85),
                  }}
                >
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

type Row = { sit: string; cmd: string; next: string; atMs: number; highlight?: boolean };
export const CheatsheetTable: React.FC<{
  heading: string;
  rows: Row[];
  sceneStartMs: number;
  footer?: { text: string; atMs: number };
}> = ({ heading, rows, sceneStartMs, footer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headP = rp(frame, 0, 14);
  const Cell: React.FC<{ children: React.ReactNode; flex: number; mono?: boolean; color?: string; align?: string }> = ({
    children,
    flex,
    mono: isMono,
    color = colors.white,
    align = "left",
  }) => (
    <div
      style={{
        flex,
        fontFamily: isMono ? mono : body,
        fontWeight: isMono ? 600 : 700,
        fontSize: isMono ? 36 : 38,
        color,
        textAlign: align as "left" | "center",
      }}
    >
      {children}
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: sizes.title, color: colors.white, opacity: headP }}>
        {heading}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 1480 }}>
        <div style={{ display: "flex", gap: 24, padding: "0 30px" }}>
          <Cell flex={4} color={colors.dim}>상황</Cell>
          <Cell flex={3} color={colors.dim}>명령</Cell>
          <Cell flex={4} color={colors.dim}>다음</Cell>
        </div>
        {rows.map((r, i) => {
          const p = rp(frame, ((r.atMs - sceneStartMs) / 1000) * fps, 12);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                padding: "18px 30px",
                borderRadius: 16,
                background: r.highlight ? "rgba(255,138,0,0.12)" : colors.panel,
                border: `2px solid ${r.highlight ? colors.accent : colors.border}`,
                opacity: p,
                translate: `${interpolate(p, [0, 1], [40, 0])}px 0px`,
              }}
            >
              <Cell flex={4}>{r.sit}</Cell>
              <Cell flex={3} mono color={colors.accent}>{r.cmd}</Cell>
              <Cell flex={4} color={colors.dim}>{r.next}</Cell>
            </div>
          );
        })}
      </div>
      {footer ? (
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 48,
            color: colors.accentSoft,
            opacity: rp(frame, ((footer.atMs - sceneStartMs) / 1000) * fps, 14),
          }}
        >
          {footer.text}
        </div>
      ) : null}
    </div>
  );
};

type Col = { cmd: string; title: string; bullets: string[] };
export const TwoColCompare: React.FC<{
  left: Col;
  right: Col;
  sceneStartMs: number;
  leftAtMs: number;
  rightAtMs: number;
  heading?: string;
}> = ({ left, right, sceneStartMs, leftAtMs, rightAtMs, heading }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headP = rp(frame, 0, 14);
  const Panel: React.FC<{ col: Col; delay: number; fromX: number }> = ({ col, delay, fromX }) => {
    const p = rp(frame, delay, 13);
    return (
      <div
        style={{
          width: 720,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "34px 38px",
          borderRadius: 24,
          background: colors.panel,
          border: `2px solid ${colors.accent}`,
          opacity: p,
          translate: `${interpolate(p, [0, 1], [fromX, 0])}px 0px`,
        }}
      >
        <span style={{ fontFamily: mono, fontSize: 46, fontWeight: 600, color: colors.accent }}>{col.cmd}</span>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 42, color: colors.white }}>{col.title}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
          {col.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ color: colors.accent, fontSize: 32, lineHeight: 1.3 }}>•</span>
              <span style={{ fontFamily: body, fontWeight: 700, fontSize: 32, color: colors.dim, textAlign: "left" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      {heading ? (
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: sizes.title, color: colors.white, opacity: headP }}>
          {heading}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 36, alignItems: "stretch" }}>
        <Panel col={left} delay={((leftAtMs - sceneStartMs) / 1000) * fps} fromX={-50} />
        <Panel col={right} delay={((rightAtMs - sceneStartMs) / 1000) * fps} fromX={50} />
      </div>
    </div>
  );
};

// re-export Icon type usage so consumers can pass icon names if needed
export type { IconName };
