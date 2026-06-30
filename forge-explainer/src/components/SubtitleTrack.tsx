import { useCurrentFrame, useVideoConfig } from "remotion";
import { captions } from "../data/captions";
import { body } from "../fonts";
import { colors, layout } from "../theme";

// Bottom karaoke subtitles. Shows the currently-active cue and colors each
// 어절 (space-separated word) by reading state:
//   not yet read -> gray (#686868)
//   being read   -> point color (amber)
//   already read -> white
export const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  // Find the active cue. Captions are sorted and mostly contiguous.
  const cue = captions.find((c) => nowMs >= c.startMs && nowMs < c.endMs);
  if (!cue) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: layout.subtitleBottom,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: layout.subtitleMaxWidth,
          textAlign: "center",
          fontFamily: body,
          fontSize: layout.subtitleFontSize,
          fontWeight: 700,
          lineHeight: 1.36,
          letterSpacing: -0.5,
          wordBreak: "keep-all",
          padding: "0 40px",
        }}
      >
        {cue.tokens.map((tok, i) => {
          const reading = nowMs >= tok.fromMs && nowMs < tok.toMs;
          const read = nowMs >= tok.toMs;
          const color = reading
            ? colors.subReading
            : read
              ? colors.subRead
              : colors.subUnread;
          return (
            <span key={i}>
              <span
                style={{
                  color,
                  transition: "none",
                  textShadow: reading
                    ? "0 0 22px rgba(255,138,0,0.45)"
                    : "0 2px 10px rgba(0,0,0,0.6)",
                }}
              >
                {tok.text}
              </span>
              {i < cue.tokens.length - 1 ? " " : null}
            </span>
          );
        })}
      </div>
    </div>
  );
};
