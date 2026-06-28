<!-- forge-slug: forge-intro-pptx -->
# 실행 노트 — forge 입문 pptx (2차: 적대적 리뷰 fix-and-re-run + 한국어화)

> 1차 실행(2026-06-27)으로 44장 덱을 빌드했고, 적대적 리뷰(.forge/review.md)가 critical 1 + minor 7을 찾았다. 활성 작업의 정직한 UAT는 `failed`였으므로(헤드라인 인용 오귀속), 이번 2차는 그 **fix-and-re-run**이다 — 리뷰 확정 8건 수정 + 사용자 요청 영문 인용 전면 한국어화 + 재빌드. (백로그 task 2 `forge-intro-pptx-fix`의 슬라이스를 이 재실행으로 흡수.)

## 산출물
- `/Users/gyuha/workspace/forge-learn/forge-입문-발표.pptx` — 44장 유지, 전 슬라이드 한국어 노트 44/44, 약 29.8MB. content.js 재빌드(`node build.js <경로>`).
- 빌드 자산(이전 세션 스크래치패드): `deck-build/content.js`(수정), `build.js`, `img/*.png`.
- 사실 기준 `.forge/research-findings.md` 도 2곳 교정(재상속 차단).

## 계획대로 된 것
- 적대적 리뷰 확정 8건 전부 반영: F-1(인용 오귀속→Osmani 정의문 한국어 교체), F-2(과일반화 축소), F-3(F1 비유 충돌 노트 봉합), F-4(저-divergence 풀어쓰기), F-5(L1→L2→L3(forge 프레이밍) 본문 통일), F-6(model→agent), F-7(자기채점 편향 헤지), F-8(1:1→다대다 노트).
- 영문 인용·슬로건 전면 한국어 교체(귀속 유지) — content.js 온스크린 영문 문장 0건 확인.
- research-findings.md line 96(Steinberger 귀속 주석), line 120·164(model→agent) 교정.
- 44장·노트 44/44 유지, python-pptx 확인.
- 변경 13개 슬라이드 PowerPoint 재렌더 전수 시각 검수 — 오버플로/잘림 0, 한글 깨짐 0.

## 계획과 달랐던 것 (divergence)
1. **별도 task가 아니라 active 작업의 fix-and-re-run으로 처리.** fg-run 진입 시 활성 슬롯이 원래 작업(verified: pending)으로 차 있었고, 리뷰가 critical을 찾아 UAT=failed였으므로, 백로그 fix-forward를 별도 실행하는 대신 step-4 failed 분기(fix-and-re-run)로 흡수했다. 한 산출물에 두 task를 두지 않음(Simplicity). → 백로그 `forge-intro-pptx-fix.md`는 소비되어 제거.
2. **번역 범위 확장.** 사용자와 합의한 9곳 외에, 누락됐던 온스크린 슬로건 "Plans are the new code"(slide 21 카드)와 Osmani 경고 4개 영문 라벨(Token cost 등→토큰 비용 등, slide 19)도 함께 한국어화. 온스크린 영문을 일관되게 제거하기 위함(귀속·기술 식별자·발표자 노트는 보존).
3. **워크플로우 미사용 — 직접 실행.** 정밀 문자열 편집(content.js 19곳 + research 3곳) + 단일 재빌드라 병렬 fan-out 불필요 → 직접 처리(fg-run Constraints "작으면 직접").

## 도중의 결정·막힘
- **PowerPoint 스테일 렌더(막힘→해결).** 첫 PDF 변환이 이전 세션부터 메모리에 떠 있던 옛 문서를 렌더해 영문 그대로 출력 → python-pptx로 디스크 pptx는 올바름을 교차확인 → PowerPoint 완전 종료 후 재변환해 실제 반영 확인. 교훈: PowerPoint osascript 변환 전 앱을 종료(또는 열린 presentation close)해 디스크에서 새로 읽게 할 것.
- **F-1 수정 방식.** 오귀속 인용을 Steinberger 귀속이 아니라 Osmani 본인 정의문(한국어)으로 교체 — 누가 그 유명한 말을 했든 무관하게 안전(사용자 승인).
- **슬라이드 29 줄바꿈.** Dynamic Workflow 인용의 한국어 자동 줄바꿈으로 "하는"이 짧은 줄로 떨어짐 — 박스 내 수용·가독 정상이라 그대로 둠(원하면 \n 위치 미세조정 가능).

## 검증 메모
- python-pptx: 44 슬라이드, 노트 44/44 비어있지 않음, 온스크린 영문 인용 시그니처 0건.
- PowerPoint→PDF→jpg 재렌더(앱 재기동 후): 변경 13개 슬라이드(2·13·17·19·20·21·24·29·37·38·39·43·44) 전수 확인 — 번역·수정 반영, 오버플로 0, 한글 깨짐 0.
