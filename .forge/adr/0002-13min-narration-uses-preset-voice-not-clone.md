---
status: superseded by ADR-0003
---

# forge 사용법 13분 버전 내레이션은 본인 목소리 클론 대신 Qwen3-TTS 프리셋 화자(Sohee)를 쓴다

`usage-13min-remotion-audio`(task 6) 작업에서 ADR-0001에 따라 GPT-SoVITS로 사용자 본인 목소리를 클론해 합성했으나, UAT에서 "본인 목소리 클론이 부담스럽다"는 피드백을 받아 **로컬 Qwen3-TTS CustomVoice 모델의 프리셋 화자 "Sohee"(한국어 지원 유일 프리셋)**로 교체하기로 했다. ADR-0001의 핵심 제약(로컬 전용·자동 클라우드 폴백 금지)은 그대로 유지된다 — Qwen3-TTS도 로컬·무료·오픈 웨이트이므로 프라이버시·비용 근거가 동일하게 적용된다.

**범위**: 이 결정은 13분 버전(사용법 설명 영상 내레이션)에만 적용된다. `voice-clone-redub-intro`(입문 영상, 이미 봉인됨)처럼 **본인 목소리 재현이 목적인 작업에는 ADR-0001의 GPT-SoVITS 클론이 여전히 유효**하다 — 이 ADR은 ADR-0001을 대체(supersede)하지 않는다.

## Considered Options
- **GPT-SoVITS로 계속, 다른 참조 음성 사용** — 인프라 변경 없이 빠르나, 권리 있는 제3자 음성 샘플을 새로 구해야 함.
- **Qwen3-TTS CustomVoice 프리셋(선택)** — 별도 녹음 불필요, 이미 로컬에 설치돼 있음(`~/qwen3-tts-env`). 단, 한국어 프리셋이 "Sohee"(여성) 하나뿐이라 화자 선택권이 없다.

## Consequences
- 24개 대본(`tts/scripts-13min.json`)은 재사용하되, 합성 백엔드만 GPT-SoVITS(`tts/synth_batch.py`) → Qwen3-TTS CustomVoice로 교체.
- `tts/.venv`·`tts/GPT-SoVITS/`(이번 작업에서 재구성한 GPT-SoVITS 환경)는 삭제하지 않고 그대로 둔다 — 입문 영상 등 향후 클론 작업에서 재사용 가능.
