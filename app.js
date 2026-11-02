/* ===========================================================
   Leben in Deutschland — Test Trainer
   Vanilla JS, no build step, no external dependencies.
   =========================================================== */

(function () {
  "use strict";

  var STATS_KEY = "lid-stats-v1";
  var MEDIA_CACHE = "lid-media-v1"; // keep in step with sw.js
  var MEDIA_DOWNLOADS_AT_ONCE = 6;
  var TOGGLE_KEY = "lid-show-english-v1"; // legacy on/off value, read once to migrate
  var LANGUAGE_KEY = "lid-language-v1";
  var LANGUAGE_PAIR_KEY = "lid-language-pair-v1";
  var DEFAULT_LANGUAGE_PAIR = ["de", "en"];
  var LANGUAGES = ["de", "en", "ur"];
  var LANGUAGE_LABEL = { de: "Deutsch", en: "English", ur: "اردو" };
  var LANGUAGE_LOCALE = { de: "de-DE", en: "en-GB", ur: "ur-PK" };
  var THEME_KEY = "lid-theme-v1";
  var FONT_SCALE_KEY = "lid-font-scale-v1";
  var FONT_SCALE_MIN = 80;
  var FONT_SCALE_MAX = 150;
  var FONT_SCALE_STEP = 10;
  var FONT_SCALE_DEFAULT = 100;
  var BOOKMARKS_KEY = "lid-bookmarks-v1";
  var BOOKMARKS_KEY_LEGACY = "lid-favorites-v1";
  var EXAM_STATE_KEY = "lid-exam-state-v1";
  var EXAM_HISTORY_KEY = "lid-exam-history-v1";
  var EXAM_HISTORY_MAX = 50;
  var KEYBINDINGS_KEY = "lid-keybindings-v1";
  var DEFAULT_KEYBINDINGS = {
    toggleEnglish: "l",
    option1: "1",
    option2: "2",
    option3: "3",
    option4: "4",
    next: "enter",
    bookmark: "b",
    audio: "a"
  };
  var SHORTCUT_ACTIONS = ["toggleEnglish", "option1", "option2", "option3", "option4", "next", "bookmark", "audio"];
  var SHORTCUT_LABEL_KEY = {
    toggleEnglish: "shortcutToggleEnglish",
    option1: "shortcutOption1",
    option2: "shortcutOption2",
    option3: "shortcutOption3",
    option4: "shortcutOption4",
    next: "shortcutNext",
    bookmark: "shortcutBookmark",
    audio: "shortcutAudio"
  };
  var KEY_DISPLAY_OVERRIDES = {
    enter: "Enter", escape: "Esc", " ": "Space", tab: "Tab",
    arrowup: "↑", arrowdown: "↓", arrowleft: "←", arrowright: "→"
  };
  var THEME_CYCLE = ["system", "light", "dark"];
  var THEME_ICON = { system: "🖥", light: "☀", dark: "🌙" };
  var THEME_LABEL = {
    system: { de: "System", en: "System", ur: "سسٹم" },
    light: { de: "Hell", en: "Light", ur: "ہلکی" },
    dark: { de: "Dunkel", en: "Dark", ur: "گہری" }
  };

  var STRINGS = {
    subtitle: { de: "Testtrainer", en: "Test Trainer", ur: "ٹیسٹ ٹرینر" },
    statsNav: { de: "Statistik", en: "Stats", ur: "اعداد و شمار" },
    langSelectTitle: { de: "Sprache wählen", en: "Choose language", ur: "زبان منتخب کریں" },
    themeTitle: { de: "Design", en: "Theme", ur: "تھیم" },
    themeTapToChange: { de: "zum Ändern tippen", en: "tap to change", ur: "تبدیل کرنے کے لیے کلک کریں" },
    themeAria: { de: "Farbschema", en: "Color theme", ur: "رنگوں کی تھیم" },
    allQuestions: { de: "Alle Fragen", en: "All questions", ur: "تمام سوالات" },
    byTopic: { de: "Nach Thema", en: "By topic", ur: "موضوع کے لحاظ سے" },
    byState: { de: "Nach Bundesland", en: "By state", ur: "ریاست کے لحاظ سے" },
    byStateSub: { de: "(Landeskunde)", en: "(regional knowledge)", ur: "(علاقائی معلومات)" },
    back: { de: "Zurück", en: "Back", ur: "واپس" },
    exit: { de: "Zurück", en: "Exit", ur: "باہر نکلیں" },
    next: { de: "Weiter", en: "Next", ur: "آگے چلیے" },
    finish: { de: "Fertig", en: "Finish", ur: "ختم کریں" },
    question: { de: "Frage", en: "Question", ur: "سوال" },
    of: { de: "von", en: "of", ur: "از" },
    score: { de: "Punkte", en: "Score", ur: "اسکور" },
    correctSuffix: { de: "richtig", en: "correct", ur: "درست" },
    sessionComplete: { de: "Sitzung abgeschlossen", en: "Session complete", ur: "سیشن مکمل" },
    tryAgain: { de: "Nochmal versuchen", en: "Try again", ur: "دوبارہ کوشش کریں" },
    viewStats: { de: "Statistik ansehen", en: "View stats", ur: "اعداد و شمار دیکھیں" },
    backToStart: { de: "Zurück zum Start", en: "Back to start", ur: "شروع پر واپس" },
    yourStats: { de: "Deine Statistik", en: "Your stats", ur: "آپ کے اعداد و شمار" },
    overallAccuracy: { de: "Gesamtgenauigkeit", en: "Overall accuracy", ur: "مجموعی درستگی" },
    questionsAttempted: { de: "Beantwortete Fragen", en: "Questions attempted", ur: "حل کیے گئے سوالات" },
    accuracyByCategory: { de: "Genauigkeit nach Kategorie", en: "Accuracy by category", ur: "زمرے کے لحاظ سے درستگی" },
    reviewMissed: { de: "Falsch beantwortete Fragen üben", en: "Review missed questions", ur: "غلط جواب والے سوالات کی مشق کریں" },
    reviewMissedEmpty: { de: "Noch keine falschen Antworten — übe weiter, dann füllt sich das hier.", en: "No missed questions yet — keep practicing and this will fill in.", ur: "ابھی کوئی غلط جواب نہیں — مشق جاری رکھیں، یہ فہرست بھر جائے گی۔" },
    reviewMissedHint: { de: "Sortiert nach den schwächsten und zuletzt falsch beantworteten Fragen.", en: "Ordered so your weakest and most recently missed questions come first.", ur: "سب سے کمزور اور حال ہی میں غلط ہونے والے سوالات پہلے دکھائے جاتے ہیں۔" },
    resetStats: { de: "Statistik zurücksetzen…", en: "Reset all stats…", ur: "تمام اعداد و شمار صاف کریں…" },
    resetConfirm: { de: "Gesamte gespeicherte Statistik zurücksetzen? Dies kann nicht rückgängig gemacht werden.", en: "Reset all saved stats? This cannot be undone.", ur: "تمام محفوظ اعداد و شمار صاف کر دیں؟ یہ عمل واپس نہیں ہو سکتا۔" },
    exitConfirm: { de: "Diese Sitzung verlassen? Dein Fortschritt in dieser Runde geht verloren.", en: "Leave this session? Your progress in this round will be lost.", ur: "یہ سیشن چھوڑ دیں؟ اس دور کی پیش رفت ضائع ہو جائے گی۔" },
    noQuestionsYet: { de: "Für diese Auswahl sind noch keine Fragen verfügbar.", en: "No questions available for this selection yet.", ur: "اس انتخاب کے لیے ابھی کوئی سوال دستیاب نہیں۔" },
    notAttempted: { de: "nicht geübt", en: "not attempted", ur: "مشق نہیں کی" },
    bookmarks: { de: "Lesezeichen", en: "Bookmarks", ur: "بُک مارکس" },
    bookmarkOn: { de: "Lesezeichen setzen", en: "Add bookmark", ur: "بُک مارک لگائیں" },
    bookmarkOff: { de: "Lesezeichen entfernen", en: "Remove bookmark", ur: "بُک مارک ہٹائیں" },
    noBookmarksYet: {
      de: "Du hast noch keine Fragen mit einem Lesezeichen versehen. Tippe während einer Übung auf den Stern, um eine Frage zu markieren.",
      en: "You haven't bookmarked any questions yet. Tap the star while practicing to mark one.",
      ur: "آپ نے ابھی کسی سوال پر بُک مارک نہیں لگایا۔ مشق کے دوران ستارے پر کلک کر کے سوال نشان زد کریں۔"
    },
    footer: {
      de: "Offline · Daten mit dem offiziellen BAMF-Einbürgerungstest abgeglichen (Stand 05.2025)",
      en: "Offline · data cross-checked against the official BAMF Einbürgerungstest (05.2025)",
      ur: "آف لائن · ڈیٹا کا موازنہ سرکاری BAMF شہریت ٹیسٹ سے کیا گیا (05.2025)"
    },
    examTitle: { de: "Prüfungssimulation", en: "Mock exam", ur: "نمونہ امتحان" },
    examSubBefore: { de: "33 Fragen (30 allgemein + 3", en: "33 questions (30 general + 3", ur: "33 سوالات (30 عام + 3" },
    examSubAfter: { de: ") · 60 Minuten · 17 richtig zum Bestehen", en: ") · 60 minutes · 17 correct to pass", ur: ") · 60 منٹ · کامیابی کے لیے 17 درست جواب" },
    examStateLabel: { de: "Bundesland", en: "State", ur: "ریاست" },
    examHistoryBtn: { de: "Verlauf", en: "History", ur: "تاریخچہ" },
    examHistoryHeading: { de: "Prüfungsverlauf", en: "Exam history", ur: "امتحانات کا تاریخچہ" },
    examHistoryEmpty: { de: "Noch keine Prüfungssimulation absolviert.", en: "No mock exams taken yet.", ur: "ابھی کوئی نمونہ امتحان نہیں دیا گیا۔" },
    clearExamHistory: { de: "Verlauf löschen…", en: "Clear history…", ur: "تاریخچہ صاف کریں…" },
    clearExamHistoryConfirm: {
      de: "Gesamten Prüfungsverlauf löschen? Dies kann nicht rückgängig gemacht werden.",
      en: "Clear all exam history? This cannot be undone.",
      ur: "امتحانات کا پورا تاریخچہ صاف کر دیں؟ یہ عمل واپس نہیں ہو سکتا۔"
    },
    reviewAnswers: { de: "Antworten überprüfen", en: "Review answers", ur: "جوابات کا جائزہ لیں" },
    reviewHeading: { de: "Antworten überprüfen", en: "Review answers", ur: "جوابات کا جائزہ" },
    examPass: { de: "Bestanden", en: "Passed", ur: "کامیاب" },
    examFail: { de: "Nicht bestanden", en: "Not passed", ur: "ناکام" },
    examThresholdNote: {
      de: "Mindestens 17 von 33 richtig nötig zum Bestehen.",
      en: "At least 17 of 33 correct required to pass.",
      ur: "کامیابی کے لیے 33 میں سے کم از کم 17 درست جواب ضروری ہیں۔"
    },
    reviewCorrect: { de: "Richtig", en: "Correct", ur: "درست" },
    reviewWrong: { de: "Falsch", en: "Wrong", ur: "غلط" },
    reviewUnanswered: { de: "Nicht beantwortet", en: "Not answered", ur: "جواب نہیں دیا" },
    explanationLabel: { de: "Warum ist das richtig?", en: "Why is this correct?", ur: "یہ کیوں درست ہے؟" },
    modalOk: { de: "OK", en: "OK", ur: "ٹھیک ہے" },
    modalCancel: { de: "Abbrechen", en: "Cancel", ur: "منسوخ کریں" },
    dataNav: { de: "Daten sichern & wiederherstellen", en: "Backup & restore data", ur: "ڈیٹا کا بیک اپ اور بحالی" },
    dataHeading: { de: "Daten sichern & wiederherstellen", en: "Backup & restore data", ur: "ڈیٹا کا بیک اپ اور بحالی" },
    dataExportHeading: { de: "Exportieren", en: "Export", ur: "ایکسپورٹ" },
    dataExportHint: {
      de: "Speichert eine Datei mit deiner Statistik, deinen Lesezeichen und deinem Prüfungsverlauf.",
      en: "Saves a file with your stats, bookmarks, and exam history.",
      ur: "آپ کے اعداد و شمار، بُک مارکس اور امتحانات کے تاریخچے کی فائل محفوظ کرتا ہے۔"
    },
    btnExportDownload: { de: "Datei herunterladen", en: "Download file", ur: "فائل ڈاؤن لوڈ کریں" },
    btnCopyExport: { de: "In Zwischenablage kopieren", en: "Copy to clipboard", ur: "کلپ بورڈ پر کاپی کریں" },
    dataExportFallbackHint: {
      de: "Falls beides nicht funktioniert, markiere den Text unten und kopiere ihn von Hand.",
      en: "If neither works, select the text below and copy it manually.",
      ur: "اگر دونوں کام نہ کریں تو نیچے دیا گیا متن منتخب کر کے خود کاپی کریں۔"
    },
    copySuccess: { de: "In die Zwischenablage kopiert.", en: "Copied to clipboard.", ur: "کلپ بورڈ پر کاپی ہو گیا۔" },
    copyError: { de: "Kopieren nicht möglich — bitte den Text unten markieren und kopieren.", en: "Couldn't copy automatically — please select and copy the text below.", ur: "خودکار کاپی نہیں ہو سکی — براہِ کرم نیچے دیا گیا متن منتخب کر کے کاپی کریں۔" },
    downloadSuccess: { de: "Datei gespeichert.", en: "File saved.", ur: "فائل محفوظ ہو گئی۔" },
    downloadDeclined: { de: "Download abgelehnt.", en: "Download declined.", ur: "ڈاؤن لوڈ مسترد کر دیا گیا۔" },
    downloadRateLimited: { de: "Bitte kurz warten und erneut versuchen.", en: "Please wait a moment and try again.", ur: "براہِ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔" },
    downloadUnavailable: {
      de: "Download in dieser Ansicht nicht verfügbar — nutze stattdessen „Kopieren“.",
      en: "Download isn't available in this view — use \"Copy\" instead.",
      ur: "اس منظر میں ڈاؤن لوڈ دستیاب نہیں — اس کے بجائے \"کاپی\" استعمال کریں۔"
    },
    dataImportHeading: { de: "Importieren", en: "Import", ur: "امپورٹ" },
    dataImportHint: {
      de: "Wähle eine zuvor exportierte Datei aus. Deine aktuellen Daten auf diesem Gerät werden dabei überschrieben.",
      en: "Choose a previously exported file. Your current data on this device will be overwritten.",
      ur: "پہلے سے ایکسپورٹ کی گئی فائل منتخب کریں۔ اس ڈیوائس پر موجود آپ کا موجودہ ڈیٹا تبدیل ہو جائے گا۔"
    },
    btnImportFile: { de: "Datei auswählen…", en: "Choose file…", ur: "فائل منتخب کریں…" },
    dataImportPasteHint: { de: "Oder JSON hier einfügen:", en: "Or paste JSON here:", ur: "یا JSON یہاں پیسٹ کریں:" },
    btnImportApply: { de: "Importieren", en: "Import", ur: "امپورٹ کریں" },
    importConfirm: {
      de: "Deine aktuellen Daten auf diesem Gerät werden durch die importierten Daten ersetzt. Fortfahren?",
      en: "Your current data on this device will be replaced by the imported data. Continue?",
      ur: "اس ڈیوائس پر موجود آپ کا موجودہ ڈیٹا امپورٹ کیے گئے ڈیٹا سے بدل دیا جائے گا۔ جاری رکھیں؟"
    },
    importSuccess: { de: "Import erfolgreich.", en: "Import successful.", ur: "امپورٹ کامیاب رہا۔" },
    importErrorParse: { de: "Ungültiges JSON — die Datei konnte nicht gelesen werden.", en: "Invalid JSON — the file could not be read.", ur: "غلط JSON — فائل پڑھی نہیں جا سکی۔" },
    importErrorFormat: { de: "Diese Datei enthält keine erkennbaren App-Daten.", en: "This file doesn't contain recognizable app data.", ur: "اس فائل میں ایپ کا قابلِ شناخت ڈیٹا موجود نہیں۔" },
    settingsNav: { de: "Einstellungen", en: "Settings", ur: "ترتیبات" },
    settingsHeading: { de: "Einstellungen", en: "Settings", ur: "ترتیبات" },
    fontSizeHeading: { de: "Textgröße", en: "Text size", ur: "متن کا سائز" },
    btnFontDecreaseAria: { de: "Textgröße verkleinern", en: "Decrease text size", ur: "متن چھوٹا کریں" },
    btnFontIncreaseAria: { de: "Textgröße vergrößern", en: "Increase text size", ur: "متن بڑا کریں" },
    btnFontReset: { de: "Zurücksetzen", en: "Reset", ur: "ری سیٹ کریں" },
    shortcutsNav: { de: "Tastenkürzel", en: "Keyboard shortcuts", ur: "کی بورڈ شارٹ کٹس" },
    shortcutsHeading: { de: "Tastenkürzel", en: "Keyboard shortcuts", ur: "کی بورڈ شارٹ کٹس" },
    shortcutToggleEnglish: { de: "Zwischen zwei Sprachen wechseln", en: "Switch between two languages", ur: "دو زبانوں کے درمیان تبدیل کریں" },
    languagePairLabel: { de: "Sprachen für dieses Kürzel", en: "Languages for this shortcut", ur: "اس شارٹ کٹ کی زبانیں" },
    languagePairFirst: { de: "Erste Sprache", en: "First language", ur: "پہلی زبان" },
    languagePairSecond: { de: "Zweite Sprache", en: "Second language", ur: "دوسری زبان" },
    shortcutOption1: { de: "Antwort 1 auswählen", en: "Select answer 1", ur: "جواب 1 منتخب کریں" },
    shortcutOption2: { de: "Antwort 2 auswählen", en: "Select answer 2", ur: "جواب 2 منتخب کریں" },
    shortcutOption3: { de: "Antwort 3 auswählen", en: "Select answer 3", ur: "جواب 3 منتخب کریں" },
    shortcutOption4: { de: "Antwort 4 auswählen", en: "Select answer 4", ur: "جواب 4 منتخب کریں" },
    shortcutNext: { de: "Weiter zur nächsten Frage", en: "Advance to the next question", ur: "اگلے سوال پر جائیں" },
    shortcutBookmark: { de: "Lesezeichen umschalten", en: "Toggle bookmark", ur: "بُک مارک لگائیں/ہٹائیں" },
    shortcutAudio: { de: "Deutsche Audiowiedergabe starten/stoppen", en: "Play/stop German audio", ur: "جرمن آڈیو چلائیں/روکیں" },
    audioPlay: { de: "Auf Deutsch vorlesen", en: "Read aloud in German", ur: "جرمن میں سنیں" },
    audioStop: { de: "Wiedergabe stoppen", en: "Stop audio", ur: "آڈیو روکیں" },
    btnChangeShortcut: { de: "Ändern", en: "Change", ur: "تبدیل کریں" },
    btnCancelListening: { de: "Abbrechen", en: "Cancel", ur: "منسوخ کریں" },
    pressAKey: { de: "Taste drücken… (Esc zum Abbrechen)", en: "Press a key… (Esc to cancel)", ur: "کوئی کلید دبائیں… (منسوخ کرنے کے لیے Esc)" },
    shortcutConflictPrefix: { de: "Diese Taste wird bereits verwendet für: ", en: "This key is already used for: ", ur: "یہ کلید پہلے سے اس کے لیے استعمال ہو رہی ہے: " },
    btnResetShortcuts: { de: "Auf Standard zurücksetzen…", en: "Reset to defaults…", ur: "ڈیفالٹ پر واپس لائیں…" },
    resetShortcutsConfirm: {
      de: "Alle Tastenkürzel auf die Standardwerte zurücksetzen?",
      en: "Reset all keyboard shortcuts to their defaults?",
      ur: "تمام کی بورڈ شارٹ کٹس ڈیفالٹ پر واپس لے آئیں؟"
    },
    mediaHeading: { de: "Offline-Medien", en: "Offline media", ur: "آف لائن میڈیا" },
    mediaHint: {
      de: "Lädt alle Audioaufnahmen und Bilder (etwa 107 MB) auf dieses Gerät, damit sie auch ohne Internet funktionieren. Am besten im WLAN.",
      en: "Saves all audio clips and images (about 107 MB) on this device so they work without internet. Wi-Fi recommended.",
      ur: "تمام آڈیو کلپس اور تصاویر (تقریباً 107 MB) اس ڈیوائس پر محفوظ کرتا ہے تاکہ وہ انٹرنیٹ کے بغیر بھی چلیں۔ Wi-Fi بہتر رہے گا۔"
    },
    mediaProgress: { de: "{done} von {total} Dateien gespeichert", en: "{done} of {total} files saved", ur: "{total} میں سے {done} فائلیں محفوظ ہیں" },
    mediaComplete: { de: "Alle Medien sind offline verfügbar.", en: "All media is available offline.", ur: "تمام میڈیا آف لائن دستیاب ہے۔" },
    mediaFailed: {
      de: "{count} Dateien konnten nicht geladen werden. Prüfe die Verbindung und versuche es erneut.",
      en: "{count} files could not be downloaded. Check your connection and try again.",
      ur: "{count} فائلیں ڈاؤن لوڈ نہیں ہو سکیں۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔"
    },
    mediaNoSpace: {
      de: "Nicht genug Speicherplatz. Bereits geladene Dateien bleiben erhalten.",
      en: "Not enough storage space. Files already saved have been kept.",
      ur: "اسٹوریج کی جگہ کافی نہیں۔ پہلے سے محفوظ فائلیں برقرار ہیں۔"
    },
    btnMediaDownload: { de: "Alle Medien herunterladen", en: "Download all media", ur: "تمام میڈیا ڈاؤن لوڈ کریں" },
    btnMediaCancel: { de: "Abbrechen", en: "Cancel", ur: "منسوخ کریں" },
    btnMediaRemove: { de: "Heruntergeladene Medien entfernen…", en: "Remove downloaded media…", ur: "ڈاؤن لوڈ شدہ میڈیا ہٹائیں…" },
    mediaRemoveConfirm: {
      de: "Alle gespeicherten Audioaufnahmen und Bilder von diesem Gerät entfernen? Deine Statistik bleibt erhalten.",
      en: "Remove all saved audio clips and images from this device? Your stats are kept.",
      ur: "تمام محفوظ آڈیو کلپس اور تصاویر اس ڈیوائس سے ہٹا دیں؟ آپ کے اعداد و شمار برقرار رہیں گے۔"
    }
  };
  function t(key) { return STRINGS[key][language]; }

  var GENERAL_ORDER = [
    "Law", "Society and Family", "State", "Politics", "Economy",
    "Federal and State Levels", "Religion and Culture", "History",
    "Europe and the World", "Education and Work"
  ];

  var STATE_ORDER = [
    "Bavaria", "Baden-Württemberg", "Berlin", "Brandenburg", "Bremen",
    "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland",
    "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
  ];

  var EXAM_GENERAL_COUNT = 30;
  var EXAM_STATE_COUNT = 3;
  var EXAM_DURATION_MS = 60 * 60 * 1000;
  var EXAM_PASS_THRESHOLD = 17;

  var DATA = [];
  var DATA_BY_ID = {};
  var CATEGORY_DE_BY_EN = {};
  var CATEGORY_UR_BY_EN = {};
  var stats = loadStats();
  var language = loadLanguage();
  var languagePair = loadLanguagePair();
  var theme = loadTheme();
  var fontScale = loadFontScale();
  var bookmarks = loadBookmarks();
  var examState = loadExamState(); // English category key, e.g. "Bavaria" — defaults to STATE_ORDER[0]
  var examHistory = loadExamHistory();
  var examTimerId = null;
  var keybindings = loadKeybindings();
  var listeningForKey = null;

  var session = null; // active quiz session
  var audioRun = 0; // bumped on every start/stop so stale speech callbacks can be ignored
  var audioPlaying = false;
  var audioPlayer = new Audio();
  var audioUtterance = null; // held so the browser can't garbage-collect it mid-speech
  var modalConfirmHandler = null;
  var modalCancelHandler = null;

  // ---------- DOM refs ----------
  var el = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    wireGlobalControls();
    registerServiceWorker();
    fetch("data.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        DATA = json;
        DATA.forEach(function (d) {
          DATA_BY_ID[d.id] = d;
          CATEGORY_DE_BY_EN[d.category_en] = d.category_de;
          CATEGORY_UR_BY_EN[d.category_en] = d.category_ur;
        });
        populateExamStateSelect();
        buildStartScreen();
        showView("start");
      })
      .catch(function (err) {
        showLoadError(err);
      });
  }

  function cacheDom() {
    el.loadStatus = document.getElementById("load-status");
    el.countAll = document.getElementById("count-all");
    el.generalList = document.getElementById("general-list");
    el.stateList = document.getElementById("state-list");

    el.topbarSubtitle = document.getElementById("topbar-subtitle");
    el.btnHome = document.getElementById("btn-home");
    el.btnThemeToggle = document.getElementById("btn-theme-toggle");
    el.themeToggleIcon = document.getElementById("theme-toggle-icon");
    el.btnSettingsNav = document.getElementById("btn-settings-nav");
    el.btnStatsNav = document.getElementById("btn-stats-nav");
    el.langSelect = document.getElementById("lang-select");
    el.btnAll = document.getElementById("btn-all");
    el.btnAllTitle = document.getElementById("scope-card-all-title");
    el.btnBookmarks = document.getElementById("btn-bookmarks");
    el.bookmarksTitle = document.getElementById("scope-card-bookmarks-title");
    el.countBookmarks = document.getElementById("count-bookmarks");
    el.headingByTopic = document.getElementById("heading-by-topic");
    el.headingByState = document.getElementById("heading-by-state");
    el.headingByStateSub = document.getElementById("heading-by-state-sub");
    el.btnExam = document.getElementById("btn-exam");
    el.examTitleEl = document.getElementById("scope-card-exam-title");
    el.examSubEl = document.getElementById("scope-card-exam-sub");
    el.examStateLabel = document.getElementById("exam-state-label");
    el.examStateSelect = document.getElementById("exam-state-select");
    el.btnExamHistory = document.getElementById("btn-exam-history");

    el.viewStart = document.getElementById("view-start");
    el.viewQuiz = document.getElementById("view-quiz");
    el.viewSummary = document.getElementById("view-summary");
    el.viewStats = document.getElementById("view-stats");
    el.viewReview = document.getElementById("view-review");
    el.viewExamHistory = document.getElementById("view-exam-history");

    el.btnQuizExit = document.getElementById("btn-quiz-exit");
    el.btnQuizExitLabel = document.getElementById("btn-quiz-exit-label");
    el.quizProgress = document.getElementById("quiz-progress");
    el.quizScore = document.getElementById("quiz-score");
    el.quizTimer = document.getElementById("quiz-timer");
    el.quizCategory = document.getElementById("quiz-category");
    el.btnBookmark = document.getElementById("btn-bookmark");
    el.bookmarkIcon = document.getElementById("bookmark-icon");
    el.btnAudio = document.getElementById("btn-audio");
    el.audioIcon = document.getElementById("audio-icon");
    el.quizImageWrap = document.getElementById("quiz-image-wrap");
    el.quizImage = document.getElementById("quiz-image");
    el.quizImageCaption = document.getElementById("quiz-image-caption");
    el.quizQuestionDe = document.getElementById("quiz-question-de");
    el.quizQuestionEn = document.getElementById("quiz-question-en");
    el.quizAnswers = document.getElementById("quiz-answers");
    el.quizExplanation = document.getElementById("quiz-explanation");
    el.quizExplanationLabel = document.getElementById("quiz-explanation-label");
    el.quizExplanationDe = document.getElementById("quiz-explanation-de");
    el.quizExplanationEn = document.getElementById("quiz-explanation-en");
    el.quizNextWrap = document.getElementById("quiz-next-wrap");
    el.btnNext = document.getElementById("btn-next");

    el.summaryHeading = document.getElementById("summary-heading");
    el.summaryScore = document.getElementById("summary-score");
    el.summaryPassBadge = document.getElementById("summary-pass-badge");
    el.summaryPct = document.getElementById("summary-pct");
    el.btnReviewAnswers = document.getElementById("btn-review-answers");
    el.btnRetry = document.getElementById("btn-retry");
    el.btnSummaryStats = document.getElementById("btn-summary-stats");
    el.btnSummaryHome = document.getElementById("btn-summary-home");

    el.btnReviewExit = document.getElementById("btn-review-exit");
    el.btnReviewExitLabel = document.getElementById("btn-review-exit-label");
    el.reviewHeadingEl = document.getElementById("review-heading");
    el.reviewList = document.getElementById("review-list");

    el.btnExamHistoryExit = document.getElementById("btn-exam-history-exit");
    el.btnExamHistoryExitLabel = document.getElementById("btn-exam-history-exit-label");
    el.examHistoryHeadingEl = document.getElementById("exam-history-heading");
    el.examHistoryList = document.getElementById("exam-history-list");
    el.examHistoryEmpty = document.getElementById("exam-history-empty");
    el.btnClearExamHistory = document.getElementById("btn-clear-exam-history");

    el.btnStatsExit = document.getElementById("btn-stats-exit");
    el.btnStatsExitLabel = document.getElementById("btn-stats-exit-label");
    el.statsHeading = document.getElementById("stats-heading");
    el.statAccuracyLabel = document.getElementById("stat-accuracy-label");
    el.statAccuracy = document.getElementById("stat-accuracy");
    el.statCoverageLabel = document.getElementById("stat-coverage-label");
    el.statCoverage = document.getElementById("stat-coverage");
    el.headingAccuracyByCategory = document.getElementById("heading-accuracy-by-category");
    el.statsChart = document.getElementById("stats-chart");
    el.btnReviewMissed = document.getElementById("btn-review-missed");
    el.reviewMissedHint = document.getElementById("review-missed-hint");
    el.btnResetStats = document.getElementById("btn-reset-stats");
    el.footerText = document.getElementById("footer-text");

    el.viewSettings = document.getElementById("view-settings");
    el.btnSettingsExit = document.getElementById("btn-settings-exit");
    el.btnSettingsExitLabel = document.getElementById("btn-settings-exit-label");
    el.settingsHeadingEl = document.getElementById("settings-heading");
    el.btnDataNav = document.getElementById("btn-data-nav");
    el.btnShortcutsNav = document.getElementById("btn-shortcuts-nav");
    el.fontSizeHeadingEl = document.getElementById("font-size-heading");
    el.fontSizeValue = document.getElementById("font-size-value");
    el.btnFontDecrease = document.getElementById("btn-font-decrease");
    el.btnFontIncrease = document.getElementById("btn-font-increase");
    el.btnFontReset = document.getElementById("btn-font-reset");

    el.viewShortcuts = document.getElementById("view-shortcuts");
    el.btnShortcutsExit = document.getElementById("btn-shortcuts-exit");
    el.btnShortcutsExitLabel = document.getElementById("btn-shortcuts-exit-label");
    el.shortcutsHeadingEl = document.getElementById("shortcuts-heading");
    el.shortcutsList = document.getElementById("shortcuts-list");
    el.shortcutsStatus = document.getElementById("shortcuts-status");
    el.btnResetShortcuts = document.getElementById("btn-reset-shortcuts");

    el.viewData = document.getElementById("view-data");
    el.btnDataExit = document.getElementById("btn-data-exit");
    el.btnDataExitLabel = document.getElementById("btn-data-exit-label");
    el.dataHeadingEl = document.getElementById("data-heading");
    el.dataExportHeadingEl = document.getElementById("data-export-heading");
    el.dataExportHintEl = document.getElementById("data-export-hint");
    el.btnExportDownload = document.getElementById("btn-export-download");
    el.btnCopyExport = document.getElementById("btn-copy-export");
    el.dataExportFallbackHint = document.getElementById("data-export-fallback-hint");
    el.dataExportText = document.getElementById("data-export-text");
    el.dataImportHeadingEl = document.getElementById("data-import-heading");
    el.dataImportHintEl = document.getElementById("data-import-hint");
    el.importFileLabel = document.getElementById("btn-import-file-label");
    el.importFileInput = document.getElementById("import-file-input");
    el.dataImportPasteHint = document.getElementById("data-import-paste-hint");
    el.dataImportText = document.getElementById("data-import-text");
    el.btnImportApply = document.getElementById("btn-import-apply");
    el.mediaBlock = document.getElementById("media-block");
    el.mediaHeadingEl = document.getElementById("media-heading");
    el.mediaHint = document.getElementById("media-hint");
    el.mediaProgress = document.getElementById("media-progress");
    el.mediaStatus = document.getElementById("media-status");
    el.btnMediaDownload = document.getElementById("btn-media-download");
    el.btnMediaCancel = document.getElementById("btn-media-cancel");
    el.btnMediaRemove = document.getElementById("btn-media-remove");
    el.dataStatus = document.getElementById("data-status");

    el.appModalOverlay = document.getElementById("app-modal-overlay");
    el.appModalMessage = document.getElementById("app-modal-message");
    el.appModalCancel = document.getElementById("app-modal-cancel");
    el.appModalConfirm = document.getElementById("app-modal-confirm");
  }

  function wireGlobalControls() {
    el.btnHome.addEventListener("click", goHome);
    el.btnThemeToggle.addEventListener("click", function () {
      var idx = THEME_CYCLE.indexOf(theme);
      theme = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      saveTheme(theme);
      applyTheme();
      reflectTheme();
    });
    el.btnStatsNav.addEventListener("click", function () {
      buildStatsScreen();
      showView("stats");
    });
    LANGUAGES.forEach(function (code) {
      var option = document.createElement("option");
      option.value = code;
      option.textContent = LANGUAGE_LABEL[code];
      el.langSelect.appendChild(option);
    });
    el.langSelect.addEventListener("change", function () {
      setLanguage(el.langSelect.value);
      // Hand the keyboard back, or the quiz shortcuts would go to the dropdown.
      el.langSelect.blur();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (listeningForKey) {
          listeningForKey = null;
          buildShortcutsScreen();
          return;
        }
        if (!el.appModalOverlay.classList.contains("hidden")) {
          cancelModal();
          return;
        }
      }

      if (listeningForKey) {
        e.preventDefault();
        var action = listeningForKey;
        var newKey = normalizeKey(e.key);
        var conflict = findActionForKey(newKey, action);
        if (conflict) {
          showShortcutsStatus(t("shortcutConflictPrefix") + t(SHORTCUT_LABEL_KEY[conflict]), true);
        } else {
          keybindings[action] = newKey;
          saveKeybindings();
          reflectKeybindingHints();
          el.shortcutsStatus.hidden = true;
        }
        listeningForKey = null;
        buildShortcutsScreen();
        return;
      }

      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;

      var key = normalizeKey(e.key);

      if (key === keybindings.toggleEnglish) {
        e.preventDefault();
        toggleLanguagePair();
        return;
      }

      if (!el.viewQuiz.classList.contains("hidden") && session && !session.finished) {
        if (key === keybindings.bookmark) {
          e.preventDefault();
          toggleBookmark(session.questions[session.index].id);
          return;
        }
        if (key === keybindings.audio) {
          e.preventDefault();
          toggleAudio();
          return;
        }
        if (!session.answered) {
          var optKeys = [keybindings.option1, keybindings.option2, keybindings.option3, keybindings.option4];
          var idx = optKeys.indexOf(key);
          if (idx !== -1 && session.shuffledAnswers && idx < session.shuffledAnswers.length) {
            e.preventDefault();
            chooseAnswer(idx);
            return;
          }
        } else if (key === keybindings.next && !el.quizNextWrap.hidden) {
          e.preventDefault();
          advanceQuestion();
          return;
        }
      }
    });

    el.appModalConfirm.addEventListener("click", function () {
      var handler = modalConfirmHandler;
      closeModal();
      if (handler) handler();
    });
    el.appModalCancel.addEventListener("click", cancelModal);
    el.appModalOverlay.addEventListener("click", function (e) {
      if (e.target === el.appModalOverlay) cancelModal();
    });
    el.btnAll.addEventListener("click", function () {
      startSession({ type: "all", label: t("allQuestions") });
    });
    el.btnBookmarks.addEventListener("click", function () {
      var scope = { type: "bookmarks", label: t("bookmarks") };
      var qs = getQuestionsForScope(scope);
      if (qs.length === 0) {
        showAlert(t("noBookmarksYet"));
        return;
      }
      startSession(scope);
    });
    el.btnBookmark.addEventListener("click", function () {
      if (!session) return;
      toggleBookmark(session.questions[session.index].id);
    });
    el.btnAudio.addEventListener("click", toggleAudio);
    window.addEventListener("pagehide", stopAudio);
    el.btnExam.addEventListener("click", function () {
      startSession({ type: "exam", label: t("examTitle") });
    });
    el.examStateSelect.addEventListener("change", function () {
      examState = el.examStateSelect.value;
      saveExamState(examState);
      updateExamSub();
    });
    el.btnExamHistory.addEventListener("click", function () {
      buildExamHistoryScreen();
      showView("examHistory");
    });

    el.btnQuizExit.addEventListener("click", function () {
      if (session && !session.finished && (session.index > 0 || session.answered)) {
        showConfirm(t("exitConfirm"), goHome);
        return;
      }
      goHome();
    });
    el.btnNext.addEventListener("click", advanceQuestion);

    el.btnRetry.addEventListener("click", function () {
      if (session) startSession(session.scope);
    });
    el.btnSummaryStats.addEventListener("click", function () {
      buildStatsScreen();
      showView("stats");
    });
    el.btnSummaryHome.addEventListener("click", goHome);
    el.btnReviewAnswers.addEventListener("click", function () {
      buildReviewScreen();
      showView("review");
    });
    el.btnReviewExit.addEventListener("click", function () {
      showView("summary");
    });

    el.btnExamHistoryExit.addEventListener("click", function () {
      showView("start");
    });
    el.btnClearExamHistory.addEventListener("click", function () {
      showConfirm(t("clearExamHistoryConfirm"), function () {
        examHistory = [];
        saveExamHistory();
        buildExamHistoryScreen();
      });
    });

    el.btnStatsExit.addEventListener("click", function () {
      showView("start");
    });
    el.btnReviewMissed.addEventListener("click", function () {
      var scope = { type: "missed", label: t("reviewMissed") };
      var qs = getQuestionsForScope(scope);
      if (qs.length === 0) return;
      startSession(scope);
    });
    el.btnResetStats.addEventListener("click", function () {
      showConfirm(t("resetConfirm"), function () {
        stats = {};
        saveStats();
        buildStatsScreen();
      });
    });

    el.btnSettingsNav.addEventListener("click", function () {
      showView("settings");
    });
    el.btnSettingsExit.addEventListener("click", function () {
      showView("start");
    });
    el.btnFontDecrease.addEventListener("click", function () {
      fontScale = Math.max(FONT_SCALE_MIN, fontScale - FONT_SCALE_STEP);
      saveFontScale(fontScale);
      applyFontScale();
      reflectFontScale();
    });
    el.btnFontIncrease.addEventListener("click", function () {
      fontScale = Math.min(FONT_SCALE_MAX, fontScale + FONT_SCALE_STEP);
      saveFontScale(fontScale);
      applyFontScale();
      reflectFontScale();
    });
    el.btnFontReset.addEventListener("click", function () {
      fontScale = FONT_SCALE_DEFAULT;
      saveFontScale(fontScale);
      applyFontScale();
      reflectFontScale();
    });
    el.btnDataNav.addEventListener("click", function () {
      buildDataScreen();
      showView("data");
    });
    el.btnShortcutsNav.addEventListener("click", function () {
      listeningForKey = null;
      el.shortcutsStatus.hidden = true;
      buildShortcutsScreen();
      showView("shortcuts");
    });
    el.btnShortcutsExit.addEventListener("click", function () {
      listeningForKey = null;
      showView("settings");
    });
    el.btnResetShortcuts.addEventListener("click", function () {
      showConfirm(t("resetShortcutsConfirm"), function () {
        keybindings = mergeKeybindings(null);
        saveKeybindings();
        languagePair = normalizeLanguagePair(null);
        saveLanguagePair();
        reflectKeybindingHints();
        el.shortcutsStatus.hidden = true;
        buildShortcutsScreen();
      });
    });
    el.btnDataExit.addEventListener("click", function () {
      showView("settings");
    });
    el.btnMediaDownload.addEventListener("click", downloadAllMedia);
    el.btnMediaCancel.addEventListener("click", function () {
      if (mediaJob) mediaJob.stopped = true;
    });
    el.btnMediaRemove.addEventListener("click", function () {
      showConfirm(t("mediaRemoveConfirm"), removeMedia);
    });
    el.btnExportDownload.addEventListener("click", triggerExportDownload);
    el.btnCopyExport.addEventListener("click", copyExportToClipboard);
    el.dataExportText.addEventListener("focus", function () { el.dataExportText.select(); });
    el.dataExportText.addEventListener("click", function () { el.dataExportText.select(); });
    el.importFileInput.addEventListener("change", function () {
      var file = el.importFileInput.files && el.importFileInput.files[0];
      if (!file) return;
      var reader = new window.FileReader();
      reader.onload = function () {
        el.dataImportText.value = String(reader.result || "");
        attemptImport(el.dataImportText.value);
        el.importFileInput.value = "";
      };
      reader.readAsText(file);
    });
    el.btnImportApply.addEventListener("click", function () {
      attemptImport(el.dataImportText.value);
    });

    reflectLanguageToggle();
    reflectTheme();
    applyFontScale();
    reflectFontScale();
    applyStaticText();
  }

  function reflectLanguageToggle() {
    el.langSelect.value = language;
  }

  function applyStaticText() {
    document.documentElement.lang = language;
    el.topbarSubtitle.textContent = t("subtitle");
    el.btnStatsNav.textContent = t("statsNav");
    reflectKeybindingHints();
    el.headingByTopic.textContent = t("byTopic");
    el.headingByState.textContent = t("byState");
    el.headingByStateSub.textContent = t("byStateSub");
    el.btnQuizExitLabel.textContent = t("exit");
    el.summaryHeading.textContent = t("sessionComplete");
    el.btnRetry.textContent = t("tryAgain");
    el.btnSummaryStats.textContent = t("viewStats");
    el.btnSummaryHome.textContent = t("backToStart");
    el.btnStatsExitLabel.textContent = t("back");
    el.statsHeading.textContent = t("yourStats");
    el.statAccuracyLabel.textContent = t("overallAccuracy");
    el.statCoverageLabel.textContent = t("questionsAttempted");
    el.headingAccuracyByCategory.textContent = t("accuracyByCategory");
    el.btnResetStats.textContent = t("resetStats");
    el.footerText.textContent = t("footer");
    el.bookmarksTitle.textContent = t("bookmarks");
    el.examTitleEl.textContent = t("examTitle");
    updateExamSub();
    el.examStateLabel.textContent = t("examStateLabel");
    el.btnExamHistory.textContent = t("examHistoryBtn");
    el.btnReviewAnswers.textContent = t("reviewAnswers");
    el.btnReviewExitLabel.textContent = t("back");
    el.reviewHeadingEl.textContent = t("reviewHeading");
    el.quizExplanationLabel.textContent = t("explanationLabel");
    el.btnExamHistoryExitLabel.textContent = t("back");
    el.examHistoryHeadingEl.textContent = t("examHistoryHeading");
    el.btnClearExamHistory.textContent = t("clearExamHistory");
    if (DATA.length) populateExamStateSelect();

    el.btnDataNav.textContent = t("dataNav");
    el.btnDataExitLabel.textContent = t("back");
    el.dataHeadingEl.textContent = t("dataHeading");
    el.dataExportHeadingEl.textContent = t("dataExportHeading");
    el.dataExportHintEl.textContent = t("dataExportHint");
    el.btnExportDownload.textContent = t("btnExportDownload");
    el.btnCopyExport.textContent = t("btnCopyExport");
    el.dataExportFallbackHint.textContent = t("dataExportFallbackHint");
    el.dataImportHeadingEl.textContent = t("dataImportHeading");
    el.dataImportHintEl.textContent = t("dataImportHint");
    el.importFileLabel.textContent = t("btnImportFile");
    el.dataImportPasteHint.textContent = t("dataImportPasteHint");
    el.btnImportApply.textContent = t("btnImportApply");
    el.mediaHeadingEl.textContent = t("mediaHeading");
    el.mediaHint.textContent = t("mediaHint");
    el.btnMediaDownload.textContent = t("btnMediaDownload");
    el.btnMediaCancel.textContent = t("btnMediaCancel");
    el.btnMediaRemove.textContent = t("btnMediaRemove");
    renderMedia();

    el.btnSettingsNav.setAttribute("title", t("settingsNav"));
    el.btnSettingsNav.setAttribute("aria-label", t("settingsNav"));
    el.btnSettingsExitLabel.textContent = t("back");
    el.settingsHeadingEl.textContent = t("settingsHeading");
    el.fontSizeHeadingEl.textContent = t("fontSizeHeading");
    el.btnFontDecrease.setAttribute("aria-label", t("btnFontDecreaseAria"));
    el.btnFontIncrease.setAttribute("aria-label", t("btnFontIncreaseAria"));
    el.btnFontReset.textContent = t("btnFontReset");
    el.btnShortcutsNav.textContent = t("shortcutsNav");
    el.btnShortcutsExitLabel.textContent = t("back");
    el.shortcutsHeadingEl.textContent = t("shortcutsHeading");
    el.btnResetShortcuts.textContent = t("btnResetShortcuts");
  }

  function goHome() {
    stopExamTimer();
    session = null;
    if (DATA.length) buildStartScreen();
    showView("start");
  }

  // ---------- Modal (replaces native confirm()/alert(), which sandboxed embeds
  // like Claude Artifacts silently block — those calls returned falsy no-ops there) ----------
  function openModal(message, showCancel, onConfirm) {
    el.appModalMessage.textContent = message;
    el.appModalCancel.hidden = !showCancel;
    el.appModalConfirm.textContent = t("modalOk");
    el.appModalCancel.textContent = t("modalCancel");
    modalConfirmHandler = onConfirm || null;
    modalCancelHandler = null;
    el.appModalOverlay.classList.remove("hidden");
  }
  function closeModal() {
    el.appModalOverlay.classList.add("hidden");
    modalConfirmHandler = null;
    modalCancelHandler = null;
  }
  function cancelModal() {
    var handler = modalCancelHandler;
    closeModal();
    if (handler) handler();
  }
  function showConfirm(message, onConfirm) {
    openModal(message, true, onConfirm);
  }
  function showAlert(message, onClose) {
    openModal(message, false, onClose);
  }

  // From a language outside the pair, this goes to the pair's first language.
  function toggleLanguagePair() {
    setLanguage(language === languagePair[0] ? languagePair[1] : languagePair[0]);
  }

  function setLanguage(code) {
    language = code;
    saveLanguage(language);
    reflectLanguageToggle();
    reflectTheme();
    applyStaticText();
    if (DATA.length) buildStartScreen();
    if (session && !session.finished) {
      if (session.answered) {
        refreshQuestionLanguage();
      } else {
        renderQuestion();
      }
    }
    if (!el.viewStats.classList.contains("hidden")) buildStatsScreen();
    if (!el.viewReview.classList.contains("hidden")) buildReviewScreen();
    if (!el.viewExamHistory.classList.contains("hidden")) buildExamHistoryScreen();
    if (!el.viewShortcuts.classList.contains("hidden")) buildShortcutsScreen();
  }

  function applyTheme() {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function reflectTheme() {
    var label = THEME_LABEL[theme][language];
    el.themeToggleIcon.textContent = THEME_ICON[theme];
    el.btnThemeToggle.setAttribute("title", t("themeTitle") + ": " + label + " (" + t("themeTapToChange") + ")");
    el.btnThemeToggle.setAttribute("aria-label", t("themeAria") + ": " + label + " (" + t("themeTapToChange") + ")");
  }

  function applyFontScale() {
    document.documentElement.style.setProperty("--app-zoom", fontScale / 100);
  }

  function reflectFontScale() {
    el.fontSizeValue.textContent = fontScale + "%";
    el.btnFontDecrease.disabled = fontScale <= FONT_SCALE_MIN;
    el.btnFontIncrease.disabled = fontScale >= FONT_SCALE_MAX;
    el.btnFontReset.disabled = fontScale === FONT_SCALE_DEFAULT;
  }

  function toggleBookmark(qId) {
    var key = String(qId);
    if (bookmarks[key]) {
      delete bookmarks[key];
    } else {
      bookmarks[key] = true;
    }
    saveBookmarks();
    reflectBookmarkButton(qId);
  }

  function reflectBookmarkButton(qId) {
    var isBookmarked = !!bookmarks[String(qId)];
    el.btnBookmark.setAttribute("aria-pressed", isBookmarked ? "true" : "false");
    el.bookmarkIcon.textContent = isBookmarked ? "★" : "☆";
    var label = isBookmarked ? t("bookmarkOff") : t("bookmarkOn");
    label += " (" + displayKeyLabel(keybindings.bookmark) + ")";
    el.btnBookmark.setAttribute("title", label);
    el.btnBookmark.setAttribute("aria-label", label);
  }

  // ---------- German audio ----------
  // Plays the pre-generated clips in audio/ (see tools/generate_audio.py). If a clip
  // can't be played, the rest is read by the browser's speech synthesis instead.
  function speechSupported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  function findGermanVoice() {
    var voices = window.speechSynthesis.getVoices();
    var german = voices.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
    var best = null;
    var bestScore = -Infinity;
    german.forEach(function (v) {
      var score = germanVoiceScore(v);
      if (score > bestScore) {
        best = v;
        bestScore = score;
      }
    });
    return best;
  }

  // Higher is better. Neural and network voices sound far more natural than the
  // compact system ones, and macOS lists novelty voices alongside the normal ones.
  function germanVoiceScore(voice) {
    var name = voice.name;
    var score = /^de[-_]DE$/i.test(voice.lang) ? 1 : 0;
    if (/natural|neural/i.test(name)) return score + 50;
    if (/premium/i.test(name)) return score + 40;
    if (/enhanced|erweitert/i.test(name)) return score + 30;
    if (/google/i.test(name)) return score + 20;
    if (/^(anna|petra|markus|viktor|helena|katja|hedda|stefan)\b/i.test(name)) return score + 10;
    if (/^(eddy|flo|grandma|grandpa|oma|opa|reed|rocko|sandy|shelley)\b/i.test(name)) return score - 10;
    return score;
  }

  // The German text currently on screen, in reading order. Answer numbers are
  // separate clips because the answers are shuffled for every question.
  function getAudioParts() {
    var q = session.questions[session.index];
    var parts = [{ src: "audio/q" + q.id + ".mp3", text: q.question_de }];
    session.shuffledAnswers.forEach(function (ans, i) {
      var number = i + 1;
      parts.push({ src: "audio/antwort-" + number + ".mp3", text: "Antwort " + number });
      parts.push({ src: "audio/q" + q.id + "-a" + ans.origIndex + ".mp3", text: ans.text_de });
    });
    if (!el.quizExplanation.hidden) {
      parts.push({ src: "audio/q" + q.id + "-e.mp3", text: q.explanation_de });
    }
    return parts;
  }

  function toggleAudio() {
    if (!session) return;
    if (audioPlaying) {
      stopAudio();
    } else {
      playAudio(getAudioParts());
    }
  }

  function playAudio(parts) {
    stopAudio();
    var run = audioRun;
    var next = 0;
    var fellBack = false;

    function playNext() {
      if (run !== audioRun) return;
      if (next >= parts.length) {
        stopAudio();
        return;
      }
      var part = parts[next];
      audioPlayer.onended = function () {
        if (run !== audioRun) return;
        next += 1;
        playNext();
      };
      audioPlayer.onerror = fallBack;
      audioPlayer.src = part.src;
      var playing = audioPlayer.play();
      if (playing) playing.catch(fallBack);
    }

    // A failed clip can report through both the error event and the play() promise.
    function fallBack() {
      if (run !== audioRun || fellBack) return;
      fellBack = true;
      audioPlayer.onended = null;
      audioPlayer.onerror = null;
      speakParts(parts.slice(next), run);
    }

    audioPlaying = true;
    reflectAudioButton();
    playNext();
  }

  function speakParts(parts, run) {
    if (!speechSupported()) {
      stopAudio();
      return;
    }
    // Sentence by sentence, because Chrome can cut off a single long utterance.
    var texts = [];
    parts.forEach(function (part) {
      texts = texts.concat(part.text.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/));
    });
    var voice = findGermanVoice();
    var next = 0;

    function speakNext() {
      if (run !== audioRun) return;
      if (next >= texts.length) {
        stopAudio();
        return;
      }
      var utterance = new SpeechSynthesisUtterance(texts[next]);
      next += 1;
      utterance.lang = "de-DE";
      if (voice) utterance.voice = voice;
      utterance.onend = speakNext;
      utterance.onerror = function () {
        if (run === audioRun) stopAudio();
      };
      audioUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    speakNext();
  }

  function stopAudio() {
    audioRun += 1;
    audioUtterance = null;
    audioPlaying = false;
    audioPlayer.onended = null;
    audioPlayer.onerror = null;
    audioPlayer.pause();
    if (speechSupported()) window.speechSynthesis.cancel();
    reflectAudioButton();
  }

  function reflectAudioButton() {
    el.btnAudio.setAttribute("aria-pressed", audioPlaying ? "true" : "false");
    el.audioIcon.textContent = audioPlaying ? "⏹" : "🔊";
    var label = t(audioPlaying ? "audioStop" : "audioPlay") + " (" + displayKeyLabel(keybindings.audio) + ")";
    el.btnAudio.setAttribute("title", label);
    el.btnAudio.setAttribute("aria-label", label);
  }

  // ---------- Translations ----------
  // Translated value of a question field such as "question", or "" in German mode.
  function translated(q, field) {
    return language === "de" ? "" : (q[field + "_" + language] || "");
  }

  function answerTranslation(ans) {
    var text = language === "de" ? "" : ans["text_" + language];
    return text && text !== ans.text_de ? text : "";
  }

  function categoryTranslation(nameEn) {
    if (language === "ur") return CATEGORY_UR_BY_EN[nameEn] || nameEn;
    return language === "en" ? nameEn : "";
  }

  function stateDisplayName(stateEn) {
    return categoryTranslation(stateEn) || CATEGORY_DE_BY_EN[stateEn] || stateEn;
  }

  // ---------- Exam state select ----------
  function populateExamStateSelect() {
    if (!STATE_ORDER.some(function (s) { return CATEGORY_DE_BY_EN[s]; })) return;
    var current = el.examStateSelect.value || examState;
    el.examStateSelect.innerHTML = "";
    STATE_ORDER.forEach(function (stateEn) {
      var opt = document.createElement("option");
      opt.value = stateEn;
      opt.textContent = stateDisplayName(stateEn);
      el.examStateSelect.appendChild(opt);
    });
    el.examStateSelect.value = current;
    if (el.examStateSelect.value !== current) {
      // stored preference no longer valid — fall back to default
      examState = STATE_ORDER[0];
      el.examStateSelect.value = examState;
      saveExamState(examState);
    }
    updateExamSub();
  }

  function updateExamSub() {
    if (!el.examSubEl) return;
    var stateName = stateDisplayName(examState);
    el.examSubEl.textContent = t("examSubBefore") + " " + stateName + t("examSubAfter");
  }

  function showLoadError(err) {
    el.loadStatus.hidden = false;
    el.loadStatus.textContent =
      "Could not load data.json (" + err.message + "). " +
      "If you opened this file directly in the browser, some browsers block " +
      "local file access for security reasons. Try serving the folder instead, " +
      "e.g. run: python3 -m http.server, then open http://localhost:8000/";
  }

  // ---------- View switching ----------
  function showView(name) {
    stopAudio();
    [el.viewStart, el.viewQuiz, el.viewSummary, el.viewStats, el.viewReview, el.viewExamHistory, el.viewData, el.viewShortcuts, el.viewSettings].forEach(function (v) {
      v.classList.add("hidden");
    });
    var map = {
      start: el.viewStart, quiz: el.viewQuiz, summary: el.viewSummary, stats: el.viewStats,
      review: el.viewReview, examHistory: el.viewExamHistory, data: el.viewData, shortcuts: el.viewShortcuts,
      settings: el.viewSettings
    };
    map[name].classList.remove("hidden");
    window.scrollTo(0, 0);
    if (name === "settings") refreshMedia();
  }

  // ---------- Offline support ----------
  var mediaSaved = 0;
  var mediaNotice = null; // { text, kind } shown under the progress bar
  var mediaJob = null; // the running download

  function offlineSupported() {
    return "serviceWorker" in navigator && "caches" in window;
  }

  function registerServiceWorker() {
    if (!offlineSupported()) return;
    navigator.serviceWorker.register("sw.js").catch(function () {
      // The app works the same without it, only not offline.
    });
  }

  // Every audio clip and image the app can ask for.
  function listMediaFiles() {
    var files = ["audio/antwort-1.mp3", "audio/antwort-2.mp3", "audio/antwort-3.mp3", "audio/antwort-4.mp3"];
    DATA.forEach(function (q) {
      files.push("audio/q" + q.id + ".mp3");
      q.answers_de.forEach(function (_, i) { files.push("audio/q" + q.id + "-a" + i + ".mp3"); });
      if (q.explanation_de) files.push("audio/q" + q.id + "-e.mp3");
      if (q.img && q.img.url && files.indexOf("img/" + q.img.url + ".png") < 0) {
        files.push("img/" + q.img.url + ".png"); // some questions share an image
      }
    });
    return files.map(function (file) { return new URL(file, location.href).href; });
  }

  function missingMedia(cache) {
    return cache.keys().then(function (requests) {
      var saved = {};
      requests.forEach(function (request) { saved[request.url] = true; });
      return listMediaFiles().filter(function (url) { return !saved[url]; });
    });
  }

  function refreshMedia() {
    if (!offlineSupported() || mediaJob) return renderMedia();
    caches.open(MEDIA_CACHE).then(missingMedia).then(function (missing) {
      mediaSaved = listMediaFiles().length - missing.length;
      renderMedia();
    }).catch(renderMedia);
  }

  function renderMedia() {
    el.mediaBlock.hidden = !offlineSupported();
    var total = listMediaFiles().length;
    var complete = total > 0 && mediaSaved >= total;
    el.mediaProgress.max = total || 1;
    el.mediaProgress.value = mediaSaved;
    el.btnMediaDownload.hidden = !!mediaJob || complete;
    el.btnMediaCancel.hidden = !mediaJob;
    el.btnMediaRemove.hidden = !!mediaJob || mediaSaved === 0;

    var kind = "";
    var text = t("mediaProgress").replace("{done}", mediaSaved).replace("{total}", total);
    if (!mediaJob && complete) {
      text = t("mediaComplete");
      kind = "is-success";
    } else if (!mediaJob && mediaNotice) {
      text = mediaNotice.text;
      kind = "is-error";
    }
    el.mediaStatus.textContent = text;
    el.mediaStatus.className = "hint " + kind;
  }

  function downloadAllMedia() {
    if (mediaJob || !DATA.length) return;
    var job = mediaJob = { stopped: false, failed: 0, noSpace: false };
    mediaNotice = null;
    renderMedia();
    // Asks the browser not to clear this data when storage runs low.
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();

    caches.open(MEDIA_CACHE).then(function (cache) {
      return missingMedia(cache).then(function (missing) {
        mediaSaved = listMediaFiles().length - missing.length;
        renderMedia();

        function nextFile() {
          if (job.stopped || !missing.length) return Promise.resolve();
          var url = missing.shift();
          // The header tells sw.js to leave this request alone.
          return fetch(url, { headers: { "x-lid-media-download": "1" } }).then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return cache.put(url, res);
          }).then(function () {
            mediaSaved++;
            renderMedia();
          }).catch(function (err) {
            if (err && err.name === "QuotaExceededError") {
              job.noSpace = true;
              job.stopped = true;
            } else {
              job.failed++;
            }
          }).then(nextFile);
        }

        var workers = [];
        for (var i = 0; i < MEDIA_DOWNLOADS_AT_ONCE; i++) workers.push(nextFile());
        return Promise.all(workers);
      });
    }).catch(function () {
      job.failed = job.failed || 1;
    }).then(function () {
      mediaJob = null;
      if (job.noSpace) mediaNotice = { text: t("mediaNoSpace") };
      else if (job.failed) mediaNotice = { text: t("mediaFailed").replace("{count}", job.failed) };
      refreshMedia();
    });
  }

  function removeMedia() {
    caches.delete(MEDIA_CACHE).then(function () {
      mediaSaved = 0;
      mediaNotice = null;
      renderMedia();
    });
  }

  // ---------- Start screen ----------
  function buildStartScreen() {
    el.countAll.textContent = String(DATA.length);
    el.btnAllTitle.textContent = t("allQuestions");
    el.bookmarksTitle.textContent = t("bookmarks");
    el.countBookmarks.textContent = String(Object.keys(bookmarks).length);

    var byCategory = {};
    DATA.forEach(function (d) {
      byCategory[d.category_en] = (byCategory[d.category_en] || 0) + 1;
    });

    el.generalList.innerHTML = "";
    GENERAL_ORDER.forEach(function (name) {
      if (!byCategory[name]) return;
      el.generalList.appendChild(makeScopeItem(name, CATEGORY_DE_BY_EN[name], byCategory[name]));
    });

    el.stateList.innerHTML = "";
    STATE_ORDER.forEach(function (name) {
      if (!byCategory[name]) return;
      el.stateList.appendChild(makeScopeItem(name, CATEGORY_DE_BY_EN[name], byCategory[name]));
    });
  }

  function makeScopeItem(nameEn, nameDe, count) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scope-item";
    var nameWrap = document.createElement("span");
    nameWrap.className = "scope-item-names";
    var nameSpan = document.createElement("span");
    nameSpan.className = "scope-item-name";
    nameSpan.textContent = nameDe;
    nameWrap.appendChild(nameSpan);
    var nameTranslated = categoryTranslation(nameEn);
    if (nameTranslated && nameTranslated !== nameDe) {
      var nameEnSpan = document.createElement("span");
      nameEnSpan.className = "scope-item-name-en";
      nameEnSpan.textContent = nameTranslated;
      nameWrap.appendChild(nameEnSpan);
    }
    btn.appendChild(nameWrap);
    var countSpan = document.createElement("span");
    countSpan.className = "scope-item-count";
    countSpan.textContent = String(count);
    btn.appendChild(countSpan);
    btn.addEventListener("click", function () {
      startSession({ type: "category", category_en: nameEn, label: nameDe });
    });
    return btn;
  }

  // ---------- Scope -> question list ----------
  function getQuestionsForScope(scope) {
    if (scope.type === "all") {
      return shuffle(DATA.slice());
    }
    if (scope.type === "category") {
      return shuffle(DATA.filter(function (d) { return d.category_en === scope.category_en; }));
    }
    if (scope.type === "missed") {
      var entries = [];
      Object.keys(stats).forEach(function (key) {
        var s = stats[key];
        if (s.wrong > 0 && DATA_BY_ID[key] !== undefined) {
          var attempts = s.correct + s.wrong;
          var accuracy = attempts > 0 ? s.correct / attempts : 0;
          entries.push({ id: key, accuracy: accuracy, lastWrong: s.lastWrong || 0 });
        }
      });
      entries.sort(function (a, b) {
        if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy; // worst accuracy first
        return b.lastWrong - a.lastWrong; // most recently wrong first
      });
      return entries.map(function (e) { return DATA_BY_ID[e.id]; });
    }
    if (scope.type === "bookmarks") {
      return shuffle(DATA.filter(function (d) { return !!bookmarks[String(d.id)]; }));
    }
    if (scope.type === "exam") {
      var generalPool = shuffle(DATA.filter(function (d) { return GENERAL_ORDER.indexOf(d.category_en) !== -1; }));
      var statePool = shuffle(DATA.filter(function (d) { return d.category_en === (scope.stateEn || examState); }));
      var chosen = generalPool.slice(0, EXAM_GENERAL_COUNT).concat(statePool.slice(0, EXAM_STATE_COUNT));
      return shuffle(chosen);
    }
    return [];
  }

  // ---------- Quiz session ----------
  function startSession(scope) {
    stopExamTimer();
    var questions = getQuestionsForScope(scope);
    if (questions.length === 0) {
      showAlert(t("noQuestionsYet"));
      return;
    }
    var isExam = scope.type === "exam";
    session = {
      scope: scope,
      questions: questions,
      index: 0,
      score: 0,
      answered: false,
      finished: false,
      shuffledAnswers: null,
      isExam: isExam,
      answers: isExam ? [] : null,
      examEndAt: isExam ? (Date.now() + EXAM_DURATION_MS) : null,
      examState: isExam ? examState : null
    };
    if (isExam) startExamTimer();
    showView("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    var q = session.questions[session.index];
    session.answered = false;
    stopAudio();

    // record "shown" for this question
    var key = String(q.id);
    if (!stats[key]) stats[key] = { shown: 0, correct: 0, wrong: 0, lastSeen: 0, lastWrong: 0 };
    stats[key].shown += 1;
    stats[key].lastSeen = Date.now();
    saveStats();

    el.quizProgress.textContent = t("question") + " " + (session.index + 1) + " " + t("of") + " " + session.questions.length;
    if (session.isExam) {
      el.quizScore.hidden = true;
      el.quizTimer.hidden = false;
      updateExamTimerDisplay();
    } else {
      el.quizScore.hidden = false;
      el.quizTimer.hidden = true;
      el.quizScore.textContent = t("score") + ": " + session.score + "/" + session.index;
    }
    el.quizCategory.textContent = q.category_de + (language !== "de" ? " · " + categoryTranslation(q.category_en) : "");
    reflectBookmarkButton(q.id);

    if (q.img && q.img.url) {
      el.quizImageWrap.hidden = false;
      el.quizImage.src = "img/" + q.img.url + ".png";
      el.quizImage.alt = q.question_en || q.question_de;
      if (q.img.text) {
        el.quizImageCaption.hidden = false;
        el.quizImageCaption.textContent = q.img.text;
      } else {
        el.quizImageCaption.hidden = true;
        el.quizImageCaption.textContent = "";
      }
    } else {
      el.quizImageWrap.hidden = true;
      el.quizImage.removeAttribute("src");
    }

    el.quizQuestionDe.textContent = q.question_de;
    if (language !== "de") {
      el.quizQuestionEn.hidden = false;
      el.quizQuestionEn.textContent = translated(q, "question");
    } else {
      el.quizQuestionEn.hidden = true;
    }

    // shuffle answer order
    var order = shuffle([0, 1, 2, 3]);
    session.shuffledAnswers = order.map(function (origIndex) {
      return {
        origIndex: origIndex,
        text_de: q.answers_de[origIndex],
        text_en: q.answers_en[origIndex],
        text_ur: q.answers_ur ? q.answers_ur[origIndex] : "",
        isCorrect: origIndex === q.correct
      };
    });

    el.quizAnswers.innerHTML = "";
    session.shuffledAnswers.forEach(function (ans, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";

      var num = document.createElement("span");
      num.className = "answer-num";
      num.textContent = String(i + 1);
      btn.appendChild(num);

      var textWrap = document.createElement("div");
      textWrap.className = "answer-text-wrap";

      var deLine = document.createElement("div");
      deLine.className = "answer-text-de";
      deLine.textContent = ans.text_de;
      textWrap.appendChild(deLine);

      var answerText = answerTranslation(ans);
      if (answerText) {
        var enLine = document.createElement("div");
        enLine.className = "answer-text-en";
        enLine.textContent = answerText;
        textWrap.appendChild(enLine);
      }
      btn.appendChild(textWrap);

      btn.addEventListener("click", function () { chooseAnswer(i); });
      el.quizAnswers.appendChild(btn);
    });

    el.quizExplanation.hidden = true;
    el.quizNextWrap.hidden = true;
  }

  // Updates only the language-dependent text on an already-answered question,
  // without touching session state, stats, shuffle order, or reveal coloring —
  // renderQuestion() would reset all of that and let the question be answered twice.
  function refreshQuestionLanguage() {
    var q = session.questions[session.index];

    el.quizCategory.textContent = q.category_de + (language !== "de" ? " · " + categoryTranslation(q.category_en) : "");
    if (q.img && q.img.url) el.quizImage.alt = q.question_en || q.question_de;

    if (language !== "de") {
      el.quizQuestionEn.hidden = false;
      el.quizQuestionEn.textContent = translated(q, "question");
    } else {
      el.quizQuestionEn.hidden = true;
    }

    var buttons = el.quizAnswers.querySelectorAll(".answer-btn");
    buttons.forEach(function (b, i) {
      var ans = session.shuffledAnswers[i];
      var textWrap = b.querySelector(".answer-text-wrap");
      var enLine = b.querySelector(".answer-text-en");
      var answerText = answerTranslation(ans);
      if (answerText) {
        if (!enLine) {
          enLine = document.createElement("div");
          enLine.className = "answer-text-en";
          textWrap.appendChild(enLine);
        }
        enLine.textContent = answerText;
      } else if (enLine) {
        enLine.remove();
      }
    });

    if (!session.isExam && q.explanation_de && !el.quizExplanation.hidden) {
      if (translated(q, "explanation")) {
        el.quizExplanationEn.hidden = false;
        el.quizExplanationEn.textContent = translated(q, "explanation");
      } else {
        el.quizExplanationEn.hidden = true;
      }
    }
  }

  function chooseAnswer(choiceIndex) {
    if (session.answered) return;
    session.answered = true;

    var buttons = el.quizAnswers.querySelectorAll(".answer-btn");
    var chosen = session.shuffledAnswers[choiceIndex];
    var q = session.questions[session.index];

    buttons.forEach(function (b, i) {
      b.classList.add("is-disabled");
      var ans = session.shuffledAnswers[i];
      if (session.isExam) {
        if (i === choiceIndex) b.classList.add("is-selected-neutral");
        return;
      }
      if (i === choiceIndex && ans.isCorrect) {
        b.classList.add("is-chosen-correct");
      } else if (i === choiceIndex && !ans.isCorrect) {
        b.classList.add("is-chosen-wrong");
      } else if (ans.isCorrect) {
        b.classList.add("is-reveal-correct");
      }
    });

    var wasCorrect = chosen.isCorrect;
    if (wasCorrect) session.score += 1;

    var key = String(q.id);
    var s = stats[key];
    if (wasCorrect) {
      s.correct += 1;
    } else {
      s.wrong += 1;
      s.lastWrong = Date.now();
    }
    s.lastSeen = Date.now();
    saveStats();

    if (session.isExam) {
      session.answers[session.index] = {
        qId: q.id,
        chosenOrigIndex: chosen.origIndex,
        isCorrect: wasCorrect
      };
    } else {
      el.quizScore.textContent = t("score") + ": " + session.score + "/" + (session.index + 1);
      if (q.explanation_de) {
        el.quizExplanation.hidden = false;
        el.quizExplanationDe.textContent = q.explanation_de;
        if (translated(q, "explanation")) {
          el.quizExplanationEn.hidden = false;
          el.quizExplanationEn.textContent = translated(q, "explanation");
        } else {
          el.quizExplanationEn.hidden = true;
        }
      }
    }
    el.quizNextWrap.hidden = false;
    el.btnNext.textContent = (session.index === session.questions.length - 1) ? t("finish") : t("next");
  }

  function advanceQuestion() {
    if (!session.answered) return;
    if (session.index + 1 >= session.questions.length) {
      session.finished = true;
      showSummary();
      return;
    }
    session.index += 1;
    renderQuestion();
  }

  function showSummary() {
    stopExamTimer();
    var total = session.questions.length;
    el.summaryScore.textContent = session.score + " / " + total;

    if (session.isExam) {
      var passed = session.score >= EXAM_PASS_THRESHOLD;
      el.summaryPassBadge.hidden = false;
      el.summaryPassBadge.textContent = passed ? t("examPass") : t("examFail");
      el.summaryPassBadge.className = "summary-pass-badge " + (passed ? "is-pass" : "is-fail");
      el.summaryPct.textContent = t("examThresholdNote");
      el.btnReviewAnswers.hidden = false;
      if (!session.recorded) {
        session.recorded = true;
        examHistory.unshift({
          date: Date.now(),
          score: session.score,
          total: total,
          passed: passed,
          stateEn: session.examState
        });
        if (examHistory.length > EXAM_HISTORY_MAX) examHistory.length = EXAM_HISTORY_MAX;
        saveExamHistory();
      }
    } else {
      el.summaryPassBadge.hidden = true;
      var pct = total > 0 ? Math.round((session.score / total) * 100) : 0;
      el.summaryPct.textContent = pct + "% " + t("correctSuffix") + " — " + (session.scope.label || "");
      el.btnReviewAnswers.hidden = true;
    }
    showView("summary");
  }

  // ---------- Exam timer ----------
  function startExamTimer() {
    stopExamTimer();
    updateExamTimerDisplay();
    examTimerId = window.setInterval(tickExamTimer, 1000);
  }

  function stopExamTimer() {
    if (examTimerId !== null) {
      window.clearInterval(examTimerId);
      examTimerId = null;
    }
  }

  function tickExamTimer() {
    if (!session || !session.isExam) {
      stopExamTimer();
      return;
    }
    var remaining = session.examEndAt - Date.now();
    if (remaining <= 0) {
      stopExamTimer();
      session.finished = true;
      showSummary();
      return;
    }
    updateExamTimerDisplay();
  }

  function updateExamTimerDisplay() {
    if (!session || !session.isExam || !el.quizTimer) return;
    var remaining = Math.max(0, session.examEndAt - Date.now());
    var totalSeconds = Math.ceil(remaining / 1000);
    var mm = Math.floor(totalSeconds / 60);
    var ss = totalSeconds % 60;
    el.quizTimer.textContent = mm + ":" + (ss < 10 ? "0" : "") + ss;
    el.quizTimer.classList.toggle("is-low", remaining <= 5 * 60 * 1000);
  }

  // ---------- Review screen ----------
  function buildReviewScreen() {
    el.reviewList.innerHTML = "";
    session.questions.forEach(function (q, i) {
      var ans = session.answers[i];
      var item = document.createElement("div");
      item.className = "review-item";

      var head = document.createElement("div");
      head.className = "review-item-head";
      var num = document.createElement("span");
      num.className = "review-item-num";
      num.textContent = "#" + (i + 1) + " · " + q.category_de;
      var status = document.createElement("span");
      var statusCls, statusText;
      if (!ans) {
        statusCls = "is-unanswered";
        statusText = t("reviewUnanswered");
      } else if (ans.isCorrect) {
        statusCls = "is-correct";
        statusText = t("reviewCorrect");
      } else {
        statusCls = "is-wrong";
        statusText = t("reviewWrong");
      }
      status.className = "review-item-status " + statusCls;
      status.textContent = statusText;
      head.appendChild(num);
      head.appendChild(status);
      item.appendChild(head);

      var question = document.createElement("p");
      question.className = "review-item-question";
      question.textContent = q.question_de;
      item.appendChild(question);
      if (language !== "de") {
        var questionEn = document.createElement("p");
        questionEn.className = "review-item-question-en";
        questionEn.textContent = translated(q, "question");
        item.appendChild(questionEn);
      }

      var answersWrap = document.createElement("div");
      answersWrap.className = "review-item-answers";
      q.answers_de.forEach(function (text, origIdx) {
        var row = document.createElement("div");
        row.className = "review-item-answer";
        if (origIdx === q.correct) row.classList.add("is-correct-answer");
        if (ans && !ans.isCorrect && origIdx === ans.chosenOrigIndex) row.classList.add("is-wrong-chosen");
        row.textContent = text;
        var rowTranslation = language === "de" ? "" : (q["answers_" + language] || [])[origIdx];
        if (rowTranslation && rowTranslation !== text) {
          var rowLine = document.createElement("div");
          rowLine.className = "review-item-answer-translation";
          rowLine.textContent = rowTranslation;
          row.appendChild(rowLine);
        }
        answersWrap.appendChild(row);
      });
      item.appendChild(answersWrap);

      if (q.explanation_de) {
        var expl = document.createElement("div");
        expl.className = "review-item-explanation";
        var explLabel = document.createElement("div");
        explLabel.className = "review-item-explanation-label";
        explLabel.textContent = t("explanationLabel");
        var explDe = document.createElement("p");
        explDe.className = "review-item-explanation-text";
        explDe.textContent = q.explanation_de;
        expl.appendChild(explLabel);
        expl.appendChild(explDe);
        if (translated(q, "explanation")) {
          var explEn = document.createElement("p");
          explEn.className = "review-item-explanation-text-en";
          explEn.textContent = translated(q, "explanation");
          expl.appendChild(explEn);
        }
        item.appendChild(expl);
      }

      el.reviewList.appendChild(item);
    });
  }

  // ---------- Exam history screen ----------
  function buildExamHistoryScreen() {
    el.examHistoryList.innerHTML = "";
    var locale = LANGUAGE_LOCALE[language];

    if (examHistory.length === 0) {
      el.examHistoryEmpty.hidden = false;
      el.examHistoryEmpty.textContent = t("examHistoryEmpty");
      el.btnClearExamHistory.hidden = true;
      return;
    }
    el.examHistoryEmpty.hidden = true;
    el.btnClearExamHistory.hidden = false;

    examHistory.forEach(function (entry) {
      var item = document.createElement("div");
      item.className = "exam-history-item";

      var info = document.createElement("div");
      info.className = "exam-history-item-info";
      var dateEl = document.createElement("div");
      dateEl.className = "exam-history-item-date";
      dateEl.textContent = new Date(entry.date).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
      var metaEl = document.createElement("div");
      metaEl.className = "exam-history-item-meta";
      var stateName = stateDisplayName(entry.stateEn);
      metaEl.textContent = stateName;
      info.appendChild(dateEl);
      info.appendChild(metaEl);

      var right = document.createElement("div");
      right.className = "exam-history-item-right";
      var scoreEl = document.createElement("span");
      scoreEl.className = "exam-history-item-score";
      scoreEl.textContent = entry.score + "/" + entry.total;
      var badge = document.createElement("span");
      badge.className = "summary-pass-badge " + (entry.passed ? "is-pass" : "is-fail");
      badge.textContent = entry.passed ? t("examPass") : t("examFail");
      right.appendChild(scoreEl);
      right.appendChild(badge);

      item.appendChild(info);
      item.appendChild(right);
      el.examHistoryList.appendChild(item);
    });
  }

  // ---------- Data backup / restore ----------
  function buildExportPayload() {
    return {
      app: "leben-in-deutschland-trainer",
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      stats: stats,
      bookmarks: bookmarks,
      examHistory: examHistory,
      examState: examState,
      language: language,
      theme: theme,
      keybindings: keybindings,
      languagePair: languagePair
    };
  }

  function buildDataScreen() {
    el.dataExportText.value = JSON.stringify(buildExportPayload(), null, 2);
    el.dataImportText.value = "";
    el.dataStatus.hidden = true;
    el.dataStatus.className = "hint";
  }

  function triggerExportDownload() {
    var json = JSON.stringify(buildExportPayload(), null, 2);
    var filename = "leben-in-deutschland-backup-" + new Date().toISOString().slice(0, 10) + ".json";

    // Running inside the Claude Artifact viewer: it blocks direct browser
    // downloads and requires going through its own confirmation-gated API.
    if (window.claude && window.claude.downloads) {
      window.claude.downloads.save({ filename: filename, data: json }).then(
        function () {
          showDataStatus(t("downloadSuccess"), false);
        },
        function (err) {
          var code = err && err.code;
          if (code === "declined") {
            showDataStatus(t("downloadDeclined"), true);
          } else if (code === "rate_limited") {
            showDataStatus(t("downloadRateLimited"), true);
          } else {
            showDataStatus(t("downloadUnavailable"), true);
          }
        }
      );
      return;
    }

    // Standalone / self-hosted: a normal browser download works fine here,
    // it was only Claude's sandboxed iframe that blocked it.
    try {
      var blob = new window.Blob([json], { type: "application/json" });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(function () { window.URL.revokeObjectURL(url); }, 1000);
      showDataStatus(t("downloadSuccess"), false);
    } catch (e) {
      showDataStatus(t("downloadUnavailable"), true);
    }
  }

  function copyExportToClipboard() {
    var json = el.dataExportText.value || JSON.stringify(buildExportPayload(), null, 2);
    if (window.navigator && window.navigator.clipboard && window.navigator.clipboard.writeText) {
      window.navigator.clipboard.writeText(json).then(
        function () { showDataStatus(t("copySuccess"), false); },
        function () { legacyCopyFallback(json); }
      );
    } else {
      legacyCopyFallback(json);
    }
  }

  function legacyCopyFallback(json) {
    try {
      el.dataExportText.value = json;
      el.dataExportText.focus();
      el.dataExportText.select();
      var ok = document.execCommand && document.execCommand("copy");
      showDataStatus(ok ? t("copySuccess") : t("copyError"), !ok);
    } catch (e) {
      showDataStatus(t("copyError"), true);
    }
  }

  function showDataStatus(message, isError) {
    el.dataStatus.hidden = false;
    el.dataStatus.textContent = message;
    el.dataStatus.className = "hint " + (isError ? "is-error" : "is-success");
  }

  function attemptImport(text) {
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      showDataStatus(t("importErrorParse"), true);
      return;
    }
    if (!parsed || typeof parsed !== "object" || (!parsed.stats && !parsed.bookmarks && !parsed.examHistory)) {
      showDataStatus(t("importErrorFormat"), true);
      return;
    }
    showConfirm(t("importConfirm"), function () {
      applyImportedData(parsed);
      showDataStatus(t("importSuccess"), false);
    });
  }

  function applyImportedData(parsed) {
    if (parsed.stats && typeof parsed.stats === "object") stats = parsed.stats;
    if (parsed.bookmarks && typeof parsed.bookmarks === "object") bookmarks = parsed.bookmarks;
    if (Array.isArray(parsed.examHistory)) examHistory = parsed.examHistory;
    if (typeof parsed.examState === "string") examState = parsed.examState;
    if (LANGUAGES.indexOf(parsed.language) !== -1) {
      language = parsed.language;
    } else if (typeof parsed.showEnglish === "boolean") {
      language = parsed.showEnglish ? "en" : "de"; // backups from before Urdu was added
    }
    if (parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system") theme = parsed.theme;
    if (parsed.keybindings && typeof parsed.keybindings === "object") keybindings = mergeKeybindings(parsed.keybindings);
    if (parsed.languagePair) languagePair = normalizeLanguagePair(parsed.languagePair);

    saveStats();
    saveBookmarks();
    saveExamHistory();
    saveExamState(examState);
    saveLanguage(language);
    saveTheme(theme);
    saveKeybindings();
    saveLanguagePair();

    applyTheme();
    reflectTheme();
    reflectLanguageToggle();
    reflectKeybindingHints();
    applyStaticText();
    if (DATA.length) buildStartScreen();
  }

  // ---------- Keyboard shortcuts ----------
  function normalizeKey(key) {
    return key.toLowerCase();
  }

  function displayKeyLabel(key) {
    if (KEY_DISPLAY_OVERRIDES[key]) return KEY_DISPLAY_OVERRIDES[key];
    if (key.length === 1) return key.toUpperCase();
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  function findActionForKey(key, excludeAction) {
    for (var i = 0; i < SHORTCUT_ACTIONS.length; i++) {
      var action = SHORTCUT_ACTIONS[i];
      if (action !== excludeAction && keybindings[action] === key) return action;
    }
    return null;
  }

  function reflectKeybindingHints() {
    var langLabel = t("langSelectTitle") + " (" + displayKeyLabel(keybindings.toggleEnglish) + ")";
    el.langSelect.setAttribute("title", langLabel);
    el.langSelect.setAttribute("aria-label", langLabel);
    if (session && !session.finished) reflectBookmarkButton(session.questions[session.index].id);
    reflectAudioButton();
  }

  function showShortcutsStatus(message, isError) {
    el.shortcutsStatus.hidden = false;
    el.shortcutsStatus.textContent = message;
    el.shortcutsStatus.className = "hint " + (isError ? "is-error" : "is-success");
  }

  function buildShortcutsScreen() {
    el.shortcutsList.innerHTML = "";
    SHORTCUT_ACTIONS.forEach(function (action) {
      var row = document.createElement("div");
      row.className = "shortcut-row";

      var label = document.createElement("span");
      label.className = "shortcut-row-label";
      label.textContent = t(SHORTCUT_LABEL_KEY[action]);
      row.appendChild(label);

      var right = document.createElement("div");
      right.className = "shortcut-row-right";

      var isListening = listeningForKey === action;
      var badge = document.createElement("span");
      badge.className = "shortcut-key-badge" + (isListening ? " is-listening" : "");
      badge.textContent = isListening ? t("pressAKey") : displayKeyLabel(keybindings[action]);
      right.appendChild(badge);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost btn-small";
      btn.textContent = isListening ? t("btnCancelListening") : t("btnChangeShortcut");
      btn.addEventListener("click", function () {
        listeningForKey = isListening ? null : action;
        el.shortcutsStatus.hidden = true;
        buildShortcutsScreen();
      });
      right.appendChild(btn);

      row.appendChild(right);
      el.shortcutsList.appendChild(row);
      if (action === "toggleEnglish") el.shortcutsList.appendChild(buildLanguagePairRow());
    });
  }

  function buildLanguagePairRow() {
    var row = document.createElement("div");
    row.className = "shortcut-row";

    var label = document.createElement("span");
    label.className = "shortcut-row-label";
    label.textContent = t("languagePairLabel");
    row.appendChild(label);

    var right = document.createElement("div");
    right.className = "shortcut-row-right";
    right.appendChild(buildLanguagePairSelect(0, "languagePairFirst"));
    var arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↔";
    right.appendChild(arrow);
    right.appendChild(buildLanguagePairSelect(1, "languagePairSecond"));
    row.appendChild(right);
    return row;
  }

  function buildLanguagePairSelect(index, labelKey) {
    var select = document.createElement("select");
    select.className = "lang-select";
    select.setAttribute("aria-label", t(labelKey));
    LANGUAGES.forEach(function (code) {
      var option = document.createElement("option");
      option.value = code;
      option.textContent = LANGUAGE_LABEL[code];
      select.appendChild(option);
    });
    select.value = languagePair[index];
    select.addEventListener("change", function () {
      var other = 1 - index;
      // Choosing the other side's language swaps them, so the two always differ.
      if (select.value === languagePair[other]) languagePair[other] = languagePair[index];
      languagePair[index] = select.value;
      saveLanguagePair();
      buildShortcutsScreen();
    });
    return select;
  }

  function mergeKeybindings(source) {
    var result = {};
    var k;
    for (k in DEFAULT_KEYBINDINGS) result[k] = DEFAULT_KEYBINDINGS[k];
    if (source && typeof source === "object") {
      for (k in DEFAULT_KEYBINDINGS) {
        if (typeof source[k] === "string" && source[k]) result[k] = source[k];
      }
    }
    return result;
  }

  function loadKeybindings() {
    try {
      var raw = window.localStorage.getItem(KEYBINDINGS_KEY);
      return mergeKeybindings(raw ? JSON.parse(raw) : null);
    } catch (e) {
      return mergeKeybindings(null);
    }
  }

  function saveKeybindings() {
    try {
      window.localStorage.setItem(KEYBINDINGS_KEY, JSON.stringify(keybindings));
    } catch (e) { /* storage unavailable — fail silently */ }
  }

  // ---------- Stats screen ----------
  function buildStatsScreen() {
    var totalCorrect = 0, totalWrong = 0, attempted = 0;
    Object.keys(stats).forEach(function (key) {
      var s = stats[key];
      totalCorrect += s.correct;
      totalWrong += s.wrong;
      if (s.shown > 0) attempted += 1;
    });
    var overallAttempts = totalCorrect + totalWrong;
    el.statAccuracy.textContent = overallAttempts > 0
      ? Math.round((totalCorrect / overallAttempts) * 100) + "%"
      : "—";
    el.statCoverage.textContent = attempted + " / " + DATA.length;

    // per-category accuracy
    var categories = GENERAL_ORDER.concat(STATE_ORDER);
    var rows = categories.map(function (cat) {
      var ids = DATA.filter(function (d) { return d.category_en === cat; }).map(function (d) { return d.id; });
      var c = 0, w = 0;
      ids.forEach(function (id) {
        var s = stats[String(id)];
        if (s) { c += s.correct; w += s.wrong; }
      });
      var attempts = c + w;
      return {
        name: cat,
        accuracy: attempts > 0 ? c / attempts : null,
        attempts: attempts
      };
    });

    rows.sort(function (a, b) {
      if (a.accuracy === null && b.accuracy === null) return 0;
      if (a.accuracy === null) return 1;
      if (b.accuracy === null) return -1;
      return a.accuracy - b.accuracy;
    });

    el.statsChart.innerHTML = "";
    rows.forEach(function (r) {
      el.statsChart.appendChild(makeChartRow(r));
    });

    var missedCount = getQuestionsForScope({ type: "missed" }).length;
    el.btnReviewMissed.disabled = missedCount === 0;
    el.btnReviewMissed.textContent = t("reviewMissed") + (missedCount > 0 ? " (" + missedCount + ")" : "");
    el.reviewMissedHint.textContent = missedCount === 0
      ? t("reviewMissedEmpty")
      : t("reviewMissedHint");
  }

  function makeChartRow(r) {
    var row = document.createElement("div");
    row.className = "chart-row";

    var top = document.createElement("div");
    top.className = "chart-row-top";
    var label = document.createElement("span");
    label.className = "chart-row-label";
    label.textContent = r.name;
    var value = document.createElement("span");
    value.className = "chart-row-value";
    value.textContent = r.accuracy === null ? t("notAttempted") : Math.round(r.accuracy * 100) + "%";
    top.appendChild(label);
    top.appendChild(value);

    var track = document.createElement("div");
    track.className = "chart-track";
    var fill = document.createElement("div");
    var pct, cls;
    if (r.accuracy === null) {
      pct = 100;
      cls = "unattempted";
    } else {
      pct = Math.max(4, Math.round(r.accuracy * 100));
      cls = r.accuracy >= 0.75 ? "good" : (r.accuracy >= 0.5 ? "warning" : "critical");
    }
    fill.className = "chart-fill " + cls;
    fill.style.width = pct + "%";
    track.appendChild(fill);

    row.appendChild(top);
    row.appendChild(track);
    return row;
  }

  // ---------- Persistence ----------
  function loadStats() {
    try {
      var raw = window.localStorage.getItem(STATS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function saveStats() {
    try {
      window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) { /* storage unavailable — fail silently */ }
  }
  function normalizeLanguagePair(pair) {
    var valid = Array.isArray(pair) && pair.length === 2 && pair[0] !== pair[1] &&
      LANGUAGES.indexOf(pair[0]) !== -1 && LANGUAGES.indexOf(pair[1]) !== -1;
    return (valid ? pair : DEFAULT_LANGUAGE_PAIR).slice();
  }
  function loadLanguagePair() {
    try {
      return normalizeLanguagePair(JSON.parse(window.localStorage.getItem(LANGUAGE_PAIR_KEY)));
    } catch (e) {
      return normalizeLanguagePair(null);
    }
  }
  function saveLanguagePair() {
    try {
      window.localStorage.setItem(LANGUAGE_PAIR_KEY, JSON.stringify(languagePair));
    } catch (e) { /* ignore */ }
  }
  function loadLanguage() {
    try {
      var stored = window.localStorage.getItem(LANGUAGE_KEY);
      if (LANGUAGES.indexOf(stored) !== -1) return stored;
      return window.localStorage.getItem(TOGGLE_KEY) === "true" ? "en" : "de";
    } catch (e) {
      return "de";
    }
  }
  function saveLanguage(val) {
    try {
      window.localStorage.setItem(LANGUAGE_KEY, val);
    } catch (e) { /* ignore */ }
  }
  function loadTheme() {
    try {
      var t = window.localStorage.getItem(THEME_KEY);
      return (t === "light" || t === "dark") ? t : "system";
    } catch (e) {
      return "system";
    }
  }
  function saveTheme(val) {
    try {
      window.localStorage.setItem(THEME_KEY, val);
    } catch (e) { /* ignore */ }
  }
  function loadFontScale() {
    try {
      var f = parseInt(window.localStorage.getItem(FONT_SCALE_KEY), 10);
      return (f >= FONT_SCALE_MIN && f <= FONT_SCALE_MAX) ? f : FONT_SCALE_DEFAULT;
    } catch (e) {
      return FONT_SCALE_DEFAULT;
    }
  }
  function saveFontScale(val) {
    try {
      window.localStorage.setItem(FONT_SCALE_KEY, String(val));
    } catch (e) { /* ignore */ }
  }
  function loadBookmarks() {
    try {
      var raw = window.localStorage.getItem(BOOKMARKS_KEY);
      if (raw) return JSON.parse(raw);
      // migrate any pre-rename "favorites" data so nothing already saved gets lost
      var legacy = window.localStorage.getItem(BOOKMARKS_KEY_LEGACY);
      if (legacy) {
        var parsed = JSON.parse(legacy);
        window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(parsed));
        window.localStorage.removeItem(BOOKMARKS_KEY_LEGACY);
        return parsed;
      }
      return {};
    } catch (e) {
      return {};
    }
  }
  function saveBookmarks() {
    try {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) { /* storage unavailable — fail silently */ }
  }
  function loadExamState() {
    try {
      var s = window.localStorage.getItem(EXAM_STATE_KEY);
      return s || STATE_ORDER[0];
    } catch (e) {
      return STATE_ORDER[0];
    }
  }
  function saveExamState(val) {
    try {
      window.localStorage.setItem(EXAM_STATE_KEY, val);
    } catch (e) { /* ignore */ }
  }
  function loadExamHistory() {
    try {
      var raw = window.localStorage.getItem(EXAM_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveExamHistory() {
    try {
      window.localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(examHistory));
    } catch (e) { /* storage unavailable — fail silently */ }
  }

  // ---------- Utils ----------
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

})();
