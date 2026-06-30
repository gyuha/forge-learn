import { interpolate, useCurrentFrame } from "remotion";
import { body, display, mono } from "./fonts";
import { colors, sizes } from "./theme";
import { clamp, EASE_OUT, popScale } from "./util/anim";
import { Icon, IconName } from "./components/Icon";
import { MotionText, MotionWords } from "./components/MotionText";
import { CommandChip } from "./components/CommandChip";
import {
  BigNumber,
  BranchMain,
  CriteriaList,
  LabeledIcon,
  NotationCompare,
  StepLines,
} from "./components/graphics";
import {
  CheatsheetTable,
  CommandFlow,
  FailurePaths,
  Gate,
  LoopDiagram,
  Pipeline,
  PointList,
  SituationBadge,
  SkillGrid,
  TrustLadder,
  TwoColCompare,
} from "./components/graphics2";

const FPS = 30;
const f = (absMs: number, startMs: number) => Math.round(((absMs - startMs) / 1000) * FPS);

const SKILL_GROUPS = [
  { label: "핵심 루프", skills: ["fg-ask", "fg-run", "fg-learn", "fg-done"] },
  { label: "자주 쓰는", skills: ["fg-next", "fg-quick", "fg-status", "fg-map"] },
  {
    label: "보조 · 유지보수",
    skills: [
      "fg-doctor",
      "fg-loop",
      "fg-adversarial-review",
      "fg-agents",
      "fg-cleanup",
      "fg-merge",
      "fg-drop",
      "fg-tdd",
      "fg-eco",
      "fg-statusline",
    ],
  },
];

// ---- layout helpers --------------------------------------------------------

const Stack: React.FC<{ gap?: number; children: React.ReactNode }> = ({ gap = 44, children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap,
      maxWidth: 1640,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const KaptionLabel: React.FC<{ text: string; delay?: number; color?: string }> = ({
  text,
  delay = 0,
  color = colors.dim,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div
      style={{
        fontFamily: body,
        fontWeight: 700,
        fontSize: sizes.label,
        color,
        letterSpacing: 1,
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [12, 0])}px`,
      }}
    >
      {text}
    </div>
  );
};

const IconBadge: React.FC<{ name: IconName; color?: string; delay?: number; size?: number }> = ({
  name,
  color = colors.accent,
  delay = 0,
  size = 96,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div
      style={{
        width: size * 1.7,
        height: size * 1.7,
        borderRadius: 34,
        border: `2px solid ${colors.border}`,
        background: colors.panel,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        scale: popScale(p, 0.7),
        translate: `0px ${interpolate(p, [0, 1], [20, 0])}px`,
      }}
    >
      <Icon name={name} size={size} color={color} />
    </div>
  );
};

const Chip: React.FC<{ text: string; delay?: number; dim?: boolean }> = ({ text, delay = 0, dim }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div
      style={{
        fontFamily: body,
        fontWeight: 700,
        fontSize: sizes.sub,
        color: dim ? colors.faint : colors.white,
        background: colors.panel,
        border: `2px solid ${dim ? colors.border : colors.accent}`,
        borderRadius: 18,
        padding: "20px 36px",
        opacity: p,
        scale: popScale(p, 0.84),
        textDecoration: dim ? "line-through" : "none",
        textDecorationColor: colors.danger,
      }}
    >
      {text}
    </div>
  );
};

// A stacked "row card": icon on the left, label + value on the right.
const RowCard: React.FC<{
  name: IconName;
  title: string;
  note: string;
  delay?: number;
  accent?: boolean;
}> = ({ name, title, note, delay = 0, accent }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 13], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        width: 980,
        padding: "28px 40px",
        borderRadius: 24,
        background: accent ? "rgba(255,138,0,0.10)" : colors.panel,
        border: `2px solid ${accent ? colors.accent : colors.border}`,
        opacity: p,
        translate: `${interpolate(p, [0, 1], [accent ? 50 : -50, 0])}px 0px`,
      }}
    >
      <Icon name={name} size={72} color={accent ? colors.accent : colors.dim} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left", flex: 1 }}>
        <span style={{ fontFamily: display, fontWeight: 700, fontSize: 56, color: colors.white }}>{title}</span>
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 38, color: accent ? colors.accentSoft : colors.dim }}>
          {note}
        </span>
      </div>
    </div>
  );
};

// ---- scene definitions -----------------------------------------------------

export type Scene = {
  id: string;
  startMs: number;
  endMs: number;
  render: React.FC<{ startMs: number }>;
};

export const SCENES: Scene[] = [
  {
    id: "s1-thesis-not",
    startMs: 0,
    endMs: 4806,
    render: () => (
      <Stack>
        <IconBadge name="book" color={colors.dim} />
        <KaptionLabel text="이 영상에서 익힐 것은" />
        <MotionWords text="명령 암기가 아니라" fontSize={128} accentWords={["아니라"]} delay={6} />
      </Stack>
    ),
  },
  {
    id: "s2-thesis-yes",
    startMs: 4806,
    endMs: 9200,
    render: () => (
      <Stack>
        <IconBadge name="compass" />
        <MotionWords
          text="상황을 보고 판단하는 능력"
          fontSize={120}
          accentWords={["판단하는", "능력"]}
          delay={4}
        />
      </Stack>
    ),
  },
  {
    id: "s3-assume",
    startMs: 9200,
    endMs: 15379,
    render: () => (
      <Stack gap={28}>
        <KaptionLabel text="이 영상의 전제" />
        <RowCard name="check" title="Claude Code" note="이미 써보셨다" delay={6} />
        <RowCard name="star" title="forge" note="이번이 처음" delay={20} accent />
      </Stack>
    ),
  },
  {
    id: "s4-skip-basics",
    startMs: 15379,
    endMs: 18674,
    render: () => (
      <Stack>
        <IconBadge name="skip" />
        <MotionWords text="Claude Code 기초는 건너뛰기" fontSize={104} accentWords={["건너뛰기"]} delay={4} />
      </Stack>
    ),
  },
  {
    id: "s5-seven",
    startMs: 18674,
    endMs: 24579,
    render: () => (
      <Stack gap={28}>
        <BigNumber value="7" unit="개 상황" label="으로 나누어 본다" dots={7} />
      </Stack>
    ),
  },
  {
    id: "s6-notation-1",
    startMs: 24579,
    endMs: 35151,
    render: () => <NotationCompare left="/fg-ask" right="/forge:fg-ask" caption="같은 명령입니다" />,
  },
  {
    id: "s7-core",
    startMs: 35151,
    endMs: 39820,
    render: () => (
      <Stack gap={48}>
        <KaptionLabel text="이 영상의 핵심" color={colors.accentSoft} />
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
          <LabeledIcon name="ladder" label="신뢰 사다리" delay={6} iconSize={104} />
          <LabeledIcon name="table" label="치트시트 2장" delay={16} iconSize={104} />
        </div>
      </Stack>
    ),
  },
  {
    id: "s8-judgment",
    startMs: 39820,
    endMs: 46957,
    render: () => (
      <Stack>
        <KaptionLabel text="명령 사전이 아니다" />
        <IconBadge name="target" />
        <MotionWords text="진짜 목표는 판단력" fontSize={128} accentWords={["판단력"]} delay={6} />
      </Stack>
    ),
  },
  {
    id: "s9-criteria",
    startMs: 46957,
    endMs: 63713,
    render: ({ startMs }) => (
      <CriteriaList
        heading="네 가지 성취 기준"
        sceneStartMs={startMs}
        primaryIndex={0}
        items={[
          { n: "1", text: "상황에 맞는 명령 고르기", revealMs: 50215 },
          { n: "2", text: "기본 루프", revealMs: 55955 },
          { n: "3", text: "길을 잃었을 때 대처", revealMs: 57817 },
          { n: "4", text: "효율적인 차선 선택", revealMs: 60610 },
        ]}
      />
    ),
  },
  {
    id: "s10-fourteen",
    startMs: 63713,
    endMs: 71160,
    render: () => (
      <Stack gap={30}>
        <BigNumber value="14" unit="개 유틸리티" label="필요할 때 찾아 쓰는 보조" />
      </Stack>
    ),
  },
  {
    id: "s11-notation-title",
    startMs: 71160,
    endMs: 73310,
    render: () => (
      <Stack>
        <IconBadge name="tag" />
        <MotionText text="표기 정리" fontSize={120} />
      </Stack>
    ),
  },
  {
    id: "s12-notation-2",
    startMs: 73310,
    endMs: 86782,
    render: () => <NotationCompare left="/fg-ask" right="/forge:fg-ask" caption="두 표기 = 같은 것" />,
  },
  {
    id: "s13-cc-assume",
    startMs: 86782,
    endMs: 96241,
    render: () => (
      <Stack gap={40}>
        <KaptionLabel text="Claude Code는 이미 안다 → 설명 생략" />
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <Chip text="프롬프트" delay={6} dim />
          <Icon name="skip" size={64} color={colors.accent} />
          <Chip text="서브에이전트" delay={14} dim />
        </div>
      </Stack>
    ),
  },
  {
    id: "s14-source",
    startMs: 96241,
    endMs: 105700,
    render: () => (
      <Stack gap={40}>
        <IconBadge name="doc" />
        <MotionWords text="정답 소스는 forge 공식 문서" fontSize={96} accentWords={["forge", "공식", "문서"]} delay={6} />
        <KaptionLabel text="배경 이론 ✕  ·  사용법에 집중 ✓" delay={20} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s15-two-lines",
    startMs: 105700,
    endMs: 107821,
    render: () => <BigNumber value="2" unit="줄" label="설치는 이게 전부" />,
  },
  {
    id: "s16-install-steps",
    startMs: 107821,
    endMs: 112366,
    render: () => (
      <StepLines
        steps={[
          { n: "1", label: "마켓플레이스 추가", code: "marketplace add" },
          { n: "2", label: "플러그인 설치 → 끝", code: "plugin install forge" },
        ]}
      />
    ),
  },
  {
    id: "s17-local-clone",
    startMs: 112366,
    endMs: 117820,
    render: () => (
      <Stack gap={40}>
        <IconBadge name="terminal" />
        <div
          style={{
            fontFamily: mono,
            fontSize: 52,
            color: colors.accentSoft,
            background: colors.panel,
            border: `2px solid ${colors.border}`,
            borderRadius: 18,
            padding: "22px 38px",
          }}
        >
          marketplace add <span style={{ color: colors.white }}>&lt;로컬 경로&gt;</span>
        </div>
        <KaptionLabel text="로컬 클론에서 개발 중이라면" delay={16} />
      </Stack>
    ),
  },
  {
    id: "s18-first-loop",
    startMs: 117820,
    endMs: 122669,
    render: () => (
      <Stack gap={44}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <CommandChip command="/fg-ask" fontSize={64} />
          <Icon name="arrow" size={64} color={colors.accent} />
          <Icon name="loop" size={84} color={colors.accentSoft} />
        </div>
        <MotionText text="설치 직후 루프 시작" fontSize={96} delay={10} />
      </Stack>
    ),
  },
  {
    id: "s19-usage-focus",
    startMs: 122669,
    endMs: 133426,
    render: () => (
      <Stack gap={36}>
        <KaptionLabel text="업데이트 · 제거는 화면 아래 한 줄" />
        <IconBadge name="gear" color={colors.dim} />
        <MotionWords text="본령은 설치가 아니라 사용법" fontSize={100} accentWords={["사용법"]} delay={8} />
      </Stack>
    ),
  },
  {
    id: "s20-branch-main",
    startMs: 133426,
    endMs: 144940,
    render: () => <BranchMain caption="GitHub 설치는 main 브랜치 · 변경은 먼저 main에 올려야" />,
  },
  // ===== Cues 36–45: 세 개의 핵심 명령 =======================================
  {
    id: "s21-grid-three",
    startMs: 144940,
    endMs: 154701,
    render: () => (
      <Stack gap={40}>
        <MotionText text="겁먹지 마세요 — 평소엔 3개" fontSize={80} />
        <SkillGrid groups={SKILL_GROUPS} core={["fg-ask", "fg-run", "fg-next"]} />
      </Stack>
    ),
  },
  {
    id: "s22-core-flow",
    startMs: 154701,
    endMs: 175679,
    render: ({ startMs }) => (
      <CommandFlow
        sceneStartMs={startMs}
        items={[
          { cmd: "/fg-ask", label: "계획 다듬기", atMs: 154701 },
          { cmd: "/fg-run", label: "실행", atMs: 157178 },
          { cmd: "/fg-next", label: "다음 한 단계", atMs: 159363 },
        ]}
        caption={{ text: "한 줄: /fg-ask 후 /fg-next 반복", atMs: 168978 }}
      />
    ),
  },
  {
    id: "s23-rest-15",
    startMs: 175679,
    endMs: 180050,
    render: () => (
      <Stack>
        <MotionWords text="나머지 15개는 보조" accentWords={["보조"]} fontSize={108} />
        <KaptionLabel text="필요할 때만 꺼내 쓴다" delay={10} />
      </Stack>
    ),
  },
  // ===== Cues 46–55: 루프 구조 / 단계 역할 ====================================
  {
    id: "s24-loop-reveal",
    startMs: 180050,
    endMs: 188563,
    render: ({ startMs }) => (
      <Stack gap={50}>
        <KaptionLabel text="루프 전체 구조" />
        <LoopDiagram
          sceneStartMs={startMs}
          sealAtMs={186400}
          nodes={[
            { key: "ask", sub: "계획", atMs: 182634 },
            { key: "run", sub: "실행", atMs: 184155 },
            { key: "learn", sub: "학습", atMs: 184763 },
            { key: "done", sub: "정리", atMs: 185675 },
          ]}
        />
      </Stack>
    ),
  },
  {
    id: "s25-loop-roles",
    startMs: 188563,
    endMs: 203765,
    render: ({ startMs }) => (
      <Stack gap={50}>
        <KaptionLabel text="각 단계의 역할" />
        <LoopDiagram
          sceneStartMs={startMs}
          sealAtMs={202600}
          nodes={[
            { key: "ask", sub: "대화형 계획", atMs: 190996 },
            { key: "run", sub: "워크플로우", atMs: 193884 },
            { key: "learn", sub: "학습 기록", atMs: 197380 },
            { key: "done", sub: "정리·봉인", atMs: 200269 },
          ]}
        />
      </Stack>
    ),
  },
  // ===== Cues 56–62: 활성 슬롯 1개 ===========================================
  {
    id: "s26-active-one",
    startMs: 203765,
    endMs: 211214,
    render: () => (
      <Stack gap={26}>
        <BigNumber value="1" label="활성 슬롯 — 항상 한 개" />
        <KaptionLabel text="한 번에 한 작업만 다룬다" delay={20} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s27-why-one",
    startMs: 211214,
    endMs: 228746,
    render: ({ startMs }) => (
      <PointList
        heading="왜 슬롯이 하나인가"
        sceneStartMs={startMs}
        items={[
          { label: "사람이 검토할 여력에 루프 폭을 맞춤", atMs: 211214 },
          { label: "봉인돼야 같은 작업이 재실행되지 않음", atMs: 215927 },
          { label: "done 건너뛰면 재실행 위험", atMs: 220031 },
          { label: "점진적 자율성을 forge 어휘로 옮긴 것", atMs: 223680 },
        ]}
      />
    ),
  },
  // ===== Cues 63–76: 신뢰 사다리 (세 차선) ===================================
  {
    id: "s28-ladder",
    startMs: 228746,
    endMs: 248087,
    render: ({ startMs }) => (
      <Stack gap={44}>
        <KaptionLabel text="세 차선 = 자동화 강도" />
        <TrustLadder
          sceneStartMs={startMs}
          levels={[
            { lvl: "L1", title: "들여다보기", desc: "결정 전 판만 — 실행 안 함", atMs: 232583 },
            { lvl: "L2", title: "한 단계씩", desc: "운전석에 남아 지켜봄", atMs: 238724 },
            { lvl: "L3", title: "통째로 맡김", desc: "루프 전체를 자동", atMs: 243175 },
          ]}
        />
      </Stack>
    ),
  },
  {
    id: "s29-ladder-howto",
    startMs: 248087,
    endMs: 262056,
    render: ({ startMs }) => (
      <PointList
        heading="차선 올리는 요령"
        sceneStartMs={startMs}
        items={[
          { label: "먼저 /fg-ask로 계획", sub: "사람 판단 — 절대 자동화되지 않음", atMs: 248087 },
          { label: "가장 낮은(편한) 차선에서 시작", atMs: 256223 },
          { label: "신뢰가 쌓이면 한 단계씩 올린다", atMs: 259140 },
        ]}
      />
    ),
  },
  {
    id: "s30-l3-preview",
    startMs: 262056,
    endMs: 277100,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="두 가지 L3 차선"
        sceneStartMs={startMs}
        leftAtMs={262056}
        rightAtMs={268811}
        left={{ cmd: "/fg-loop", title: "검증 가능한 목표", bullets: ["grep·테스트로 검증되는 L3"] }}
        right={{ cmd: "/fg-next all", title: "다듬어둔 대기열", bullets: ["대기열을 비우는 L3"] }}
      />
    ),
  },
  // ===== Cues 77–87: .forge 상태 파일 ========================================
  {
    id: "s31-forge-dir",
    startMs: 277100,
    endMs: 288371,
    render: () => (
      <Stack gap={40}>
        <IconBadge name="terminal" />
        <MotionWords text=".forge = 상태를 파일로" accentWords={[".forge", "파일로"]} fontSize={92} delay={6} />
        <KaptionLabel text="단계를 따로 호출해도 흐름이 이어진다 · 네 단계를 기억" delay={18} />
      </Stack>
    ),
  },
  {
    id: "s32-pipeline",
    startMs: 288371,
    endMs: 310150,
    render: ({ startMs }) => (
      <Stack gap={44}>
        <KaptionLabel text=".forge 네 단계" />
        <Pipeline
          sceneStartMs={startMs}
          stages={[
            { key: "backlog", ko: "대기", atMs: 288371 },
            { key: "active", ko: "활성", atMs: 292026, badge: true },
            { key: "executed", ko: "회고 대기", atMs: 295529 },
            { key: "done", ko: "봉인", atMs: 300707 },
          ]}
        />
        <KaptionLabel text="활성 슬롯은 항상 정확히 한 개" delay={f(303296, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s33-dir-note",
    startMs: 310150,
    endMs: 322030,
    render: () => (
      <Stack gap={36}>
        <MotionText text="이 그림은 최소 지식" fontSize={84} />
        <div style={{ display: "flex", gap: 28 }}>
          <CommandChip command="/fg-status" fontSize={48} />
          <CommandChip command="/fg-doctor" fontSize={48} />
        </div>
        <KaptionLabel text="읽을 때 필요 · 구현 세부(브랜치 오버레이)는 생략" delay={14} />
      </Stack>
    ),
  },
  // ===== Cues 88–97: 파일에 두는 이유 4가지 ===================================
  {
    id: "s34-four-reasons",
    startMs: 322030,
    endMs: 365060,
    render: ({ startMs }) => (
      <PointList
        heading="상태를 파일에 두는 이유 4가지"
        sceneStartMs={startMs}
        items={[
          { label: "재진입", sub: "퇴근 후 다음 날에도 .forge만 보면 이어하기", atMs: 326302 },
          { label: "재실행 방지", sub: "중복 커밋·마이그레이션을 구조적으로 차단", atMs: 335305 },
          { label: "검증 게이트", sub: "검증이 기록돼야 봉인", atMs: 349496 },
          { label: "영속성", sub: "세션 메모리는 날아가도 파일은 남는다", atMs: 356515 },
        ]}
      />
    ),
  },
  // ===== Cues 98–102: 일곱 개 상황 시작 ======================================
  {
    id: "s35-seven-intro",
    startMs: 365060,
    endMs: 376421,
    render: () => (
      <Stack gap={30}>
        <BigNumber value="7" unit="개 상황" label="하나씩 살펴보기" />
        <KaptionLabel text="상황 · 명령 · 산출물 · 다음 단계" delay={20} color={colors.accentSoft} />
      </Stack>
    ),
  },
  // ===== Cues 103–116: 상황1 새 프로젝트 셋업 ================================
  {
    id: "s36-sit1",
    startMs: 376421,
    endMs: 396941,
    render: ({ startMs }) => (
      <Stack gap={46}>
        <SituationBadge n="①" title="새 프로젝트 셋업" />
        <CommandFlow
          sceneStartMs={startMs}
          items={[
            { cmd: "/fg-map", label: "코드 매핑", atMs: 386400 },
            { cmd: "/fg-agents", label: "에이전트", atMs: 388600 },
            { cmd: "/fg-ask", label: "첫 작업", atMs: 390800 },
          ]}
          caption={{ text: "빠른 시작이 생략하는 유일한 사전 단계", atMs: 392724 }}
        />
      </Stack>
    ),
  },
  {
    id: "s37-fgmap",
    startMs: 396941,
    endMs: 414408,
    render: ({ startMs }) => (
      <Stack gap={36}>
        <CommandChip command="/fg-map" fontSize={60} />
        <MotionWords
          text="병렬 서브에이전트로 코드베이스 지도화"
          accentWords={["지도화"]}
          fontSize={70}
          delay={6}
        />
        <KaptionLabel
          text="이후 fg-ask가 지도를 읽음 → 컨텍스트 부패 ↓"
          delay={f(411096, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  {
    id: "s38-fgagents",
    startMs: 414408,
    endMs: 438050,
    render: ({ startMs }) => (
      <PointList
        heading="fg-agents — 선택"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "반복되는 특화 역할이 있으면 역할 카드 생성", atMs: 416968 },
          { label: "억지로 만들지 않음 — 없음도 정직한 결과", atMs: 421185 },
          { label: "카드를 만들어도 세션 재시작해야 fg-run이 인식", atMs: 429316, tone: "warn" },
        ]}
      />
    ),
  },
  // ===== Cues 117–133: 상황2 일상 작업 =======================================
  {
    id: "s39-sit2",
    startMs: 438050,
    endMs: 458957,
    render: ({ startMs }) => (
      <Stack gap={46}>
        <SituationBadge n="②" title="일상 작업 — 90%" />
        <CommandFlow
          sceneStartMs={startMs}
          items={[
            { cmd: "/fg-ask", label: "계획", atMs: 450840 },
            { cmd: "/fg-run", label: "실행", atMs: 452500 },
            { cmd: "/fg-next", label: "다음", atMs: 454200 },
          ]}
          caption={{ text: "삼단콤이 forge의 기본 리듬", atMs: 456000 }}
        />
      </Stack>
    ),
  },
  {
    id: "s40-grilling",
    startMs: 458957,
    endMs: 477531,
    render: ({ startMs }) => (
      <Stack gap={34}>
        <PointList
          heading="fg-ask = 그릴링"
          sceneStartMs={startMs}
          items={[
            { label: "재현 조건", atMs: 464732 },
            { label: "완료 기준", atMs: 465669 },
            { label: "비목표", atMs: 466605 },
          ]}
        />
        <KaptionLabel
          text="그릴링 품질 = 실행의 정답 소스 품질"
          delay={f(470195, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  {
    id: "s41-run-next",
    startMs: 477531,
    endMs: 494935,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="fg-run · fg-next 동작"
        sceneStartMs={startMs}
        leftAtMs={477531}
        rightAtMs={485492}
        left={{ cmd: "/fg-run", title: "실행", bullets: ["단일 계획 → 바로 실행", "백로그 여럿 → 선택 메뉴"] }}
        right={{ cmd: "/fg-next", title: "다음 단계", bullets: ["검증 결과 따라 회고로", "차이 작으면 봉인으로"] }}
      />
    ),
  },
  // ===== Cues 134–150: 상황3 fg-quick =======================================
  {
    id: "s42-sit3",
    startMs: 494935,
    endMs: 514867,
    render: ({ startMs }) => (
      <Stack gap={34}>
        <SituationBadge n="③" title="fg-quick — 경량 차선" />
        <KaptionLabel
          text="루프 밖 · ADR·계획·회고 없이 바로 실행"
          delay={f(508356, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  {
    id: "s43-quick-when",
    startMs: 514867,
    endMs: 530371,
    render: ({ startMs }) => (
      <PointList
        heading="fg-quick는 언제?"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: ".forge 로그에 한 줄만 남김", atMs: 514867 },
          { label: "오타·문구·버전 번호 — 회고할 게 없는 일회성", atMs: 520759 },
          { label: "정식 루프로 돌리면 관료주의", atMs: 526650 },
        ]}
      />
    ),
  },
  {
    id: "s44-quick-escape",
    startMs: 530371,
    endMs: 550990,
    render: ({ startMs }) => (
      <Stack gap={34}>
        <MotionWords text="가장 중요한 건 탈출 조건" accentWords={["탈출", "조건"]} fontSize={80} />
        <PointList
          sceneStartMs={startMs}
          numbered={false}
          items={[
            { label: "버그가 깊거나 범위가 크다고 드러나면", atMs: 533161, tone: "warn" },
            { label: "그 즉시 /fg-ask로 옮겨라", atMs: 538122 },
            { label: "이 판단이 곧 실력", atMs: 549130 },
          ]}
        />
      </Stack>
    ),
  },
  // ===== Cues 151–167: 상황4 L3 두 차선 ======================================
  {
    id: "s45-sit4",
    startMs: 550990,
    endMs: 565680,
    render: () => (
      <Stack gap={34}>
        <SituationBadge n="④" title="L3 — 루프 통째로 맡기기" />
        <KaptionLabel text="계획은 사람, 검증이 기계로 명확하면" delay={16} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s46-l3-compare",
    startMs: 565680,
    endMs: 602764,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="두 L3 차선 비교"
        sceneStartMs={startMs}
        leftAtMs={574008}
        rightAtMs={585793}
        left={{
          cmd: "/fg-next all",
          title: "대기열 비우기",
          bullets: ["이미 다듬어둔 백로그", "계획=사람 · 실행·검증·봉인=기계"],
        }}
        right={{
          cmd: "/fg-loop",
          title: "목표 수렴",
          bullets: ["grep·테스트 정지 조건 필요", "실패 시 승인 범위 내 자가 수정"],
        }}
      />
    ),
  },
  {
    id: "s47-wall",
    startMs: 602764,
    endMs: 619420,
    render: ({ startMs }) => (
      <Stack gap={32}>
        <PointList
          heading="둘 다 '벽'에서 멈춘다"
          sceneStartMs={startMs}
          numbered={false}
          items={[
            { label: "검증이 불가능", atMs: 604806 },
            { label: "진짜 방향 갈등", atMs: 606600 },
            { label: "진전이 없음", atMs: 608500 },
          ]}
        />
        <KaptionLabel
          text="멈추면 맥락을 사람에게 — 무인이지 무책임이 아니다"
          delay={f(613920, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  // ===== Cues 168–186: 상황5 status / doctor =================================
  {
    id: "s48-sit5",
    startMs: 619420,
    endMs: 637096,
    render: () => (
      <Stack gap={34}>
        <SituationBadge n="⑤" title="재진입 · 점검" />
        <KaptionLabel text="'어디까지 했지?' → 읽기 전용 도구 2개" delay={16} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s49-status-doctor",
    startMs: 637096,
    endMs: 654038,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="읽기 전용 — 쓰기·자동실행 X"
        sceneStartMs={startMs}
        leftAtMs={645859}
        rightAtMs={649802}
        left={{ cmd: "/fg-status", title: "어디까지 했나?", bullets: ["진행 상태를 본다"] }}
        right={{ cmd: "/fg-doctor", title: "상태가 건강한가?", bullets: ["무결성을 점검한다"] }}
      />
    ),
  },
  {
    id: "s50-status-detail",
    startMs: 654038,
    endMs: 682080,
    render: ({ startMs }) => (
      <PointList
        heading="두 도구 활용"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "fg-status '회고 대기' → fg-next로 이어가기", atMs: 655352 },
          { label: "fg-doctor: 고아 파일·상태 손상·슬러그 짝 검사", atMs: 663093 },
          { label: "문서 정합도 점검", atMs: 676238 },
          { label: "위반 보고 → 수정은 사람이 fg-quick·fg-ask로", atMs: 677552 },
        ]}
      />
    ),
  },
  // ===== Cues 187–202: 상황6 마무리 + 적대적 리뷰 ============================
  {
    id: "s51-sit6",
    startMs: 682080,
    endMs: 695718,
    render: () => (
      <Stack gap={34}>
        <SituationBadge n="⑥" title="마무리 · 출하" />
        <KaptionLabel text="learn + done이 한 바퀴를 닫는다" delay={16} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s52-finish",
    startMs: 695718,
    endMs: 711662,
    render: ({ startMs }) => (
      <CommandFlow
        sceneStartMs={startMs}
        items={[
          { cmd: "/fg-learn", label: "회고→학습 문서", atMs: 695718 },
          { cmd: "/fg-done", label: "봉인·아카이브", atMs: 700274 },
          { cmd: "배포", label: "결과 내보내기", atMs: 707410 },
        ]}
        caption={{ text: "봉인돼야 재실행이 막힌다", atMs: 704981 }}
      />
    ),
  },
  {
    id: "s53-adversarial",
    startMs: 711662,
    endMs: 741120,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <CommandChip command="/fg-adversarial-review" fontSize={44} />
        <PointList
          sceneStartMs={startMs}
          numbered={false}
          items={[
            { label: "위험 변경(결제·인증·마이그레이션)에서", atMs: 717280 },
            { label: "'틀렸다' 가정 — 공격자 자세로 6개 렌즈 병렬", atMs: 721228 },
            { label: "단, 봉인 게이트는 아님 (게이트=검증·회고뿐)", atMs: 729000 },
            { label: "무인 주행은 건너뜀 · 판단은 사람 몫", atMs: 737628 },
          ]}
        />
      </Stack>
    ),
  },
  // ===== Cues 203–216: 상황7 유지보수 도구 ===================================
  {
    id: "s54-sit7",
    startMs: 741120,
    endMs: 759581,
    render: () => (
      <Stack gap={34}>
        <SituationBadge n="⑦" title="유지보수 — 정비 도구" />
        <KaptionLabel text="일상엔 안 쓰지만 달력에 두면 좋다" delay={16} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s55-maint-tools",
    startMs: 759581,
    endMs: 803400,
    render: ({ startMs }) => (
      <PointList
        heading="루프 밖 정비 도구"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "fg-cleanup", sub: "대체된 ADR 은퇴 처리 (번호 유지·삭제 X)", atMs: 759581 },
          { label: "fg-merge", sub: "브랜치 forge 상태를 기본 브랜치로 합치기", atMs: 771345 },
          { label: "fg-drop", sub: "미완 작업 안전 삭제 (깃·코드는 안 건드림)", atMs: 778844 },
          { label: "fg-tdd · fg-eco", sub: "설정 토글 (eco = 소넷 제한 + 단순성 규율)", atMs: 787961 },
        ]}
      />
    ),
  },
  // ===== Cues 217–227: 치트시트 ① 의사결정 ===================================
  {
    id: "s56-cheat1",
    startMs: 803400,
    endMs: 848020,
    render: ({ startMs }) => (
      <CheatsheetTable
        heading="치트시트 ① 의사결정"
        sceneStartMs={startMs}
        rows={[
          { sit: "오타·버전 번호", cmd: "/fg-quick", next: "경량 차선", atMs: 813612 },
          { sit: "보통 작업", cmd: "정식 루프", next: "ask → run → next", atMs: 816500 },
          { sit: "기계 검증 가능한 목표", cmd: "/fg-loop", next: "자가 수정", atMs: 824767 },
          { sit: "아니면 백로그 쌓고", cmd: "/fg-next all", next: "대기열 비우기", atMs: 826653 },
          { sit: "길을 잃음", cmd: "/fg-status", next: "안전하게 판만", atMs: 830895, highlight: true },
        ]}
        footer={{ text: "이 5가지 = 18개의 90%", atMs: 839536 }}
      />
    ),
  },
  // ===== Cues 228–242: fg-ask 4가지 산물 =====================================
  {
    id: "s57-ask-products",
    startMs: 848020,
    endMs: 902040,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <PointList
          heading="fg-ask의 4가지 산물"
          sceneStartMs={startMs}
          items={[
            { label: "용어", sub: "애매한 단어를 정확히 못 박음 → 용어집", atMs: 859375 },
            { label: "완료 기준", sub: "'잘못된 입력에 400 반환'처럼 관측 가능", atMs: 869009 },
            { label: "비목표", sub: "안 할 것 명시 → 범위 폭발 방지", atMs: 878471 },
            { label: "조각", sub: "독립 검증·봉인 단위로 분할", atMs: 886040 },
          ]}
        />
        <KaptionLabel
          text="이게 제대로 안 되면 실행이 흔들린다"
          delay={f(895331, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  // ===== Cues 243–254: divergence + 검증 게이트 ==============================
  {
    id: "s58-divergence",
    startMs: 902040,
    endMs: 925103,
    render: ({ startMs }) => (
      <PointList
        heading="run 파일 = 계획과 실제의 차이 (divergence)"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "차이가 작으면 → 회고 건너뛰고 봉인", atMs: 912709 },
          { label: "차이가 크면 → /fg-ask로 재정비 (배울 게 있다)", atMs: 917102 },
        ]}
      />
    ),
  },
  {
    id: "s59-gate",
    startMs: 925103,
    endMs: 948480,
    render: ({ startMs }) => (
      <Stack gap={34}>
        <Gate sceneStartMs={startMs} />
        <KaptionLabel
          text="실행 직후 '실행됨' → fg-done이 '완료'로 뒤집음"
          delay={f(940949, startMs)}
        />
      </Stack>
    ),
  },
  // ===== Cues 255–268: 실패 상태 ============================================
  {
    id: "s60-failure",
    startMs: 948480,
    endMs: 999100,
    render: ({ startMs }) => <FailurePaths sceneStartMs={startMs} />,
  },
  // ===== Cues 269–282: 제작 원칙 (메타) ======================================
  {
    id: "s61-meta",
    startMs: 999100,
    endMs: 1042010,
    render: ({ startMs }) => (
      <PointList
        heading="이 영상의 제작 원칙"
        sceneStartMs={startMs}
        items={[
          { label: "분위기·섹션 구분 = 이미지", atMs: 1007069 },
          { label: "명령·상태명·화살표 = 텍스트/도형", atMs: 1010287 },
          { label: "이미지에 명령을 박으면 깨짐 → 이미지는 텍스트 없이", atMs: 1017797 },
          { label: "흐름도 = 상황·명령·산출물·다음 (일관 구조)", atMs: 1028524 },
        ]}
      />
    ),
  },
  // ===== Cues 283–292: 치트시트 ② 상황→명령→다음 ============================
  {
    id: "s62-cheat2",
    startMs: 1042010,
    endMs: 1077670,
    render: ({ startMs }) => (
      <CheatsheetTable
        heading="치트시트 ② 상황 → 명령 → 다음"
        sceneStartMs={startMs}
        rows={[
          { sit: "새 프로젝트", cmd: "/fg-map", next: "지도 → 첫 작업", atMs: 1046674 },
          { sit: "일상 작업", cmd: "ask·run·next", next: "기본 리듬", atMs: 1048800 },
          { sit: "사소한 일회 변경", cmd: "/fg-quick", next: "바로 실행", atMs: 1054649, highlight: true },
          { sit: "재진입·점검", cmd: "/fg-status", next: "안전하게 판만", atMs: 1059012, highlight: true },
          { sit: "실패", cmd: "/fg-ask", next: "고치거나 재정비", atMs: 1064000 },
        ]}
        footer={{ text: "/fg-ask 후 /fg-next(또는 all) 반복", atMs: 1070448 }}
      />
    ),
  },
  // ===== Cues 293–306: 18개 전체 표 =========================================
  {
    id: "s63-grid18",
    startMs: 1077670,
    endMs: 1117530,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <MotionText text="18개 전체 한눈에" fontSize={74} />
        <SkillGrid groups={SKILL_GROUPS} core={["fg-ask", "fg-run", "fg-next", "fg-quick", "fg-status"]} />
        <KaptionLabel
          text="다 외울 필요 없음 — 핵심 5개로 80% 커버"
          delay={f(1101837, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  // ===== Cues 307–317: 실수 패턴 3가지 ======================================
  {
    id: "s64-mistakes",
    startMs: 1117530,
    endMs: 1159430,
    render: ({ startMs }) => (
      <PointList
        heading="실수 패턴 3가지"
        sceneStartMs={startMs}
        items={[
          { label: "ask 건너뛰고 run → 정답 소스 없는 실행", sub: "반드시 ask부터 시작", atMs: 1123402, tone: "warn" },
          { label: ".forge 상태 무시 → 재실행·길 잃음", sub: "습관적으로 fg-status로 판부터", atMs: 1133084, tone: "warn" },
          { label: "실패 상태를 억지로 봉인 — 게이트가 막음", sub: "정직하게 고치거나 fg-ask로", atMs: 1143400, tone: "warn" },
        ]}
      />
    ),
  },
  // ===== Cues 318–325: 출처 + 마무리 ========================================
  {
    id: "s65-source",
    startMs: 1159430,
    endMs: 1176998,
    render: ({ startMs }) => (
      <Stack gap={36}>
        <IconBadge name="doc" />
        <MotionWords
          text="정답 소스 = forge README · 문서"
          accentWords={["README", "문서"]}
          fontSize={74}
          delay={6}
        />
        <KaptionLabel
          text="스킬 파일 = 18개 상세 · 상태 계약 파일 = 상태 계약"
          delay={f(1168063, startMs)}
        />
      </Stack>
    ),
  },
  {
    id: "s66-closing",
    startMs: 1176998,
    endMs: 1190100,
    render: ({ startMs }) => (
      <Stack gap={36}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <CommandChip command="/fg-ask" fontSize={58} />
          <Icon name="arrow" size={56} color={colors.accent} />
          <CommandChip command="/fg-next" fontSize={58} />
        </div>
        <MotionWords text="이 한 줄이 기억나면 성공" accentWords={["성공"]} fontSize={76} delay={f(1184874, startMs)} />
        <MotionText text="감사합니다" fontSize={64} color={colors.accentSoft} delay={f(1188811, startMs)} />
      </Stack>
    ),
  },
];
