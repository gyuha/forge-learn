import { Easing, interpolate, useCurrentFrame } from "remotion";

// A pleasant ease-out for entrances.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IO = Easing.bezier(0.45, 0, 0.2, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0 -> 1 entrance progress, starting after `delay` frames over `dur` frames.
export const useEnter = (delay = 0, dur = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
};

// Spring-free "pop" scale value from a progress 0..1.
export const popScale = (p: number, from = 0.86) => from + (1 - from) * p;

// Current local time in ms from the sequence/composition frame.
export const useLocalMs = (fps: number) => (useCurrentFrame() / fps) * 1000;

export { clamp };
