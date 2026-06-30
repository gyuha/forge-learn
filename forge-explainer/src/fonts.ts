import { loadFont as loadBody } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadDisplay } from "@remotion/google-fonts/GothicA1";

// Body / subtitles — Korean-capable, multiple weights.
export const body = loadBody("normal", {
  weights: ["400", "700"],
  subsets: ["korean", "latin"],
}).fontFamily;

// Display — clean Korean sans with selectable weights for hero typography.
// (Replaces Black Han Sans, whose single black weight clumped at large sizes.)
export const display = loadDisplay("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["korean", "latin"],
}).fontFamily;

// Monospace for command tokens like /fg-ask (ASCII only).
export const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
