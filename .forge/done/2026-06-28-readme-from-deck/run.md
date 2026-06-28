<!-- forge-slug: readme-from-deck -->
# 실행 노트 — 발표 덱 내용을 자습용 학습 README로 변환

## 산출물
- `/Users/gyuha/workspace/forge-learn/README.md` (414줄) — 자습용 한국어 학습 문서. 덱 4파트 빌드업(기초→사고방식→메커니즘→forge) 유지 + 짧은 README 상단(제목·소개·pptx 링크·TL;DR·목차). Mermaid 2종 + 표 다수, 이미지 파일 0.
- 사실 기준: 교정된 `deck-build/content.js` + `.forge/research-findings.md`.

## 계획대로 된 것
- 6개 슬라이스 전부 반영: S1 상단/오프닝, S2 Part1(6기능 사무실 비유 표 등), S3 Part2(하네스·루프·컴파운드), S4 Part3(그릴링·에이전트·Dynamic Workflow + 비교표), S5 Part4(forge 4단계 Mermaid·개념→forge 매핑표·실전·설치), S6 흐름도+검수.
- **노트→본문 변환**: 덱의 발표자 노트(풍부한 설명)를 본문 산문으로 녹여 발표자 없이 읽어도 이해되게 함(README 성격).
- **덱 교정본 상속 확인**(검수 grep): 정확도 게이트 3건, "에이전트는 잊어도"(model 아님), Osmani 본인 정의문(Steinberger 인용 아님), 자기채점 편향 추론 헤지, L1→L2→L3 forge 프레이밍 3곳 명시. 영문 인용 문장 0건.
- **시각 = Mermaid + 표 + 텍스트 흐름도**(이미지 파일 미임베드, Non-goal 준수). 흐름 섹션은 텍스트 맥락 먼저 + 다이어그램(사용자 문서 규칙), Mermaid classDef 색상 적용.

## 계획과 달랐던 것 (divergence)
1. **직접 실행 — 워크플로우 미사용.** 단일 파일(README.md) 저작이라 모든 슬라이스가 같은 파일을 쓰고 일관된 한 목소리가 필요 → 병렬 fan-out 이득이 없어 메인 세션에서 직접 저작(fg-run Constraints "작으면 직접", 덱 저작과 동일 판단).
2. **Mermaid 줄바꿈 버그(검수에서 발견·수정).** forge 4단계 다이어그램 노드에 `\n`을 썼는데 Mermaid는 리터럴 출력 → `<br/>`로 교정. (교훈: 마크다운 Mermaid 노드 줄바꿈은 `<br/>`.)
3. **README 관용 요소 추가.** 목차(TOC)와 "직접 해보기"(설치/시작 명령) 섹션을 추가 — 덱에 없는 *개념* 발명은 아니며(설치 명령은 덱 클로징에 존재), README 성격상 자연스러운 상단/하단 구성(상단 repo framing 허용 범위).
4. content.js 소스가 이전 세션 스크래치패드에 잔존 → 폴백(pptx 추출) 불필요.

## 검증 메모
- 콘텐츠·구조·사실: grep 검수로 정확도 게이트 3건·교정 사항 전부 반영, 금지 항목(영문 인용 문장·"model forgets"·Steinberger 오귀속) 0건, 4파트 순서 유지 확인.
- Mermaid: 펜스 균형(8), 리터럴 `\n` 0; mmdc 미설치라 GitHub 네이티브 렌더에 의존, 문법은 수기 확인(flowchart LR + quoted 노드 + classDef). → 실제 렌더 모양은 사용자가 GitHub/뷰어에서 최종 확인 권장.
