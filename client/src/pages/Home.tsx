import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  Flame,
  Globe2,
  Headphones,
  Lightbulb,
  PlayCircle,
  RotateCcw,
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
  color: string;
};

type QuizQuestion = {
  prompt: string;
  hint: string;
  options: string[];
  answer: string;
};

const vocabulary: VocabularyItem[] = [
  {
    arabic: "مَرْحَبًا",
    transliteration: "Marhaban",
    meaning: "Hello",
    example: "مَرْحَبًا! كَيْفَ حَالُكَ؟",
    color: "coral",
  },
  {
    arabic: "شُكْرًا",
    transliteration: "Shukran",
    meaning: "Thank you",
    example: "شُكْرًا جَزِيلًا عَلَى مُسَاعَدَتِكَ.",
    color: "gold",
  },
  {
    arabic: "صَدِيق",
    transliteration: "Sadeeq",
    meaning: "Friend",
    example: "هَذَا صَدِيقِي أَحْمَد.",
    color: "sage",
  },
  {
    arabic: "مَاء",
    transliteration: "Maa’",
    meaning: "Water",
    example: "أُرِيدُ كَأْسَ مَاءٍ، مِنْ فَضْلِكَ.",
    color: "blue",
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    prompt: "ماذا تعني كلمة «صباح الخير»؟",
    hint: "تُقال عند بدء اليوم، مثل Good morning.",
    options: ["Good evening", "Good morning", "Good night", "See you"],
    answer: "Good morning",
  },
  {
    prompt: "اختر الترجمة الصحيحة لكلمة «بيت».",
    hint: "هو المكان الذي نعيش فيه.",
    options: ["Book", "School", "House", "Street"],
    answer: "House",
  },
  {
    prompt: "كيف تقول «Thank you» بالعربية؟",
    hint: "تبدأ بحرف الشين.",
    options: ["of فضلك", "عفوًا", "شكرًا", "أهلًا"],
    answer: "شكرًا",
  },
  {
    prompt: "ما الكلمة التي تعني «Water»؟",
    hint: "كلمة قصيرة of ثلاثة أحرف.",
    options: ["ماء", "نور", "باب", "قلم"],
    answer: "ماء",
  },
];

const phrases = [
  { arabic: "أَيْنَ الْمَطْعَم؟", meaning: "Where is the restaurant?", tag: "Conversation" },
  { arabic: "أَنَا أَتَعَلَّمُ الْعَرَبِيَّة.", meaning: "I am learning Arabic.", tag: "Introducing yourself" },
  { arabic: "مِنْ فَضْلِكَ، تَكَلَّمْ بِبُطْء.", meaning: "Please speak slowly.", tag: "Useful phrase" },
];

function speakArabic(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function SectionLabel({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{children}</h2>
      </div>
      <div className="hidden h-px flex-1 bg-ink/10 sm:block" />
    </div>
  );
}

function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = quizQuestions[quizIndex];
  const progress = useMemo(() => ((quizIndex + (completed ? 1 : 0)) / quizQuestions.length) * 100, [quizIndex, completed]);

  const scrollTo = (id: string, label: string) => {
    setActiveNav(label);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chooseAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === question.answer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    if (quizIndex === quizQuestions.length - 1) {
      setCompleted(true);
      return;
    }
    setQuizIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div dir="ltr" className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
        <div className="container flex h-[74px] items-center justify-between gap-6">
          <button className="flex items-center gap-3 text-right" onClick={() => scrollTo("top", "Home")} aria-label="Back to home">
            <span className="brand-mark"><span>ع</span></span>
            <span>
              <span className="block font-display text-lg font-bold leading-none text-ink">Learn Arabic</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-ink/45" dir="ltr">ARABIC · DAILY</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-bold text-ink/55 md:flex" aria-label="التنقل الرئيسي">
            {[['top', 'Home'], ['words', 'Words'], ['practice', 'Practice']].map(([id, label]) => (
              <button key={label} onClick={() => scrollTo(id, label)} className={`nav-link ${activeNav === label ? "is-active" : ""}`}>
                {label}
              </button>
            ))}
          </nav>

          <button className="button-ghost hidden sm:flex" onClick={() => scrollTo("quiz", "Practice")}>
            Start a quick lesson <ArrowLeft size={16} />
          </button>
          <button className="icon-button md:hidden" onClick={() => scrollTo("words", "Words")} aria-label="اذهب إلى Words"><BookOpen size={19} /></button>
        </div>
      </header>

      <main id="top">
        <section className="container relative pb-16 pt-10 sm:pb-24 sm:pt-16">
          <div className="hero-panel">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden rounded-l-[30px] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(246,127,99,.22),transparent_33%),radial-gradient(circle_at_65%_70%,rgba(213,171,76,.18),transparent_35%)]" />
              <div className="calligraphy-art" aria-hidden="true"><span>ع</span><span>ل</span><span>م</span></div>
              <div className="absolute bottom-9 left-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-paper/80 backdrop-blur-md"><Sparkles size={14} className="text-saffron" /> Today’s lesson: greetings</div>
            </div>
            <div className="relative z-10 max-w-xl px-6 py-12 sm:px-12 sm:py-16 lg:mr-auto lg:min-h-[470px] lg:max-w-[58%] lg:px-14 lg:py-20">
              <div className="mb-6 flex items-center gap-2 text-xs font-bold text-saffron"><span className="h-2 w-2 rounded-full bg-coral" /> Small steps, real progress</div>
              <h1 className="font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-paper sm:text-7xl">Arabic<br /><em>starts here.</em></h1>
              <p className="mt-7 max-w-md text-base leading-8 text-paper/70 sm:text-lg">Short lessons, clear words, and practice that helps you speak Arabic with confidence — one step every day.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button className="button-primary" onClick={() => scrollTo("quiz", "Practice")}><PlayCircle size={18} /> Start practice</button>
                <button className="button-on-dark" onClick={() => scrollTo("words", "Words")}><BookOpen size={17} /> Browse Words</button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-paper/55">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sage" /> No sign-up</span>
                <span className="flex items-center gap-2"><Zap size={15} className="text-saffron" /> 5-minute lessons</span>
                <span className="flex items-center gap-2"><Globe2 size={15} className="text-coral" /> For beginners</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="stat-card"><span className="stat-icon bg-coral/12 text-coral"><Flame size={18} /></span><div><strong>4 days</strong><span>Current streak</span></div></div>
            <div className="stat-card"><span className="stat-icon bg-saffron/18 text-[#9b761e]"><BookOpen size={18} /></span><div><strong>12 words</strong><span>Ready to review</span></div></div>
            <div className="stat-card"><span className="stat-icon bg-sage/20 text-[#347764]"><Trophy size={18} /></span><div><strong>Level 01</strong><span>Your first steps</span></div></div>
          </div>
        </section>

        <section id="words" className="container scroll-mt-24 pb-20 sm:pb-28">
          <SectionLabel eyebrow="01 / Today’s vocabulary">Words you will use today</SectionLabel>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
            {vocabulary.map((item, index) => (
              <article key={item.arabic} className={`vocab-card color-${item.color} ${index === 0 ? "lg:col-span-1" : ""}`}>
                <div className="flex items-center justify-between gap-2"><span className="mini-number">0{index + 1}</span><button className="audio-button" onClick={() => speakArabic(item.arabic)} aria-label={`Listen to ${item.arabic}`}><Volume2 size={16} /></button></div>
                <div className="mt-8"><p className="arabic-word">{item.arabic}</p><p className="mt-2 text-xs font-bold tracking-wide text-ink/48" dir="ltr">{item.transliteration}</p></div>
                <div className="mt-7 border-t border-ink/10 pt-4"><p className="font-bold text-ink">{item.meaning}</p><p className="mt-2 text-xs leading-6 text-ink/55">{item.example}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="practice" className="border-y border-ink/10 bg-cream scroll-mt-24">
          <div className="container grid gap-10 py-20 sm:py-24 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-3">02 / How to learn</p>
              <h2 className="font-display max-w-sm text-4xl font-bold leading-tight text-ink sm:text-5xl">Listen, try,<br /><span className="text-coral">then remember.</span></h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-ink/58">Every word takes you from meaning to real use. Tap the speaker, then repeat it out loud.</p>
              <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-5 shadow-soft"><div className="flex items-start gap-3"><span className="rounded-xl bg-saffron/20 p-2 text-[#9b761e]"><Lightbulb size={18} /></span><div><p className="text-sm font-bold">Quick tip</p><p className="mt-1 text-xs leading-6 text-ink/55">Do not chase perfection. Repeating out loud is the fastest way to build confidence.</p></div></div></div>
            </div>
            <div className="space-y-4">
              {phrases.map((phrase, index) => (
                <article key={phrase.arabic} className="phrase-card group">
                  <div className="flex items-center gap-4"><span className="phrase-index">0{index + 1}</span><div className="min-w-0 flex-1"><span className="mb-2 inline-flex rounded-full bg-ink/6 px-2.5 py-1 text-[10px] font-extrabold text-ink/50">{phrase.tag}</span><p className="font-display text-2xl font-bold text-ink sm:text-3xl">{phrase.arabic}</p><p className="mt-2 text-sm text-ink/55" dir="ltr">{phrase.meaning}</p></div><button className="audio-button large" onClick={() => speakArabic(phrase.arabic)} aria-label={`Listen to ${phrase.arabic}`}><Headphones size={19} /></button></div>
                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-ink/8"><div className="h-full w-0 rounded-full bg-coral transition-all duration-500 group-hover:w-1/3" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="quiz" className="container scroll-mt-24 py-20 sm:py-28">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow mb-3">03 / Test yourself</p><h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">One question at a time.</h2></div><div className="flex items-center gap-3 text-sm font-bold text-ink/50"><CircleHelp size={18} className="text-coral" /> Practice score: <span className="text-ink">{score} / {quizQuestions.length}</span></div></div>
          <div className="quiz-shell">
            <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="quiz-badge">Quick quiz</span><span className="text-xs font-bold text-paper/50">Question {completed ? quizQuestions.length : quizIndex + 1} of {quizQuestions.length}</span></div><button className="quiz-reset" onClick={resetQuiz}><RotateCcw size={14} /> Restart quiz</button></div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: `${completed ? 100 : Math.max(12, progress)}%` }} /></div>
            {!completed ? <div className="mt-10 grid gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-center"><div><p className="text-xs font-bold text-saffron">Choose the correct answer</p><h3 className="mt-4 font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">{question.prompt}</h3><p className="mt-4 flex items-center gap-2 text-sm leading-7 text-paper/55"><Lightbulb size={15} className="shrink-0 text-saffron" /> {question.hint}</p></div><div className="grid gap-3 sm:grid-cols-2">{question.options.map((option, index) => { const isSelected = selectedAnswer === option; const isCorrect = selectedAnswer && option === question.answer; const isWrong = isSelected && option !== question.answer; return <button key={option} onClick={() => chooseAnswer(option)} className={`answer-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="flex-1 text-right">{option}</span>{isCorrect && <Check size={18} />}{isWrong && <X size={18} />}</button>; })}<div className="sm:col-span-2 mt-1 flex min-h-12 items-center justify-between gap-3">{selectedAnswer && <span className={`text-sm font-bold ${selectedAnswer === question.answer ? "text-sage" : "text-coral"}`}>{selectedAnswer === question.answer ? "Great job! Correct answer." : `Correct answer: ${question.answer}`}</span>}<button className={`button-primary mr-auto ${!selectedAnswer ? "pointer-events-none opacity-30" : ""}`} onClick={nextQuestion}>{quizIndex === quizQuestions.length - 1 ? "See your result" : "Question التالي"}<ArrowLeft size={16} /></button></div></div></div> : <div className="py-12 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-saffron/18 text-saffron"><Trophy size={30} /></span><h3 className="mt-5 font-display text-4xl font-bold text-paper">Well done, you finished the quiz!</h3><p className="mt-3 text-paper/60">You answered <strong className="text-paper">{score} of {quizQuestions.length}</strong> questions correctly.</p><button className="button-on-dark mt-7" onClick={resetQuiz}><RotateCcw size={16} /> Try again</button></div>}
          </div>
        </section>

        <section className="container pb-20 sm:pb-28"><div className="closing-card"><div><p className="eyebrow mb-3 text-saffron">Your next step</p><h2 className="font-display max-w-xl text-3xl font-bold leading-tight text-paper sm:text-4xl">خذ خمس دقائق اليوم،<br />واقترب of العربية أكثر.</h2></div><button className="button-primary shrink-0" onClick={() => scrollTo("words", "Words")}>Start with one word <ArrowLeft size={17} /></button></div></section>
      </main>

      <footer className="border-t border-ink/10"><div className="container flex flex-col items-center justify-between gap-4 py-8 text-center text-xs font-bold text-ink/45 sm:flex-row sm:text-right"><p>Learn Arabic — مساحة بسيطة لبداية جميلة.</p><p dir="ltr">Made for curious minds · 2026</p></div></footer>
    </div>
  );
}

export default Home;

function _UnusedChevron() { return <ChevronLeft size={14} />; }
function _UnusedArrow() { return <ArrowRight size={14} />; }
