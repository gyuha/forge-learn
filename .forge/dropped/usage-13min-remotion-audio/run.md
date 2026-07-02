<!-- forge-slug: usage-13min-remotion-audio -->
# 실행 노트 — forge 사용법 13분 버전 (Remotion용 narration.mp3 + subtitles.srt)

실행: 2026-07-01 · 방식: **직접 실행**(Dynamic Workflow 미사용 — S1→S2→S3→S4 전부 순차 의존, 병렬화 대상 없음, 로컬 도구 실행 위주)

## 계획대로 된 것
- S1 `tts/scripts-13min.json` 작성 (24개 항목, S01·S02·S09 단축 내레이션 반영)
- S2 GPT-SoVITS 클론 합성 → `tts/out_audio_13min/` 24개 WAV + `durations.json` (총 765.4초, MPS RTF 평균 ~0.6대)
- S3 `tts/assemble_remotion.py` 신규 작성 및 실행 → 24개 WAV concat + loudnorm -16 LUFS → `narration.mp3`(765.4초, 측정 -16.7 LUFS), `subtitles.srt`(219블록) 교체
- S4 `gen-captions.mjs`로 `captions.ts` 재생성(totalDurationMs 765360) + `Root.tsx`의 `DURATION_IN_FRAMES` 35703→22962 갱신
- 비목표 전부 준수: Remotion 렌더링 안 함, 슬라이드 프레임 미변경, 기존 32슬라이드 `scripts.json`/오디오 미변경(별도 파일로 분리), BGM 믹싱 없음(오디오만), 로컬 GPT-SoVITS만 사용(ADR-0001)

## 계획과 달랐던 것 / 현장 결정
1. **슬라이드 개수 불일치(계획서 자체 오류)**: 계획의 목표는 "26슬라이드"·완료기준 `len(data)==26`이었으나, 같은 계획의 "제거 슬라이드(8개)" 목록(S08,S22,S23,S25,S26,S27,S28,S30)을 32에서 빼면 24개. 실행 전 사용자에게 확인 → **"제거 목록 8개가 정확 → 24개로 진행"** 결정. 완료기준의 "26"은 오기로 판단하고 24 기준으로 검증함.
2. **로컬 GPT-SoVITS 환경이 사라져 있었음(계획 외 선행 작업)**: `tts/.venv/`·`tts/GPT-SoVITS/`는 `.gitignore` 대상이라 이번 세션에는 존재하지 않음. 직전 작업(voice-clone-redub-pipeline)에서 구성했던 환경을 처음부터 재구성해야 했음 — repo 재클론, uv venv(Python 3.11) + torch 2.12(MPS) + requirements.txt 설치, `dl_models.py`로 사전학습 모델 재확보(HF 캐시 4.2GB 덕분에 재다운로드 거의 없이 완료).
3. **자동 모드 승인 게이트**: GPT-SoVITS `requirements.txt` 설치(방금 클론한 외부 저장소의 의존성)가 Claude Code 자동 모드 분류기에 의해 차단됨 → 사용자에게 직접 승인 요청, 승인받아 진행.
4. **`tts_infer.yaml`의 `custom.device` 기본값이 `cpu`로 초기화되어 있었음**: 리포를 새로 클론하면서 이전 세션에서 설정했던 `mps`가 사라짐 → 최초 실행이 CPU로 로드되는 것을 확인하고 `custom.device: mps`로 직접 수정 후 재실행. (MPS 가용성은 `torch.backends.mps.is_available()`로 사전 확인.)
5. **`fast_langdetect` 캐시 디렉터리 누락으로 첫 합성 실패**: `GPT_SoVITS/pretrained_models/fast_langdetect/` 디렉터리가 없어 `FileNotFoundError` 발생 → `mkdir -p`로 해결, 재실행.
6. **영어 단어 포함 대본에서 nltk 리소스 누락으로 두 번째 합성 실패**: 대본에 "forge", "GPT-SoVITS" 등 영단어가 섞여 있어 영어 g2p 경로가 실행되는데, nltk `averaged_perceptron_tagger_eng`가 없어 `LookupError` 발생 → `nltk.download(...)`로 해결, 재실행. (세 번째 실행에서 24/24 정상 완료.)
7. **최종 길이 765.4초** — 목표 780±30초(750~810초) 범위 내이나 하한에 가까움(예상치 757초와 유사, 원본 대비 문자수 비율로 사전 추정한 값과 일치).

## 코드 리뷰
- 위험 영역(auth/데이터변형/공개 API/마이그레이션) 없음, 자체 완결 로컬 미디어 파이프라인 확장 → 조건부 코드 리뷰 생략(저위험, 직전 작업과 동일 판단).

## 검증
- 자동: MP3 765.4초(780±30 범위 내) · 측정 음량 -16.7 LUFS(목표 -16 LUFS 근접) · SRT 219블록(>0) · `captions.ts` totalDurationMs(765360ms)가 `Root.tsx` 새 길이(765384ms)와 24ms 차이(±1초 이내) · `Root.tsx` `DURATION_IN_FRAMES` 35703→22962 변경 확인 · 원본 `forge-video-assets/scripts/scripts.json`·32슬라이드 오디오 파이프라인 미변경 — **전부 통과**.
- 청취/육안(UAT): **새 내레이션의 목소리 정체성·발음(특히 영단어 "forge"/명령어)·한국어 자연스러움·자막 219블록의 타이밍 감각·음량 체감** — 핸드오프에서 사용자 확인 대기.
