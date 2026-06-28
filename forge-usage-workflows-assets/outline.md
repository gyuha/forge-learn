# forge 사용법·유형별 워크플로우 안내 PPTX 아웃라인

총 32장 / 35~45분. 대상은 Claude Code는 써봤지만 forge는 처음인 개발자. 본문은 사용법 중심, 배경 이론은 한 줄 정의만 허용.

## 0. 오프닝
1. 표지 — forge 사용법·유형별 워크플로우 — 이미지: cover.
2. 오늘의 목표 — “상황을 보고 어떤 fg 명령을 쓸지 판단한다.”
3. 표기와 전제 — `/fg-*` 기본, 환경에 따라 `/forge:fg-*` 가능, Claude Code 기본 설명 제외.
4. 설치/업데이트 1장 — marketplace add/install, update/uninstall, 로컬 설치는 한 줄.

## 1. 기본 루프와 상태
5. 가장 많이 쓰는 3개 — `/fg-ask → /fg-run → /fg-next`.
6. 한 바퀴의 의미 — ask/plan → execute → retro → done.
7. 신뢰 사다리 — L1 `/fg-status`, L2 `/fg-next`, L3 `/fg-loop` 또는 `/fg-next all`.
8. `.forge` 상태 흐름 — backlog → plan/run/STATUS → executed/done. 이미지: state-flow.
9. 왜 상태를 파일로 남기나 — 독립 호출, 재진입, 재실행 방지.

## 2. 7개 상황별 워크플로우
10. 상황 1: 처음 셋업 — `fg-map → fg-agents → fg-ask → 루프`. 이미지: setup.
11. 처음 셋업 예시 — 새 코드베이스에 코드 지도와 도메인 에이전트 준비.
12. 상황 2: 일상 작업 — `fg-ask → fg-run → fg-next`. 이미지: everyday.
13. 일상 작업 예시 — 버그 수정/작은 기능 추가를 계획·실행·검증.
14. 상황 3: 사소한 1회 변경 — `fg-quick`. 이미지: quick.
15. 사소한 변경 예시 — 오타/문구/버전 범프와 bail-out 기준.
16. 상황 4: 무인 주행 — `fg-ask ×N → fg-next all` 또는 `fg-loop`. 이미지: unattended.
17. 무인 주행 예시 — 그릴된 큐와 기계 검증 가능한 goal의 차이.
18. 상황 5: 재진입/점검 — `fg-status`, `fg-next`, `fg-doctor`. 이미지: reentry-health.
19. 재진입/점검 예시 — 어디까지 했는지 모를 때, 상태가 이상할 때.
20. 상황 6: 마무리/배포 — `fg-adversarial-review → fg-learn → fg-done → 배포`. 이미지: wrapup-ship.
21. 마무리/배포 예시 — 적대적 리뷰가 필요한 경우와 회고/봉인.
22. 상황 7: 유지보수 — `fg-cleanup`, `fg-merge`, `fg-drop`, `fg-tdd`, `fg-eco`, `fg-statusline`. 이미지: maintenance.
23. 유지보수 예시 — ADR 은퇴, 브랜치 통합, 미완 작업 폐기.

## 3. 판단 기준과 실전 운용
24. 어떤 차선을 고를까 — quick / normal loop / next all / loop decision.
25. `fg-ask`에서 좋은 계획을 만드는 법 — 용어, 비목표, 완료 기준, slice.
26. `fg-run` 뒤 확인할 것 — plan vs actual, 검증 게이트, run.md/STATUS.md.
27. 실패했을 때 — failed는 봉인 불가, fix-and-re-run 또는 재그릴링.
28. 이미지와 도형을 섞은 설명 슬라이드 — 사용법 덱 작성 규칙 자체 요약.

## 4. 치트시트와 부록
29. 치트시트 1 — 상황 → 쓸 명령 → 다음 단계. 이미지: cheatsheet.
30. 치트시트 2 — 18개 스킬 전체 요약.
31. 흔한 실수 5개 — 계획 없이 run, 상태 무시, failed 봉인 시도, 내부 구현 과독, 이미지에 명령어 박기.
32. 출처 — README.ko.md, docs/skills.md, docs/state-contract.md, docs/forge-vs-loop-engineering.md.
