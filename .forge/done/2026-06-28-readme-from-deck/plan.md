<!-- forge-slug: readme-from-deck -->
<!-- task: 2 -->
<!-- tdd: off -->
# 발표 덱 내용을 자습용 학습 README로 변환

## Goal / Non-goals
- **Goal**: `forge-입문-발표.pptx`(44장)의 내용을 `/Users/gyuha/workspace/forge-learn/README.md`에 **자습용 한국어 학습 문서**로 변환한다. 덱의 "간결 본문 + 풍부한 발표자 노트" 구조를 README 성격에 맞게 **발표자 없이 읽어도 이해되는 자기완결 산문**으로 녹인다(노트의 설명을 본문으로 끌어올림). 덱의 4파트 빌드업(기초 → 사고방식 → 메커니즘 → forge) **순서를 유지**하고, 맨 위에 짧은 README 상단(제목 · 1~2줄 소개 · 📥 pptx 링크 · 한 줄 TL;DR)을 둔다. 흐름은 GitHub에서 렌더되는 **Mermaid**, 대응 관계는 **표**로.
- **Non-goals**:
  - **이미지 파일 임베드 금지** — 덱의 분위기 이미지/png를 repo에 넣지 않음(용량). 시각은 Mermaid + 표 + 텍스트 흐름도만.
  - **덱에 없는 새 내용 발명 금지** — 덱 콘텐츠의 충실한 변환만. 신규 섹션(저장소 구조 해설 등) 추가 안 함(단 상단 1~2줄 repo 소개는 허용).
  - **CONTEXT.md 용어집 / ADR 생성 안 함** — 문서 변환 작업(덱과 동일 방침).
  - **영어 병기 금지** — 한국어 단일(덱과 동일). 인용구는 이미 한국어화됨; 기술 식별자(Claude Code·Skills·Hooks·MCP·Dynamic Workflow·fg-* 등)만 원형 유지.
  - **슬라이드 대본형(슬라이드별 나열) 금지** — 개념 중심 산문으로 재구성.

## Source of truth
- **콘텐츠·사실 기준(필독)**: 봉인된 덱의 **교정 최종본**을 그대로 상속한다.
  - 구조 소스: `deck-build/content.js`(이전 세션 스크래치패드 `/private/tmp/claude-501/-Users-gyuha-workspace-forge-learn/e38e0731-.../scratchpad/deck-build/content.js` — 적대적 리뷰 8건 + 영문 인용 전면 한국어화 반영). **스크래치패드가 비었으면** 워크스페이스의 `forge-입문-발표.pptx`를 python-pptx로 텍스트 추출하거나 `.forge/done/2026-06-28-forge-intro-pptx/`(plan·run·review)를 근거로 재구성.
  - 사실 기준 문서: `.forge/research-findings.md`(line 96·120·164 교정 반영).
- **반드시 상속할 교정 사항**:
  - 정확도 게이트 3건: ① Dynamic Workflow는 Claude Code **공식 기능**(2026-05-28, v2.1.154+) ② Loop 프리미티브 "5 core + State/Memory", **L1→L2→L3은 forge 프레이밍**(Osmani 원문 아님) ③ Compound = Kieran Klaassen / Every.
  - 인용 귀속 교정: "프롬프트 치지 말고 루프를 설계하라"는 Osmani가 **Peter Steinberger를 인용**한 것 → README는 **Osmani 본인 정의문**(한국어)을 쓴다. 클로징 표어는 **"에이전트는 잊어도, 저장소는 기억한다"**(model 아님).
  - maker/checker **자기채점 편향 메커니즘은 추론([중간])** → 단정하지 말고 "편향이 생길 수 있다"로.
- **Glossary terms**: none (CONTEXT.md 미사용)
- **Related ADRs**: none

## Work slices
- [ ] **S1. README 상단 + 오프닝(Part 0)** — 제목, repo 소개 1~2줄, 📥 `forge-입문-발표.pptx` 링크, 한 줄 TL;DR, "왜 이걸 알아야 하나"(덱 노트 설명을 산문으로). 현재 2줄 README는 전면 교체. — 완료 기준: 상단 4요소 + 오프닝 산문이 존재한다.
- [ ] **S2. Part 1 — Claude Code 기초** — Claude Code란?(동료 비유), 핵심 기능(사무실 비유 **표**: Skills·CLAUDE.md·Hooks·Permissions·MCP·Subagents), 대화·명령·계획(Plan mode), 기억(Skills/CLAUDE.md), Hooks·Permissions, Subagents·MCP, "CLAUDE.md에 다 적으면" 오해(200줄 권장). — 완료 기준: 6개 기능 + 오해가 표/산문으로 담긴다.
- [ ] **S3. Part 2 — 사고방식** — 하네스(테제 "LLM은 가장 작은 부품"·F1/CPU 비유·구성요소 6·"모델 바꾸면 해결" 오해), 루프 엔지니어링(**Osmani 본인 정의문**·프리미티브 5 core + State/Memory·그림자 4경고[토큰 비용·이해 부채·인지적 항복·오케스트레이션 세금]), 컴파운드(정의·복리 비유·"마지막 환원 단계"·50/50). — 완료 기준: 3개 사고방식 산문 + 한국어 핵심 인용.
- [ ] **S4. Part 3 — 메커니즘** — 그릴링(정의·기법 5·반대신문/세관 비유), 에이전트(독립 컨텍스트·maker/checker — 편향은 [중간] 헤지·작가≠편집자), Dynamic Workflow(**공식 기능**·대화형 vs 워크플로우 **비교표**·Bun 포팅 사례·토큰비용 주의). — 완료 기준: 3개 메커니즘 산문 + 비교표.
- [ ] **S5. Part 4 — forge** — forge란?(18개 fg- 스킬), **4단계 루프(Mermaid)**, 두 기둥("문서는 연료"), **개념→forge 매핑(표)**, 강점(경고를 게이트로), 실전 fg-ask→fg-run→fg-next(+ 신뢰 사다리 L1→L2→L3 **forge 프레이밍 명시**), 언제 무엇을 쓰나, 기억할 세 문장(한국어), 마무리 + 설치/시작 명령(`/plugin marketplace add gyuha/forge` → `/plugin install forge@forge`). — 완료 기준: forge 섹션 + 매핑표 + Mermaid 루프 + 설치 명령이 존재한다.
- [ ] **S6. 흐름도 보강 + 검수** — 흐름 있는 섹션(하네스 실행 루프 / 루프 설계 / forge 4단계 / 메커니즘→forge)에 **텍스트 맥락 먼저 + Mermaid(또는 단순 흐름은 텍스트 흐름도)** 추가(사용자 문서 규칙). 검수: 정확도 게이트 3건·인용 귀속 교정·"agent forgets" 반영 확인, 마크다운/Mermaid 렌더 유효(코드펜스·노드 문법), 본문에 영어 인용 0건(귀속·기술 식별자 제외), 4파트 순서 유지. — 완료 기준: 위 체크리스트 전 항목 통과 보고. (depends: S1–S5)
