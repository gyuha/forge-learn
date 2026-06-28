<!-- forge-slug: forge-intro-pptx -->
<!-- task: 1 -->
<!-- tdd: off -->
# Claude Code 기초 + forge 입문 교육용 pptx 제작

## Goal / Non-goals
- **Goal**: Claude Code 입문 개발자 대상 50~60분(40장+) 한국어 교육 발표자료 `forge-입문-발표.pptx`를 제작한다. 6개 기초 개념을 쌓아 올린 뒤 forge의 강점·워크플로우로 착지시킨다. 모던 다크 테크 테마 + 단일 강조색, 슬라이드마다 상세 한국어 발표자 노트, codex-image로 생성한 이미지 적극 활용.
- **Non-goals**:
  - forge 정식 문서 기계장치(CONTEXT.md 용어집 / ADR) 생성 — 발표자료 제작이므로 적용 안 함.
  - 실시간 라이브 데모/실행 환경 구성 — 슬라이드 안의 정적 워크스루로 대체.
  - 영어 병기 — 본문·노트 모두 한국어 단일.
  - forge 18개 스킬 전수 해설 — 입문자용이므로 핵심 흐름(fg-ask/fg-run/fg-next + 4단계 루프)만, 나머지는 카탈로그 1장으로 압축.

## Source of truth
- **Glossary terms**: none (CONTEXT.md 미사용 — Non-goals 참조)
- **Related ADRs**: none
- **검증 근거 문서(필독)**: `.forge/research-findings.md` — deep research로 1차 출처 직접 검증한 7개 개념 정리(정의·출처·인용·비유·forge 연결). 슬라이드 본문/노트 작성 시 **이 문서를 사실 기준으로 삼는다.** forge 자체 근거는 `/Users/gyuha/workspace/forge/README.ko.md`, `docs/forge-vs-loop-engineering.md`, `docs/skills.md`, `docs/state-contract.md`, `docs/workflow.png`, `docs/icon.png`.

### 반드시 반영할 정확도 정정 3건 (틀리면 발표 신뢰도 붕괴)
1. **Dynamic Workflow는 Claude Code 공식 기능이다.** 2026-05-28 리서치 프리뷰→GA, v2.1.154+. "비공식"으로 표기 금지.
2. **Loop Engineering(Osmani) 프리미티브는 "5 core + State/Memory" 구조.** `/goal`·`/loop`는 별도 in-session 명령이며 동급 프리미티브로 단정 금지. **L1→L2→L3 자율성 사다리는 forge의 프레이밍이지 Osmani 원문 용어가 아님** — "Osmani가 L1/L2/L3를 정의했다"고 쓰지 말 것. 원문 발행일 2026-06-07.
3. **Compound Engineering = Kieran Klaassen / Every.** 원전(2025-08-18) 표기는 "compounding engineering", 가이드(2026-01-17) 이후 "compound engineering"으로 정착 — 동일 개념.

### 발표 구조 (4파트, 확정)
- **Part 0. 오프닝** — 왜 이걸 알아야 하나 / 발표 로드맵 (표지 포함 2~3장)
- **Part 1. 기초** — Claude Code 기본 기능 (대화형 CLI·slash·plan mode·Skills·Hooks·Subagents·MCP·Memory/CLAUDE.md·Permissions)
- **Part 2. 사고방식(왜)** — 하네스 엔지니어링(넓은 개념, 메인) → 그 안의 대표 사례로 Loop Engineering(Osmani) → 컴파운드 엔지니어링(Every)
- **Part 3. 메커니즘(어떻게)** — 그릴링(grill me / grill-with-docs) → 에이전트(Subagents, maker/checker) → Dynamic Workflow
- **Part 4. 종합** — forge의 강점 → forge 워크플로우(4단계 루프 + fg-ask/run/next, 신뢰 사다리) → 마무리

### 개념 → forge 매핑 (Part 4 착지점, 메커니즘이 그대로 forge 스킬로 연결)
| 개념 | forge 대응 |
|---|---|
| 하네스 엔지니어링 | `.forge/` 상태계약 + 4단계 루프 + `fg-doctor` |
| Loop Engineering | `fg-loop`, 신뢰 사다리 L1→L2→L3(forge 프레이밍) |
| Compound Engineering | `fg-learn`(회고→문서 승급), "문서는 연료" 기둥 2 |
| 그릴링 | `fg-ask` |
| Subagents | `fg-agents`(생성) + `fg-run`(maker)/`fg-adversarial-review`(checker) |
| Dynamic Workflow | `fg-run`, `fg-adversarial-review`(6렌즈 fan-out) |

### 디자인 규칙
- 테마: 모던 다크 테크 배경 + **단일 강조색**(forge `docs/icon.png`에서 추출). 코드/터미널 친화 폰트.
- 이미지: codex-image(gpt-image-2) 적극 활용 — 표지·섹션 표지 6~7개·개념/분위기 일러스트. **단 정확해야 할 라벨·화살표·용어는 AI 이미지 안에 넣지 말고 pptx 텍스트 레이어로 이미지 위/옆에 얹는다**(gpt-image-2가 글자를 깨뜨림). forge `docs/workflow.png`는 루프 슬라이드에 재사용.
- 노트: **슬라이드마다 상세 한국어 발표자 노트** — 본문은 간결(인지부하↓), 풀 설명·예시·전환 멘트는 노트에(발표자가 읽으면 강의가 되도록). research-findings.md의 비유·인용·"흔한 오해"를 노트에 활용.
- 분량: 40장+ / 50~60분. 개념당 2~3장 확보.

## Work slices
- [ ] S1. **테마 토큰 + 슬라이드 아웃라인 확정** — forge `docs/icon.png`에서 강조색 추출, 다크 테마 색/폰트 토큰 정의. 4파트 기준 40장+ 슬라이드별 (제목 / 본문 bullet 골자 / 노트 골자 / 필요 이미지 여부)를 담은 아웃라인 작성. — 완료 기준: 40장 이상이 4파트로 배치되고 각 슬라이드에 제목·노트 골자·이미지 필요여부가 명시된 아웃라인 문서가 존재한다.
- [ ] S2. **이미지 생성 (codex-image)** — 표지 1 + 섹션 표지(파트별) + 핵심 개념/분위기 일러스트를 codex-image로 생성. 다크 테마 강조색과 톤 일치. 라벨 텍스트는 이미지에 넣지 않음. — 완료 기준: 아웃라인에서 이미지 필요로 표시된 슬라이드 수만큼 이미지 파일이 생성되어 있고, 글자 깨짐이 들어간 이미지가 없다. (depends: S1)
- [ ] S3. **pptx 빌드** — pptx 스킬로 덱 생성: 다크 테마 적용, 슬라이드 본문(한국어, 간결) + 슬라이드마다 상세 한국어 발표자 노트, S2 이미지 배치, 개념 다이어그램(루프/하네스/컴파운드 복리/메커니즘→forge 매핑) 작성, `workflow.png` 재사용. 정정 3건을 본문·노트에 정확히 반영. — 완료 기준: `/Users/gyuha/workspace/forge-learn/forge-입문-발표.pptx`가 생성되고, 슬라이드 40장 이상, 모든 슬라이드에 한국어 노트가 존재한다. (depends: S2)
- [ ] S4. **검수** — 슬라이드 수(40+)·파트 구조·노트 누락 여부·이미지 깨짐·정정 3건 반영(Dynamic Workflow 공식 표기 / L1-L3는 forge 프레이밍 / compound 출처)·개념→forge 매핑 착지 확인. 파일이 PowerPoint에서 정상 열림. — 완료 기준: 위 체크리스트 전 항목 통과를 확인한 검수 결과가 보고된다. (depends: S3)
