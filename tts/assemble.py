#!/usr/bin/env python
# 재타이밍 + 재합성 (사용법/입문 공용). 음량 -16 LUFS 내장.
import os, sys, json, subprocess, re, argparse
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE)
FADE=0.3

ap=argparse.ArgumentParser()
ap.add_argument("--frames", default=f"{ROOT}/forge-video-assets/frames")
ap.add_argument("--frame-fmt", default="{:02d}.png")          # 입문: slide-{:02d}.png
ap.add_argument("--audio",  default=f"{HERE}/out_audio")
ap.add_argument("--scripts",default=f"{ROOT}/forge-video-assets/scripts/scripts.json")
ap.add_argument("--bgm",    default=f"{ROOT}/forge-video-assets/music/ambient.mp3")
ap.add_argument("--build",  default=f"{HERE}/build")
ap.add_argument("--out-mp4",default=f"{ROOT}/forge-사용법-워크플로우-내목소리.mp4")
ap.add_argument("--out-srt",default=f"{ROOT}/forge-사용법-워크플로우-내목소리.srt")
a=ap.parse_args(); os.makedirs(a.build, exist_ok=True)

def run(c): subprocess.run(c, check=True)
def srt_ts(t):
    h=int(t//3600);m=int(t%3600//60);s=int(t%60);ms=int(round((t-int(t))*1000))
    if ms==1000:s+=1;ms=0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
def split_chunks(text,mx=38):
    parts=re.split(r'(?<=[.!?。])\s*',text.strip());out=[]
    for p in parts:
        p=p.strip()
        if not p:continue
        while len(p)>mx:
            c=p.rfind(' ',0,mx); c=c if c>0 else mx
            out.append(p[:c].strip());p=p[c:].strip()
        if p:out.append(p)
    return out or [text.strip()]

data=json.load(open(a.scripts))
durs=json.load(open(os.path.join(a.audio,"durations.json")))

# 1) 세그먼트
seglist=[]
for item in data:
    i=item["idx"];k=f"{i:02d}";d=durs[k]
    img=os.path.join(a.frames,a.frame_fmt.format(i)); aud=os.path.join(a.audio,f"{k}.wav")
    seg=os.path.join(a.build,f"seg_{k}.mp4")
    vf=(f"scale=1920:1080:force_original_aspect_ratio=decrease,"
        f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,"
        f"fade=t=in:st=0:d={FADE},fade=t=out:st={max(0,d-FADE):.3f}:d={FADE}")
    run(["ffmpeg","-y","-loglevel","error","-loop","1","-i",img,"-i",aud,"-t",f"{d:.3f}",
         "-r","30","-vf",vf,"-c:v","libx264","-pix_fmt","yuv420p","-c:a","aac",
         "-b:a","192k","-ar","48000","-shortest",seg])
    seglist.append(seg); print(f"[seg {k}] {d:.1f}s",flush=True)

# 2) concat
ct=os.path.join(a.build,"concat.txt"); open(ct,"w").write("".join(f"file '{s}'\n" for s in seglist))
merged=os.path.join(a.build,"merged.mp4")
run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",ct,"-c","copy",merged])

# 3) 자막 (대본 비례 배분)
blocks=[];off=0.0;n=1
for item in data:
    k=f"{item['idx']:02d}";d=durs[k];chunks=split_chunks(item["script"]);tot=sum(len(c) for c in chunks) or 1;t=off
    for c in chunks:
        cd=d*len(c)/tot; blocks.append((n,t,t+cd,c));n+=1;t+=cd
    off+=d
with open(a.out_srt,"w") as f:
    for idx,st,en,tx in blocks: f.write(f"{idx}\n{srt_ts(st)} --> {srt_ts(en)}\n{tx}\n\n")
print(f"[srt] {len(blocks)} blocks",flush=True)

# 4) BGM 믹싱(-24dB, normalize=0) + loudnorm -16 LUFS + soft 자막
run(["ffmpeg","-y","-loglevel","error","-i",merged,"-stream_loop","-1","-i",a.bgm,"-i",a.out_srt,
     "-filter_complex","[1:a]volume=-24dB[bg];[0:a][bg]amix=inputs=2:normalize=0:duration=first:dropout_transition=0[m];[m]loudnorm=I=-16:TP=-1.5:LRA=11[au]",
     "-map","0:v","-map","[au]","-map","2:s","-c:v","copy","-c:a","aac","-b:a","192k",
     "-c:s","mov_text","-metadata:s:s:0","language=kor","-shortest",a.out_mp4])
print(f"[DONE] {a.out_mp4}",flush=True)
