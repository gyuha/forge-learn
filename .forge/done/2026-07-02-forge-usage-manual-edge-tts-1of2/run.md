# RUN — forge 사용 매뉴얼 대본 재구성 + Edge TTS 내레이션/자막 생성 (1/2 — 오디오 확정)

## 계획 vs 실제
- 계획대로 된 것: README.ko.md 기준 "왜"(5개 항목)+"사용법"(15개 항목, 기존 7상황 구조 유지) 대본을 `tts/scripts-forge-manual-12min.json`에 작성. `edge-tts` 설치, `tts/synth_batch_edge.py` 작성(항목별 mp3 합성 후 wav 변환, durations.json 기록), `tts/assemble_remotion.py`로 `forge-explainer/public/narration.mp3`(loudnorm -16 LUFS)와 `subtitles.srt`(202블록) 생성. 최종 길이 746.1초(12:26) — 목표 690~750초 범위 안.
- 계획과 달랐던 것:
  1. **글자수-발화시간 추정치가 크게 빗나감**: 그릴링 시점엔 초당 4.7~5.5자로 추정했으나, 실제 Edge TTS(ko-KR-SunHiNeural, rate +0%)는 초당 약 7.1~7.7자로 훨씬 빠르게 말함. 첫 합성 결과가 471초(목표의 63%)에 그쳐, 대본을 16→19→20개 항목(3353→4953→5413자)으로 세 차례 보강해야 했음. 속도를 늦추는 대신 실제 내용(루프 구조 상세, 신뢰 사다리 L1/L2/L3, 구체적 예시)을 추가하는 방식으로 채움.
  2. **기존 `tts/.venv`에 pip 모듈이 없어서** `edge-tts` 설치가 불가능했음 — GPT-SoVITS/CosyVoice2용으로 구성된 venv라 pip이 빠져 있었음. 별도의 경량 venv(`tts/.venv-edge`)를 새로 만들어 격리 설치함.
  3. Edge TTS는 mp3로만 출력하므로, `synth_batch_edge.py`가 각 항목을 mp3로 합성한 뒤 ffmpeg으로 wav 변환하는 단계를 추가함(`assemble_remotion.py`가 wav 입력을 기대하므로).

## 다음 단계
- S4 (청취 UAT) 대기 중 — 사용자가 `forge-explainer/public/narration.mp3`를 직접 들어보고 내용(왜+사용법 구성)·음성(ko-KR-SunHiNeural)·분량(12:26) 승인 필요.
