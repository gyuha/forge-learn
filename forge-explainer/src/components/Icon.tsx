import { colors } from "../theme";

export type IconName =
  | "book"
  | "target"
  | "brain"
  | "check"
  | "star"
  | "skip"
  | "grid"
  | "tag"
  | "equals"
  | "ladder"
  | "table"
  | "list"
  | "doc"
  | "terminal"
  | "branch"
  | "plugin"
  | "download"
  | "loop"
  | "gear"
  | "arrow"
  | "cross"
  | "bolt"
  | "compass";

const PATHS: Record<IconName, React.ReactNode> = {
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" />
    </>
  ),
  brain: (
    <>
      <path d="M9 4.5A3 3 0 0 0 6 7.5 3 3 0 0 0 4.5 13 3 3 0 0 0 7 18a3 3 0 0 0 2 1.5V4.5z" />
      <path d="M15 4.5A3 3 0 0 1 18 7.5 3 3 0 0 1 19.5 13 3 3 0 0 1 17 18a3 3 0 0 1-2 1.5V4.5z" />
      <path d="M12 4v16" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.8 2.8L16 9.5" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9 6.75 19.6l1-5.85L3.5 9.65l5.9-.85z" />
  ),
  skip: (
    <>
      <path d="M5 5l8 7-8 7z" />
      <path d="M16 5v14" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 11.5l8-8H20.5V12.5l-8 8z" />
      <circle cx="16" cy="8" r="1.4" />
    </>
  ),
  equals: (
    <>
      <path d="M5 9.5h14" />
      <path d="M5 14.5h14" />
    </>
  ),
  ladder: (
    <>
      <path d="M7.5 3v18M16.5 3v18" />
      <path d="M7.5 7.5h9M7.5 12h9M7.5 16.5h9" />
    </>
  ),
  table: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.6" />
      <path d="M3.5 9.5h17M3.5 14.5h17M9 4.5v15" />
    </>
  ),
  list: (
    <>
      <path d="M9 6.5h11M9 12h11M9 17.5h11" />
      <circle cx="4.5" cy="6.5" r="1.3" />
      <circle cx="4.5" cy="12" r="1.3" />
      <circle cx="4.5" cy="17.5" r="1.3" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3.5h8l4 4V20.5H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12.5h6M9 16h6" />
    </>
  ),
  terminal: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M7 9.5l3 2.5-3 2.5M12.5 14.5h4" />
    </>
  ),
  branch: (
    <>
      <circle cx="7" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M7 8.2v7.6M7 12.5a6 6 0 0 0 6-3.5" />
    </>
  ),
  plugin: (
    <>
      <path d="M9 3.5v3M15 3.5v3" />
      <path d="M6.5 6.5h11V13a5.5 5.5 0 0 1-11 0z" />
      <path d="M12 18.5v2" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11M7.5 10l4.5 4.5L16.5 10" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  loop: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  cross: <path d="M6 6l12 12M18 6 6 18" />,
  bolt: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" />
    </>
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
}> = ({ name, size = 96, color = colors.accent, strokeWidth = 1.7, fill = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? color : "none"}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
};
