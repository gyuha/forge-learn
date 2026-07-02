<!-- forge-slug: forge-usage-manual-edge-tts-2of2 -->
<!-- task: 7 -->
<!-- part: 2/2 -->
<!-- tdd: off -->
# forge 사용 매뉴얼 대본 재구성 + Edge TTS 내레이션/자막 생성 (2/2 — 영상 반영)

## Goal / Non-goals
- Goal: 1/2에서 확정된 `narration.mp3`/`subtitles.srt`를 기준으로 forge-explainer 영상에 반영한다 — `captions.ts` 재생성, `Root.tsx` duration 갱신, 기존 7상황 씬(`scenes.tsx`) 재-타이밍, "왜" 파트 신규 씬/그래픽 설계·구현.
- Non-goals: 오디오 재합성·대본 재작성(1/2에서 이미 확정, 여기선 손대지 않음).

## Source of truth
- Glossary terms: none
- Related ADRs: `.forge/adr/0004-usage-narration-switches-to-cloud-edge-tts.md`
- Definition of Done: forge-explainer를 `remotion studio`로 열었을 때 새 오디오·자막과 화면 애니메이션(7상황 + 왜 파트)이 전체 구간에서 어긋남 없이 동기화되고, 영상 총 길이가 `narration.mp3` 길이와 정확히 일치한다.

## Work slices
- [ ] S1. `forge-explainer/scripts/gen-captions.mjs`를 새 `subtitles.srt`로 재실행해 `captions.ts` 재생성, `Root.tsx`의 `DURATION_IN_FRAMES`를 새 `narration.mp3` 실측 길이로 갱신 — completion criterion: `captions.ts`의 `totalDurationMs`가 새 오디오 길이와 일치, `Root.tsx` 주석/상수 갱신
- [ ] S2. 기존 7상황 씬(`scenes.tsx`의 `startMs` 타임스탬프 전체)을 새 `narration.mp3`의 해당 대본 구간 타임스탬프로 재계산·반영 — completion criterion: 각 `SituationBadge`(①~⑦)와 하위 씬이 새 오디오에서 해당 대본이 발화되는 시점과 어긋나지 않음(수동 스크러빙 확인) (depends: S1)
- [ ] S3. "왜 forge를 써야 하는가" 파트 전용 신규 씬/그래픽을 설계·구현(기존 컴포넌트 `PointList`, `TwoColCompare`, `BigNumber`, `CriteriaList` 등 재사용 우선, 필요 시 신규 컴포넌트 추가) — completion criterion: 새 도입부 구간 전체에 화면 공백 없이 시각 요소가 표시되고, 애니메이션 타이밍이 해당 나레이션과 맞음 (depends: S1)
- [ ] S4. `remotion studio`로 전체 재생하며 사용자 UAT — completion criterion: 처음부터 끝까지 오디오·자막·화면이 어긋나지 않는다는 사용자 승인 (depends: S2, S3)
