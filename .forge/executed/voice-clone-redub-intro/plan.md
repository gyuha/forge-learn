<!-- forge-slug: voice-clone-redub-intro -->
<!-- task: 6 -->
<!-- tdd: off -->
# 내 목소리 클론으로 입문 영상 재더빙 (pptx 재빌드)

## 목표 / 비목표
- **목표**: `forge-입문-발표.mp4`(27.7분·44슬라이드)를 사용자 본인 목소리(로컬 GPT-SoVITS zero-shot 클론, `voice-samples/` 동일 참조)로 재더빙해 **새 mp4로 산출**(원본 보존). 원본 영상에 장면전환(크로스페이드)이 없어 타이밍 추출이 불가하므로, **pptx에서 새로 빌드**한다(사용법 영상 파이프라인 재현).
- **비목표**:
  - 원본 `forge-입문-발표.mp4` 덮어쓰기 (새 파일로만).
  - 상용/클라우드 백엔드 (로컬 전용, ADR-0001 승계).
  - 슬라이드 디자인 수정 (기존 PDF 렌더 재사용).
  - SRT 307블록→44슬라이드 퍼지 매핑 (노트 1:1 재작성으로 회피).
  - 사용법 작업 봉인 (사용자 결정: 입문을 별도 슬러그로 공존, 나중에 둘 다 봉인).

## 기준 자료
- **관련 ADR**: `.forge/adr/0001-local-voice-clone-privacy.md` (로컬 전용·자동 클라우드 금지 승계).
- **파이프라인**: `tts/`(사용법에서 구축·검증한 GPT-SoVITS 클론 + 재합성). RTF ~0.37, MPS 동작 확인됨.
- **자산**: 슬라이드 = `forge-입문-발표.pdf`(44p) → `forge-intro-assets/frames/slide-01..44.png`(렌더 완료). 내레이션 원천 = pptx 발표자 노트 44개(`forge-intro-assets/notes.json`). BGM = `forge-video-assets/music/ambient.mp3` 재사용.
- **완료 정의**: 새 파일(예: `forge-입문-발표-내목소리.mp4`)이 1920×1080 H.264 + AAC + 한국어 soft 자막으로 생성되고, 44슬라이드 분량의 내레이션이 voice-samples 참조 클론 음성이며, 슬라이드·자막이 새 음성 길이에 동기되고, 음량 -16 LUFS, 원본 미변경, 육안 검수(클론 정체성·동기·가독·자연스러움) 통과.

## 합의된 설계 (사용법 파이프라인 + 입문 차이점)
- **렌더**: PDF→PNG(`pdftoppm`)로 해결 — PowerPoint AppleScript 불필요(사용법 회고의 렌더 통증 회피).
- **내레이션**: 44개 노트를 시청자용 구어체로 재작성(코칭 지시어 제거), 슬라이드 1:1. 사용법 S1과 동일.
- **합성**: `tts` 파이프라인 재사용(동일 참조). 입문은 44개로 일반화.
- **재타이밍·조립**: 사용법 `assemble.py` 방식(fade in/out 0.3s + concat, 대본 비례 자막, soft mov_text + SRT sidecar), 음량은 처음부터 -16 LUFS 부스트(사용법 학습 반영).

## 작업 조각
- [ ] S1. **슬라이드 렌더** — `forge-입문-발표.pdf` → `forge-intro-assets/frames/slide-NN.png` 44장 1920×1080. — 완료 기준: 44장 PNG가 1920×1080으로 존재. (완료됨)
- [ ] S2. **내레이션 재작성** — 44개 노트 → 시청자용 구어체 대본(`forge-intro-assets/scripts-intro.json`, idx 1..44), 코칭 지시어 제거·내용 보존. — 완료 기준: 44개 비어있지 않은 대본, 지시어 제거 확인.
- [ ] S3. **클론 합성** — S2 대본 44개를 voice-samples 참조로 합성 → `tts/out_audio_intro/NN.wav` + durations. — 완료 기준: 44개 한국어 클론 음성 생성, 길이 기록. (depends: S2)
- [ ] S4. **재타이밍·조립** — frames + 음성 + ambient 베드를 fade+concat·비례 자막·soft 자막·-16 LUFS로 합성 → `forge-입문-발표-내목소리.mp4` + .srt. — 완료 기준: 새 mp4 1920×1080/H.264/AAC/자막트랙, 길이 = 음성 총합, 원본 미변경. (depends: S1, S3)
- [ ] S5. **검증** — 자동(ffprobe·타이밍) + 육안(클론 정체성·동기·가독·음량·자연스러움). — 완료 기준: 자동 통과 + 육안 이상 없음. (depends: S4)
