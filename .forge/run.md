<!-- forge-slug: forge-intro-pptx -->
# 실행 노트 — Claude Code 기초 + forge 입문 교육용 pptx

## 산출물
- `/Users/gyuha/workspace/forge-learn/forge-입문-발표.pptx` — 44장, 전 슬라이드 한국어 발표자 노트 포함, 다크 테크 테마, 이미지 13장 임베드 (약 29.8MB)
- 빌드 자산(스크래치패드): `deck-build/content.js`(슬라이드 데이터), `build.js`(pptxgenjs 빌드), `img/*.png`(생성 이미지 13장)
- 근거: `.forge/research-findings.md`

## 계획대로 된 것
- 4파트 구조(오프닝→기초→사고방식→메커니즘→forge) 그대로 구현, 44장(목표 40장+ 충족).
- 정확도 게이트 3건 모두 반영: ①Dynamic Workflow 공식 기능(2026-05-28, slide 29) ②Loop 프리미티브 "5 core + State/Memory", L1→L2→L3는 forge 프레이밍으로 명시(slide 18·40) ③Compound = Klaassen/Every(slide 20).
- 메커니즘 3종 → forge 스킬 1:1 매핑 착지(slide 33·38).
- 다크 테마 강조색을 forge 아이콘에서 추출(#F5811E 오렌지/#F5B301 앰버).
- 이미지 적극 활용 + 라벨은 텍스트 레이어로(이미지 내 글자 없음 확인).
- 슬라이드마다 상세 한국어 노트(44/44).
- 시각 QA: PowerPoint→PDF→jpg 렌더 후 서브에이전트 전수 검수.

## 계획과 달랐던 것 (divergence)
1. **실행 방식 — 하이브리드.** 계획상 fg-run은 Dynamic Workflow 단계지만, 산출물이 "일관된 한 목소리의 단일 pptx"라 내용 저작·빌드는 메인 세션에서 직접 수행하고, 진짜 병렬인 두 구간(이미지 생성·시각 QA)만 팬아웃했다. (fg-run Constraints "작으면 직접 처리" + Simplicity First 근거. 사용자 승인 받음.)
2. **루프 다이어그램 — 재작성.** 계획은 forge `docs/workflow.png` 재사용이었으나, 라이트 테마라 다크 덱과 충돌 → 동일 내용(ask→run→learn→done)을 테마 일치 도형으로 직접 그림(slide 36).
3. **시각 QA 도구 — PowerPoint.** LibreOffice 미설치 → 사용자가 PowerPoint 자동화 권한을 허용해 osascript(백그라운드)로 PDF 변환. (LibreOffice 설치 회피.)

## 도중의 결정·막힘
- **병렬 codex 이미지 생성 레이스(막힘→해결).** 동시 3개 codex exec 중 세션 간 이미지 교차 복사 발생 → 2쌍 중복(sec-claudecode=sec-mindset, sec-forge=workflow-kitchen). md5로 검출, 틀린 2장(sec-mindset·sec-forge)을 **순차** 재생성해 해소. 교훈: codex 이미지 배치는 병렬 시 파일 교차 위험 → 순차 또는 사후 해시 검증 필요.
- **closing 이미지 누락 버그.** content.js closing 슬라이드에 `image` 필드 누락으로 배경이 안 깔림 → 필드 추가 후 정상.
- **레이아웃 수정(QA 반영).** 매핑 6행 푸터 초과, 카드 콜아웃 푸터 겹침(2건), 섹션 제목 단어 고립, Hooks 슬라이드 콜아웃 누락 → 모두 수정 후 재렌더로 확인.

## 검증 메모
- python-pptx 확인: 44 슬라이드, 노트 44/44 비어있지 않음.
- 서브에이전트 시각 QA + 직접 스폿 검수: 텍스트 오버플로·겹침·저대비·이미지 주제 불일치·이미지 내 글자 — 발견분 전부 수정 완료. 한글 깨짐 0건.
