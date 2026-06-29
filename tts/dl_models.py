from huggingface_hub import snapshot_download
p = snapshot_download(
    repo_id="lj1995/GPT-SoVITS",
    local_dir="GPT_SoVITS/pretrained_models",
    allow_patterns=[
        "chinese-roberta-wwm-ext-large/*",
        "chinese-hubert-base/*",
        "gsv-v2final-pretrained/s1bert25hz-5kh-longer-epoch=12-step=369668.ckpt",
        "gsv-v2final-pretrained/s2G2333k.pth",
    ],
)
print("DONE", p)
