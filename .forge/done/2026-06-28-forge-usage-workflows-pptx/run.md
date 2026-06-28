<!-- forge-slug: forge-usage-workflows-pptx -->
# 실행 노트 — forge 사용법·유형별 워크플로우 안내 PPTX 제작

> 32장 한국어 발표자료. README.ko.md + docs/*.md 기준, 상황별 워크플로우 중심, codex-image 이미지 10장, 전 슬라이드 상세 발표자 노트.

## 산출물
- `/Users/gyuha/workspace/forge-learn/forge-사용법-워크플로우.pptx` — 32장, 약 19.5MB. python-pptx 빌드 + 발표자 노트.
- 빌드 자산: `forge-usage-workflows-assets/content.py`(슬라이드 데이터), `build.py`(렌더러), `images/*.png`(codex-image 10장), `outline.md`, `render/*.jpg`(렌더 검수용).

## 계획대로 된 것
- 32장(30~35 범위 내) · 노트 32/32 비어있지 않음 · notesSlides 32 · 미디어 10장.
- README의 7개 상황(셋업/일상/사소한/무인/재진입/마무리/유지보수) 전부 + 설치 1장 + 신뢰 사다리(L1/L2/L3) + 상태 흐름 2장 + 치트시트 2장 + 흔한 실수 + 출처.
- 명령 표기 /fg-* 기본, 표기/전제 슬라이드에 /forge:fg-* 환경 병기 안내.
- 배경 이론(Claude Code 기초·Loop Engineering 강의) 제외, 한 줄 정의만 허용 원칙 준수.
- 이미지 안에 명령어/텍스트 없음(프롬프트로 금지) — 명령·상태명·화살표는 전부 PPTX 텍스트/도형 레이어.
- 온스크린 영문 run은 전부 합법적(설치 명령 /plugin marketplace add, 파일명 run.md/plan.md, github URL, 스킬 경로 docs/skills.md) — 한국어화 대상 아님.

## 계획과 달랐던 것 (divergence)
1. **pptxgenjs → python-pptx 전환.** `npm install pptxgenjs`가 외부 패키지 설치로 권한 게이트(Code from External)에서 거부됨. 우회 설치하지 않고, 이미 설치된 python-pptx + 발표자 노트 API(notes_slide.notes_text_frame)로 빌드 방식 변경. 발표자 노트 지원을 python-pptx가 기본 제공함을 확인해 Open XML 수동 주입은 불필요했음. 산출물 요구사항(노트 포함)은 동일하게 충족.
2. **codex-image 일괄 생성 타임아웃.** 10장을 한 codex exec 호출로 묶었더니 590초 제한에서 타임아웃. 같은 요구사항(codex-image)의 실행 단위를 1장씩으로 쪼개 재시도해 해결 — 다른 이미지 생성기로 우회하지 않음(계획 합의 준수).
3. **PowerPoint AppleScript PDF 저장 경로.** `save ... in "문자열경로"`가 PowerPoint 컨테이너 내부에 써서 파일이 홈/작업경로에 안 생김. `in POSIX file`로 지정 + 홈 디렉토리 출력으로 해결. 이전 forge-입문 작업의 "앱 재기동 전 옛 문서 렌더" 교훈대로 매 렌더 전 PowerPoint quit 후 새 pptx를 /tmp로 복사해 오픈.
4. **비전 모델 픽셀 처리 불안정.** 시각 QA 에이전트 4개 중 1개는 픽셀 자체를 못 봤고, 나머지도 한국어 OCR 난독("산댕쟉" 등)이 심해 비전 보고의 신뢰도가 낮았음. 그래서 소스(build.py/content.py) 기반 EMU 단위 끝 위치 계산을 검증 기준으로 채택 — 비전 환각과 실제 결함을 분리.
5. **소스 계산 기반 레이아웃 수정 5건** (1차 빌드 → 재빌드):
   - r_table: rh 계산이 행 간 gap을 포함하지 않아 14행(치트시트2)에서 끝이 7.45"로 하단 근접 → gap 포함 역산으로 끝 7.0" 확보.
   - r_section: 섹션 제목 40pt가 "재진입 / 점검"(8자)에서 4.1" 패널에 임계(줄바꿈 위험) → 34pt로 하향.
   - r_scenario: 예시 박스 텍스트 3줄이 0.65" 영역에 빽빽 → 박스 1.25"→1.4", 텍스트 영역 0.65"→0.85", line_spacing 1.15→1.2, 경고 박스 0.78"→0.95".
   - r_concept: 본문 영역이 ch 고정 오프셋이라 5카드(3행, ch 1.4")일 때 본문이 0.2"로 부족 → ch 비례(40%/50%)로 변경.
   - r_concept: 홀수 카드(5개) 마지막 행 1개가 좌측 치우침 → 가운데 정렬.

## 도중의 결정·막힘
- **도메인 에이전트 미사용.** .claude/agents/ 없음 → fg-agents 포인터 불필요(presentation 제작이라 반복 역할 아님).
- **워크플로우 미사용 — 직접 실행.** 이미지 생성·빌드·렌더가 로컬 도구 호출 위주라 병렬 fan-out 불필요. 시각 QA만 서브에이전트 4개 병렬 분배.
- **검증 이중축.** 비전(불안정) + 소스 계산(확실)으로 교차. 최종 판정은 소스 계산 기준.

6. **사후 수정 — slide-31 "흔한 실수" 카드 4·5 제거.** 사용자가 카드 4·5가 안 맞는다고 지적 → 확인 결과 위치가 아니라 내용 문제: 카드 4(내부 구현 과독)·5(이미지에 명령 박기)은 forge 사용자의 실수가 아니라 덱 작성 메타 조언이라 주제에 안 맞음. 두 항목 제거로 5개 → 3개 축소(제목도 "흔한 실수 5개"→"흔한 실수 3개"), r_concept에 n==3일 때 3열 1행 중앙 정렬(ch 2.9") 분기 추가. 사용자 육안·내용 검수가 비전+소스계산 검증의 빈틈을 잡은 사례.

## 검증 메모
- python-pptx: 32 슬라이드, 노트 32/32 비어있지 않음, 미디어 10, notesSlides 32.
- PowerPoint→PDF(POSIX file, 앱 재기동 후)→JPG 110dpi 32장 + 수정 슬라이드 150dpi 10장.
- 소스 EMU 계산: 수정 슬라이드 끝 위치 전부 하단 7.5"에 0.5"+ 여유 확보 (slide-23 6.93", slide-30 7.0", 예시 박스 6.9", 섹션 제목 패널 내).
- placeholder(lorem/ipsum/xxxx/TODO) grep: 0건.
