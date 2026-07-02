# RUN — forge 사용 매뉴얼 대본 재구성 + Edge TTS 내레이션/자막 생성 (2/2 — 영상 반영)

## 계획 vs 실제
- 계획대로 된 것: `captions.ts` 재생성(202 cue, totalDurationMs 746112 — narration.mp3와 일치), `Root.tsx`의 `DURATION_IN_FRAMES` 갱신(22385 frame = 746.136s). "왜" 파트 신규 씬 설계·구현, 기존 7상황 씬 재-타이밍 완료. `npx tsc --noEmit` / `npx eslint src` 통과(에러 0).
- 계획과 달랐던 것:
  1. **"기계적 재-타이밍"이 아니라 사실상 전면 재작성이었음**: 조사 결과 기존 `scenes.tsx`(66개 씬)는 이번에 교체한 869초 오디오가 아니라, 훨씬 더 예전의 19.8분짜리 버전(task 4, `forge-usage-workflows-video`)에 맞춰 타이밍된 것이었음 — `forge-explainer`는 어떤 forge 작업에서도 관리된 적 없이 방치된 상태(커밋 `60ef42c remotion add` 이후 수동 수정만 존재). 이 사실을 사용자에게 공유하고 승인받은 뒤 진행. 결과적으로 66개 씬 중 새 20개 대본과 대응되는 것만 재사용(약 40개는 폐기 — 네가지 성취기준·14/18개 유틸리티 표·치트시트①·fg-ask 4대 산물·divergence·Gate·FailurePaths·제작원칙 메타·18개 전체표·실수패턴 상세 등, 조건 축소로 대본에서 빠진 내용), "왜" 파트(5개 항목) 전용 신규 씬 8개를 새로 작성. 최종 62개 씬.
  2. **정밀 타이밍은 SRT 대신 스크립트 문자 위치 비례 계산으로 추정**: 원본 씬들의 초정밀 `atMs`가 어떻게 산출됐는지 재현할 방법이 없어(당시 SRT/대본 유실), 각 문구의 대본 내 문자 위치를 항목 구간(ms)에 비례 배분하는 방식으로 앵커를 계산. 9개 지점(오프닝/신뢰사다리/상황①/SkillGrid/활성슬롯/상황③/벽 감지/치트시트/클로징)을 실제 프레임 렌더링(`remotion still`)으로 육안 확인해 전부 자막과 시각 요소가 정확히 맞아떨어짐을 검증. 그 과정에서 idx1 PointList 두 번째 항목이 세 번째보다 늦게 나타나는 순서 오류 1건 발견·수정.
  3. **미사용 컴포넌트/임포트 정리**: 새 씬 구성에서 더는 안 쓰는 `RowCard`(로컬 헬퍼), `CriteriaList`·`LabeledIcon`·`FailurePaths`·`Gate`·`Pipeline`(그래픽 컴포넌트), `display` 폰트 임포트를 제거(내 변경으로 unused가 된 것만 — 다른 기존 죽은 코드는 건드리지 않음).
  4. **`forge-explainer` 의존성 미설치 상태**였음 — `npm install` 처음 실행(316 패키지). Remotion 렌더 확인을 위해 Chrome Headless Shell도 최초 1회 다운로드됨.

## 검증
- 자동: `tsc --noEmit` 0 errors, `eslint src` 0 errors(기존 무관 warning 1개만), `captions.ts`/`Root.tsx`/`narration.mp3` 길이 일치(746.1s).
- 육안(직접 수행): `remotion still`로 9개 시점(0.3s~24.8min 전 구간 고르게 분포) 렌더링해 확인 — 전부 자막·시각 요소·컴포넌트가 올바르게 표시되고 서로 어긋나지 않음.
- 남은 것: 사용자가 `npx remotion studio`로 전체를 실제 재생하며 처음부터 끝까지 훑어보는 최종 확인(S4) — 특히 제가 샘플링하지 않은 구간의 애니메이션 타이밍 체감.
