<!-- forge-slug: forge-usage-workflows-pptx -->
<!-- task: 3 -->
<!-- tdd: off -->
# forge 사용법·유형별 워크플로우 안내 PPTX 제작

## 목표 / 비목표
- **목표**: GitHub `gyuha/forge` 저장소의 사용자-facing 문서만을 기준으로, Claude Code는 써봤지만 forge는 처음인 개발자를 위한 한국어 PowerPoint 덱 `forge-사용법-워크플로우.pptx`를 제작한다. 덱은 30~35장 / 35~45분 분량이며, 상황별 워크플로우 중심으로 forge 사용법을 안내하고, 모든 슬라이드에 상세 한국어 발표자 노트를 포함한다.
- **비목표**:
  - Claude Code 기초, Loop Engineering, Compound Engineering, Dynamic Workflow 자체 이론 강의는 제외한다. 단, forge 명령을 이해하는 데 필요한 한 줄 정의는 허용한다.
  - `skills/*/SKILL.md` 내부 운영 규칙을 본문 설명의 기준으로 삼지 않는다. 필요한 확인용으로만 참조한다.
  - 기존 `forge-입문-발표.pptx`를 직접 수정하지 않는다. 기존 pptx는 시각 스타일 참고용이며, 이번 덱의 내용과 빌드 소스는 새로 만든다.
  - `.forge/CONTEXT.md` 용어집이나 ADR을 새로 만들지 않는다. 발표자료 제작 작업이며 도메인 용어·아키텍처 결정을 추가하는 작업이 아니다.

## 기준 자료
- **용어집 항목**: 없음
- **관련 ADR**: 없음
- **내용 근거**:
  - `/Users/gyuha/workspace/forge/README.ko.md`
  - `/Users/gyuha/workspace/forge/docs/skills.md`
  - `/Users/gyuha/workspace/forge/docs/state-contract.md`
  - `/Users/gyuha/workspace/forge/docs/forge-vs-loop-engineering.md`
  - 필요 시 `/Users/gyuha/workspace/forge/README.md`를 한영 대조용으로만 확인
- **스타일 참고**: `/Users/gyuha/workspace/forge-learn/forge-입문-발표.pptx`의 다크 테크 톤. 단, 해당 pptx를 직접 편집하지 않는다.
- **완료 정의**: `/Users/gyuha/workspace/forge-learn/forge-사용법-워크플로우.pptx`가 생성되어 있고, 30~35장 범위·슬라이드별 상세 한국어 노트·README/docs 근거의 7개 상황별 워크플로우·설치/업데이트 1장·마지막 치트시트 2장·출처 1장·codex-image로 생성한 슬라이드용 이미지 10장을 포함하며, PPTX 구조 검증과 PDF/JPG 렌더 시각 검수를 통과한다.

## 합의된 덱 설계
- 대상: Claude Code는 써봤지만 forge는 처음인 개발자.
- 구성 원칙: 명령 카탈로그가 아니라 **상황별 워크플로우 중심**. 마지막에 명령 카탈로그/치트시트로 정리한다.
- 명령 표기: 본문 기본 표기는 README 공식 표기인 `/fg-*`. 첫 사용 슬라이드 또는 발표자 노트에만 “환경에 따라 `/forge:fg-*`처럼 보일 수 있음”을 주석으로 병기한다.
- 근거 범위: README.ko.md와 docs/*.md 중심. skill 내부 구현은 확인용만.
- 디자인: 기존 forge 입문 덱의 다크 테크 톤을 유지하되, 이번에는 매뉴얼형·흐름도 중심으로 단순화한다. 이미지는 codex-image 스킬로 생성하고, 본문은 `상황 → 명령 → 산출물 → 다음 단계` 흐름도와 표 중심으로 만든다.
- 내부 상태 설명: `.forge/backlog → plan.md/run.md/STATUS.md → done` 수준의 사용자가 알아야 할 상태 흐름을 2~3장 포함한다. 브랜치 오버레이·ADR 세부 구현은 제외한다.
- 워크플로우 범위: README의 7개 상황 전부를 다룬다.
  1. 처음 셋업
  2. 일상 작업
  3. 사소한 1회 변경
  4. 무인 주행 완료까지
  5. 재진입 / 점검
  6. 마무리 / 배포
  7. 유지보수
- 설정/보조 기능: `fg-tdd`, `fg-eco`, `fg-statusline`은 독립 워크플로우가 아니라 부록성 카탈로그에서 짧게 다룬다.
- 예시: 각 워크플로우마다 짧은 실제 예시 시나리오를 포함한다. 예시는 forge 문서의 동작 범위를 벗어나지 않는 가상 예시로 제한한다.
- 끝부분: 치트시트 2장 — “상황 → 쓸 명령 → 다음 단계” 의사결정표 + 전체 명령 요약. 마지막 부록에 출처 1장 포함.
- 이미지 생성 합의:
  - PPTX에 필요한 슬라이드용 이미지는 codex-image 스킬로 생성한다.
  - 이미지 수는 총 10장: 표지 1장, README의 7개 워크플로우별 1장, `.forge` 상태 흐름 1장, 마무리/요약 1장.
  - 스타일은 기존 다크 테크 톤 + forge 아이콘 강조색 + 추상/상징적 장면으로 통일한다.
  - 슬라이드용 기본 크기는 landscape `1536x1024`, 품질은 `auto` 또는 필요 시 `medium/high`로 둔다.
  - codex-image 스킬 규칙에 따라 생성 이미지는 기존 파일을 덮어쓰지 않고, 생성 후 Read로 확인한다.
  - 정확해야 하는 명령어(`/fg-*`, `/forge:fg-*`), 상태명(`.forge/backlog`, `plan.md`, `run.md`, `STATUS.md`, `done`), 화살표·라벨은 이미지 안에 넣지 않고 PPTX 텍스트/도형 레이어로 얹는다.
  - codex-image가 인증/권한/타임아웃 등으로 실패하면 다른 이미지 생성기로 우회하지 않고 중단·보고한다. 본문 흐름도와 표는 PPTX 도형으로 계속 만들 수 있지만, 필요한 슬라이드용 이미지는 codex-image 산출물이어야 한다.

## 작업 조각
- [ ] S1. **근거 문서 재확인 및 슬라이드 아웃라인 작성** — README.ko.md, docs/skills.md, docs/state-contract.md, docs/forge-vs-loop-engineering.md에서 사용자-facing 설명만 추려 30~35장 아웃라인을 만든다. 각 슬라이드에 제목, 핵심 본문, 발표자 노트 골자, 사용할 흐름도/표/이미지 여부를 지정한다. — 완료 기준: 30~35장 범위의 한국어 아웃라인이 있고, README의 7개 상황·설치/업데이트 1장·상태 흐름 2~3장·치트시트 2장·출처 1장이 모두 배치되어 있다.
- [ ] S2. **테마와 codex-image 자산 준비** — 기존 `forge-입문-발표.pptx`는 색감·톤·레이아웃 참고용으로 확인하고, 이번 덱용 새 빌드 소스와 도형 자산을 만든다. 슬라이드용 이미지는 codex-image 스킬로 총 10장(표지 1, 7개 워크플로우별 1, `.forge` 상태 흐름 1, 마무리/요약 1)을 생성한다. 다크 테크 톤 + forge 강조색 + 추상/상징적 장면으로 통일하고, 명령어·상태명·화살표·라벨은 이미지가 아니라 PPTX 텍스트/도형 레이어로 올린다. codex-image 실패 시 다른 이미지 생성기로 우회하지 않고 중단·보고한다. — 완료 기준: 새 덱을 생성할 수 있는 빌드 소스와 테마 토큰/레이아웃 규칙이 준비되어 있고, codex-image 산출물 10장이 생성·Read 확인되었으며, 기존 pptx 직접 수정 없이 새 산출물 경로로 빌드 가능하다. (depends: S1)
- [ ] S3. **PPTX 생성** — `forge-사용법-워크플로우.pptx`를 생성한다. 모든 슬라이드에 상세 한국어 발표자 노트를 넣고, 본문에는 `/fg-*` 공식 표기를 사용하며, 첫 사용 구간에만 `/forge:fg-*` 병기 가능성을 주석 처리한다. 배경 이론 설명은 제외하고 forge 사용법 중심으로 작성한다. — 완료 기준: `/Users/gyuha/workspace/forge-learn/forge-사용법-워크플로우.pptx`가 생성되어 있고, 30~35장 범위이며 모든 슬라이드에 비어 있지 않은 한국어 발표자 노트가 있다. (depends: S2)
- [ ] S4. **내용 검수** — 덱 내용이 GitHub repo의 사용자-facing 문서 기준에서 벗어나지 않는지 확인한다. 특히 7개 워크플로우, 설치/업데이트 1장, `.forge` 상태 흐름 2~3장, 마지막 치트시트 2장, 출처 1장, codex-image 산출물 10장, 명령 표기 규칙, 배경 이론 제외 원칙을 점검한다. 이미지 안에 깨진 텍스트·명령어·상태명·화살표가 들어가지 않았는지도 확인한다. — 완료 기준: 검수 체크리스트 전 항목이 통과하고, skill 내부 구현 세부가 본문 설명으로 과도하게 유입되지 않았으며, 이미지 생성 요구사항이 지켜졌음이 확인된다. (depends: S3)
- [ ] S5. **PPTX 구조 및 렌더 검증** — `python-pptx` 등으로 슬라이드 수와 노트 존재를 검사하고, PowerPoint를 새로 열어 PDF/JPG로 렌더링해 대표/변경 슬라이드의 오버플로·한글 깨짐·명령 표기 오류·스테일 렌더 문제를 확인한다. 이전 작업의 교훈에 따라 PowerPoint 변환 전 열린 기존 presentation을 닫거나 앱을 재기동한다. — 완료 기준: 구조 검증과 PDF/JPG 렌더 시각 검수가 통과하고, 검증 결과가 실행 노트에 기록된다. (depends: S4)
