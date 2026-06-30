// Central design tokens for the forge explainer video.

export const colors = {
  bg: "#000000",
  panel: "#121214",
  panelAlt: "#1A1A1F",
  border: "#2A2A30",
  borderAccent: "#FF8A00",

  accent: "#FF8A00", // point color (amber orange — forge fire)
  accentSoft: "#FFB454",
  accentDim: "#6E4316",

  white: "#FFFFFF",
  dim: "#9A9AA2",
  faint: "#55555C",

  // Subtitle karaoke states
  subUnread: "#686868",
  subReading: "#FF8A00",
  subRead: "#FFFFFF",

  ok: "#3DDC84",
  danger: "#FF5A52",
} as const;

export const layout = {
  width: 1920,
  height: 1080,
  fps: 30,
  // Subtitle band
  subtitleFontSize: 58,
  subtitleBottom: 96,
  subtitleMaxWidth: 1640,
  // Center stage keeps clear of the subtitle band
  centerPaddingBottom: 250,
  safeX: 140,
} as const;

export const sizes = {
  hero: 132,
  heroSm: 96,
  title: 76,
  sub: 50,
  label: 38,
  bigNumber: 300,
} as const;
