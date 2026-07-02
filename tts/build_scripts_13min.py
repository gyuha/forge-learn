import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

SRC = os.path.join(ROOT, "forge-video-assets/scripts/scripts.json")
OUT = os.path.join(HERE, "scripts-13min.json")

REMOVE = {8, 22, 23, 25, 26, 27, 28, 30}

SHORTENED = {
    1: "오늘 익힐 것은 명령 목록이 아니라, 상황을 보고 어떤 fg 명령을 꺼낼지 판단하는 능력입니다. Claude Code를 써보셨다고 가정하고, forge를 실제 업무에 어떻게 쓰는지 일곱 가지 상황으로 보여드립니다.",
    2: "성취 기준 네 가지입니다. 상황에 맞는 명령 선택, 기본 루프, 길을 잃었을 때 대처, 효율적인 차선 선택. 이 네 가지가 오늘의 전부입니다.",
    9: "파일에 상태를 두는 이유는 세 가지입니다. 재진입 — 다음 날 돌아와도 .forge만 보면 이어할 수 있습니다. 재실행 방지 — 활성 슬롯이 비어야만 실행되니 중복 실행이 구조적으로 막힙니다. 검증 게이트 — 검증이 기록되어야 봉인됩니다. 세션 메모리는 날아가지만 파일은 남습니다.",
}

data = json.load(open(SRC))
kept = [item for item in data if item["idx"] not in REMOVE]
for item in kept:
    if item["idx"] in SHORTENED:
        item["script"] = SHORTENED[item["idx"]]

assert len(kept) == 24, f"expected 24, got {len(kept)}"
for i in (1, 2, 9):
    assert any(x["idx"] == i for x in kept), f"idx {i} missing"

json.dump(kept, open(OUT, "w"), ensure_ascii=False, indent=2)
print(f"wrote {len(kept)} items -> {OUT}")
