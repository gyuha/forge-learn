# Claude Code 입문 교육 — 7개 핵심 개념 리서치 정리

> 작성일: 2026-06-27 · 검증 방식: 1차 출처(공식 문서·원문 블로그·GitHub 원본) 직접 fetch + 다중 출처 교차검증
> 신뢰 수준 표기: `[높음]` 공식문서/원문 직접 확인 · `[중간]` 합리적 추론 · `[낮음]` 추정 · `[확인 안 됨]` 미확인
> 고유명사·인용구는 원문 유지. 입문자용 비유는 슬라이드 설명용으로 작성.

---

## ⚠️ 발표 전 반드시 알아둘 정정 사항 1건

- **Dynamic Workflow는 "공식 기능이 아님"이 아니라 공식 기능이 맞습니다.** 사전 검증 단계에서 한 보조 자료가 "공식 용어 아님"으로 판정했으나, Anthropic 공식 블로그와 공식 문서(`code.claude.com/docs/en/workflows`)로 **2026-05-28 리서치 프리뷰 출시 → GA** 사실을 확정했습니다. (개념 #5 참조) — `[높음]`

---

## 1. Claude Code 기본 기능 (입문자 핵심 set)

### 한 문장 정의
**Claude Code는 터미널에서 `claude` 명령으로 실행하는 대화형 AI 코딩 에이전트로, 코드베이스 전체에 접근해 파일을 읽고·고치고·명령을 실행하며 작업한다.** `[높음]`

### 출처
- 공식 문서: https://code.claude.com/docs/en/overview.md , https://code.claude.com/docs/en/how-claude-code-works.md (2026-06 기준)
- CLI/데스크톱 앱(Mac·Windows)/웹(claude.ai/code)/IDE 확장(VS Code·JetBrains) — 동일 엔진 공유

### 입문자에게 꼭 가르칠 기능 목록 (각 한 줄 효용)

| 기능 | 한 줄 정의 | 효용 | 신뢰 |
|------|-----------|------|------|
| **대화형 CLI** | `claude`로 시작하는 터미널 대화 | 코드베이스 맥락 위에서 자연어로 작업 | 높음 |
| **Slash commands** (`/`) | `/`로 시작하는 세션 제어·워크플로우 명령 | `/init`·`/model`·`/context`·`/compact`·`/agents`·`/mcp` 등으로 세션을 빠르게 조작 | 높음 |
| **Plan mode** | `Shift+Tab` 또는 `/plan` — 읽기만 하고 계획만 세우는 모드(소스 미수정) | 큰 변경 전 안전하게 설계·검토 | 높음 |
| **Skills** | `SKILL.md`로 패키징한 재사용 절차(개인/프로젝트/플러그인 위치) | 반복 작업 자동화, CLAUDE.md보다 lazy-load되어 컨텍스트 절약 | 높음 |
| **Hooks** | 생명주기 이벤트(`PreToolUse`·`PostToolUse`·`SessionStart`·`UserPromptSubmit` 등)에 shell 명령 실행 | 자동 포맷·린트·권한검증·알림 등 결정론적 자동화 | 높음 |
| **Subagents** | `.claude/agents/<name>.md` — 독립 컨텍스트를 가진 전담 작업자 | 큰 탐색/검증을 격리해 메인 컨텍스트 보호 | 높음 |
| **MCP** | Model Context Protocol — GitHub·Jira·Slack·DB 등 외부 도구 표준 연결 | 복붙 없이 외부 시스템 직접 액세스 | 높음 |
| **Memory / CLAUDE.md** | 계층형 영구 지시(managed→user→project→local→nested) + 자동 메모리 | 팀 표준·개인 선호를 세션 간 기억 | 높음 |
| **Permissions** | Allow/Ask/Deny 규칙 + 권한 모드(default·acceptEdits·plan·bypassPermissions 등) | 도구 사용 통제·신뢰 못할 코드 격리 | 높음 |
| **@ 멘션 / 이미지 / Checkpoints** | `@파일`로 첨부, 스크린샷 입력, 편집 전 자동 스냅샷(`Esc` 2회 복원) | 맥락 첨부·UI 검증·안전한 되돌리기 | 높음 |

### 입문자용 비유
1. **"IDE 안의 페어 프로그래머"가 아니라 "터미널에 상주하는 시니어 동료"** — 파일을 직접 열어보고, 명령을 실행하고, 결과를 확인하며 일한다. 차이는 "내가 타이핑"이 아니라 "내가 위임·검토".
2. **기능 레이어 = 사무실 비유** — Skills=업무 매뉴얼, CLAUDE.md=사내 규정집, Hooks=자동 결재 규칙, Permissions=출입 권한, MCP=외부 거래처 직통 회선, Subagents=전담 인턴.

### 흔한 오해/주의점
- **"CLAUDE.md에 모든 걸 적으면 똑똑해진다"는 착각.** CLAUDE.md는 매 세션 컨텍스트에 상주하므로 길수록 토큰을 먹고 집중도가 떨어진다. 공식 권장은 **200줄 이하 + 구체적 지시**. 반복 절차는 lazy-load되는 Skills로 빼는 게 정석. `[높음]`

### forge 연결
- forge는 이 기능들 위에 얹은 워크플로우 — **18개 fg- 스킬(Skills)**, 상태바(`fg-statusline`=hooks/statusline), 도메인 에이전트 생성(`fg-agents`=Subagents), CLAUDE.md 스킬 목록 등록까지 Claude Code 네이티브 기능을 그대로 활용한다.

---

## 2. Harness Engineering (하네스 엔지니어링)

### 한 문장 정의
**Harness(하네스)란 LLM을 "실제로 일하는 에이전트"로 만들어 주는 둘러싼 실행 계층 — 모델을 반복 호출하고, 출력을 파싱해 도구를 실행하고, 결과를 다시 넣고, 컨텍스트·메모리·권한·상태를 관리하며 언제 멈출지 결정하는 루프와 스캐폴딩 전체**를 말한다. `[높음]`

### 출처 (다중)
- MongoDB Engineering Blog — *"The Agent Harness: Why the LLM Is the Smallest Part of Your Agent System"* (2026): https://www.mongodb.com/company/blog/technical/agent-harness-why-llm-is-smallest-part-of-your-agent-system
- Firecrawl — *"What Is an Agent Harness?"*: https://www.firecrawl.dev/blog/what-is-an-agent-harness
- `awesome-harness-engineering` (GitHub 큐레이션): https://github.com/ai-boost/awesome-harness-engineering
- arXiv 2603.05344 — *"Building AI Coding Agents for the Terminal: Scaffolding, Harness, Context Engineering, and Lessons Learned"*: https://arxiv.org/html/2603.05344v1
- Adnan Masood, *"Agent Harness Engineering — The Rise of the AI Control Plane"* (Medium)

### 정확한 인용구
- > "An agent harness is the scaffolding around an LLM that turns it into a working agent—the loop, tool calls, context management, memory, guardrails, and tracing." (다중 정의 종합) `[높음]`
- > **Scaffolding vs Harness 구분**: "Scaffolding is how agents are assembled *before* the first prompt arrives, while the harness is concerned with everything that happens *after*: dispatching tools, compacting context, enforcing safety invariants, and persisting state across turns." `[높음]`
- MongoDB 글 제목 자체가 테제: **"the LLM is the smallest part of your agent system."** `[높음]`

### 핵심 주장 3~5개
1. **에이전트 성능의 대부분은 모델이 아니라 하네스가 좌우한다.** 같은 모델도 하네스가 좋으면 훨씬 잘 작동한다 — "LLM은 가장 작은 부품".
2. **하네스의 구성요소**: 실행 루프(call→parse→execute→feed back→stop 판단), 도구 등록·디스패치, 컨텍스트 윈도우 관리/compaction, 메모리·상태 영속화, 안전·권한 가드레일, 트레이싱/관측성.
3. **하네스 엔지니어링 = 새로운 인프라 레이어(AI control plane).** 프롬프트 튜닝보다 이 계층을 설계하는 게 더 큰 레버리지.
4. **검증 루프(verification loop)와 에러 복구**가 하네스의 1급 책임 — 도구 실패·잘못된 출력을 어떻게 회복하느냐가 신뢰성을 만든다.
5. **상태 영속화**(checkpoints, 중간 출력, 멀티스텝 내 위치)가 있어야 긴 작업이 세션을 넘어 이어진다.

### 입문자용 비유
1. **F1 드라이버(LLM)와 레이싱카(하네스).** 아무리 뛰어난 드라이버여도 차·타이어·텔레메트리·피트크루가 형편없으면 못 이긴다. 우승은 차고(harness) 엔지니어링에서 갈린다.
2. **CPU(LLM) vs 메인보드·전원·냉각·OS(하네스).** CPU 하나만 책상에 둔다고 컴퓨터가 되지 않는다 — 둘러싼 시스템이 "쓸 수 있는 기계"를 만든다.

### 흔한 오해/주의점
- **"더 좋은 모델로 바꾸면 해결된다"는 착각.** 실무에서 에이전트가 헤매는 원인은 대부분 컨텍스트 관리·도구 디스패치·검증 루프 같은 하네스 결함이지 모델 IQ가 아니다. `[중간]`

### forge 연결
- forge 자체가 **Claude Code 위에 얹은 하네스** — `.forge/` 상태 계약(state contract), 4단계 루프, 무결성 헬스체크(`fg-doctor`)가 곧 "컨텍스트·상태·검증을 관리하는 하네스" 그 자체다.

---

## 3. Loop Engineering — Addy Osmani

### 한 문장 정의
**Loop Engineering이란 "에이전트에게 프롬프트를 입력하는 사람" 자리에서 스스로 물러나, 대신 에이전트를 작동시키는 자율 시스템(루프)을 설계하는 일**이다. `[높음]`

### 출처
- Addy Osmani, *"Loop Engineering"*, **2026-06-07** 발행: https://addyosmani.com/blog/loop-engineering/ (원문 직접 fetch)

### 핵심 테제 — 정확한 인용
- > **"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."** `[높음]` — ⚠️ **귀속 주의**: 이 문장은 Osmani 본인의 테제가 아니라 그가 글에서 **Peter Steinberger를 인용**한 것이다("Peter Steinberger recently said: …"). Osmani 본인의 정의는 바로 아래(↓). 슬라이드/문서에서 이 문장을 Osmani 테제로 단독 귀속하지 말 것.
- > "Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead." `[높음]`

### 프리미티브 (원문 정확 표기)
원문은 **5개 핵심 프리미티브 + State/Memory(여섯 번째 요소)**로 구성한다(각 원문 인용):
1. **Automations** — "Automations that go off on a schedule and do discovery and triage by themselves."
2. **Worktrees** — "Worktrees so two agents working in parallel don't step on each other."
3. **Skills** — "Skills to write down the project knowledge the agent would otherwise just guess."
4. **Plugins and Connectors** — "Plugins and connectors to plug the agent into the tools you already use."
5. **Sub-agents** — "Sub-agents so one of them has the idea and a different one checks it."
6. **State/Memory** — "A markdown file, or a Linear board, anything that lives outside the single conversation and holds what's done and what is next."

> ⚠️ **정확도 노트**: 의뢰서가 언급한 `/goal`·`/loop`는 원문에서 *별도의 in-session 명령*으로 등장한다 — `/goal`="runs iteratively until a verifiable stopping condition is met", `/loop`="re-runs on a cadence". 단, 원문이 이 둘을 위 "5개 core primitives"와 같은 급의 프리미티브로 **공식 열거하지는 않는다**(슬라이드에서 "프리미티브 7개"로 단정하면 부정확). `[높음]`
>
> 원문은 **L1/L2/L3 같은 번호 매긴 자율성 사다리를 명시적으로 열거하지 않는다.** 대신 한 구현 흐름(automations → triage skill → worktrees → sub-agents(draft+review) → connectors → state)을 예시로 보여줄 뿐이다. ("L1→L2→L3"는 forge의 프레이밍이지 Osmani 원문 용어가 아님 — 혼동 주의) `[높음]`

### 후반부 경고 (원문 인용)
- **Token Cost** — "Be careful about token costs (usage patterns can vary wildly if you are token rich or poor)."
- **Comprehension Debt(이해 부채)** — "The faster the loop ships code you didn't write, the bigger the gap between what exists and what you understand."
- **Cognitive Surrender(인지적 항복)** — 루프가 무인으로 돌 때 "stop having an opinion and just take whatever it gives back"하고 싶은 유혹.
- **Orchestration Tax(오케스트레이션 세금)** — 병렬 에이전트 수를 정하는 건 도구가 아니라 **당신의 리뷰 대역폭**이다.
- **Verification Responsibility** — "Your job is to ship code you confirmed works."

### 마무리 명언 (슬라이드 클로징용)
- > **"The agent forgets, the repo doesn't."**
- > **"The loop changes the work, it does not delete you from it."**
- > **"Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go."**

### 입문자용 비유
1. **공장 작업자 → 생산라인 설계자.** 예전엔 내가 컨베이어 앞에서 부품을 조립했다면(프롬프팅), 이제는 라인 전체를 설계하고 품질검사 스테이션을 어디 둘지 정하는 사람이 된다.
2. **요리사 → 주방 시스템 운영자.** 매번 직접 볶는 대신, 레시피(Skills)·재료 발주 자동화(Automations)·맛 검수 담당(Sub-agent checker)을 갖춘 주방을 설계한다. 단, "맛 최종 책임"은 여전히 내 몫.

### 흔한 오해/주의점
- **"루프를 만들면 내가 빠져도 된다"는 오해.** Osmani의 핵심 경고가 정확히 이 지점 — 루프는 검증 책임을 **없애는 게 아니라 증폭**시킨다. "press go"하는 사람이 아니라 "engineer로 남을" 설계를 하라. `[높음]`

### forge 연결
- forge는 Loop Engineering의 **직접 구현체**다. `fg-loop`이 `/goal`·`/loop`에 대응(verifiable stop condition + 유계 replan), State/Memory=`.forge/`, Sub-agent maker/checker=`fg-run`+`fg-adversarial-review`. forge README도 L1→L2→L3 자율성 사다리를 "loop engineering's report→assisted→unattended"로 명시 참조.

---

## 4. Compound Engineering (컴파운드/컴파운딩 엔지니어링)

### 한 문장 정의
**Compound Engineering이란 "각 작업 단위가 다음 작업을 더 쉽게 만들도록" 설계하는 방식 — 모든 PR·버그수정·코드리뷰를 일회성 이벤트가 아니라 시스템이 영구히 학습하는 자산으로 바꿔 복리로 쌓는 자기개선형 개발 시스템**이다. `[높음]`

### 출처/창시자
- **창시·대중화: Kieran Klaassen** (Every 산하 Cora의 GM). 공동 표기 "Kieran Klaassen, Claude, GPT".
- 원전 기사(개념 최초 정식화): Kieran Klaassen, *"My AI Had Already Fixed the Code Before I Saw It"*, Every (source-code), **2025-08-18** — https://every.to/source-code/my-ai-had-already-fixed-the-code-before-i-saw-it (여기선 "**compounding** engineering" 표기)
- 종합 가이드: *"Compound Engineering"*, Every Guides, **2026-01-17 발행 / 2026-05 업데이트** — https://every.to/guides/compound-engineering
- 보조: GenAI PM Wiki 개념 정리 https://genaipm.com/wiki/concepts/compound-engineering , Kieran Klaassen 튜토리얼(Claude Code plan/work/assess/triage 워크플로우)

> 📌 **용어 노트**: 원전(2025-08)은 **"compounding engineering"**, 이후 가이드(2026-01)는 **"compound engineering"**으로 정착. 두 표기 모두 같은 개념. `[높음]`

### 정확한 인용
- > **"The core philosophy of compound engineering is that each unit of engineering work should make subsequent units easier—not harder."** (Every 가이드) `[높음]`
- > "Instead of features adding complexity and fragility, they teach the system new capabilities. Bug fixes eliminate entire categories of future bugs." `[높음]`
- > **"Every time we fix something, the system learns. Every time we review something, the system learns. Every time we fail in an avoidable way, the system learns."** (원전 기사) `[높음]`
- 슬로건: **"Ship more value. Type less code."** / **"Plans are the new code."** `[높음]`

### 핵심 주장/실천 3~5개
1. **메모리를 가진 시스템.** PR이 시스템을 가르치고, 버그는 영구 교훈이 되고, 코드리뷰는 기본값(defaults)을 업데이트한다.
2. **실패→규칙 전환(failure-to-rule).** 버그가 나면 테스트 생성 + `CLAUDE.md`/`AGENTS.md` 규칙 갱신 + eval 추가로 같은 부류 재발을 차단.
3. **7단계 루프**: Ideate → Brainstorm → Plan → Work → Review → Polish → **Compound**(마지막에 학습을 시스템에 환원). `[높음]`
4. **계획 우선 + 병렬 전문 에이전트.** 구현 전 상세 계획("Plans are the new code"), 리뷰는 다중 전문 에이전트가 병렬로.
5. **50/50 규칙.** 절반은 기능 구현, 절반은 시스템(룰·문서·자동화) 개선에 투자 — 그래야 복리가 돈다.

### 입문자용 비유
1. **복리 이자.** 일반 개발=원금만 쓰는 단리(매번 같은 실수 반복). 컴파운드 엔지니어링=수익(학습)을 원금에 재투자 → 시간이 갈수록 같은 노력으로 더 많은 산출.
2. **근육 기억 vs 메모장.** 사람은 잊지만, 시스템은 한 번 배운 규칙을 `CLAUDE.md`에 적어두면 영원히 자동 적용한다 ("The agent forgets, the repo doesn't"와 통함).

### 흔한 오해/주의점
- **"AI에게 일을 많이 시키면 자동으로 복리가 된다"는 오해.** 복리는 **학습을 명시적으로 문서/룰로 환원하는 '마지막 Compound 단계'를 의식적으로 수행할 때만** 발생한다. 그 단계를 빼면 그냥 빠른 단리 개발일 뿐. `[중간]`

### forge 연결
- forge의 `fg-learn`이 정확히 "Compound 단계"다 — 실행 후 학습을 분류해 **CONTEXT.md·ADR·retro 로그로 승격**시킨다. README의 "**Docs are the loop's fuel, not its by-product**"가 복리 축적 사상의 한국어판 선언.

---

## 5. Claude Code Dynamic Workflow (동적 워크플로우)

### 한 문장 정의
**Dynamic Workflow란 Claude가 당신의 작업을 위해 직접 작성하는 JavaScript 오케스트레이션 스크립트로, 수십~수백 개의 서브에이전트를 한 세션 안에서 결정론적으로(스크립트가 흐름을 쥐고) 병렬 실행·교차검증하고, 백그라운드에서 돌아가는 동안 세션은 계속 응답 가능하다.** `[높음]`

### 출처 (공식 — 확정)
- 공식 블로그: *"Introducing dynamic workflows"*, Claude by Anthropic — https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
- 공식 문서: *"Orchestrate subagents at scale with dynamic workflows"* — https://code.claude.com/docs/en/workflows (원문 직접 fetch)
- 출시: **2026-05-28 리서치 프리뷰 → GA.** Opus 4.8 및 fast mode와 동시 발표. **v2.1.154+** 필요. CLI·Desktop·VS Code·API·Bedrock·Vertex AI·Microsoft Foundry. Max/Team/Enterprise 기본 활성, Pro는 `/config`에서 켬.
- 보조: InfoQ(2026-06), Trilogy AI, Pasquale Pillitteri 등

### 정확한 인용
- > **"A dynamic workflow is a JavaScript script that orchestrates subagents at scale. Claude writes the script for the task you describe, and a runtime executes it in the background while your session stays responsive."** `[높음]`
- > "fills the gap between firing off a single subagent and building out a full agent team" `[높음]`
- > "Work you'd normally plan in quarters now finishes in days." `[높음]`

### 일반 대화형 에이전트와의 차이 (공식 비교표 핵심)
| | Subagents | Skills | Agent teams | **Workflows** |
|---|---|---|---|---|
| 정체 | Claude가 띄우는 작업자 | Claude가 따르는 지시 | 리드가 동료 세션 감독 | **런타임이 실행하는 스크립트** |
| **다음에 뭘 할지 결정** | Claude가 매 턴 | Claude가 프롬프트대로 | 리드가 매 턴 | **스크립트가** |
| 중간 결과 위치 | Claude 컨텍스트 | Claude 컨텍스트 | 공유 작업목록 | **스크립트 변수** |
| 규모 | 턴당 소수 | 동일 | 소수의 장기 동료 | **런당 수십~수백** |

→ 핵심 차이: **"누가 계획을 쥐는가."** 대화형은 Claude가 매 턴 판단(컨텍스트에 중간 결과가 쌓임), 워크플로우는 **계획을 코드로 옮겨** 스크립트가 루프·분기·중간결과를 보관 → Claude 컨텍스트엔 **최종 답만** 남는다. `[높음]`

### 핵심 주장/특징 3~5개
1. **반복 가능한 품질 패턴을 코드화.** 단지 에이전트를 더 돌리는 게 아니라 — "have independent agents adversarially review each other's findings"(어드버서리얼 교차검증), 여러 각도로 계획 초안 후 비교 등 **신뢰성 패턴**을 스크립트에 박는다.
2. **fan-out / parallel / pipeline.** 수십~수백 병렬 fan-out, 단계별 파이프라인, 검증 게이트("Results are checked before they're folded in").
3. **동시성 한계(공식)**: **동시 최대 16개**(코어 적으면 더 적음), **런당 총 1,000개** 상한(폭주 방지).
4. **재개 가능(resumable)** — 같은 세션 내에서 완료된 에이전트는 캐시 결과 반환, 나머지만 live 재실행. 스크립트는 `~/.claude/projects/` 아래 저장돼 읽고·diff·수정·재실행 가능.
5. **트리거**: 프롬프트에 `ultracode` 키워드 또는 "use a workflow"; `/effort ultracode`로 세션 전체 자동 오케스트레이션. 번들 워크플로우 `/deep-research` 내장. `/workflows`로 진행 모니터링.

### 실증 사례 (슬라이드 임팩트용)
- > **Jarred Sumner가 Dynamic Workflow로 Bun을 Zig→Rust로 포팅: 기존 테스트 99.8% 통과, 약 750,000줄 Rust, 첫 커밋→머지 11일.** `[높음]`

### 입문자용 비유
1. **즉흥 회의(대화형) vs 작성된 작업지시서(워크플로우).** 대화형은 매 턴 "다음 뭐하지?"를 즉석에서 정하는 회의. 워크플로우는 **공정표를 미리 코드로 써두고** 그대로 자동 집행 — 같은 공정을 다음에도 그대로 재실행.
2. **1인 셰프 vs 표준 레시피로 돌아가는 중앙주방.** 한 명(서브에이전트 하나)이 아니라, 표준 스크립트로 수백 스테이션이 동시에 돌고 검수까지 자동인 주방.

### 흔한 오해/주의점
- **"많이 돌리니까 무조건 좋다"는 오해 → 토큰 비용.** 공식 문서가 명시: 한 번 실행이 같은 작업을 대화로 하는 것보다 **훨씬 많은 토큰**을 쓰며 플랜 사용량/레이트리밋에 잡힌다. 큰 작업 전 **작은 슬라이스로 비용 가늠** 권장. `[높음]`

### forge 연결
- forge의 `fg-run`이 정련된 계획(`.forge/plan.md`/backlog)을 **Claude Code Dynamic Workflow로 실행**한다. `fg-adversarial-review`는 6개 렌즈(실패지점·숨은가정·요구오독·보안성능데이터·오용·약한결정)를 **parallel subagent로 fan-out**하는 워크플로우 — 공식 "adversarial review" 패턴의 forge판.

---

## 6. Grilling / grill-with-docs (Matt Pocock)

### 한 문장 정의
**Grilling(그릴링)이란 한 번에 한 질문씩 집요하게 심문(relentless interview)하며 계획·설계를 프로젝트의 도메인 모델(용어·결정)에 대고 날카롭게 다듬고, 그 과정에서 나온 결정을 즉석에서 ADR과 용어집(glossary)으로 기록하는 계획 기법**이다. `[높음]`

### 출처
- Matt Pocock, `skills` 저장소 — `skills/engineering/grill-with-docs/SKILL.md`: https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs (원본 직접 fetch)
- 위임 대상 스킬: `skills/engineering/domain-modeling/SKILL.md` (전문 직접 fetch)

### 정확한 인용 (원문)
- grill-with-docs `description`: > **"A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go."** `[높음]`
- 본문 전체: > **"Run a `/grilling` session, using the `/domain-modeling` skill."** `[높음]`

> ⚠️ **정확도 노트**: `grill-with-docs/SKILL.md`는 **얇은 래퍼**다 — 실제 심문 기법의 본체는 `/grilling` 명령과 `domain-modeling` 스킬에 있다. "한 질문씩"이라는 표현은 `domain-modeling`의 기법들(아래)에서 도출되며, SKILL.md 자체가 "one question at a time"을 문자 그대로 명시하진 않는다. `/grilling` 명령 본문은 이번에 fetch하지 못함 → 그 부분 `[확인 안 됨]`. `[중간]`

### domain-modeling이 규정하는 "심문" 기법 (원문 — 왜 효과적인가의 실체)
1. **Challenge against the glossary** — 사용자가 기존 용어집과 충돌하는 단어를 쓰면 즉시 지적: *"Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"*
2. **Sharpen fuzzy language** — 모호/과적재 용어를 정확한 표준어로: *"You're saying 'account' — do you mean the Customer or the User?"*
3. **Discuss concrete scenarios** — 엣지케이스 시나리오를 발명해 경계를 강제로 정밀화.
4. **Cross-reference with code** — 말과 코드가 어긋나면 표면화: *"Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"*
5. **Update CONTEXT.md inline** — 용어가 확정되는 즉시 기록(배치 금지). CONTEXT.md는 **순수 용어집**(구현 세부 금지).
6. **Offer ADRs sparingly** — ① 되돌리기 어렵고 ② 맥락 없이는 의아하고 ③ 진짜 트레이드오프의 결과 — 셋 다일 때만 ADR 제안.

### 핵심 주장 (왜 효과적인가)
1. **모호함을 코드 이전에 제거한다.** 가장 비싼 버그는 "서로 다른 걸 같은 단어로 부른" 데서 나온다 — 심문이 이를 계획 단계에서 죽인다.
2. **한 번에 한 질문**이라 사용자가 도망갈 수 없다 — 추상적 동의가 아니라 구체적 결정을 강제.
3. **결정이 휘발되지 않는다.** 그릴링의 산출물이 그대로 ADR·용어집 → 다음 작업의 컨텍스트가 됨(컴파운드 엔지니어링과 직결).
4. **코드와의 대조**로 "계획과 현실의 괴리"를 조기 발견.

### 입문자용 비유
1. **변호사의 반대신문(cross-examination).** "대충 그렇다"를 용납하지 않고 한 질문씩 파고들어 모순을 드러낸다 — 증언(계획)이 단단해질 때까지.
2. **세관 검색대.** 모든 용어가 "신고 내용(도메인 모델)과 일치하는가"를 한 건씩 통과시킨다. 애매한 건 통과 못 함.

### 흔한 오해/주의점
- **"그릴링은 트집/시간낭비"라는 오해.** 목적은 사람을 곤란하게 하는 게 아니라 **싼 단계(대화)에서 비싼 모호함을 제거**하는 것. 단, 사소한 작업엔 과함 — forge도 trivial 작업은 `fg-quick`으로 가볍게 우회한다. `[중간]`

### forge 연결
- forge의 **`fg-ask`가 grill-with-docs의 forge판**이다 — 계획을 도메인 모델·ADR에 대고 그릴링하고 CONTEXT.md/ADR을 인라인 생성. forge README가 "**grilling-driven planning**"을 두 기둥 중 하나로 명시. (단 forge 그릴링은 Dynamic Workflow 밖 대화로만 수행 — "워크플로우는 실행 중 사용자 입력을 못 받으므로".)

---

## 7. Agents / Subagents (Claude Code)

### 한 문장 정의
**Subagent란 Claude가 특정 작업을 위임하는, 독립된 컨텍스트 윈도우·권한·지시를 가진 전담 작업자로 — 무거운 탐색이나 검증을 메인 세션과 격리해 처리하고 결과 요약만 돌려줌으로써 메인 컨텍스트를 깨끗하게 보호한다.** `[높음]`

### 출처
- 공식 문서: https://code.claude.com/docs/en/sub-agents.md , https://code.claude.com/docs/en/agents (Run agents in parallel)
- 정의/설정 `[높음]`. maker/checker·자기채점 금지는 공식 워크플로우 문서의 "adversarial review" 서술로 뒷받침 `[중간~높음]`.

### 핵심 특징 3~5개
1. **독립 컨텍스트 윈도우.** 메인 대화 히스토리를 로드하지 않음 → 큰 탐색 로그가 메인을 오염시키지 않고, **결과 요약만** 메인으로 반환.
2. **역할 카드 = `.claude/agents/<name>.md`.** YAML frontmatter 필드:
   - `description` (필수): **"when to use"** — Claude가 언제 이 에이전트를 위임할지 판단하는 근거.
   - `tools` / `disallowedTools`: 사용 가능/금지 도구 제한(예: checker는 Read·Grep만).
   - `model`: 에이전트별 모델 오버라이드. `skills`·`mcpServers`도 지정 가능.
3. **`agentType`으로 호출.** 메인이 작업을 위임할 때 커스텀 에이전트 타입을 지정(예: `Explore`, `code-reviewer`). 워크플로우에서도 `agentType` 옵션으로 특정 역할 dispatch.
4. **병렬 실행.** 독립 작업을 한 번에 여러 에이전트로 fan-out — 탐색/리뷰를 동시에.
5. **내장 에이전트**: `Explore`(읽기 전용 탐색, CLAUDE.md 미로드로 컨텍스트 절약), `Plan`(계획 전용, 편집 불가), `general-purpose`(전 도구).

### Maker/Checker 분리 & "자기 채점 금지"
- **패턴**: 만드는 에이전트(maker: Edit·Write·Bash)와 검증하는 에이전트(checker: Read·Grep만, 종종 다른 모델/관점)를 **분리**.
- **왜 자기 자신을 채점하지 않게 하나**: 같은 에이전트가 코드를 짜고 스스로 검증하면 **자기 결정을 정당화하는 편향**이 생긴다. 독립된 checker가 "refute(반증)" 자세로 보면 maker가 놓친 실패모드를 잡는다. 공식 워크플로우 문서도 "**other agents try to refute what they found**" / "independent agents adversarially review each other's findings"로 이 원리를 명문화. `[중간]` (자기채점 편향의 메커니즘 설명은 추론, 패턴 자체는 공식 문서 근거)

### 입문자용 비유
1. **작가와 편집자는 같은 사람이면 안 된다.** 자기 글의 오타는 안 보인다 — 다른 눈(checker)이 봐야 잡힌다.
2. **인턴에게 조사 위임.** "이 라이브러리 다 조사해 와"를 인턴(Explore subagent)에게 시키면, 내 책상(메인 컨텍스트)엔 산더미 자료가 아니라 **한 장 요약**만 올라온다.

### 흔한 오해/주의점
- **"서브에이전트는 메인 대화를 다 안다"는 오해.** 정반대다 — **독립 컨텍스트**라 메인이 명시적으로 넘긴 정보만 안다. 그래서 위임 프롬프트에 필요한 맥락을 충분히 담아야 하고, 결과는 "요약"으로 받는다는 전제로 설계해야 한다. `[높음]`

### forge 연결
- forge의 **`fg-agents`가 프로젝트 도메인 역할을 `.claude/agents/<role>.md`로 생성**하고, 각 `description`에 "when to use"를 담아 `fg-run`이 나중에 `agentType`으로 매칭 dispatch한다. (주의: 카드는 세션 시작 때만 로드 → 생성 후 **세션 재시작 필요** — ADR-0024.) maker/checker 분리는 `fg-run`(maker) + `fg-adversarial-review`(checker, 반증 자세)로 구현.

---

## 부록 A. 7개 개념 한눈에 (슬라이드 1장 요약용)

| # | 개념 | 한 줄 | 창시/출처 | forge 대응 |
|---|------|-------|-----------|-----------|
| 1 | Claude Code 기능 | 터미널 상주 AI 코딩 에이전트의 핵심 도구상자 | Anthropic 공식문서 | 18개 fg- 스킬 전체 |
| 2 | Harness Engineering | LLM을 일하는 에이전트로 만드는 둘러싼 실행계층 | MongoDB/Firecrawl/arXiv (2026) | `.forge/` 상태계약+`fg-doctor` |
| 3 | Loop Engineering | 프롬프터에서 물러나 루프를 설계하라 | Addy Osmani (2026-06-07) | `fg-loop`, L1→L2→L3 |
| 4 | Compound Engineering | 각 작업이 다음을 더 쉽게 — 학습의 복리 | Kieran Klaassen/Every (2025-08~) | `fg-learn`(Compound 단계) |
| 5 | Dynamic Workflow | Claude가 쓴 JS 스크립트로 서브에이전트 수백 개 오케스트레이션 | Anthropic 공식 (2026-05-28) | `fg-run`, `fg-adversarial-review` |
| 6 | Grilling | 한 질문씩 심문해 계획을 도메인모델에 대고 다듬기 | Matt Pocock skills | `fg-ask` |
| 7 | Subagents | 독립 컨텍스트 전담 작업자 + maker/checker 분리 | Anthropic 공식 | `fg-agents` |

## 부록 B. 개념 간 관계 (발표 스토리라인)

```
Harness Engineering (2: 바탕 사상 — 모델이 아니라 둘러싼 시스템이 핵심)
        │
        ├─ Claude Code (1: 그 하네스의 구체적 제품)
        │       ├─ Subagents (7: 작업자)
        │       ├─ Dynamic Workflow (5: 작업자들을 코드로 오케스트레이션)
        │       └─ Skills/Hooks/Memory/MCP (1: 구성 도구)
        │
        ├─ Loop Engineering (3: 사람의 역할 전환 — 프롬프터→루프 설계자)
        │       └─ Grilling (6: 루프에 넣기 전 계획을 단단히)
        │
        └─ Compound Engineering (4: 루프가 학습을 복리로 쌓게 하는 규율)
                                    ↑
                              forge = 위 전부를 한국어 워크플로우로 묶은 구현체
```

흐름 요약: **하네스(2)라는 사상** → 그 구현인 **Claude Code(1)** 와 그 안의 **서브에이전트(7)·동적 워크플로우(5)** → 사람은 **루프 설계자(3)** 로 올라서고, 루프에 넣기 전 **그릴링(6)** 으로 계획을 벼리고, 루프가 도는 동안 **컴파운드(4)** 로 학습을 복리로 쌓는다. **forge**는 이 전체를 18개 스킬로 엮은 한 구현.

---

## 부록 C. 정확도/미확인 항목 (정직 표기)

- `[확인 안 됨]` Matt Pocock의 `/grilling` **명령 본문 원문** — SKILL.md가 위임만 하고 본문은 별도 위치, 이번에 미확보. "한 질문씩"은 `domain-modeling` 기법에서 도출한 합리적 정리.
- `[중간]` Subagent "자기 채점 금지"의 **편향 메커니즘 설명** — 패턴·"adversarial review"는 공식 근거, 인지편향 설명은 추론.
- `[높음] 정정` Dynamic Workflow는 **공식 기능** (2026-05-28, v2.1.154+). 사전 보조검증의 "공식 용어 아님" 판정은 **틀렸음**, 공식 블로그·문서로 반증 완료.
- `[높음]` Loop Engineering 프리미티브는 원문상 **"5 core + State/Memory"** 구조 — `/goal`·`/loop`는 별도 명령이지 동급 프리미티브 열거 아님. L1/L2/L3는 forge 프레이밍이지 Osmani 원문 용어 아님.
- `[높음]` Compound Engineering 표기: 원전(2025-08) "compounding", 가이드(2026-01) "compound" — 동일 개념.
