#!/usr/bin/env python3
"""Generate the German MP3 clips in audio/ from data.json using edge-tts.

Usage: pip install edge-tts && python3 tools/generate_audio.py [--limit N]

Existing clips are skipped, so an interrupted run can simply be restarted.
Delete a clip to regenerate it, for example after correcting its text.
"""
import argparse
import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"
VOICE = "de-DE-KatjaNeural"
CONCURRENCY = 6
RETRIES = 5


def collect_clips(questions):
    clips = {f"antwort-{n}.mp3": f"Antwort {n}" for n in range(1, 5)}
    for q in questions:
        qid = q["id"]
        clips[f"q{qid}.mp3"] = q["question_de"]
        for i, text in enumerate(q["answers_de"]):
            clips[f"q{qid}-a{i}.mp3"] = text
        if q.get("explanation_de"):
            clips[f"q{qid}-e.mp3"] = q["explanation_de"]
    return clips


async def generate(name, text, semaphore):
    target = OUT / name
    partial = target.with_suffix(".part")
    async with semaphore:
        for attempt in range(RETRIES):
            try:
                await edge_tts.Communicate(text, VOICE).save(str(partial))
                partial.replace(target)
                return True
            except Exception as error:
                if attempt == RETRIES - 1:
                    print(f"FAILED {name}: {error}", flush=True)
                    partial.unlink(missing_ok=True)
                    return False
                await asyncio.sleep(2 ** attempt)


async def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, help="generate at most this many clips")
    args = parser.parse_args()

    questions = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
    OUT.mkdir(exist_ok=True)
    clips = collect_clips(questions)
    todo = [(n, t) for n, t in clips.items() if not (OUT / n).exists()]
    print(f"{len(clips)} clips, {len(todo)} to generate", flush=True)
    if args.limit:
        todo = todo[: args.limit]

    semaphore = asyncio.Semaphore(CONCURRENCY)
    results = await asyncio.gather(*(generate(n, t, semaphore) for n, t in todo))
    print(f"done: {sum(results)} generated, {len(results) - sum(results)} failed", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
