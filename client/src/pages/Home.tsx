import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  Flame,
  Globe2,
  Headphones,
  Lightbulb,
  PlayCircle,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";

type VocabularyItem = {
  arabic: string;
  transliteration: string;
  meaning: string;
  example: string;
  category: string;
  color: string;
};

type LetterItem = {
  letter: string;
  name: string;
  sound: string;
  example: string;
  exampleMeaning: string;
  color: string;
};

type QuizQuestion = {
  prompt: string;
  hint: string;
  options: string[];
  answer: string;
};

const vocabulary: VocabularyItem[] = [
  { arabic: "مَرْحَبًا", transliteration: "Marhaban", meaning: "Hello", example: "مَرْحَبًا! كَيْفَ حَالُكَ؟", category: "Greetings", color: "coral" },
  { arabic: "شُكْرًا", transliteration: "Shukran", meaning: "Thank you", example: "شُكْرًا جَزِيلًا عَلَى مُسَاعَدَتِكَ.", category: "Polite words", color: "gold" },
  { arabic: "صَدِيق", transliteration: "Sadeeq", meaning: "Friend", example: "هَذَا صَدِيقِي أَحْمَد.", category: "People", color: "sage" },
  { arabic: "مَاء", transliteration: "Maa’", meaning: "Water", example: "أُرِيدُ كَأْسَ مَاءٍ، مِنْ فَضْلِكَ.", category: "Everyday", color: "blue" },
  { arabic: "بَيْت", transliteration: "Bayt", meaning: "House", example: "هَذَا بَيْتِي.", category: "Places", color: "coral" },
  { arabic: "كِتَاب", transliteration: "Kitaab", meaning: "Book", example: "أَقْرَأُ كِتَابًا.", category: "School", color: "gold" },
  { arabic: "شَمْس", transliteration: "Shams", meaning: "Sun", example: "الشَّمْسُ مُشْرِقَةٌ.", category: "Nature", color: "sage" },
  { arabic: "قِطَّة", transliteration: "Qittah", meaning: "Cat", example: "هَذِهِ قِطَّةٌ صَغِيرَةٌ.", category: "Animals", color: "blue" },
  { arabic: "نَعَم", transliteration: "Naʿam", meaning: "Yes", example: "نَعَم، أُحِبُّ اللُّغَةَ العَرَبِيَّةَ.", category: "Useful", color: "coral" },
  { arabic: "لَا", transliteration: "Laa", meaning: "No", example: "لَا، شُكْرًا.", category: "Useful", color: "gold" },
  { arabic: "صَبَاح", transliteration: "Sabaah", meaning: "Morning", example: "صَبَاحُ الخَيْرِ!", category: "Time", color: "sage" },
  { arabic: "لَيْل", transliteration: "Layl", meaning: "Night", example: "لَيْلَةٌ سَعِيدَةٌ.", category: "Time", color: "blue" },
];

const letters: LetterItem[] = [
  { letter: "ا", name: "Alif", sound: "aah", example: "أَسَد", exampleMeaning: "lion", color: "coral" },
  { letter: "ب", name: "Baa", sound: "b", example: "بَاب", exampleMeaning: "door", color: "gold" },
  { letter: "ت", name: "Taa", sound: "t", example: "تُفَّاح", exampleMeaning: "apple", color: "sage" },
  { letter: "ث", name: "Thaa", sound: "th", example: "ثَوْب", exampleMeaning: "dress", color: "blue" },
  { letter: "ج", name: "Jeem", sound: "j", example: "جَمَل", exampleMeaning: "camel", color: "coral" },
  { letter: "ح", name: "Haa", sound: "h (deep)", example: "حَلِيب", exampleMeaning: "milk", color: "gold" },
  { letter: "خ", name: "Khaa", sound: "kh", example: "خُبْز", exampleMeaning: "bread", color: "sage" },
  { letter: "د", name: "Daal", sound: "d", example: "دُبّ", exampleMeaning: "bear", color: "blue" },
  { letter: "ذ", name: "Dhaal", sound: "dh", example: "ذَهَب", exampleMeaning: "gold", color: "coral" },
  { letter: "ر", name: "Raa", sound: "r", example: "رُمَّان", exampleMeaning: "pomegranate", color: "gold" },
  { letter: "ز", name: "Zaay", sound: "z", example: "زَهْرَة", exampleMeaning: "flower", color: "sage" },
  { letter: "س", name: "Seen", sound: "s", example: "سَمَك", exampleMeaning: "fish", color: "blue" },
  { letter: "ش", name: "Sheen", sound: "sh", example: "شَمْس", exampleMeaning: "sun", color: "coral" },
  { letter: "ص", name: "Saad", sound: "s (strong)", example: "صَقْر", exampleMeaning: "falcon", color: "gold" },
  { letter: "ض", name: "Daad", sound: "d (strong)", example: "ضَوْء", exampleMeaning: "light", color: "sage" },
  { letter: "ط", name: "Taa", sound: "t (strong)", example: "طَائِر", exampleMeaning: "bird", color: "blue" },
  { letter: "ظ", name: "Dhaa", sound: "dh (strong)", example: "ظَرْف", exampleMeaning: "envelope", color: "coral" },
  { letter: "ع", name: "Ayn", sound: "ʿ (from throat)", example: "عَيْن", exampleMeaning: "eye", color: "gold" },
  { letter: "غ", name: "Ghayn", sound: "gh", example: "غَيْم", exampleMeaning: "cloud", color: "sage" },
  { letter: "ف", name: "Faa", sound: "f", example: "فِيل", exampleMeaning: "elephant", color: "blue" },
  { letter: "ق", name: "Qaaf", sound: "q", example: "قَمَر", exampleMeaning: "moon", color: "coral" },
  { letter: "ك", name: "Kaaf", sound: "k", example: "كَلْب", exampleMeaning: "dog", color: "gold" },
  { letter: "ل", name: "Laam", sound: "l", example: "لَيْمُون", exampleMeaning: "lemon", color: "sage" },
  { letter: "م", name: "Meem", sound: "m", example: "مَوْز", exampleMeaning: "banana", color: "blue" },
  { letter: "ن", name: "Noon", sound: "n", example: "نَجْم", exampleMeaning: "star", color: "coral" },
  { letter: "ه", name: "Haa", sound: "h", example: "هِلَال", exampleMeaning: "crescent", color: "gold" },
  { letter: "و", name: "Waaw", sound: "w / oo", example: "وَرْدَة", exampleMeaning: "rose", color: "sage" },
  { letter: "ي", name: " Yaa", sound: "y / ee", example: "يَد", exampleMeaning: "hand", color: "blue" },
];

const quizQuestions: QuizQuestion[] = [
  { prompt: "ماذا تعني كلمة «صباح الخير»؟", hint: "تُقال عند بدء اليوم، مثل Good morning.", options: ["Good evening", "Good morning", "Good night", "See you"], answer: "Good morning" },
  { prompt: "اختر الترجمة الصحيحة لكلمة «بيت».", hint: "هو المكان الذي نعيش فيه.", options: ["Book", "School", "House", "Street"], answer: "House" },
  { prompt: "كيف تقول «Thank you» بالعربية؟", hint: "تبدأ بحرف الشين.", options: ["من فضلك", "عفوًا", "شكرًا", "أهلًا"], answer: "شكرًا" },
  { prompt: "ما الكلمة التي تعني «Water»؟", hint: "كلمة قصيرة من ثلاثة أحرف.", options: ["ماء", "نور", "باب", "قلم"], answer: "ماء" },
];

const phrases = [
  { arabic: "أَيْنَ الْمَطْعَم؟", meaning: "Where is the restaurant?", tag: "Conversation" },
  { arabic: "أَنَا أَتَعَلَّمُ الْعَرَبِيَّة.", meaning: "I am learning Arabic.", tag: "Introducing yourself" },
  { arabic: "مِنْ فَضْلِكَ، تَكَلَّمْ بِبُطْء.", meaning: "Please speak slowly.", tag: "Useful phrase" },
];

function speakArabic(text: string, rate = 0.82) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function SectionLabel({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return <div className="mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">{eyebrow}</p><h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{children}</h2></div><div className="hidden h-px flex-1 bg-ink/10 sm:block" /></div>;
}

function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [libraryTab, setLibraryTab] = useState<"words" | "letters">("words");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState(letters[0]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const question = quizQuestions[quizIndex];
  const categories = ["All", ...Array.from(new Set(vocabulary.map((item) => item.category)))];
  const filteredWords = useMemo(() => vocabulary.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesQuery = !query || item.arabic.includes(searchTerm) || item.meaning.toLowerCase().includes(query) || item.transliteration.toLowerCase().includes(query);
    return matchesQuery && (category === "All" || item.category === category);
  }), [searchTerm, category]);
  const progress = ((quizIndex + (completed ? 1 : 0)) / quizQuestions.length) * 100;

  const scrollTo = (id: string, label: string) => { setActiveNav(label); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const chooseAnswer = (answer: string) => { if (selectedAnswer) return; setSelectedAnswer(answer); if (answer === question.answer) setScore((current) => current + 1); };
  const nextQuestion = () => { if (quizIndex === quizQuestions.length - 1) { setCompleted(true); return; } setQuizIndex((current) => current + 1); setSelectedAnswer(null); };
  const resetQuiz = () => { setQuizIndex(0); setSelectedAnswer(null); setScore(0); setCompleted(false); };

  return (
    <div dir="ltr" className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl"><div className="container flex h-[74px] items-center justify-between gap-6">
        <button className="flex items-center gap-3 text-right" onClick={() => scrollTo("top", "Home")} aria-label="Back to home"><span className="brand-mark"><span>ع</span></span><span><span className="block font-display text-lg font-bold leading-none text-ink">Learn Arabic</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/45" dir="ltr">ARABIC · DAILY</span></span></button>
        <nav className="hidden items-center gap-7 text-sm font-bold text-ink/55 md:flex" aria-label="Main navigation">{[["top", "Home"], ["library", "Library"], ["practice", "Practice"]].map(([id, label]) => <button key={label} onClick={() => scrollTo(id, label)} className={`nav-link ${activeNav === label ? "is-active" : ""}`}>{label}</button>)}</nav>
        <button className="button-ghost hidden sm:flex" onClick={() => scrollTo("quiz", "Practice")}>Start a quick lesson <ArrowLeft size={16} /></button><button className="icon-button md:hidden" onClick={() => scrollTo("library", "Library")} aria-label="Go to learning library"><BookOpen size={19} /></button>
      </div></header>

      <main id="top"><section className="container relative pb-16 pt-10 sm:pb-24 sm:pt-16"><div className="hero-panel"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden rounded-l-[30px] lg:block"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(246,127,99,.22),transparent_33%),radial-gradient(circle_at_65%_70%,rgba(213,171,76,.18),transparent_35%)]" /><div className="calligraphy-art" aria-hidden="true"><span>ع</span><span>ل</span><span>م</span></div><div className="absolute bottom-9 left-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-paper/80 backdrop-blur-md"><Sparkles size={14} className="text-saffron" /> Today’s lesson: greetings</div></div><div className="relative z-10 max-w-xl px-6 py-12 sm:px-12 sm:py-16 lg:mr-auto lg:min-h-[470px] lg:max-w-[58%] lg:px-14 lg:py-20"><div className="mb-6 flex items-center gap-2 text-xs font-bold text-saffron"><span className="h-2 w-2 rounded-full bg-coral" /> Small steps, real progress</div><h1 className="font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-paper sm:text-7xl">Arabic<br /><em>starts here.</em></h1><p className="mt-7 max-w-md text-base leading-8 text-paper/70 sm:text-lg">Short lessons, clear words, and practice that helps you speak Arabic with confidence — one step every day.</p><div className="mt-9 flex flex-wrap items-center gap-3"><button className="button-primary" onClick={() => scrollTo("quiz", "Practice")}><PlayCircle size={18} /> Start practice</button><button className="button-on-dark" onClick={() => scrollTo("library", "Library")}><BookOpen size={17} /> Explore library</button></div><div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-paper/55"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sage" /> No sign-up</span><span className="flex items-center gap-2"><Zap size={15} className="text-saffron" /> 5-minute lessons</span><span className="flex items-center gap-2"><Globe2 size={15} className="text-coral" /> For beginners</span></div></div></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="stat-card"><span className="stat-icon bg-coral/12 text-coral"><Flame size={18} /></span><div><strong>4 days</strong><span>Current streak</span></div></div><div className="stat-card"><span className="stat-icon bg-saffron/18 text-[#9b761e]"><BookOpen size={18} /></span><div><strong>12 words</strong><span>Ready to review</span></div></div><div className="stat-card"><span className="stat-icon bg-sage/20 text-[#347764]"><Trophy size={18} /></span><div><strong>Level 01</strong><span>Your first steps</span></div></div></div></section>

        <section id="library" className="container scroll-mt-24 pb-20 sm:pb-28"><SectionLabel eyebrow="01 / Learning library">Words and letters, made simple</SectionLabel><div className="mb-8 flex flex-col gap-4 rounded-3xl border border-ink/10 bg-white/60 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"><div className="flex rounded-2xl bg-ink/5 p-1" role="tablist" aria-label="Learning library"><button onClick={() => setLibraryTab("words")} className={`rounded-xl px-5 py-3 text-sm font-extrabold transition ${libraryTab === "words" ? "bg-ink text-paper shadow-sm" : "text-ink/55"}`} role="tab" aria-selected={libraryTab === "words"}><BookOpen size={16} className="mr-2 inline" /> Essential words</button><button onClick={() => setLibraryTab("letters")} className={`rounded-xl px-5 py-3 text-sm font-extrabold transition ${libraryTab === "letters" ? "bg-ink text-paper shadow-sm" : "text-ink/55"}`} role="tab" aria-selected={libraryTab === "letters"}>أ ب ت <span className="ml-1">Letters & sounds</span></button></div>{libraryTab === "words" && <label className="flex min-w-0 items-center gap-2 rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm"><Search size={16} className="text-ink/40" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search words..." className="min-w-0 bg-transparent outline-none placeholder:text-ink/35" aria-label="Search words" /></label>}</div>
          {libraryTab === "words" ? <><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition ${category === item ? "bg-sage text-white" : "bg-ink/5 text-ink/55 hover:bg-ink/10"}`}>{item}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filteredWords.map((item, index) => <article key={item.arabic} className={`vocab-card color-${item.color}`}><div className="flex items-center justify-between gap-2"><span className="mini-number">{String(index + 1).padStart(2, "0")}</span><button className="audio-button" onClick={() => speakArabic(item.arabic)} aria-label={`Listen to ${item.arabic}`}><Volume2 size={16} /></button></div><div className="mt-8"><p className="arabic-word">{item.arabic}</p><p className="mt-2 text-xs font-bold tracking-wide text-ink/48" dir="ltr">{item.transliteration}</p></div><div className="mt-7 border-t border-ink/10 pt-4"><span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40">{item.category}</span><p className="mt-1 font-bold text-ink">{item.meaning}</p><p className="mt-2 text-xs leading-6 text-ink/55">{item.example}</p></div></article>)}</div>{filteredWords.length === 0 && <div className="rounded-2xl bg-ink/5 p-8 text-center text-sm font-bold text-ink/55">No words found. Try another search.</div>}</> : <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-start"><div><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-extrabold text-ink">The 28 Arabic letters</p><p className="mt-1 text-xs text-ink/50">Tap a letter, then listen and repeat.</p></div><span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-extrabold text-sage">Child-friendly</span></div><div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{letters.map((item) => <button key={item.letter} onClick={() => setSelectedLetter(item)} className={`letter-tile color-${item.color} ${selectedLetter.letter === item.letter ? "is-selected" : ""}`} aria-label={`Learn ${item.name}`}><span>{item.letter}</span><small>{item.name}</small></button>)}</div></div><article className={`letter-detail color-${selectedLetter.color}`}><div className="flex items-start justify-between gap-3"><div><p className="eyebrow mb-2">Letter of the moment</p><h3 className="font-display text-2xl font-extrabold text-ink">{selectedLetter.name}</h3></div><button className="audio-button large" onClick={() => speakArabic(selectedLetter.letter, 0.68)} aria-label={`Hear ${selectedLetter.name}`}><Headphones size={19} /></button></div><div className="my-4 flex items-center gap-5"><span className="letter-big">{selectedLetter.letter}</span><div><p className="text-xs font-bold uppercase tracking-wider text-ink/45">Sound</p><p className="mt-1 text-lg font-extrabold text-ink">{selectedLetter.sound}</p></div></div><div className="rounded-2xl bg-white/65 p-4"><p className="text-xs font-bold text-ink/45">Try this word</p><p className="mt-1 font-display text-3xl font-extrabold text-ink">{selectedLetter.example}</p><p className="text-sm font-bold text-ink/55">{selectedLetter.exampleMeaning}</p><button className="mt-3 flex items-center gap-2 text-xs font-extrabold text-sage" onClick={() => speakArabic(selectedLetter.example, 0.7)}><Volume2 size={14} /> Hear the example</button></div></article></div>}
        </section>

        <section id="practice" className="border-y border-ink/10 bg-cream scroll-mt-24"><div className="container grid gap-10 py-20 sm:py-24 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><div className="lg:sticky lg:top-28"><p className="eyebrow mb-3">02 / How to learn</p><h2 className="font-display max-w-sm text-4xl font-bold leading-tight text-ink sm:text-5xl">Listen, try,<br /><span className="text-coral">then remember.</span></h2><p className="mt-5 max-w-sm text-sm leading-7 text-ink/58">Every word takes you from meaning to real use. Tap the speaker, then repeat it out loud.</p><div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-5 shadow-soft"><div className="flex items-start gap-3"><span className="rounded-xl bg-saffron/20 p-2 text-[#9b761e]"><Lightbulb size={18} /></span><div><p className="text-sm font-bold">A tip for children</p><p className="mt-1 text-xs leading-6 text-ink/55">Learn three letters or words at a time. Celebrate every small sound!</p></div></div></div></div><div className="space-y-4">{phrases.map((phrase, index) => <article key={phrase.arabic} className="phrase-card group"><div className="flex items-center gap-4"><span className="phrase-index">0{index + 1}</span><div className="min-w-0 flex-1"><span className="mb-2 inline-flex rounded-full bg-ink/6 px-2.5 py-1 text-[10px] font-extrabold text-ink/50">{phrase.tag}</span><p className="font-display text-2xl font-bold text-ink sm:text-3xl">{phrase.arabic}</p><p className="mt-2 text-sm text-ink/55" dir="ltr">{phrase.meaning}</p></div><button className="audio-button large" onClick={() => speakArabic(phrase.arabic)} aria-label={`Listen to ${phrase.arabic}`}><Headphones size={19} /></button></div><div className="mt-5 h-1 overflow-hidden rounded-full bg-ink/8"><div className="h-full w-0 rounded-full bg-coral transition-all duration-500 group-hover:w-1/3" /></div></article>)}</div></div></section>

        <section id="quiz" className="container scroll-mt-24 py-20 sm:py-28"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow mb-3">03 / Test yourself</p><h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">One question at a time.</h2></div><div className="flex items-center gap-3 text-sm font-bold text-ink/50"><CircleHelp size={18} className="text-coral" /> Practice score: <span className="text-ink">{score} / {quizQuestions.length}</span></div></div><div className="quiz-shell"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="quiz-badge">Quick quiz</span><span className="text-xs font-bold text-paper/50">Question {completed ? quizQuestions.length : quizIndex + 1} of {quizQuestions.length}</span></div><button className="quiz-reset" onClick={resetQuiz}><RotateCcw size={14} /> Restart quiz</button></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: `${completed ? 100 : Math.max(12, progress)}%` }} /></div>{!completed ? <div className="mt-10 grid gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-center"><div><p className="text-xs font-bold text-saffron">Choose the correct answer</p><h3 className="mt-4 font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">{question.prompt}</h3><p className="mt-4 flex items-center gap-2 text-sm leading-7 text-paper/55"><Lightbulb size={15} className="shrink-0 text-saffron" /> {question.hint}</p></div><div className="grid gap-3 sm:grid-cols-2">{question.options.map((option, index) => { const isSelected = selectedAnswer === option; const isCorrect = Boolean(selectedAnswer) && option === question.answer; const isWrong = isSelected && option !== question.answer; return <button key={option} onClick={() => chooseAnswer(option)} className={`answer-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="flex-1 text-right">{option}</span>{isCorrect && <Check size={18} />}{isWrong && <X size={18} />}</button>; })}<div className="sm:col-span-2 mt-1 flex min-h-12 items-center justify-between gap-3">{selectedAnswer && <span className={`text-sm font-bold ${selectedAnswer === question.answer ? "text-sage" : "text-coral"}`}>{selectedAnswer === question.answer ? "Great job! Correct answer." : `Correct answer: ${question.answer}`}</span>}<button className={`button-primary mr-auto ${!selectedAnswer ? "pointer-events-none opacity-30" : ""}`} onClick={nextQuestion}>{quizIndex === quizQuestions.length - 1 ? "See your result" : "Next question"}<ArrowLeft size={16} /></button></div></div></div> : <div className="py-12 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-saffron/18 text-saffron"><Trophy size={30} /></span><h3 className="mt-5 font-display text-4xl font-bold text-paper">Well done, you finished the quiz!</h3><p className="mt-3 text-paper/60">You answered <strong className="text-paper">{score} of {quizQuestions.length}</strong> questions correctly.</p><button className="button-on-dark mt-7" onClick={resetQuiz}><RotateCcw size={16} /> Try again</button></div>}</div></section>

        <section className="container pb-20 sm:pb-28"><div className="closing-card"><div><p className="eyebrow mb-3 text-saffron">Your next step</p><h2 className="font-display max-w-xl text-3xl font-bold leading-tight text-paper sm:text-4xl">Take five minutes today,<br />and get closer to Arabic.</h2></div><button className="button-primary shrink-0" onClick={() => scrollTo("library", "Library")}>Learn one word <ArrowLeft size={17} /></button></div></section>
      </main><footer className="border-t border-ink/10"><div className="container flex flex-col items-center justify-between gap-4 py-8 text-center text-xs font-bold text-ink/45 sm:flex-row sm:text-right"><p>Learn Arabic — a simple space for a beautiful beginning.</p><p dir="ltr">Made for curious minds · 2026</p></div></footer>
    </div>
  );
}

export default Home;
