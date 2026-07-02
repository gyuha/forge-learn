<!-- forge-slug: usage-13min-remotion-audio -->
<!-- task: 6 -->
<!-- tdd: off -->
<!-- retro-hint: optional -->
# forge 사용법 13분 버전 — Remotion용 narration.mp3 + subtitles.srt 생성

## 목표 / 비목표
- **목표**: 기존 32슬라이드 ~20분 발표를 26슬라이드 ~13분으로 압축한 새 내레이션 스크립트를 작성하고, GPT-SoVITS로 합성하여 `forge-explainer/public/narration.mp3`와 `subtitles.srt`를 교체한다. `captions.ts`와 `Root.tsx` 길이도 업데이트해 Remotion이 바로 렌더 가능하게 한다.
- **비목표**:
  - Remotion 영상 렌더링 — MP3/SRT 교체까지가 이 작업의 범위
  - 슬라이드 프레임 변경 — 기존 `forge-video-assets/frames/` 재사용
  - 기존 32슬라이드 스크립트/오디오 덮어쓰기 — `tts/scripts-13min.json`과 `tts/out_audio_13min/`을 별도 디렉터리로 분리
  - BGM 믹싱 — Remotion 프로젝트가 비디오 레이어를 별도 처리하므로 오디오만
  - edge-TTS 또는 클라우드 TTS — ADR-0001 준수(로컬 GPT-SoVITS 전용)

## 기준 자료
- **관련 ADR**: `.forge/adr/0001-local-voice-clone-privacy.md` — 로컬 GPT-SoVITS 전용, 자동 클라우드 전환 금지
- **참조 음성**: `voice-samples/reference_norm.wav` + `voice-samples/reference_norm.txt` (직전 작업에서 검증된 참조 재사용)
- **기존 파이프라인**: `tts/synth_batch.py` (`--scripts`, `--out` 인자로 경로 변경 가능)
- **기존 SRT 생성 로직**: `tts/assemble.py`의 `split_chunks` + 비례 배분 방식 참고
- **Remotion captions 재생성**: `node forge-explainer/scripts/gen-captions.mjs <srt> <out-ts>`
- **완료 정의**: `forge-explainer/public/narration.mp3` 길이 780±30초, `subtitles.srt` 존재, `src/data/captions.ts` 갱신됨, `Root.tsx`의 `DURATION_IN_FRAMES`가 새 길이 반영

## 제거 슬라이드 (8개)
S08, S22, S23, S25, S26, S27, S28, S30

## 단축 내레이션 (스크립트에 반영)
- **S01** (39.8s → ~25s): "오늘 익힐 것은 명령 목록이 아니라, 상황을 보고 어떤 fg 명령을 꺼낼지 판단하는 능력입니다. Claude Code를 써보셨다고 가정하고, forge를 실제 업무에 어떻게 쓰는지 일곱 가지 상황으로 보여드립니다."
- **S02** (31.3s → ~20s): "성취 기준 네 가지입니다. 상황에 맞는 명령 선택, 기본 루프, 길을 잃었을 때 대처, 효율적인 차선 선택. 이 네 가지가 오늘의 전부입니다."
- **S09** (43.0s → ~30s): "파일에 상태를 두는 이유는 세 가지입니다. 재진입 — 다음 날 돌아와도 .forge만 보면 이어할 수 있습니다. 재실행 방지 — 활성 슬롯이 비어야만 실행되니 중복 실행이 구조적으로 막힙니다. 검증 게이트 — 검증이 기록되어야 봉인됩니다. 세션 메모리는 날아가지만 파일은 남습니다."

## 작업 슬라이스
- [ ] S1. `tts/scripts-13min.json` 작성 — 26개 항목, `idx`/`script` 구조, S01·S02·S09 단축 내레이션 포함, 제거 슬라이드 8개 제외 — 완료 기준: 파일 존재, `len(data) == 26`, 단축 3개 텍스트가 계획의 단축 내레이션과 일치
- [ ] S2. GPT-SoVITS 합성 — `tts/synth_batch.py --scripts tts/scripts-13min.json --out tts/out_audio_13min` 실행 — 완료 기준: `tts/out_audio_13min/` 에 26개 WAV + `durations.json` 존재 (depends: S1)
- [ ] S3. `tts/assemble_remotion.py` 작성 및 실행 — 26개 WAV를 단일 MP3로 concat, SRT 생성, `forge-explainer/public/narration.mp3`·`subtitles.srt` 교체 — 완료 기준: MP3 길이 780±30초, SRT 항목 수 > 0 (depends: S2)
- [ ] S4. Remotion 갱신 — `gen-captions.mjs` 실행으로 `captions.ts` 재생성, `Root.tsx`의 `DURATION_IN_FRAMES` 새 MP3 길이로 업데이트 — 완료 기준: `captions.ts`의 `totalDurationMs`가 새 MP3 길이와 ±1초 이내 일치, `Root.tsx` 숫자 변경됨 (depends: S3)
