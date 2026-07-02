import { interpolate, useCurrentFrame } from "remotion";
import { body } from "./fonts";
import { colors, sizes } from "./theme";
import { clamp, EASE_OUT, popScale } from "./util/anim";
import { Icon, IconName } from "./components/Icon";
import { MotionText, MotionWords } from "./components/MotionText";
import { CommandChip } from "./components/CommandChip";
import { BigNumber, NotationCompare } from "./components/graphics";
import {
  CheatsheetTable,
  CommandFlow,
  LoopDiagram,
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

// ---- scene definitions -----------------------------------------------------
// Retimed 2026-07-02 for the "forge 사용 매뉴얼 12분" narration (Edge TTS,
// ko-KR-SunHiNeural, 746.1s) — replaces the earlier 66-scene set that was
// timed against a stale 19.8min narration (see .forge/adr/0004).

export type Scene = {
  id: string;
  startMs: number;
  endMs: number;
  render: React.FC<{ startMs: number }>;
};

export const SCENES: Scene[] = [
  // ===== idx1 (0–26064): 오프닝 — 흔히 겪는 네 가지 문제 =====================
  {
    id: "s01-open",
    startMs: 0,
    endMs: 8601,
    render: () => (
      <Stack>
        <IconBadge name="book" color={colors.dim} />
        <KaptionLabel text="Claude Code로 작업하다 보면" />
        <MotionWords text="이런 순간이 옵니다" fontSize={120} accentWords={["이런", "순간"]} delay={8} />
      </Stack>
    ),
  },
  {
    id: "s02-four-problems",
    startMs: 8601,
    endMs: 20982,
    render: ({ startMs }) => (
      <PointList
        heading="흔히 겪는 네 가지 순간"
        sceneStartMs={startMs}
        items={[
          { label: "계획 없이 실행 → 엉뚱한 방향", atMs: 8601 },
          { label: "세션 끊기면 어디까지 했는지 기억 안 남", atMs: 9500 },
          { label: "검증 없이 완료라 착각", atMs: 12641 },
          { label: "같은 작업을 실수로 두 번 실행", atMs: 17463 },
        ]}
      />
    ),
  },
  {
    id: "s03-forge-answer-tease",
    startMs: 20982,
    endMs: 26064,
    render: () => (
      <Stack>
        <IconBadge name="target" />
        <MotionWords text="forge는 이 네 가지를 막는 개발 루프" fontSize={80} accentWords={["forge"]} delay={4} />
      </Stack>
    ),
  },
  // ===== idx2 (26064–60528): 월요일 예시 =====================================
  {
    id: "s04-monday-example",
    startMs: 26064,
    endMs: 54522,
    render: ({ startMs }) => (
      <PointList
        heading="흔한 시나리오"
        sceneStartMs={startMs}
        items={[
          { label: "월요일 — 새 기능 작업 시작", atMs: 28209 },
          { label: "화요일 — 다른 일로 중단", atMs: 30354 },
          { label: "수요일 — 어디부터? 기억 안 남", atMs: 33786 },
          { label: "결국 재검토, 최악은 중복 실행", atMs: 39363 },
        ]}
      />
    ),
  },
  {
    id: "s05-monday-closing",
    startMs: 54522,
    endMs: 60528,
    render: () => (
      <Stack>
        <KaptionLabel text="개인이든 팀이든 똑같이 벌어지는 일" />
        <MotionWords text="forge는 이 문제를 풀려고 만들어졌습니다" fontSize={72} accentWords={["forge"]} delay={6} />
      </Stack>
    ),
  },
  // ===== idx3 (60528–89112): forge의 답 ======================================
  {
    id: "s06-forge-loop",
    startMs: 60528,
    endMs: 71074,
    render: () => (
      <Stack>
        <KaptionLabel text="forge의 답" />
        <MotionWords text="질의 → 실행 → 회고 → 완료, 한 바퀴" fontSize={88} accentWords={["한", "바퀴"]} delay={6} />
      </Stack>
    ),
  },
  {
    id: "s07-forge-dir",
    startMs: 71074,
    endMs: 89112,
    render: ({ startMs }) => (
      <Stack gap={40}>
        <IconBadge name="terminal" />
        <MotionWords text=".forge 디렉터리에 상태를 남긴다" accentWords={[".forge"]} fontSize={88} delay={6} />
        <KaptionLabel
          text="세션이 끊겨도 파일은 남는다 — 필요한 건 판단력"
          delay={f(74404, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  // ===== idx4 (89112–132888): 두 기둥 =========================================
  {
    id: "s08-two-pillars",
    startMs: 89112,
    endMs: 124766,
    render: ({ startMs }) => (
      <PointList
        heading="forge의 두 기둥"
        sceneStartMs={startMs}
        items={[
          {
            label: "① 그릴링·회고는 항상 대화로",
            sub: "자동화 구간엔 사람 입력이 들어갈 자리가 없다",
            atMs: 92829,
          },
          {
            label: "② 문서는 산출물이 아니라 연료",
            sub: "계획의 결정이 실행 기준, 회고의 학습이 다음 계획의 출발점",
            atMs: 110725,
          },
        ]}
      />
    ),
  },
  {
    id: "s09-pillars-example",
    startMs: 124766,
    endMs: 132888,
    render: () => (
      <Stack>
        <KaptionLabel text="예: 계획을 얼마나 쪼갤지도" />
        <MotionWords text="언제나 대화로 확인합니다" fontSize={80} delay={6} />
      </Stack>
    ),
  },
  // ===== idx5 (132888–191712): 신뢰 사다리 ====================================
  {
    id: "s10-trust-ladder",
    startMs: 132888,
    endMs: 156558,
    render: ({ startMs }) => (
      <Stack gap={44}>
        <KaptionLabel text="세 차선 = 자동화 강도" />
        <TrustLadder
          sceneStartMs={startMs}
          levels={[
            { lvl: "L1", title: "들여다보기", desc: "결정 전 판만 — 실행 안 함", atMs: 140451 },
            { lvl: "L2", title: "한 단계씩", desc: "운전석에 남아 지켜봄", atMs: 147734 },
            { lvl: "L3", title: "통째로 맡김", desc: "루프 전체를 자동", atMs: 152916 },
          ]}
        />
      </Stack>
    ),
  },
  {
    id: "s11-ladder-flex",
    startMs: 156558,
    endMs: 180507,
    render: ({ startMs }) => (
      <Stack gap={34}>
        <KaptionLabel text="차선은 언제든 오르내릴 수 있다" />
        <MotionWords
          text="fg-status → fg-next → fg-loop 순서로"
          fontSize={72}
          delay={f(161740, startMs)}
        />
        <KaptionLabel text="신뢰가 쌓이는 만큼 올리면 된다" delay={f(176306, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s12-automate-judgment",
    startMs: 180507,
    endMs: 191712,
    render: ({ startMs }) => (
      <Stack>
        <IconBadge name="compass" />
        <MotionWords text="자동화하되 판단은 사람에게" fontSize={92} accentWords={["판단"]} delay={4} />
        <KaptionLabel text="이제 일곱 가지 상황을 보여드립니다" delay={f(186810, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  // ===== idx6 (191712–222792): 표기 정리 ======================================
  {
    id: "s13-notation-title",
    startMs: 191712,
    endMs: 195697,
    render: () => (
      <Stack>
        <IconBadge name="tag" />
        <MotionText text="표기 정리" fontSize={120} />
      </Stack>
    ),
  },
  {
    id: "s14-notation-compare",
    startMs: 195697,
    endMs: 208182,
    render: () => <NotationCompare left="/fg-ask" right="/forge:fg-ask" caption="같은 명령입니다" />,
  },
  {
    id: "s15-cc-assume",
    startMs: 208182,
    endMs: 218409,
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
    id: "s16-source",
    startMs: 218409,
    endMs: 222792,
    render: () => (
      <Stack gap={30}>
        <IconBadge name="doc" />
        <MotionWords text="정답 소스는 forge 공식 문서" fontSize={80} accentWords={["forge", "공식", "문서"]} delay={6} />
      </Stack>
    ),
  },
  // ===== idx7·idx8 슬롯(222792–265944)의 실제 오디오 =========================
  // 실측(Whisper 전사) 결과: 이 슬롯의 실제 음성은 설치 안내가 아니라 idx08
  // 대본("18개 스킬...") 전체 + 대본에 없는 고아 문장("이 파일 기반 상태...")이다.
  // 설치 안내(idx07 원 대본)는 오디오 어디에도 존재하지 않아 해당 슬라이드를 들어냈다.
  // 오디오는 그대로 두기로 합의(사용자 결정) — 자막/슬라이드만 실제 음성에 맞춤.
  {
    id: "s22-grid-three",
    startMs: 222792,
    endMs: 229312,
    render: () => (
      <Stack gap={34}>
        <MotionText text="겁먹지 마세요 — 평소엔 3개" fontSize={72} />
        <SkillGrid groups={SKILL_GROUPS} core={["fg-ask", "fg-run", "fg-next"]} />
      </Stack>
    ),
  },
  {
    id: "s23-core-flow",
    startMs: 229312,
    endMs: 245472,
    render: ({ startMs }) => (
      <CommandFlow
        sceneStartMs={startMs}
        items={[
          { cmd: "/fg-ask", label: "계획", atMs: 229312 },
          { cmd: "/fg-run", label: "실행", atMs: 231800 },
          { cmd: "/fg-next", label: "다음", atMs: 234200 },
        ]}
        caption={{ text: "검증부터 회고·봉인까지 fg-next가 판단 — 한 줄만 기억", atMs: 237832 }}
      />
    ),
  },
  {
    id: "s24-rest-fifteen",
    startMs: 245472,
    endMs: 253488,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <MotionWords text="fg-ask 후 fg-next를 계속" accentWords={["fg-ask", "fg-next"]} fontSize={72} />
        <KaptionLabel text="나머지 15개는 보조" delay={f(249500, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s24b-orphan-lock",
    startMs: 253488,
    endMs: 265944,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <IconBadge name="check" />
        <KaptionLabel text="활성 슬롯은 항상 한 개로 유지" delay={0} />
        <KaptionLabel text="봉인이 되어야만 재실행" delay={f(257928, startMs)} color={colors.accentSoft} />
        <MotionWords text="이제 7가지 상황을 하나씩" fontSize={64} delay={f(262328, startMs)} />
      </Stack>
    ),
  },
  // ===== idx9 (265944–302208): 루프 구조 상세 =================================
  {
    id: "s25-loop-roles",
    startMs: 265944,
    endMs: 281626,
    render: ({ startMs }) => (
      <Stack gap={50}>
        <KaptionLabel text="forge 루프의 전체 구조" />
        <LoopDiagram
          sceneStartMs={startMs}
          sealAtMs={279500}
          nodes={[
            { key: "ask", sub: "계획", atMs: 269000 },
            { key: "run", sub: "실행", atMs: 272500 },
            { key: "learn", sub: "학습", atMs: 275800 },
            { key: "done", sub: "정리", atMs: 278600 },
          ]}
        />
      </Stack>
    ),
  },
  {
    id: "s26-active-one",
    startMs: 281626,
    endMs: 293387,
    render: () => (
      <Stack gap={26}>
        <BigNumber value="1" label="활성 슬롯 — 항상 한 개" />
        <KaptionLabel text="한 번에 한 작업만 다룬다" delay={20} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s27-plan-run-seal",
    startMs: 293387,
    endMs: 302208,
    render: () => (
      <Stack>
        <MotionWords text="계획 하나 = 실행 하나 = 봉인 하나" fontSize={72} accentWords={["하나"]} delay={4} />
      </Stack>
    ),
  },
  // ===== idx10 슬롯(302208–336432)의 실제 오디오 =============================
  // 실측(Whisper 전사) 결과: 이 슬롯의 실제 음성은 "파일 상태를 두는 이유"가
  // 아니라 idx12(상황② 일상 작업) 대본의 축약판이다(예시 문장 2개만 빠짐) —
  // 뒤(s33 이하)에서 같은 내용이 정식으로 다시 나와 중복되지만, 오디오는 그대로
  // 두기로 합의했으므로 자막/슬라이드만 실제 음성에 맞춘다.
  {
    id: "s28-sit2-preview",
    startMs: 302208,
    endMs: 313328,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <SituationBadge n="②" title="일상 작업 — 90%" />
        <KaptionLabel text="3단 리듬의 실전판" delay={f(306368, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s28b-grilling-preview",
    startMs: 313328,
    endMs: 326568,
    render: ({ startMs }) => (
      <PointList
        heading="fg-ask = 그릴링"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "재현 조건·완료 기준·비목표를 못 박는다", atMs: 313328 },
          { label: "그릴링 품질 = 정답 소스 품질", atMs: 321888 },
        ]}
      />
    ),
  },
  {
    id: "s28c-run-next-preview",
    startMs: 326568,
    endMs: 336432,
    render: ({ startMs }) => (
      <CommandFlow
        sceneStartMs={startMs}
        items={[
          { cmd: "/fg-run", label: "하나면 실행 · 여럿이면 선택", atMs: 326568 },
          { cmd: "/fg-next", label: "검증 결과로 판단", atMs: 331448 },
        ]}
        caption={{ text: "회고 또는 봉인으로 이어짐", atMs: 333500 }}
      />
    ),
  },
  // ===== idx11 (336432–380880): situation① 새 프로젝트 셋업 ==================
  {
    id: "s30-sit1",
    startMs: 336432,
    endMs: 358584,
    render: ({ startMs }) => (
      <Stack gap={46}>
        <SituationBadge n="①" title="새 프로젝트 셋업" />
        <CommandFlow
          sceneStartMs={startMs}
          items={[
            { cmd: "/fg-map", label: "코드 매핑", atMs: 344540 },
            { cmd: "/fg-agents", label: "에이전트", atMs: 349500 },
            { cmd: "/fg-ask", label: "첫 작업", atMs: 353500 },
          ]}
          caption={{ text: "빠른 시작이 생략하는 유일한 사전 단계", atMs: 356000 }}
        />
      </Stack>
    ),
  },
  {
    id: "s31-fgmap",
    startMs: 358584,
    endMs: 365823,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <CommandChip command="/fg-map" fontSize={56} />
        <MotionWords text="병렬 서브에이전트로 코드베이스 지도화" accentWords={["지도화"]} fontSize={62} delay={6} />
        <KaptionLabel
          text="아키텍처·컨벤션·이슈까지 구조화된 문서로 저장"
          delay={f(361500, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  {
    id: "s32-fgagents",
    startMs: 365823,
    endMs: 380880,
    render: ({ startMs }) => (
      <PointList
        heading="fg-agents — 선택"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "반복되는 특화 역할이 있으면 카드 생성", atMs: 365823 },
          { label: "억지로 만들지 않음 — 없음도 정직한 결과", atMs: 369500 },
          { label: "카드를 만들어도 세션 재시작해야 인식", atMs: 374365, tone: "warn" },
        ]}
      />
    ),
  },
  // ===== idx12 (380880–432360): situation② 일상 작업 ==========================
  {
    id: "s33-sit2",
    startMs: 380880,
    endMs: 391176,
    render: ({ startMs }) => (
      <Stack gap={40}>
        <SituationBadge n="②" title="일상 작업 — 90%" />
        <CommandFlow
          sceneStartMs={startMs}
          items={[
            { cmd: "/fg-ask", label: "계획", atMs: 384500 },
            { cmd: "/fg-run", label: "실행", atMs: 386800 },
            { cmd: "/fg-next", label: "다음", atMs: 389000 },
          ]}
          caption={{ text: "삼단콤이 forge의 기본 리듬", atMs: 390000 }}
        />
      </Stack>
    ),
  },
  {
    id: "s34-grilling",
    startMs: 391176,
    endMs: 410499,
    render: ({ startMs }) => (
      <PointList
        heading="fg-ask = 그릴링"
        sceneStartMs={startMs}
        items={[
          { label: "재현 조건", atMs: 394500 },
          { label: "완료 기준", atMs: 398500 },
          { label: "비목표", atMs: 402500 },
        ]}
      />
    ),
  },
  {
    id: "s35-grilling-example",
    startMs: 410499,
    endMs: 421923,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <PointList
          heading="예를 들면"
          sceneStartMs={startMs}
          numbered={false}
          items={[
            { label: "몇 번 시도해야 재현되나요?", atMs: 410499 },
            { label: "이번엔 어디까지가 범위 밖인가요?", atMs: 414500 },
          ]}
        />
        <KaptionLabel
          text="그릴링 품질 = 실행의 정답 소스 품질"
          delay={f(418500, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  {
    id: "s36-run-next",
    startMs: 421923,
    endMs: 432360,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="fg-run · fg-next 동작"
        sceneStartMs={startMs}
        leftAtMs={421923}
        rightAtMs={427000}
        left={{ cmd: "/fg-run", title: "실행", bullets: ["단일 계획 → 바로 실행", "백로그 여럿 → 선택 메뉴"] }}
        right={{ cmd: "/fg-next", title: "다음 단계", bullets: ["검증 결과 따라 회고로", "차이 작으면 봉인으로"] }}
      />
    ),
  },
  // ===== idx13 (432360–471264): situation③ fg-quick ===========================
  {
    id: "s37-sit3",
    startMs: 432360,
    endMs: 440990,
    render: () => (
      <Stack gap={30}>
        <SituationBadge n="③" title="fg-quick — 경량 차선" />
        <KaptionLabel text="회고할 게 없는 사소한 일회성 변경" delay={16} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s38-quick-when",
    startMs: 440990,
    endMs: 448487,
    render: ({ startMs }) => (
      <PointList
        heading="fg-quick는 언제?"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "오타·문구·버전 번호", atMs: 440990 },
          { label: "형식 산출물 없이 바로 실행", atMs: 443700 },
          { label: "정식 루프로 돌리면 관료주의", atMs: 446200 },
        ]}
      />
    ),
  },
  {
    id: "s39-quick-escape",
    startMs: 448487,
    endMs: 460937,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <MotionWords text="가장 중요한 건 탈출 조건" accentWords={["탈출", "조건"]} fontSize={76} />
        <PointList
          sceneStartMs={startMs}
          numbered={false}
          items={[
            { label: "생각보다 크거나 깊으면", atMs: 452000, tone: "warn" },
            { label: "그 즉시 /fg-ask로 옮겨라", atMs: 455500 },
            { label: "이 판단이 곧 실력", atMs: 458500 },
          ]}
        />
      </Stack>
    ),
  },
  {
    id: "s40-quick-log",
    startMs: 460937,
    endMs: 471264,
    render: ({ startMs }) => (
      <Stack>
        <IconBadge name="doc" color={colors.dim} />
        <KaptionLabel
          text="계획서·회고 문서 없이 로그 한 줄만 남는다"
          delay={f(460937, startMs)}
        />
      </Stack>
    ),
  },
  // ===== idx14 (471264–523656): situation④ L3 두 차선 ==========================
  {
    id: "s41-sit4",
    startMs: 471264,
    endMs: 476990,
    render: () => (
      <Stack gap={30}>
        <SituationBadge n="④" title="L3 — 루프 통째로 맡기기" />
      </Stack>
    ),
  },
  {
    id: "s42-l3-compare",
    startMs: 476990,
    endMs: 502756,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="두 L3 차선 비교"
        sceneStartMs={startMs}
        leftAtMs={476990}
        rightAtMs={485006}
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
    id: "s43-wall-detection",
    startMs: 502756,
    endMs: 514495,
    render: ({ startMs }) => (
      <PointList
        heading="벽 감지 예시"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "검증이 두 라운드 연속 진전 없음", atMs: 502756 },
          { label: "이미 통과한 조건을 다시 깨뜨리는 핑퐁", atMs: 508000, tone: "warn" },
        ]}
      />
    ),
  },
  {
    id: "s44-wall-handoff",
    startMs: 514495,
    endMs: 523656,
    render: ({ startMs }) => (
      <Stack>
        <KaptionLabel
          text="둘 다 벽에서 멈추고 맥락을 사람에게 — 무인이지 무책임이 아니다"
          delay={f(514495, startMs)}
          color={colors.accentSoft}
        />
      </Stack>
    ),
  },
  // ===== idx15 (523656–570264): situation⑤ 재진입 · 점검 =======================
  {
    id: "s45-sit5",
    startMs: 523656,
    endMs: 535596,
    render: () => (
      <Stack gap={30}>
        <SituationBadge n="⑤" title="재진입 · 점검" />
        <KaptionLabel text="'어디까지 했지?' → 읽기 전용 도구 2개" delay={16} color={colors.accentSoft} />
      </Stack>
    ),
  },
  {
    id: "s46-status-doctor",
    startMs: 535596,
    endMs: 555447,
    render: ({ startMs }) => (
      <TwoColCompare
        heading="읽기 전용 — 쓰기·자동실행 X"
        sceneStartMs={startMs}
        leftAtMs={540000}
        rightAtMs={547000}
        left={{ cmd: "/fg-status", title: "어디까지 했나?", bullets: ["진행 상태를 본다"] }}
        right={{ cmd: "/fg-doctor", title: "상태가 건강한가?", bullets: ["고아 파일·상태 손상 검사"] }}
      />
    ),
  },
  {
    id: "s47-status-example",
    startMs: 555447,
    endMs: 564078,
    render: ({ startMs }) => (
      <PointList
        heading="예를 들면"
        sceneStartMs={startMs}
        numbered={false}
        items={[{ label: "fg-status '회고 대기' → fg-next로 이어가기", atMs: 555447 }]}
      />
    ),
  },
  {
    id: "s48-status-fix",
    startMs: 564078,
    endMs: 570264,
    render: ({ startMs }) => (
      <Stack>
        <KaptionLabel text="문제를 발견해도 수정은 사람이 fg-quick·fg-ask로" delay={f(564078, startMs)} />
      </Stack>
    ),
  },
  // ===== idx16 (570264–617112): situation⑥ 마무리 · 배포 ========================
  {
    id: "s49-sit6",
    startMs: 570264,
    endMs: 572937,
    render: () => (
      <Stack gap={30}>
        <SituationBadge n="⑥" title="마무리 · 출하" />
      </Stack>
    ),
  },
  {
    id: "s50-finish-flow",
    startMs: 572937,
    endMs: 588131,
    render: ({ startMs }) => (
      <CommandFlow
        sceneStartMs={startMs}
        items={[
          { cmd: "/fg-learn", label: "회고→학습 문서", atMs: 572937 },
          { cmd: "/fg-done", label: "봉인·아카이브", atMs: 578500 },
          { cmd: "배포", label: "결과 내보내기", atMs: 584200 },
        ]}
        caption={{ text: "봉인돼야 재실행이 막힌다", atMs: 586000 }}
      />
    ),
  },
  {
    id: "s51-adversarial-intro",
    startMs: 588131,
    endMs: 600511,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <CommandChip command="/fg-adversarial-review" fontSize={42} />
        <PointList
          sceneStartMs={startMs}
          numbered={false}
          items={[{ label: "결제·인증처럼 위험한 변경에서, 결과가 틀렸다고 가정", atMs: 588131 }]}
        />
      </Stack>
    ),
  },
  {
    id: "s52-six-lenses",
    startMs: 600511,
    endMs: 617112,
    render: ({ startMs }) => (
      <PointList
        heading="여섯 개 렌즈로 동시에"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "놓친 실패 지점 · 숨은 가정", atMs: 600511 },
          { label: "요구사항 오독 · 보안과 성능", atMs: 605000 },
          { label: "예상 밖 오용 · 근거 약한 판단", atMs: 609500 },
          { label: "다만 이건 선택 — 봉인 게이트는 아님", atMs: 613500 },
        ]}
      />
    ),
  },
  // ===== idx17 (617112–658152): situation⑦ 유지보수 ============================
  {
    id: "s53-sit7",
    startMs: 617112,
    endMs: 639626,
    render: ({ startMs }) => (
      <Stack gap={30}>
        <SituationBadge n="⑦" title="유지보수 — 정비 도구" />
        <PointList
          sceneStartMs={startMs}
          numbered={false}
          items={[
            { label: "fg-cleanup · fg-merge", atMs: 622000 },
            { label: "fg-drop", atMs: 627000 },
            { label: "fg-tdd · fg-eco · fg-statusline", atMs: 632000 },
          ]}
        />
      </Stack>
    ),
  },
  {
    id: "s54-maint-example",
    startMs: 639626,
    endMs: 652749,
    render: ({ startMs }) => (
      <PointList
        heading="예를 들면"
        sceneStartMs={startMs}
        numbered={false}
        items={[
          { label: "ADR이 쌓여 그릴링이 느려지면 → fg-cleanup", atMs: 639626 },
          { label: "브랜치 병합 후 forge 상태까지 → fg-merge", atMs: 646000 },
        ]}
      />
    ),
  },
  {
    id: "s55-maint-closing",
    startMs: 652749,
    endMs: 658152,
    render: ({ startMs }) => (
      <Stack>
        <KaptionLabel text="매일 쓰는 도구가 아니라 가끔 정비할 때" delay={f(652749, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  // ===== idx18 (658152–672720): 피드백 루프 =====================================
  {
    id: "s56-feedback-loop",
    startMs: 658152,
    endMs: 672720,
    render: ({ startMs }) => (
      <Stack gap={34}>
        <IconBadge name="loop" />
        <MotionWords text="회고의 학습이 다음 그릴링의 출발점" accentWords={["다음", "그릴링"]} fontSize={72} delay={4} />
        <KaptionLabel text="문서가 두꺼워질수록 그릴링도 좋아진다" delay={f(662151, startMs)} color={colors.accentSoft} />
      </Stack>
    ),
  },
  // ===== idx19 (672720–697248): 요약표 ==========================================
  {
    id: "s57-cheatsheet",
    startMs: 672720,
    endMs: 697248,
    render: ({ startMs }) => (
      <CheatsheetTable
        heading="상황 → 명령 → 다음"
        sceneStartMs={startMs}
        rows={[
          { sit: "새 프로젝트", cmd: "/fg-map", next: "지도 → 첫 작업", atMs: 676000 },
          { sit: "일상 작업", cmd: "ask·run·next", next: "기본 리듬", atMs: 679000 },
          { sit: "사소한 일회 변경", cmd: "/fg-quick", next: "바로 실행", atMs: 684918, highlight: true },
          { sit: "재진입·점검", cmd: "/fg-status", next: "안전하게 판만", atMs: 688000, highlight: true },
          { sit: "루프 통째로", cmd: "/fg-loop · all", next: "벽까지 자동", atMs: 691000 },
        ]}
        footer={{ text: "fg-quick · fg-status 이 두 줄이 가장 헷갈린다", atMs: 693500 }}
      />
    ),
  },
  // ===== idx20 (697248–746112): 정리 · 마무리 ====================================
  {
    id: "s58-summary-intro",
    startMs: 697248,
    endMs: 701083,
    render: () => <MotionWords text="정리하겠습니다 — 실수 패턴 세 가지" fontSize={72} />,
  },
  {
    id: "s59-mistakes",
    startMs: 701083,
    endMs: 722532,
    render: ({ startMs }) => (
      <PointList
        heading="실수 패턴 3가지"
        sceneStartMs={startMs}
        items={[
          { label: "ask 건너뛰고 run → 정답 소스 없는 실행", atMs: 701083, tone: "warn" },
          { label: ".forge 상태 무시 → 재실행·길 잃음", atMs: 707191, tone: "warn" },
          { label: "실패 상태를 억지로 봉인 — 게이트가 막음", atMs: 713157, tone: "warn" },
        ]}
      />
    ),
  },
  {
    id: "s60-source",
    startMs: 722532,
    endMs: 728498,
    render: () => (
      <Stack gap={30}>
        <IconBadge name="doc" />
        <MotionWords text="정답 소스 = forge README · 문서" accentWords={["README", "문서"]} fontSize={68} delay={4} />
      </Stack>
    ),
  },
  {
    id: "s61-deeper-docs",
    startMs: 728498,
    endMs: 736027,
    render: ({ startMs }) => (
      <Stack>
        <KaptionLabel text="더 깊이 알고 싶으면 문서 폴더의 스킬별 상세 설명" delay={f(728498, startMs)} />
      </Stack>
    ),
  },
  {
    id: "s62-closing",
    startMs: 736027,
    endMs: 746112,
    render: ({ startMs }) => (
      <Stack gap={36}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <CommandChip command="/fg-ask" fontSize={58} />
          <Icon name="arrow" size={56} color={colors.accent} />
          <CommandChip command="/fg-next" fontSize={58} />
        </div>
        <MotionWords text="이 한 줄이 기억나면 성공" accentWords={["성공"]} fontSize={76} delay={f(741000, startMs)} />
        <MotionText text="감사합니다" fontSize={64} color={colors.accentSoft} delay={f(744500, startMs)} />
      </Stack>
    ),
  },
];
