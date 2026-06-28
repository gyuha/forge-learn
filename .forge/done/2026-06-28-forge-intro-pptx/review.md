<!-- forge-slug: forge-intro-pptx -->
# 적대적 리뷰 — Claude Code 기초 + forge 입문 교육용 pptx

**판정: 확정 8건 (critical 1 · major 0 · minor 7) · fix-needed 6 · 회의론자 반증으로 탈락 20.**
6렌즈 병렬 fan-out(34개 서브에이전트) 후 각 발견을 독립 회의론자가 반증 검증. 원시 28건 중 20건이 "계획·research 오독" 또는 "정상 범위를 결함으로 과장"으로 탈락. 시각 QA(오버플로·대비·이미지)는 run.md에서 이미 수행됨 — 본 리뷰는 내용·사실·논리·교육효과·요구일치 공격에 집중.

> 리뷰 대상: 활성 슬롯 `run.md`(forge-intro-pptx), 산출물 `forge-입문-발표.pptx`(44장), 슬라이드 데이터 `deck-build/content.js`, 사실 기준 `.forge/research-findings.md`.

---

## 렌즈 4 — 사실 무결성

### [CRITICAL · fix-needed] F-1. 발표 핵심 인용구가 엉뚱한 사람에게 귀속됨 — Osmani가 아니라 Peter Steinberger
- **위치**: 슬라이드 17 (content.js 165-167), cover 부제(11)·노트(20)도 이 인용에 발표 축을 검.
- **증거**: 슬라이드 17은 *"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."* 를 메인 인용으로 띄우고 *"— Addy Osmani, Loop Engineering (2026-06-07)"* 로 귀속. 그러나 Osmani 블로그 원문(서브에이전트가 직접 fetch, 반증자도 재확인)은 이 문장을 **"Peter Steinberger recently said: '...'"** 로 — 즉 Osmani가 Steinberger를 *인용한* 것. research-findings.md line 96도 이를 Osmani의 '핵심 테제 [높음]'으로 잘못 표기했고 덱이 상속.
- **왜 critical**: 덱의 헤드라인 인용이자 발표 부제의 근거. Loop Engineering 글을 읽은 청중 한 명이면 발표자 신뢰도가 그 자리에서 붕괴.
- **제안 수정**: (안1) Steinberger에게 귀속하고 "Osmani가 Loop Engineering에서 인용"으로 맥락 표기. (안2) Osmani 본인 정의 문장 *"Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead."* (research line 97, [높음])로 교체하고 Osmani 귀속 유지. 노트(167)의 "근거: Osmani 원문 직접 인용"도 함께 수정.
- **연쇄**: research-findings.md line 96도 함께 고쳐야 향후 재빌드 시 재상속 안 됨.

### [minor · fix-needed] F-6. 클로징 표어 "The model forgets, the repo doesn't" — 원문은 'model'이 아니라 'agent'
- **위치**: 슬라이드 43 (content.js 410), 노트(82).
- **증거**: '기억할 세 문장' 첫 줄을 영어 verbatim으로 Osmani 귀속해 화면에 박음. 원문은 **"The agent forgets; the repo doesn't."** research line 120도 'model'로 오기 → 상속. verbatim 인용 슬라이드에서 단어가 바뀌면 원문 아는 청중에겐 날조로 비침.
- **제안 수정**: 영어 따옴표를 'agent'로 교정(한국어 본문 '모델은 잊어도 저장소는 기억'은 무방). research line 120도 함께.

### [minor · fix-needed] F-7. maker/checker '자기채점 편향' 메커니즘을 단정 — research는 [중간](추론)으로 명시
- **위치**: 슬라이드 19 노트 (content.js 272).
- **증거**: 노트가 "같은 에이전트가 짜고 스스로 검증하면 자기 결정을 정당화하는 편향이 생깁니다"를 헤지 없이 단정. research line 284·335는 "패턴·adversarial review는 공식 근거([높음]), 인지편향 설명은 추론([중간])"으로 분리 태깅. 덱의 다른 정확도 게이트와 달리 이 [중간] 항목엔 단서가 없어 발표자가 추론을 공식 사실로 발화하도록 유도. (화면 본문 sub는 결과만 기술해 정확 — 오류는 노트 한 줄.)
- **제안 수정**: 노트에 한 줄 추가 — "패턴/adversarial review는 [높음]이나 편향 *메커니즘*은 추론([중간]); '편향이 생길 수 있다' 정도로 말할 것."

---

## 렌즈 1 — 실패 지점

### [minor · fix-needed] F-2. 슬라이드 2 "프롬프트 다듬는 시대는 저물고 있다" — 출처 없는 과일반화
- **위치**: 슬라이드 2 sub (content.js 15-20).
- **증거**: research 어디에도 "프롬프트 엔지니어링이 저물고 있다"는 출처 없음. 가장 가까운 Osmani 인용은 "프롬프팅의 *주체*가 사람→루프로 이동"이지 "프롬프트 품질이 무의미"가 아님. 같은 덱이 후속에서 그릴링·컨텍스트 관리·정교한 지시 설계를 강조 → 자기모순. plan line 19가 "research를 사실 기준으로" 못박았으므로 출처 없는 단정은 자기 기준 위반. (반증자 주: '청중 닻 없음' 논거는 탈락 — 노트가 흔들 통념을 명시함. 그러나 '출처 없는 과장'은 성립.)
- **제안 수정**: sub를 출처 범위로 축소 — "프롬프트 한 줄을 다듬는 것만으로 생산성이 갈리는 시대는 지나가고 있습니다" 또는 Osmani 프레이밍 그대로.

### [minor · fix-needed] F-3. F1 비유(슬라이드 13)가 다음 슬라이드 14('모델 바꿔도 안 풀린다')와 프레임 충돌
- **위치**: 슬라이드 13 (132-137) ↔ 슬라이드 14 (152-160).
- **증거**: F1은 "같은 차여도 드라이버 기량으로 우승이 갈린다"는 대중적 평판이 강함 → 슬라이드 14의 "LLM(드라이버)은 가장 작은 부품" 테제와 충돌. "더 좋은 드라이버로 바꾸면 되지 않나"는 질문에 마찰. (반증자 주: 두 슬라이드 모두 헤지 표현이고 노트 137에 사전 방어 라인이 있어 major는 과장 → minor. research도 드라이버 변수를 봉합하진 않음.)
- **제안 수정**: (안1) research가 동급 제시한 CPU 비유로 교체. (안2) 슬라이드 13 sub/노트에 "드라이버 기량도 변수지만 통제 가능한 레버리지는 차고 쪽이 크다" 단서 명시.

---

## 렌즈 3 — 요구 오독

### [minor · fix-needed] F-5. 수렴점 매핑 슬라이드 본문에서 'L1→L2→L3 = forge 프레이밍' 한정자 누락 (정확도 게이트 ② 약화)
- **위치**: 슬라이드 38 mapping 본문 셀 (content.js 361).
- **증거**: plan 매핑표(line 35)는 본문에 "L1→L2→L3(forge 프레이밍)" 한정자를 인라인으로 박음. 덱 slide 38 본문 셀은 "fg-loop · 신뢰 사다리 L1→L2→L3" — 한정자가 빠지고 'L1→L2→L3'가 Osmani 개념 '루프 엔지니어링' 옆 칸에 붙음. 한정자는 노트(367)에만. 같은 덱 slide 18·40은 본문에 한정자 유지 → slide 38만 불일치. 수렴점 요약 슬라이드라 오독 위험 최대. (반증자 주: 노트에 보존돼 있고 레드라인 "Osmani가 정의했다고 쓰지 말 것"의 literal 위반은 아니므로 major→minor. 일관성 손질 수준.)
- **제안 수정**: 본문 셀을 plan 매핑표와 동일하게 "fg-loop · 신뢰 사다리 L1→L2→L3(forge 프레이밍)"으로 통일.

---

## 렌즈 2 — 숨은 가정

### [minor · 수용/선택] F-4. 입문자 미정의 용어 — 특히 '저-divergence'(slide 38)
- **위치**: 슬라이드 38 (content.js 374); 부수적으로 'eval'(slide 26, 206).
- **증거**: "건너뛰기는 저-divergence에서만"의 '저-divergence'는 덱 전체 1회 등장, 본문·노트·research 어디에도 정의 없음(grep 확인). forge 내부 jargon을 입문자 본문에 무정의 노출 — '무엇으로부터의 발산'인지 슬라이드만으로 불명. (반증자 주: 'PR'은 입문자도 알고, 'eval'은 research 충실+문맥상 가독이라 약함. '저-divergence' 하나만 실재 결함.)
- **제안 수정**: '저-divergence' → "계획과 실제 결과의 차이가 작을 때만" 등으로 풀어쓰기. (fix-needed=false: 발표 신뢰도 붕괴는 아님, 명료성 다듬기.)

---

## 렌즈 6 — 약한 결정

### [minor · 수용/선택] F-8. recap 슬라이드 노트의 '1:1 대응' 표현 ≠ 실제 다대다 매핑
- **위치**: 슬라이드 31 노트 (content.js 322).
- **증거**: 노트가 "세 메커니즘이 forge 스킬로 1:1 대응"이라 지시하나, 같은 슬라이드 본문은 "에이전트 → fg-agents + fg-run/fg-adversarial-review"(1:3)로 다대다. plan·research 매핑표도 다대다. 발표자가 노트대로 "1:1"이라 발화하면 화면과 모순. (화면 본문은 정확 — 오류는 노트 한 단어.)
- **제안 수정**: 노트의 "1:1 대응"을 "대응(일부는 한 개념이 여러 스킬로 갈라짐)"으로 완화. 본문 불변. (fix-needed=false.)

---

## 반증으로 탈락한 주요 발견 (20건 중 발췌 — 리뷰의 엄정성 기록)
- **Bun 포팅 통계(99.8%/75만 줄/11일)가 검증 불가** → 탈락: research [높음]·1차 출처(Anthropic 블로그+공식문서)에 충실, "통계 틀리면 게이트 ①까지 붕괴"는 일화와 기능-존재 주장 간 거짓 결합.
- **타이밍 초과 위험(58분+)** → 탈락: 50~60분 범위 안이고, "노트 1.4배 즉흥 부연" 가정이 plan의 "노트=풀 대본" 설계를 이중계상.
- **'ADR' 미정의** → 탈락: 'ADR·용어집'/'결정을 ADR로' 문맥이 사실상 정의, 매핑 슬라이드 재등장 주장은 날조, 뒤 슬라이드가 의존 안 함.
- **미래 날짜·v2.1.154+ 단정 위험** → 탈락: plan이 정정 3건으로 "본문·노트에 정확히 반영"을 *명령*. 계획 준수를 결함으로 오인.
- **영어 인용 번역 없음** → 탈락: research가 "인용구는 원문 유지" 명시 허용, Non-goals의 '병기 금지'와 무관, 발표자 노트가 한국어 해설 제공.

---

## 라우팅 권고
- **코드(산출물) 결함 → fix-forward 1건**: F-1(critical) + F-2·F-3·F-5·F-6·F-7. content.js 6곳 수정 + research-findings.md 2곳(line 96·120) 수정 + 덱 재빌드. (사람 승인 후 backlog 플랜 생성.)
- **수용/선택 → review.md 잔류(회고 연료)**: F-4·F-8 (fix-needed=false). fix-forward에 끼워 같이 처리해도 저비용.
- **설계/요구 결함**: 없음 — 계획 자체는 건전. (fg-ask 재그릴링 불필요.)
