# Leben in Deutschland Test Trainer

A practice trainer for the Leben in Deutschland citizenship test, with German questions and English and Urdu translations. It is a static web app with no dependencies and no build step.

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

## Install and offline use

The app is a progressive web app. On desktop Chrome or Edge, use the install button in the address bar. On Android, choose **Add to Home screen** from the browser menu. On iPhone, open the site in Safari and choose **Share**, then **Add to Home Screen**.

Once it has loaded, the app and all questions work offline. Audio clips and images are saved the first time they're used. To save all of them at once (about 107 MB), open **Settings** (Einstellungen) and select **Download all media** (Alle Medien herunterladen). You can cancel and resume the download, and remove the files from the same place.

After regenerating clips or images, change `MEDIA_CACHE` in both `sw.js` and `app.js`. Otherwise installed copies keep the old files.

After changing `app.js` or `styles.css`, raise the `?v=` number where `index.html` loads them. Otherwise, for up to 10 minutes after you publish, a browser that refreshes the page can run the new page with the old script.

## Missed questions

Select **Missed questions** (Falsch beantwortet) on the start screen, or **View missed questions** on the stats screen, to see every question you've answered wrong. Your weakest ones are at the top. Each question shows how often you got it wrong and right, with the correct answer in green and the wrong answer you picked last in red. Select **Practice these questions** to go through them as a quiz.

To start the list over, select **Clear list…** at the bottom. Your stats are kept, and questions you get wrong after that show up in the list again.

## Language

Choose German, English or Urdu from the dropdown at the top of the page. Press `L` to switch between two languages, German and English by default. To pick the two, open **Settings** (Einstellungen) and choose **Keyboard shortcuts** (Tastenkürzel).

## Keyboard shortcuts

| Key | Action | Where it works |
| --- | --- | --- |
| `L` | Switch between your two chosen languages | Anywhere |
| `1` `2` `3` `4` | Select answer 1 to 4 | During a quiz, before answering |
| `Enter` | Advance to the next question | During a quiz, after answering |
| `B` | Toggle bookmark | During a quiz |
| `A` | Play or stop German audio | During a quiz |
| `Esc` | Close a dialog, or cancel changing a shortcut | Anywhere |

To change a shortcut, open **Settings** (Einstellungen) and choose **Keyboard shortcuts** (Tastenkürzel). Your choices are saved in the browser, and you can restore the defaults from the same screen. All of the keys above can be changed except `Esc`.
