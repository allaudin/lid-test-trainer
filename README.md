# Leben in Deutschland Test Trainer

A bilingual (German/English) practice trainer for the Leben in Deutschland citizenship test. It is a static web app with no dependencies and no build step.

## Running it

The app loads its questions from `data.json`, so it has to be served over HTTP. Opening `index.html` directly from disk will not work, because browsers block that request on `file://` pages.

Start a local web server from the project folder:

```sh
git clone https://github.com/allaudin/lid-test-trainer.git
cd lid-test-trainer
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop the server.

If you prefer Node.js, `npx serve` works too. It prints the address to open.

## German audio

During a quiz, select the speaker button or press `A` to hear the question and its answers read aloud in German. Once a practice question is answered, the explanation is read too. Press it again to stop.

The clips in `audio/` were generated from `data.json` with [edge-tts](https://github.com/rany2/edge-tts) using a Microsoft neural voice. If a clip can't be played, the app falls back to your browser's built-in speech synthesis.

To regenerate clips after changing a question, delete the affected files from `audio/`, then run:

```sh
pip install edge-tts
python3 tools/generate_audio.py
```

## Keyboard shortcuts

| Key | Action | Where it works |
| --- | --- | --- |
| `L` | Toggle language (German/English) | Anywhere |
| `1` `2` `3` `4` | Select answer 1 to 4 | During a quiz, before answering |
| `Enter` | Advance to the next question | During a quiz, after answering |
| `B` | Toggle bookmark | During a quiz |
| `A` | Play or stop German audio | During a quiz |
| `Esc` | Close a dialog, or cancel changing a shortcut | Anywhere |

To change a shortcut, open **Settings** (Einstellungen) and choose **Keyboard shortcuts** (Tastenkürzel). Your choices are saved in the browser, and you can restore the defaults from the same screen. All of the keys above can be changed except `Esc`.
