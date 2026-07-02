<!-- forge-slug: forge-explainer-video-render -->
<!-- task: 8 -->
<!-- retro-hint: optional -->
<!-- tdd: off -->
# forge-explainer Remotion 프로젝트를 실제 mp4 영상으로 렌더링

## Goal / Non-goals
- Goal: `forge-usage-manual-edge-tts-2of2`에서 이미 새 내레이션(`narration.mp3`, 746.136초)·자막(`subtitles.srt`/`captions.ts`)에 맞춰 갱신된 `forge-explainer`의 Remotion 컴포지션(`ForgeExplainer`, `scenes.tsx`)을 `npx remotion render`로 실제 mp4 영상 파일로 렌더링한다.
- Non-goals: 씬 타이밍·그래픽 재작업(2of2에서 이미 완료), 오디오·자막 재생성(1of2에서 이미 확정), `remotion studio`를 통한 사전 프리뷰 재검토(2of2에서 9개 지점 still 렌더로 이미 검증됨) — 이번엔 최종 렌더 결과물 자체로 확인한다.

## Source of truth
- Glossary terms: none
- Related ADRs: none (순수 렌더링 실행 단계, 새 트레이드오프 없음)
- Definition of Done: `forge-explainer/out/`에 mp4 파일이 생성되고, ffprobe로 실측한 길이가 `narration.mp3` 길이(746.136초, ±0.5초)와 일치하며, 사용자가 재생해 오디오·자막·화면이 전체 구간에서 어긋나지 않음을 승인한다.

## Work slices
- [ ] S1. `forge-explainer` 디렉토리에서 `npx remotion render src/index.ts ForgeExplainer out/forge-explainer.mp4` 실행 — completion criterion: `out/forge-explainer.mp4` 생성, ffprobe 실측 길이가 746.136초(±0.5초)와 일치
- [ ] S2. 사용자가 렌더된 mp4를 재생해 확인(UAT) — completion criterion: 오디오·자막·화면 동기에 문제 없음을 사용자가 승인 (depends: S1)
