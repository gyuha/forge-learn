# tts — 내 목소리 클론 더빙 파이프라인

`forge-사용법-워크플로우` 영상의 내레이션을 **내 목소리(로컬 GPT-SoVITS zero-shot 클론)**로 재더빙하는 파이프라인. 목소리는 기계 밖으로 나가지 않음(전부 로컬). 결정 배경: `.forge/adr/0001-local-voice-clone-privacy.md`.

## 빠른 사용 (재클론)

1. `voice-samples/reference.wav` 를 새 녹음으로 교체 (조용한 곳, 단일 화자, 길이 무관 — 자동으로 ≤9.5초 트림·모노 변환).
2. 재클론하려면 기존 음성을 비운다: `rm -rf tts/out_audio`
3. 실행: `bash tts/run.sh`
4. 결과: `forge-사용법-워크플로우-내목소리.mp4` (+ `.srt`)

> `out_audio/` 를 비우지 않으면 이미 만든 음성은 건너뛴다(중간 재개용). 목소리를 바꿔 새로 만들 땐 반드시 비울 것.

## 구성

| 파일 | 역할 |
|------|------|
| `normalize_ref.py` | `voice-samples/reference.wav` → `reference_norm.wav`(≤9.5s·mono) + `reference_norm.txt`(whisper 전사). GPT-SoVITS는 참조 3~10초를 강제하므로 트림 필수. |
| `synth_batch.py` | `forge-video-assets/scripts/scripts.json`(32개 대본)을 참조 음색으로 합성 → `out_audio/NN.wav` + `durations.json`. |
| `assemble.py` | `frames/`(슬라이드) + `out_audio/`(음성) + `music/ambient.mp3`(베드)를 합성. 새 음성 길이에 맞춰 슬라이드·자막 재타이밍, soft `mov_text` 자막 + SRT sidecar. |
| `run.sh` | 위 3개를 순서대로 실행. |

## 환경

- Python 3.11 venv (`tts/.venv`), torch 2.12 + MPS(Apple Silicon GPU), GPT-SoVITS(v2, 한국어 공식 지원).
- 실측: M5에서 RTF ~0.37 (32개 대본 ≈ 19분 분량 합성에 ~7분).
- `.venv/`·`GPT-SoVITS/`(repo+모델 ~1.2GB)·`out_audio/`·`build/` 는 gitignore. 스크립트만 커밋.
