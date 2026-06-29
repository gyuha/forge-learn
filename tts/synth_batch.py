import os, sys, time, json
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK","1")
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), "GPT_SoVITS"))
import soundfile as sf, numpy as np

ROOT="../.."
SCRIPTS=f"{ROOT}/forge-video-assets/scripts/scripts.json"
REF=f"{ROOT}/voice-samples/reference_norm.wav"
PTXT=open(f"{ROOT}/voice-samples/reference_norm.txt").read().strip()
OUTDIR="../out_audio"; os.makedirs(OUTDIR, exist_ok=True)
CFG="GPT_SoVITS/configs/tts_infer.yaml"   # device=mps, is_half=false (테스트에서 설정됨)

from GPT_SoVITS.TTS_infer_pack.TTS import TTS, TTS_Config
t0=time.time()
tts=TTS(TTS_Config(CFG))
print(f"[load] {time.time()-t0:.1f}s on {tts.configs.device}", flush=True)

data=json.load(open(SCRIPTS))
durs={}
dpath=os.path.join(OUTDIR,"durations.json")
if os.path.exists(dpath): durs=json.load(open(dpath))

tA=time.time()
for item in data:
    i=item["idx"]; key=f"{i:02d}"
    out=os.path.join(OUTDIR, f"{key}.wav")
    if os.path.exists(out):
        print(f"[skip] {key} (exists)", flush=True); continue
    req=dict(text=item["script"], text_lang="ko", ref_audio_path=REF, prompt_text=PTXT,
             prompt_lang="ko", top_k=15, top_p=1.0, temperature=1.0,
             text_split_method="cut5", speed_factor=1.0, batch_size=1,
             return_fragment=False, streaming_mode=False, parallel_infer=True)
    ts=time.time(); sr=None; ch=[]
    for s,a in tts.run(req): sr=s; ch.append(a)
    audio=np.concatenate(ch) if len(ch)>1 else ch[0]
    sf.write(out, audio, sr)
    dur=len(audio)/sr; durs[key]=dur
    json.dump(durs, open(dpath,"w"), indent=2)
    print(f"[{key}] {len(item['script'])}자 -> {dur:.2f}s audio in {time.time()-ts:.1f}s  (total {time.time()-tA:.0f}s)", flush=True)

print(f"[DONE] {len(durs)}/32 in {time.time()-tA:.0f}s, total audio {sum(durs.values()):.1f}s", flush=True)
