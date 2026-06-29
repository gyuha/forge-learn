#!/usr/bin/env bash
# 재사용 파이프라인: 내 목소리로 사용법 영상 재더빙
# 사용법: voice-samples/reference.wav (+ reference.txt) 교체 후 →  bash tts/run.sh
# 결과: forge-사용법-워크플로우-내목소리.mp4 (+ .srt)
set -euo pipefail
cd "$(dirname "$0")/.."          # 프로젝트 루트
export PYTORCH_ENABLE_MPS_FALLBACK=1
PY=tts/.venv/bin/python

if [ ! -f voice-samples/reference.wav ]; then
  echo "✗ voice-samples/reference.wav 가 없습니다. 깨끗한 녹음을 넣어주세요." >&2; exit 1
fi

echo "▶ [1/3] 참조 정규화 (트림 ≤9.5s · 모노 · 전사)"
$PY tts/normalize_ref.py

echo "▶ [2/3] 32개 대본 클론 합성  (재클론하려면 out_audio 를 비우고 실행)"
$PY tts/synth_batch.py

echo "▶ [3/3] 영상 재합성"
$PY tts/assemble.py

echo "✅ 완료: forge-사용법-워크플로우-내목소리.mp4"
