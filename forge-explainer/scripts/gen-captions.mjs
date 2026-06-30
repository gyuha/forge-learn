import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SRT = process.argv[2];
const OUT = process.argv[3];

const raw = readFileSync(SRT, "utf8").replace(/\r/g, "");

// Split into blocks separated by blank lines
const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

const tc = (s) => {
  // HH:MM:SS,mmm
  const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  const [, hh, mm, ss, ms] = m;
  return ((+hh * 60 + +mm) * 60 + +ss) * 1000 + +ms;
};

const cues = [];
for (const block of blocks) {
  const lines = block.split("\n");
  // line0 = index, line1 = timecode, rest = text
  const idxLine = lines[0].trim();
  const timeLine = lines[1] || "";
  if (!/-->/.test(timeLine)) continue;
  const [a, b] = timeLine.split("-->");
  const startMs = tc(a);
  const endMs = tc(b);
  const text = lines.slice(2).join(" ").replace(/\s+/g, " ").trim();
  if (!text) continue;

  // Split into 어절 by whitespace
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.length + 0.5); // +0.5 so short particles still get time
  const totalW = weights.reduce((s, w) => s + w, 0) || 1;
  const dur = Math.max(0, endMs - startMs);

  let acc = 0;
  const tokens = words.map((w, i) => {
    const from = startMs + (acc / totalW) * dur;
    acc += weights[i];
    const to = startMs + (acc / totalW) * dur;
    return { text: w, fromMs: Math.round(from), toMs: Math.round(to) };
  });

  cues.push({ index: +idxLine || cues.length + 1, startMs, endMs, text, tokens });
}

const totalDurationMs = cues.length ? cues[cues.length - 1].endMs : 0;

const header = `// AUTO-GENERATED from public/subtitles.srt by scripts/gen-captions.mjs.
// Do not edit by hand. Each cue's tokens carry per-어절 timing derived by
// distributing the cue [startMs,endMs] window across words proportional to length.

export type CaptionToken = { text: string; fromMs: number; toMs: number };
export type CaptionCue = {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
  tokens: CaptionToken[];
};

export const totalDurationMs = ${totalDurationMs};

export const captions: CaptionCue[] = ${JSON.stringify(cues, null, 2)};
`;

mkdirSync(OUT.replace(/\/[^/]+$/, ""), { recursive: true });
writeFileSync(OUT, header);
console.log(`Wrote ${cues.length} cues, total ${totalDurationMs}ms -> ${OUT}`);
