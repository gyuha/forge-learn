import subprocess, sys, os
from faster_whisper import WhisperModel

SRC = "voice-samples/reference.wav"
OUT_WAV = "voice-samples/reference_norm.wav"
OUT_TXT = "voice-samples/reference_norm.txt"
MAX_S = 9.5  # GPT-SoVITS 3~10초 강제 → 안전 마진

print("=> whisper(small) 로딩/전사 (ko, word timestamps)...")
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = m.transcribe(SRC, language="ko", word_timestamps=True)
words = []
for s in segs:
    for w in (s.words or []):
        words.append((w.start, w.end, w.word))
if not words:
    print("FAIL: no words"); sys.exit(1)

# ≤MAX_S 안에 드는 마지막 단어 경계 찾기
cut = None; picked = []
for st, en, wd in words:
    if en <= MAX_S:
        picked.append((st, en, wd)); cut = en
    else:
        break
if cut is None:  # 첫 단어가 이미 길면 첫 단어까지
    st, en, wd = words[0]; cut = min(en, MAX_S); picked = [words[0]]

prompt = "".join(w for _,_,w in picked).strip()
print(f"=> cut at {cut:.3f}s, words={len(picked)}")
print(f"=> prompt_text: {prompt}")

# 트림 + 모노 (원본 48k 유지, GPT-SoVITS가 내부 리샘플)
subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",SRC,
                "-t",f"{cut:.3f}","-ac","1",OUT_WAV], check=True)
with open(OUT_TXT,"w") as f: f.write(prompt+"\n")
import json
print("=> wrote", OUT_WAV, OUT_TXT)
