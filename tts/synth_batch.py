import os, sys, time, json, argparse
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK","1")
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE)
REPO=os.path.join(HERE,"GPT-SoVITS")
ap=argparse.ArgumentParser()
ap.add_argument("--scripts", default=f"{ROOT}/forge-video-assets/scripts/scripts.json")
ap.add_argument("--out", default=f"{HERE}/out_audio")
ap.add_argument("--ref", default=f"{ROOT}/voice-samples/reference_norm.wav")
ap.add_argument("--ptxt", default=f"{ROOT}/voice-samples/reference_norm.txt")
a=ap.parse_args()
for _k in ('scripts','out','ref','ptxt'): setattr(a,_k, os.path.abspath(getattr(a,_k)))
# sv.py가 import 시점에 {cwd}/GPT_SoVITS/eres2net 를 path에 붙이므로, import 전에 chdir 필수
os.chdir(REPO)
sys.path.insert(0, REPO); sys.path.insert(0, os.path.join(REPO,"GPT_SoVITS"))
import soundfile as sf, numpy as np
os.makedirs(a.out, exist_ok=True)
PTXT=open(a.ptxt).read().strip()
CFG=os.path.join(REPO,"GPT_SoVITS/configs/tts_infer.yaml")

from GPT_SoVITS.TTS_infer_pack.TTS import TTS, TTS_Config
t0=time.time(); tts=TTS(TTS_Config(CFG))
print(f"[load] {time.time()-t0:.1f}s on {tts.configs.device}", flush=True)

data=json.load(open(a.scripts))
dpath=os.path.join(a.out,"durations.json")
durs=json.load(open(dpath)) if os.path.exists(dpath) else {}
tA=time.time()
for item in data:
    i=item["idx"]; key=f"{i:02d}"; out=os.path.join(a.out,f"{key}.wav")
    if os.path.exists(out): print(f"[skip] {key}", flush=True); continue
    req=dict(text=item["script"], text_lang="ko", ref_audio_path=a.ref, prompt_text=PTXT,
             prompt_lang="ko", top_k=15, top_p=1.0, temperature=1.0,
             text_split_method="cut5", speed_factor=1.0, batch_size=1,
             return_fragment=False, streaming_mode=False, parallel_infer=True)
    ts=time.time(); sr=None; ch=[]
    for s,au in tts.run(req): sr=s; ch.append(au)
    audio=np.concatenate(ch) if len(ch)>1 else ch[0]
    sf.write(out, audio, sr); durs[key]=len(audio)/sr
    json.dump(durs, open(dpath,"w"), indent=2)
    print(f"[{key}] {len(item['script'])}자 -> {durs[key]:.1f}s in {time.time()-ts:.1f}s (tot {time.time()-tA:.0f}s)", flush=True)
print(f"[DONE] {len(durs)} in {time.time()-tA:.0f}s, audio {sum(durs.values()):.1f}s", flush=True)
