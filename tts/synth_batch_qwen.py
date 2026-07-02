import os, sys, time, json, argparse
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)

ap = argparse.ArgumentParser()
ap.add_argument("--scripts", default=f"{HERE}/scripts-13min.json")
ap.add_argument("--out", default=f"{HERE}/out_audio_13min_qwen")
ap.add_argument("--speaker", default="sohee")
ap.add_argument("--language", default="korean")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)

import torch
from qwen_tts.inference.qwen3_tts_model import Qwen3TTSModel

t0 = time.time()
model = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice", device_map="mps", dtype=torch.float16)
print(f"[load] {time.time()-t0:.1f}s on {model.device}", flush=True)

data = json.load(open(a.scripts))
dpath = os.path.join(a.out, "durations.json")
durs = json.load(open(dpath)) if os.path.exists(dpath) else {}
tA = time.time()
for item in data:
    i = item["idx"]; key = f"{i:02d}"; out = os.path.join(a.out, f"{key}.wav")
    if os.path.exists(out):
        print(f"[skip] {key}", flush=True); continue
    ts = time.time()
    wavs, sr = model.generate_custom_voice(text=item["script"], speaker=a.speaker, language=a.language)
    audio = wavs[0]
    sf.write(out, audio, sr)
    durs[key] = len(audio) / sr
    json.dump(durs, open(dpath, "w"), indent=2)
    print(f"[{key}] {len(item['script'])}자 -> {durs[key]:.1f}s in {time.time()-ts:.1f}s (tot {time.time()-tA:.0f}s)", flush=True)
print(f"[DONE] {len(durs)} in {time.time()-tA:.0f}s, audio {sum(durs.values()):.1f}s", flush=True)
