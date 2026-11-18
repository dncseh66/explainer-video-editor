#!/usr/bin/env python3
"""ffmpeg versions of the Mac-only Swift tools, so films can be finished on Linux (cloud sessions) too.

  python3 -I scripts/av.py encode    <frames_dir> <fps> <out.mp4> [firstFrame=0] [lastFrame=auto]
  python3 -I scripts/av.py mux       <video.mp4> <voice.mp3> <out.mp4> [voiceStart=0] [musicVolume=0.35]
  python3 -I scripts/av.py mix       <video.mp4> <presets/timing/<name>.json> <out.mp4>
  python3 -I scripts/av.py vo_concat <out.m4a> <file>@<offset> ...

Same arguments and behaviour as scripts/{mix,mux,vo_concat}.swift and film-snapshot/*/encode.swift.
Normally called through scripts/bin/<tool>, which picks this file when ffmpeg is installed.
"""
import json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.getcwd()
SR = 48000


def fail(m):
    sys.stderr.write(m + "\n"); sys.exit(1)


def p(path):
    return path if os.path.isabs(path) else os.path.join(ROOT, path)


def ffmpeg(args):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"] + args)
    if r.returncode != 0:
        fail("ffmpeg failed")


def probe(path, stream=None):
    args = ["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", path]
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        return None
    j = json.loads(r.stdout)
    types = [s.get("codec_type") for s in j.get("streams", [])]
    return {"dur": float(j.get("format", {}).get("duration") or 0), "audio": "audio" in types, "video": "video" in types}


def envelope(keys, at):
    """Piecewise-linear gain from absolute (time, gain) keyframes, as an ffmpeg volume expression on clip time."""
    keys = sorted(keys)
    pts = [(round(t - at, 4), g) for t, g in keys]
    expr = "%g" % pts[-1][1]
    for (t0, g0), (t1, g1) in reversed(list(zip(pts, pts[1:]))):
        seg = "%g" % g0 if t1 <= t0 or g0 == g1 else "(%g+(%g)*(t-%g)/%g)" % (g0, g1 - g0, t0, t1 - t0)
        expr = "if(lt(t,%g),%s,%s)" % (t1, seg, expr)
    return "if(lt(t,%g),%g,%s)" % (pts[0][0], pts[0][1], expr)


class Mixer:
    """Collects audio clips placed on a timeline and renders them with one amix."""

    def __init__(self, length):
        self.length, self.inputs, self.chains, self.missing, self.placed = length, [], [], set(), 0

    def place(self, file, at, vol, max_len=None, fade_out=0.0, src=0.0, keys=None):
        f = p(file)
        info = probe(f) if os.path.exists(f) else None
        if not info or not info["audio"]:
            self.missing.add(file); return False
        room = self.length - at
        if room <= 0.05:
            return False
        ln = min(info["dur"] - src, max_len if max_len is not None else info["dur"], room)
        if ln <= 0.05:
            return False
        k = keys[:] if keys else [(at, vol)]
        if fade_out > 0:
            k += [(at + ln - fade_out, vol), (at + ln, 0.0)]
        n = len(self.chains)
        self.inputs += ["-i", f]
        self.chains.append(
            "[%d:a]atrim=start=%g:duration=%g,asetpts=PTS-STARTPTS,aresample=%d,aformat=channel_layouts=stereo,"
            "volume='%s':eval=frame,adelay=%d:all=1[c%d]" % (n, src, ln, SR, envelope(k, at), round(at * 1000), n))
        self.placed += 1
        return True

    def render(self, out, video=None, codec="aac"):
        if not self.chains:
            fail("nothing to mix")
        base = 1 if video else 0
        chains = [c.replace("[%d:a]" % i, "[%d:a]" % (i + base), 1) for i, c in enumerate(self.chains)]
        labels = "".join("[c%d]" % i for i in range(len(chains)))
        # a silent bed of exactly the film's length goes first, so amix (duration=first) ends right there
        graph = ";".join(chains) + ";aevalsrc=0|0:s=%d:d=%g[bed];[bed]%samix=inputs=%d:normalize=0:duration=first[aout]" % (
            SR, self.length, labels, len(chains) + 1)
        args = (["-i", video] if video else []) + self.inputs + ["-filter_complex", graph]
        if video:
            args += ["-map", "0:v:0", "-c:v", "copy", "-dn"]
        args += ["-map", "[aout]", "-c:a", codec, "-b:a", "192k", "-t", "%g" % self.length]
        if out.endswith(".mp4"):
            args += ["-movflags", "+faststart"]
        ffmpeg(args + [out])


def cmd_encode(a):
    if len(a) < 3:
        fail("usage: encode <frames_dir> <fps> <out.mp4> [first=0] [last=auto]")
    d, fps, out = a[0], int(a[1]), a[2]
    nums = sorted(int(n[1:-4]) for n in os.listdir(d) if re.fullmatch(r"f\d+\.jpg", n) and int(n[1:-4]) < 900000)
    if not nums:
        fail("no frames in " + d)
    first = int(a[3]) if len(a) > 3 else 0
    last = int(a[4]) if len(a) > 4 else nums[-1]
    have, missing, prev = set(nums), 0, None
    tmp = tempfile.mkdtemp(prefix="frames-")
    try:
        for i in range(first, last + 1):  # missing frames repeat the previous one, like encode.swift
            src = os.path.join(os.path.abspath(d), "f%06d.jpg" % i)
            if i not in have:
                missing += 1; src = prev
            if src is None:
                continue
            prev = src
            os.symlink(src, os.path.join(tmp, "f%06d.jpg" % (i - first)))
        ffmpeg(["-framerate", str(fps), "-i", os.path.join(tmp, "f%06d.jpg"), "-vf", "scale=1920:1080",
                "-c:v", "libx264", "-preset", "medium", "-b:v", "14M", "-maxrate", "20M", "-bufsize", "28M",
                "-pix_fmt", "yuv420p", "-g", "60", "-profile:v", "high", "-movflags", "+faststart", out])
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print("wrote %s frames %d...%d missing %d" % (os.path.abspath(out), first, last, missing))


def cmd_mux(a):
    if len(a) < 3:
        fail("usage: mux <video.mp4> <voice.mp3> <out.mp4> [voiceStart=0] [musicVolume=0.35]")
    video, voice, out = a[0], a[1], a[2]
    start = float(a[3]) if len(a) > 3 else 0.0
    mvol = float(a[4]) if len(a) > 4 else 0.35
    v = probe(video) or fail("cannot read " + video)
    vo = probe(voice) or fail("cannot read " + voice)
    if not vo["audio"]:
        fail("no audio track in " + voice)
    if start >= v["dur"]:
        fail("voice start is past the end of the video")
    m = Mixer(v["dur"])
    if mvol > 0 and v["audio"]:
        m.place(video, 0, mvol)
    m.place(voice, start, 1.0)
    if vo["dur"] > v["dur"] - start:
        print("note: voice is %.2fs longer than the video and was cut" % (vo["dur"] - (v["dur"] - start)))
    m.render(out, video=video)
    print("wrote %s (%.2fs)" % (os.path.abspath(out), v["dur"]))


VOLS = {"pop": 0.45, "whoosh": 0.35, "thud": 0.5, "tick": 0.4, "ding": 0.35, "scratch": 0.6, "scratch4": 0.55,
        "night": 0.4, "shake": 0.5, "splat": 0.5, "splash": 0.45, "blanket": 0.45}


def cmd_mix(a):
    if len(a) < 3:
        fail("usage: mix <video.mp4> <timing.json> <out.mp4>")
    video, out = p(a[0]), p(a[2])
    J = json.load(open(p(a[1])))
    sound = J.get("sound") or {}
    sfx = sound.get("sfx") or {}
    v = probe(video) or fail("cannot read " + video)
    if not v["video"]:
        fail("no video track")
    L = v["dur"]
    m = Mixer(L)
    if J.get("voiceover"):
        m.place(J["voiceover"], 0, 1.0)
    cues = sound.get("music_cues")
    if isinstance(cues, list):
        for c in cues:
            f, fr, to = c.get("file"), c.get("from"), c.get("to")
            if not f or fr is None or to is None:
                continue
            vol, fi, fo = c.get("vol", 0.16), c.get("fade_in", 0.8), c.get("fade_out", 1.2)
            keys = [(fr, 0.0), (fr + fi, vol)] if fi > 0 else [(fr, vol)]
            m.place(f, fr, vol, max_len=to - fr, fade_out=fo, src=c.get("src", 0), keys=keys)
    elif isinstance(sound.get("music"), dict) and sound["music"].get("file"):
        mu = sound["music"]
        vol = mu.get("volume_under_voice", 0.16)
        keys = [(0, 0.0), (1.2, vol)]
        for c in mu.get("cuts") or []:
            if "at" in c:
                t = c["at"]; keys += [(t - 0.08, vol), (t, 0.0), (t + 0.6, 0.0), (t + 2.0, vol)]
        m.place(mu["file"], 0, vol, max_len=L, fade_out=2.5, keys=keys)
    for s in J.get("shots") or []:
        st = s.get("start", 0); en = s.get("end", st)
        for e in s.get("events") or []:
            raw, t = e.get("sfx"), e.get("t")
            if not raw or t is None:
                continue
            for part in raw.split("+"):
                words = part.strip().split()
                if not words or words[0] not in sfx or not sfx[words[0]].get("file"):
                    continue
                key, f, n = words[0], sfx[words[0]]["file"], 1
                for w in words:
                    if re.fullmatch(r"x\d+", w):
                        n = min(int(w[1:]), 8); break
                if "many" in words:
                    n = 8
                if key == "night":
                    m.place(f, st, VOLS.get(key, 0.4), max_len=en - st, fade_out=0.6); continue
                for i in range(n):
                    m.place(f, max(0, t - 0.03) + i * 0.12, VOLS.get(key, 0.45), max_len=2.5, fade_out=0.1)
    m.render(out, video=video)
    print("wrote %s (%.2fs), %d audio clips placed" % (out, L, m.placed))
    if m.missing:
        print("missing (skipped): " + ", ".join(sorted(m.missing)))


def cmd_vo_concat(a):
    if len(a) < 2:
        fail("usage: vo_concat <out.m4a> <file>@<offset> ...")
    segs = []
    for arg in a[1:]:
        f, _, off = arg.rpartition("@")
        try:
            segs.append((f, float(off)))
        except ValueError:
            fail("bad segment: " + arg)
    end = 0.0
    for f, off in segs:
        info = probe(f)
        if not info or not info["audio"]:
            fail("no audio in " + f)
        end = max(end, off + info["dur"])
    m = Mixer(end)
    for f, off in segs:
        m.place(f, off, 1.0)
    m.render(a[0])
    print("wrote " + os.path.abspath(a[0]))


if __name__ == "__main__":
    if not shutil.which("ffmpeg"):
        fail("ffmpeg is not installed")
    cmds = {"encode": cmd_encode, "mux": cmd_mux, "mix": cmd_mix, "vo_concat": cmd_vo_concat}
    if len(sys.argv) < 2 or sys.argv[1] not in cmds:
        fail(__doc__)
    cmds[sys.argv[1]](sys.argv[2:])
