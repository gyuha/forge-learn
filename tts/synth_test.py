import os, sys, time
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK","1")
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), "GPT_SoVITS"))
import yaml, soundfile as sf, numpy as np, torch

CFG="GPT_SoVITS/configs/tts_infer.yaml"
d=yaml.safe_load(open(CFG))
DEV = sys.argv[1] if len(sys.argv)>1 else "mps"
d["custom"]["device"]=DEV
d["custom"]["is_half"]=False
yaml.safe_dump(d, open(CFG,"w"), allow_unicode=True)
print("device set ->", DEV)

from GPT_SoVITS.TTS_infer_pack.TTS import TTS, TTS_Config
t0=time.time()
cfg=TTS_Config(CFG)
tts=TTS(cfg)
print(f"[load] models loaded in {time.time()-t0:.1f}s on {cfg.device}")

ref="../../voice-samples/reference_norm.wav"
ptext=open("../../voice-samples/reference_norm.txt").read().strip()
text="안녕하세요. 이것은 제 목소리로 만든 테스트 음성입니다. forge 사용법 영상을 직접 내레이션해 보겠습니다."
req=dict(text=text, text_lang="ko", ref_audio_path=ref, prompt_text=ptext,
         prompt_lang="ko", top_k=15, top_p=1.0, temperature=1.0,
         text_split_method="cut5", speed_factor=1.0, batch_size=1,
         return_fragment=False, streaming_mode=False, parallel_infer=True)
t1=time.time()
sr=None; chunks=[]
for s,a in tts.run(req):
    sr=s; chunks.append(a)
audio=np.concatenate(chunks) if len(chunks)>1 else chunks[0]
dur=len(audio)/sr
el=time.time()-t1
sf.write("../synth_test_out.wav", audio, sr)
print(f"[synth] text {len(text)}자 -> {dur:.2f}s audio in {el:.2f}s  (RTF={el/dur:.2f})  sr={sr}")
print("OK wrote tts/synth_test_out.wav")
