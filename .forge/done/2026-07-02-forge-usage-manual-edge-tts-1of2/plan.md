<!-- forge-slug: forge-usage-manual-edge-tts-1of2 -->
<!-- task: 6 -->
<!-- part: 1/2 -->
<!-- tdd: off -->
# forge 사용 매뉴얼 대본 재구성 + Edge TTS 내레이션/자막 생성 (1/2 — 오디오 확정)

## Goal / Non-goals
- Goal: forge 저장소(README.ko.md) 기준으로 "왜 forge를 써야 하는가"(~3분)와 "사용법"(~9분, 기존 7상황 구조 압축)을 새 대본으로 작성하고, Microsoft Edge TTS(ko-KR-SunHiNeural)로 합성해 `forge-explainer/public/narration.mp3`와 `subtitles.srt`를 새로 만든다. 총 길이는 11:30~12:30(690~750초)를 목표로 한다.
- Non-goals: forge-explainer의 `scenes.tsx` 씬 재타이밍, "왜" 파트 신규 그래픽 디자인, `captions.ts` 재생성, `Root.tsx` duration 갱신 — 전부 2/2에서 다룬다. `docs/forge-vs-loop-engineering.md`의 Loop Engineering/Osmani 인용은 포함하지 않는다.

## Source of truth
- Glossary terms: 프리셋 화자(.forge/CONTEXT.md — Edge TTS도 이 정의에 해당, 음성 클론 아님)
- Related ADRs: `.forge/adr/0001-local-voice-clone-privacy.md`(음성 클론 작업에는 유효, 이 작업엔 비적용), `.forge/adr/0004-usage-narration-switches-to-cloud-edge-tts.md`(이 작업의 근거)
- Definition of Done: `forge-explainer/public/narration.mp3`·`subtitles.srt`가 새로 생성되고, 총 길이가 690~750초이며, 사용자가 청취 후 내용(왜+사용법 구성)·음성·속도를 승인한다.

## Work slices
- [ ] S1. `~/.claude/plugins/marketplaces/forge`(gyuha/forge 로컬 클론) README.ko.md 기준으로 "왜"(~180초 분량)+"사용법"(~540초 분량, 기존 7상황 유지하되 적대적 리뷰 상세 설명·유지보수 유틸 나열·별도 실수패턴 슬라이드는 압축/통합) 대본을 작성해 `tts/scripts-forge-manual-12min.json`에 저장 — completion criterion: JSON 파일 생성, 각 항목 글자수 합계 기준 예상 발화 시간이 690~750초 범위 추정치 내
- [ ] S2. `edge-tts` 파이썬 패키지를 `tts/.venv`에 설치하고, `tts/synth_batch_edge.py`(`synth_batch_qwen.py` 패턴 참고, voice=`ko-KR-SunHiNeural`)를 작성해 S1의 각 항목을 WAV로 합성 — completion criterion: 모든 항목의 WAV 파일과 `durations.json`이 생성됨 (depends: S1)
- [ ] S3. `tts/assemble_remotion.py`를 새 scripts/audio 경로로 실행해 `forge-explainer/public/narration.mp3`(loudnorm -16 LUFS 유지)와 `subtitles.srt`를 생성 — completion criterion: ffprobe로 측정한 총 길이가 690~750초, mp3 정상 재생 (depends: S2)
- [ ] S4. 사용자 청취 UAT — completion criterion: 내용(왜+사용법 구성이 README에 부합)·음성(ko-KR-SunHiNeural 자연스러움)·분량(690~750초)에 대한 사용자 승인 (depends: S3)
