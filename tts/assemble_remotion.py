#!/usr/bin/env python
# 24개 클론 WAV -> 단일 MP3(narration.mp3) + SRT(subtitles.srt). Remotion 프로젝트용(비디오 렌더 없음).
# 음량 -16 LUFS 내장(직전 회고 교훈: amix 없이도 loudnorm 필수 단계로 포함).
import os, sys, json, subprocess, re, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

ap = argparse.ArgumentParser()
ap.add_argument("--scripts", default=f"{HERE}/scripts-13min.json")
ap.add_argument("--audio", default=f"{HERE}/out_audio_13min")
ap.add_argument("--out-mp3", default=f"{ROOT}/forge-explainer/public/narration.mp3")
ap.add_argument("--out-srt", default=f"{ROOT}/forge-explainer/public/subtitles.srt")
a = ap.parse_args()


def srt_ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = int(t % 60); ms = int(round((t - int(t)) * 1000))
    if ms == 1000:
        s += 1; ms = 0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def split_chunks(text, mx=38):
    parts = re.split(r'(?<=[.!?。])\s*', text.strip())
    out = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        while len(p) > mx:
            c = p.rfind(' ', 0, mx); c = c if c > 0 else mx
            out.append(p[:c].strip()); p = p[c:].strip()
        if p:
            out.append(p)
    return out or [text.strip()]


data = json.load(open(a.scripts))
durs = json.load(open(os.path.join(a.audio, "durations.json")))

wavs = []
for item in data:
    key = f"{item['idx']:02d}"
    wav = os.path.join(a.audio, f"{key}.wav")
    if not os.path.exists(wav):
        sys.exit(f"missing wav: {wav}")
    wavs.append(wav)

# 1) concat + loudnorm -16 LUFS -> mp3 (필터 콘캣: 인코딩 파라미터 불일치에도 안전)
inputs = []
for w in wavs:
    inputs += ["-i", w]
n = len(wavs)
concat_inputs = "".join(f"[{i}:a]" for i in range(n))
filt = f"{concat_inputs}concat=n={n}:v=0:a=1[cat];[cat]loudnorm=I=-16:TP=-1.5:LRA=11[au]"
os.makedirs(os.path.dirname(a.out_mp3), exist_ok=True)
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", filt,
     "-map", "[au]", "-codec:a", "libmp3lame", "-b:a", "192k", a.out_mp3],
    check=True,
)
print(f"[mp3] wrote {a.out_mp3}", flush=True)

# 2) SRT: durations.json 기반 비례 배분 (assemble.py의 split_chunks 재사용)
blocks = []
off = 0.0
n_block = 1
for item in data:
    k = f"{item['idx']:02d}"
    d = durs[k]
    chunks = split_chunks(item["script"])
    tot = sum(len(c) for c in chunks) or 1
    t = off
    for c in chunks:
        cd = d * len(c) / tot
        blocks.append((n_block, t, t + cd, c))
        n_block += 1
        t += cd
    off += d

with open(a.out_srt, "w") as f:
    for idx, st, en, tx in blocks:
        f.write(f"{idx}\n{srt_ts(st)} --> {srt_ts(en)}\n{tx}\n\n")
print(f"[srt] {len(blocks)} blocks -> {a.out_srt}", flush=True)
print(f"[total] {off:.1f}s", flush=True)
