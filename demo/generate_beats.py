import urllib.request
import urllib.parse
import json
import time
import os
import subprocess

API_KEY = 'sk_sp9oujj3tncjcu3unzsfygj0p24we8yj674i52pdtfhtbexs'
VOICE_ID = 'minimax_273587280617670'
BEATS_DIR = '/Users/raphie/Documents/Hackathons/vernier/demo/beats'

BEATS = [
    {
        "id": 1,
        "name": "beat-01",
        "text": "Every day, millions of dollars are drained in Web three because wallets force users to sign completely blind. MetaMask shows you an unreadable hash, while phishing drainers steal everything. What if you could see the exact damage before you sign?"
    },
    {
        "id": 2,
        "name": "beat-02",
        "text": "Meet Vernier, the zero point four two millisecond Web three transaction firewall. Built around the precision caliper principle, Vernier measures contract bytecode and storage mutations down to the single gas unit. Red means halt, green means safe. Anyone understands it in five seconds."
    },
    {
        "id": 3,
        "name": "beat-03",
        "text": "Inside the working cockpit, Vernier runs full client-side EVM emulation. When a malicious airdrop attempts an unbounded token approval, Vernier intercepts the hazard instantly. Zero RPC leakage, zero third-party latency. Your private keys never touch the network unprotected."
    },
    {
        "id": 4,
        "name": "beat-04",
        "text": "Vernier is not a static mockup. With real Web three wallet integration via Wagmi and Viem, you can connect your wallet and benchmark custom contracts in real time. Our live caliper calculates gas discrepancies, storage slot mutations, and verifies contract state roots in under one millisecond."
    },
    {
        "id": 5,
        "name": "beat-05",
        "text": "Every simulated execution generates an immutable cryptographic receipt. Judges, dapps, and smart contract auditors can independently verify state deltas, gas discrepancies, and threat hashes with mathematical certainty. Security is no longer a promise; it is verifiable on-chain evidence."
    },
    {
        "id": 6,
        "name": "beat-06",
        "text": "We have also built our complete six-slide pitch deck directly into the application. Vernier is ready to deploy as a lightweight browser extension and an ERC forty-three thirty-seven account abstraction plugin. Stop blind signing. Protect your keys with Vernier."
    }
]

os.makedirs(BEATS_DIR, exist_ok=True)

def generate_beat(beat):
    print(f"Generating {beat['name']}...")
    data = urllib.parse.urlencode({
        'text': beat['text'],
        'voice_id': VOICE_ID,
        'speed': 1.0
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.ai33.pro/v3/text-to-speech',
        data=data,
        headers={
            'xi-api-key': API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method='POST'
    )

    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
    task_id = res['task_id']
    print(f"  Task ID: {task_id}, polling...")

    # Poll
    poll_req = urllib.request.Request(
        f'https://api.ai33.pro/v1/task/{task_id}',
        headers={'xi-api-key': API_KEY}
    )

    audio_url = None
    for _ in range(30):
        time.sleep(2)
        with urllib.request.urlopen(poll_req) as resp:
            poll_res = json.loads(resp.read().decode())
            if poll_res.get('status') == 'done':
                audio_url = poll_res['metadata']['audio_url']
                break
            elif poll_res.get('status') == 'error':
                raise RuntimeError(f"Error generating beat {beat['name']}: {poll_res}")

    if not audio_url:
        raise TimeoutError(f"Timeout waiting for {beat['name']}")

    temp_mp3 = os.path.join(BEATS_DIR, f"{beat['name']}.mp3")
    wav_path = os.path.join(BEATS_DIR, f"{beat['name']}.wav")

    print(f"  Downloading from {audio_url}...")
    subprocess.run(['curl', '-s', '-L', '-A', 'Mozilla/5.0', audio_url, '-o', temp_mp3], check=True)

    # Convert to 48kHz stereo WAV for clean muxing
    cmd = [
        'ffmpeg', '-y', '-i', temp_mp3,
        '-ar', '48000', '-ac', '2',
        wav_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Get exact duration
    probe_cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        wav_path
    ]
    duration = float(subprocess.check_output(probe_cmd).decode().strip())
    print(f"  Saved {wav_path} (Duration: {duration:.2f}s)")
    return duration

total_duration = 0.0
manifest = []
for beat in BEATS:
    dur = generate_beat(beat)
    total_duration += dur
    manifest.append({
        'id': beat['id'],
        'name': beat['name'],
        'duration': dur,
        'wav': os.path.join(BEATS_DIR, f"{beat['name']}.wav"),
        'text': beat['text']
    })

print(f"\nAll beats generated successfully! Total VO Duration: {total_duration:.2f}s")
with open(os.path.join(BEATS_DIR, 'manifest.json'), 'w') as f:
    json.dump({'total_duration': total_duration, 'beats': manifest}, f, indent=2)
