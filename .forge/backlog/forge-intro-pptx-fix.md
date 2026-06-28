<!-- forge-slug: forge-intro-pptx-fix -->
<!-- task: 2 -->
<!-- tdd: off -->
<!-- generated-by: fg-adversarial-review -->
# forge 입문 pptx — 적대적 리뷰 fix-forward (8건 수정 + 재빌드)

## Goal / Non-goals
- **Goal**: 적대적 리뷰(.forge/review.md)에서 확정된 8건(critical 1 + minor 7)을 수정하고 덱을 재빌드한다. 사실 오류는 산출물(content.js)과 **사실 기준 문서(research-findings.md) 양쪽**을 고쳐 향후 재빌드 시 재상속을 막는다.
- **Non-goals**: 새 슬라이드 추가·구조 변경·디자인 변경 없음. 시각 QA 재수행 없음(라인 텍스트 수정만이라 레이아웃 영향 미미 — 단 재빌드 후 해당 슬라이드만 스폿 렌더 확인). 반증으로 탈락한 20건은 손대지 않음.

## Source of truth
- **수정 근거**: `.forge/review.md` (확정 8건의 위치·증거·제안수정).
- **사실 기준**: `.forge/research-findings.md` — F-1·F-6은 이 문서의 오류가 덱에 상속된 것이라 **이 문서도 함께 수정**.
- **빌드 자산**: `/private/tmp/claude-501/-Users-gyuha-workspace-forge-learn/e38e0731-a85b-44ce-aaad-2a5195b32b70/scratchpad/deck-build/` — `content.js`(슬라이드 데이터), `build.js`(pptxgenjs 빌드), `img/*.png`, `node_modules/`. 산출물: `/Users/gyuha/workspace/forge-learn/forge-입문-발표.pptx`. (스크래치패드가 비워졌으면 content.js를 review.md 기준으로 재구성해야 함 — 실행 시 존재 먼저 확인.)

## Work slices

### S1. content.js 8곳 수정 (라인은 현재 content.js 기준, 실행 시 문맥으로 재확인)
- [ ] **F-1 (critical)** 슬라이드 17 루프엔지니어링 image-quote(`quote` 줄, ~165) — 메인 인용을 **Osmani 본인 정의문**으로 교체: `"Loop engineering is replacing yourself as the person who prompts the agent.\nYou design the system that does it instead."` `sub`(~166)는 `— Addy Osmani, "Loop Engineering" (2026-06-07)` 유지(이제 정확). `notes`(167)의 "근거: Osmani 원문 직접 인용"은 유지 가능(실제 Osmani 문장이므로). — *사유: 기존 인용문은 Osmani가 Peter Steinberger를 인용한 것이라 Osmani 테제로 표기 불가.*
- [ ] **F-6** 슬라이드 43 quotes(~410) — `{ q: "The model forgets, the repo doesn't.", ... }`의 `model` → **`agent`** (`"The agent forgets, the repo doesn't."`). 한국어 본문/노트는 무방.
- [ ] **F-7** 슬라이드 19 maker/checker `notes`(~272) — "자기 결정을 정당화하는 편향이 생깁니다"를 헤지하고 한 줄 추가: *"패턴·adversarial review는 공식 근거([높음])지만 자기채점 편향의 인지 메커니즘은 추론([중간]) — '편향이 생길 수 있다' 정도로 말할 것."* (본문 sub는 정확하므로 불변.)
- [ ] **F-2** 슬라이드 2 statement `sub`(~18) — "프롬프트 한 줄을 다듬는 시대는 빠르게 저물고 있습니다." → **"프롬프트 한 줄을 다듬는 것만으로 생산성이 갈리는 시대는 지나가고 있습니다."** (출처 범위로 축소.)
- [ ] **F-3** 슬라이드 13 F1 image-quote(`sub` ~136 또는 `notes` ~137) — 단서 한 줄 추가: *"드라이버 기량(모델)도 변수지만, 같은 드라이버라도 차고(하네스)가 형편없으면 못 이긴다 — 우리가 통제 가능한 레버리지는 차고 쪽이 더 크다."* (슬라이드 14와의 프레임 충돌 사전 봉합. 이미지·비유 자체는 유지.)
- [ ] **F-5** 슬라이드 38 mapping 본문 셀(~361) — `f: "fg-loop · 신뢰 사다리 L1→L2→L3"` → **`f: "fg-loop · 신뢰 사다리 L1→L2→L3(forge 프레이밍)"`** (slide 18·40과 표기 통일, 정정 게이트 ② 강화.)
- [ ] **F-4 (선택)** 슬라이드 38 "forge의 강점" lead 포인트(~374) — "건너뛰기는 저-divergence에서만" → **"건너뛰기는 계획과 실제 결과의 차이가 작을 때만"** (입문자 미정의 내부용어 풀어쓰기.)
- [ ] **F-8 (선택)** 슬라이드 31 recap `notes`(~322) — "세 메커니즘이 forge 스킬로 **1:1 대응**" → **"forge 스킬로 대응(일부는 한 개념이 여러 스킬로 갈라짐)"** (본문 다대다와 정합. 본문 불변.)
- 완료 기준: 위 8개 변경이 content.js에 반영되고, 변경 외 라인은 불변(surgical).

### S2. research-findings.md 2곳 수정 (재상속 차단) — depends: 없음, S1과 병행 가능
- [ ] **F-1 근거** line 96 — "핵심 테제 — 정확한 인용 [높음]" 아래 Steinberger 문장이 Osmani 테제로 표기됨. **이 문장은 Osmani가 Peter Steinberger를 인용한 것**임을 명기하고, Osmani 본인 정의는 line 97임을 분명히. (line 132 forge 연결의 동일 인용도 점검.)
- [ ] **F-6 근거** line 120 — "마무리 명언"의 `"The model forgets, the repo doesn't."` → **`"The agent forgets, the repo doesn't."`** (원문 단어 교정.)
- 완료 기준: research-findings.md의 두 사실 오류가 교정되어, 향후 덱 재빌드가 올바른 사실을 상속한다.

### S3. 덱 재빌드 + 스폿 검증 — depends: S1
- [ ] `deck-build/`에서 `node build.js`로 `forge-입문-발표.pptx` 재생성.
- [ ] python-pptx로 슬라이드 수(44 유지)·전 슬라이드 노트 존재 재확인.
- [ ] 수정한 슬라이드(2·13·17·19·31·38·43)만 렌더(또는 텍스트 추출)해 변경 반영·오버플로 없음 확인. 라인 텍스트 길이가 기존과 비슷하므로 레이아웃 영향은 경미.
- 완료 기준: 재빌드된 pptx가 PowerPoint에서 정상 열리고, 8건 수정이 모두 반영되며, 44장·전 노트 유지, 수정 슬라이드에 오버플로/깨짐 없음.
