import os, sys, time, json, argparse, asyncio, subprocess
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)

ap = argparse.ArgumentParser()
ap.add_argument("--scripts", default=f"{HERE}/scripts-forge-manual-12min.json")
ap.add_argument("--out", default=f"{HERE}/out_audio_forge_manual_edge")
ap.add_argument("--voice", default="ko-KR-SunHiNeural")
ap.add_argument("--rate", default="+0%")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)


async def synth_one(text, voice, rate, mp3_path):
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(mp3_path)


def ffprobe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


data = json.load(open(a.scripts))
dpath = os.path.join(a.out, "durations.json")
durs = json.load(open(dpath)) if os.path.exists(dpath) else {}

tA = time.time()
for item in data:
    i = item["idx"]; key = f"{i:02d}"
    wav = os.path.join(a.out, f"{key}.wav")
    if os.path.exists(wav):
        print(f"[skip] {key}", flush=True); continue
    mp3 = os.path.join(a.out, f"{key}.mp3")
    ts = time.time()
    asyncio.run(synth_one(item["script"], a.voice, a.rate, mp3))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, wav], check=True)
    os.remove(mp3)
    durs[key] = ffprobe_duration(wav)
    json.dump(durs, open(dpath, "w"), indent=2)
    print(f"[{key}] {len(item['script'])}자 -> {durs[key]:.1f}s in {time.time()-ts:.1f}s (tot {time.time()-tA:.0f}s)", flush=True)

print(f"[DONE] {len(durs)} in {time.time()-tA:.0f}s, audio {sum(durs.values()):.1f}s", flush=True)
