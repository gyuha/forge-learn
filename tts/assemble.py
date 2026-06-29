#!/usr/bin/env python
# S4+S5: 새 클론 음성으로 영상 재합성 (재타이밍 포함)
import os, sys, json, subprocess, re, tempfile

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRAMES=f"{ROOT}/forge-video-assets/frames"
AUDIO=f"{ROOT}/tts/out_audio"
BGM=f"{ROOT}/forge-video-assets/music/ambient.mp3"
SCRIPTS=f"{ROOT}/forge-video-assets/scripts/scripts.json"
BUILD=f"{ROOT}/tts/build"; os.makedirs(BUILD, exist_ok=True)
OUT=f"{ROOT}/forge-사용법-워크플로우-내목소리.mp4"
SRT_OUT=f"{ROOT}/forge-사용법-워크플로우-내목소리.srt"
FADE=0.3

def run(cmd): subprocess.run(cmd, check=True)

def ffdur(p):
    r=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1",p],capture_output=True,text=True)
    return float(r.stdout.strip())

def srt_ts(t):
    h=int(t//3600); m=int(t%3600//60); s=int(t%60); ms=int(round((t-int(t))*1000))
    if ms==1000: s+=1; ms=0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def split_chunks(text, maxlen=38):
    # 문장(.!?) 우선 분할, 긴 건 공백 기준 재분할
    parts=re.split(r'(?<=[.!?。])\s*', text.strip())
    chunks=[]
    for p in parts:
        p=p.strip()
        if not p: continue
        while len(p)>maxlen:
            cut=p.rfind(' ',0,maxlen)
            if cut<=0: cut=maxlen
            chunks.append(p[:cut].strip()); p=p[cut:].strip()
        if p: chunks.append(p)
    return chunks or [text.strip()]

def main():
    data=json.load(open(SCRIPTS))
    durs=json.load(open(os.path.join(AUDIO,"durations.json")))
    assert len(durs)>=32, f"durations 부족: {len(durs)}/32"

    # 1) 세그먼트 생성 (이미지 × 음성, fade in/out)
    seglist=[]
    for item in data:
        i=item["idx"]; k=f"{i:02d}"
        img=f"{FRAMES}/{k}.png"; aud=f"{AUDIO}/{k}.wav"; seg=f"{BUILD}/seg_{k}.mp4"
        d=durs[k]
        vf=(f"scale=1920:1080:force_original_aspect_ratio=decrease,"
            f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,"
            f"fade=t=in:st=0:d={FADE},fade=t=out:st={max(0,d-FADE):.3f}:d={FADE}")
        run(["ffmpeg","-y","-loglevel","error","-loop","1","-i",img,"-i",aud,
             "-t",f"{d:.3f}","-r","30","-vf",vf,
             "-c:v","libx264","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k",
             "-ar","48000","-shortest",seg])
        seglist.append(seg)
        print(f"[seg {k}] {d:.2f}s", flush=True)

    # 2) concat
    concat_txt=f"{BUILD}/concat.txt"
    open(concat_txt,"w").write("".join(f"file '{s}'\n" for s in seglist))
    merged=f"{BUILD}/merged.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",concat_txt,
         "-c","copy",merged])

    # 3) 자막 SRT (대본 구문 비례 배분, 슬라이드 누적 오프셋)
    blocks=[]; off=0.0; n=1
    for item in data:
        i=item["idx"]; k=f"{i:02d}"; d=durs[k]
        chunks=split_chunks(item["script"])
        tot=sum(len(c) for c in chunks) or 1
        t=off
        for c in chunks:
            cd=d*len(c)/tot
            blocks.append((n, t, t+cd, c)); n+=1; t+=cd
        off+=d
    with open(SRT_OUT,"w") as f:
        for idx,st,en,tx in blocks:
            f.write(f"{idx}\n{srt_ts(st)} --> {srt_ts(en)}\n{tx}\n\n")
    print(f"[srt] {len(blocks)} blocks -> {SRT_OUT}", flush=True)

    # 4) BGM 믹싱(-22dB 루프) + 5) soft 자막(mov_text) 임베드
    run(["ffmpeg","-y","-loglevel","error","-i",merged,
         "-stream_loop","-1","-i",BGM,"-i",SRT_OUT,
         "-filter_complex","[1:a]volume=-22dB[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=0[a]",
         "-map","0:v","-map","[a]","-map","2:s",
         "-c:v","copy","-c:a","aac","-b:a","192k","-c:s","mov_text",
         "-metadata:s:s:0","language=kor","-shortest",OUT])
    print(f"[DONE] {OUT}", flush=True)

if __name__=="__main__":
    main()
