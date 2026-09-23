import os
import sys
import subprocess
import math
import json
from PIL import Image

sys.path.append("/Users/raphie/Documents/Hackathons/vernier/demo")
import cursor_engine

W, H = 1920, 1080
FPS = 30

DEMO_DIR = "/Users/raphie/Documents/Hackathons/vernier/demo"
ASSETS_DIR = os.path.join(DEMO_DIR, "assets")
BEATS_DIR = os.path.join(DEMO_DIR, "beats")
TAKES_DIR = os.path.join(DEMO_DIR, "takes")

with open(os.path.join(DEMO_DIR, "take-config.json")) as f:
    CONFIG = json.load(f)

TAILS = {int(k): float(v) for k, v in CONFIG.get("tails", {}).items()}

# Probe exact beat durations from WAVs
BEAT_DURS = {}
for i in range(1, 7):
    wav = os.path.join(BEATS_DIR, f"beat-0{i}.wav")
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        wav
    ]
    BEAT_DURS[i] = float(subprocess.check_output(cmd).decode().strip())

SCENES = [
    {
        "id": 1,
        "name": "scene1_hook_threat",
        "beat_dur": BEAT_DURS[1],
        "tail": TAILS.get(1, 0.65),
        "asset": os.path.join(ASSETS_DIR, "scene1_frontdoor_hero.png"),
        "cursor_plan": [
            (0.0, 3.5, (960, 480), (1250, 40), 1.0, None),
            (3.5, 7.5, (1250, 40), (960, 380), -1.0, None),
            (7.5, 12.0, (960, 380), (960, 680), 1.0, None),
            (12.0, 999.0, (960, 680), (1800, 40), 1.0, None)
        ]
    },
    {
        "id": 2,
        "name": "scene2_frontdoor_friction",
        "beat_dur": BEAT_DURS[2],
        "tail": TAILS.get(2, 0.65),
        "asset": os.path.join(ASSETS_DIR, "scene2_friction_grid.png"),
        "cursor_plan": [
            (0.0, 3.5, (960, 200), (400, 520), 1.0, None),
            (3.5, 8.0, (400, 520), (960, 520), -1.0, None),
            (8.0, 12.5, (960, 520), (1520, 520), 1.0, None),
            (12.5, 16.5, (1520, 520), (1800, 40), 1.0, None),
            (16.5, 17.2, (1800, 40), (1800, 40), 1.0, (16.7, 17.1)),
            (17.2, 999.0, (1800, 40), (1800, 40), 1.0, None)
        ]
    },
    {
        "id": 3,
        "name": "scene3_cockpit_phishdrop",
        "beat_dur": BEAT_DURS[3],
        "tail": TAILS.get(3, 0.65),
        "asset": os.path.join(ASSETS_DIR, "scene3_cockpit_phishdrop.png"),
        "cursor_plan": [
            (0.0, 3.5, (1800, 40), (280, 140), 1.0, (2.0, 2.4)),
            (3.5, 8.5, (280, 140), (1420, 140), -1.0, None),
            (8.5, 13.5, (1420, 140), (960, 620), 1.0, None),
            (13.5, 999.0, (960, 620), (1190, 140), -1.0, None)
        ]
    },
    {
        "id": 4,
        "name": "scene4_live_caliper_wallet",
        "beat_dur": BEAT_DURS[4],
        "tail": TAILS.get(4, 0.65),
        "asset": os.path.join(ASSETS_DIR, "scene4_live_caliper.png"),
        "cursor_plan": [
            (0.0, 3.5, (1190, 140), (1520, 40), 1.0, (2.0, 2.4)),
            (3.5, 7.5, (1520, 40), (1060, 140), -1.0, (5.5, 5.9)),
            (7.5, 11.5, (1060, 140), (160, 520), 1.0, (9.5, 9.9)),
            (11.5, 15.5, (160, 520), (310, 685), 1.0, (13.5, 14.0)),
            (15.5, 999.0, (310, 685), (1380, 480), -1.0, None)
        ]
    },
    {
        "id": 5,
        "name": "scene5_cryptographic_proof",
        "beat_dur": BEAT_DURS[5],
        "tail": TAILS.get(5, 0.65),
        "asset": os.path.join(ASSETS_DIR, "scene5_proof_rail.png"),
        "cursor_plan": [
            (0.0, 4.0, (1380, 480), (860, 40), 1.0, (2.0, 2.4)),
            (4.0, 9.5, (860, 40), (960, 350), -1.0, None),
            (9.5, 15.0, (960, 350), (960, 620), 1.0, None),
            (15.0, 999.0, (960, 620), (1520, 350), 1.0, None)
        ]
    },
    {
        "id": 6,
        "name": "scene6_deck_roadmap",
        "beat_dur": BEAT_DURS[6],
        "tail": TAILS.get(6, 1.50),
        "asset": os.path.join(ASSETS_DIR, "scene6_deck_roadmap.png"),
        "cursor_plan": [
            (0.0, 4.0, (1520, 350), (940, 40), 1.0, (1.5, 1.9)),
            (4.0, 9.0, (940, 40), (960, 520), 1.0, None),
            (9.0, 13.0, (960, 520), (1350, 115), -1.0, None),
            (13.0, 999.0, (1350, 115), (960, 540), 1.0, None)
        ]
    }
]

def render_scene(sc):
    scene_id = sc["id"]
    name = sc["name"]
    beat_dur = sc["beat_dur"]
    tail = sc["tail"]
    dur = beat_dur + tail
    total_frames = int(round(dur * FPS))
    plan = sc["cursor_plan"]
    asset_path = sc["asset"]
    beat_wav = os.path.join(BEATS_DIR, f"beat-0{scene_id}.wav")

    video_raw = os.path.join(TAKES_DIR, f"scene{scene_id}_raw.mp4")
    out_mp4 = os.path.join(TAKES_DIR, f"scene{scene_id}.mp4")
    print(f"\n[Scene {scene_id}: {name}] Beat: {beat_dur:.2f}s + Tail: {tail:.2f}s = {dur:.2f}s ({total_frames} frames)")

    base_img = Image.open(asset_path).convert("RGB")
    if base_img.size != (W, H):
        base_img = base_img.resize((W, H), Image.Resampling.LANCZOS)

    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-crf", "18",
        video_raw
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for f_idx in range(total_frames):
        t = f_idx / FPS
        active_seg = None
        for seg in plan:
            t0, t1, p0, p1, cdir, click = seg
            if t0 <= t <= t1 or (seg == plan[-1] and t >= t0):
                active_seg = seg
                break
        if not active_seg:
            active_seg = plan[-1]

        t0, t1, p0, p1, cdir, click_window = active_seg
        effective_t1 = min(t1, dur)
        cx, cy = cursor_engine.interpolate_segment(t, t0, effective_t1, p0, p1, cdir)

        frame = base_img.copy()

        if click_window:
            c_start, c_end = click_window
            if c_start <= t <= c_end:
                progress = (t - c_start) / (c_end - c_start)
                cursor_engine.draw_click_ring(frame, cx, cy, progress)

        cursor_engine.draw_cursor(frame, cx, cy)
        pipe.stdin.write(frame.tobytes())

    pipe.stdin.close()
    pipe.wait()

    # Mux video with beat WAV padded with exact tail silence
    mux_cmd = [
        "ffmpeg", "-y",
        "-i", video_raw,
        "-i", beat_wav,
        "-filter_complex", f"[1:a]apad=whole_dur={dur:.3f}[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        out_mp4
    ]
    subprocess.check_call(mux_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(video_raw):
        os.remove(video_raw)

    print(f"[Scene {scene_id}] Rendered & Muxed to {out_mp4}")
    return out_mp4

def main():
    print("=== Vernier Master Video Producer with Breath Tails ===")
    print(f"UI Assets: {ASSETS_DIR}")
    print("Voice: minimax_273587280617670 (Honest Man)")
    print("=======================================================")

    rendered_scenes = []
    for sc in SCENES:
        out = render_scene(sc)
        rendered_scenes.append(out)

    print("\nAll 6 scenes rendered & muxed! Creating concat list...")
    concat_file = os.path.join(DEMO_DIR, "concat_list.txt")
    with open(concat_file, "w") as f:
        for p in rendered_scenes:
            f.write(f"file '{p}'\n")

    final_mp4 = os.path.join(DEMO_DIR, "vernier-demo-final.mp4")
    print(f"Concatenating 6 scenes into final master: {final_mp4}...")
    subprocess.check_call([
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_file,
        "-c", "copy",
        final_mp4
    ])

    print(f"\n==========================================")
    print(f"SUCCESS: Master Cut Ready at: {final_mp4}")
    print(f"==========================================")

    cmd = f"ffprobe -i {final_mp4} 2>&1 | grep -E 'Duration|Video|Audio'"
    os.system(cmd)

if __name__ == "__main__":
    main()
