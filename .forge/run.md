<!-- forge-slug: forge-usage-workflows-video -->
# 실행 노트 — forge 사용법 PPTX → 음성 영상 제작

> 32장 PPTX를 입력으로 한국어 내레이션 영상 mp4로 제작. 발표자 노트 재작성 → edge-tts 음성 → 기존 렌더 frames → ffmpeg 합성.

## 산출물
- `/Users/gyuha/workspace/forge-learn/forge-사용법-워크플로우.mp4` — 90.7MB, 19.8분(1190.1초), 1920×1080 30fps, H.264/AAC + mov_text 자막 트랙(한국어).
- `/Users/gyuha/workspace/forge-learn/forge-사용법-워크플로우.srt` — SRT sidecar 자막(325 큐).
- 빌드 자산: `forge-video-assets/{scripts,audio,frames,segs,srt,music}/`, `base.mp4`, `with_audio.mp4`.

## 계획대로 된 것
- 대본 재작성 32장(발표자 노트 → 시청자용 내레이션, 발표자 지시어 제거·구어체).
- edge-tts ko-KR-SunHiNeural 음성 32개(총 19.8분, 평균 37.2초/슬라이드).
- frames 1920×1080 정규화(fix 수정본 우선).
- 슬라이드 전환 부드럽게(fade in/out), 음성-화면 동기(슬라이드별 음성 길이 = 화면 노출).
- 배경음 믹싩(음성 아래 -18dB), 마지막 4초 페이드아웃.
- 자막: 325 큐(문장 단위 분할, 글자수 비례 동기화).
- 분량 19.8분 = 계획 목표(15~20분) 범위 내.

## 계획과 달랐던 것 (divergence)
1. **PowerPoint PDF 렌더 타임아웃/미생성** → 기존 렌더 자산 재사용. PowerPoint AppleScript PDF 저장이 6분+ 대기에도 PDF 미생성(대화상자/상태 막힘 추정). 직전 `forge-usage-workflows-pptx` 작업의 검증된 렌더(`forge-usage-workflows-assets/render/slide-*.jpg` + `fix-NN-NN.jpg` 수정본)가 현재 PPTX(봉인 시점 그대로)와 일치하므로, 이를 frames로 재사용해 PowerPoint 의존을 entirely 제거. 회고 "검증된 렌더 파이프라인" 산물의 재활용 — 긍정적 회피.
2. **WebSearch deny → 외부 CC0 배경음 다운로드 불가** (회고 교훈 "외부 게이트 → 우회하지 말고 중단·보고" 준수; plan에도 명시). → ffmpeg **로컬 합성 앰비언트 베드**(저음 화음 C3/G3/C4 + 브라운 노이즈 + 트레몰로 + 로우패스 + 에코)를 백업으로 생성(외부 의존 0, CC0 자동 만족). 품질은 실제 음악에 못 미침 → **유지/제거/직접 제공을 사용자가 결정**(핸드오프에서 위임).
3. **ffmpeg에 subtitles 필터(libass) 미포함** → burn-in 자막 불가 (`No such filter: 'subtitles'`). libass 재빌드는 외부 설치 게이트라, **mov_text soft 자막 트랙 내장 + SRT sidecar**로 대체. 자막 기능 자체는 충족(토글 가능 soft 자막), burn-in은 divergence.
4. **정밀 xfade 체인 대신 fade in/out + concat** → xfade는 비디오만 줄여 오디오와 길이가 어긋나 내레이션이 잘릴 위험. 대신 각 세그먼트에 fade in/out(0.3초) + concat으로 부드러운 전환(길이 정확, 내레이션 보존). 엄밀한 크로스페이드는 아니지만 의도(부드러운 전환) 달성.
5. **대본 영문 처리** — `/fg-ask` 등 명령은 영문 그대로(TTS가 영문 음독, 자막엔 영문 표시). 상태값(verified/failed/pending/yes 등)은 자연스러운 내레이션을 위해 일부 한국어 의역("예스/스킵/실패/실행됨/완료"). 슬라이드 본문과 자막의 미세한 표기 차이.

## 도중의 결정·막힘
- **직접 실행(Dynamic Workflow 미사용)** — 대본 재작성은 문체 일관성 위해 메인에서, 음성/렌더/합성은 로컬 도구(edge-tts·ffmpeg)라 메인 직접이 안정적. 병렬 fan-out 불필요.
- **PowerPoint 게이트** — GUI 자동화가 막혀 백그라운드 감시(360초) 후에도 PDF 미생성 → 기존 렌더 재사용으로 우회(회고 교훈 적용: 외부/무거운 도구 막히면 검증된 대안 경로).
- **WebSearch deny** — CC0 음원 탐색 자체가 deny rule. 외부 소스 회피하지 않고 로컬 합성으로 대체.

## 검증 메모
- **자동 검증(ffprobe) PASS**: 해상도 1920×1080, 30fps, H.264/AAC, 스트림 video+audio+subtitle(mov_text), 길이 1190.1초(목표 900~1200초 범위), 영상-음성 동기 0.4초 오차(무시 가능), slide-31 치트시트 수정본 frame 정합.
- **육안 검수(UAT 보류)**: 슬라이드-음성-자막 동기, 자막 가독성(soft 자막), 배경음 볼륨/품질, 내용 적합성 — 사용자 재생 확인 필요(직전 회고 "내용 적합성 리뷰" 교훈: 자동 검증이 잡지 못하는 부분).
