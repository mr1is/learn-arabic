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
  colloquial?: string;
  colloquialTransliteration?: string;
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

type MatchCard = {
  word: string;
  meaning: string;
  letter: string;
  image: string;
  choices: string[];
};

const vocabulary: VocabularyItem[] = [
  { arabic: "مَرْحَبًا", transliteration: "Marhaban", meaning: "Hello", example: "مَرْحَبًا! كَيْفَ حَالُكَ؟", category: "Greetings", color: "coral" , colloquial: "هَلَا", colloquialTransliteration: "Hala" },
  { arabic: "شُكْرًا", transliteration: "Shukran", meaning: "Thank you", example: "شُكْرًا جَزِيلًا عَلَى مُسَاعَدَتِكَ.", category: "Polite words", color: "gold" , colloquial: "مَشْكُور", colloquialTransliteration: "Mashkoor" },
  { arabic: "صَدِيق", transliteration: "Sadeeq", meaning: "Friend", example: "هَذَا صَدِيقِي أَحْمَد.", category: "People", color: "sage" , colloquial: "صَاحِب", colloquialTransliteration: "Saahib" },
  { arabic: "مَاء", transliteration: "Maa’", meaning: "Water", example: "أُرِيدُ كَأْسَ مَاءٍ، مِنْ فَضْلِكَ.", category: "Everyday", color: "blue" , colloquial: "مَاي", colloquialTransliteration: "Maay" },
  { arabic: "بَيْت", transliteration: "Bayt", meaning: "House", example: "هَذَا بَيْتِي.", category: "Places", color: "coral" , colloquial: "بَيْت", colloquialTransliteration: "Bayt" },
  { arabic: "كِتَاب", transliteration: "Kitaab", meaning: "Book", example: "أَقْرَأُ كِتَابًا.", category: "School", color: "gold" , colloquial: "كِتَاب", colloquialTransliteration: "Kitaab" },
  { arabic: "شَمْس", transliteration: "Shams", meaning: "Sun", example: "الشَّمْسُ مُشْرِقَةٌ.", category: "Nature", color: "sage" , colloquial: "شَمْس", colloquialTransliteration: "Shams" },
  { arabic: "قِطَّة", transliteration: "Qittah", meaning: "Cat", example: "هَذِهِ قِطَّةٌ صَغِيرَةٌ.", category: "Animals", color: "blue" , colloquial: "بَسَّة", colloquialTransliteration: "Bissah" },
  { arabic: "نَعَم", transliteration: "Naʿam", meaning: "Yes", example: "نَعَم، أُحِبُّ اللُّغَةَ العَرَبِيَّةَ.", category: "Useful", color: "coral" , colloquial: "إِي", colloquialTransliteration: "Ee" },
  { arabic: "لَا", transliteration: "Laa", meaning: "No", example: "لَا، شُكْرًا.", category: "Useful", color: "gold" , colloquial: "لَا", colloquialTransliteration: "Laa" },
  { arabic: "صَبَاح", transliteration: "Sabaah", meaning: "Morning", example: "صَبَاحُ الخَيْرِ!", category: "Time", color: "sage" , colloquial: "صَبَاح", colloquialTransliteration: "Sabaah" },
  { arabic: "لَيْل", transliteration: "Layl", meaning: "Night", example: "لَيْلَةٌ سَعِيدَةٌ.", category: "Time", color: "blue" , colloquial: "لَيْل", colloquialTransliteration: "Layl" },
  { arabic: "مَدْرَسَة", transliteration: "Madrasa", meaning: "School", example: "أَذْهَبُ إِلَى الْمَدْرَسَةِ.", category: "Places", color: "coral" , colloquial: "مَدْرَسَة", colloquialTransliteration: "Madrasah" },
  { arabic: "قَلَم", transliteration: "Qalam", meaning: "Pen", example: "هَذَا قَلَمِي.", category: "School", color: "gold" , colloquial: "قَلَم", colloquialTransliteration: "Qalam" },
  { arabic: "كُرَة", transliteration: "Kura", meaning: "Ball", example: "أَلْعَبُ بِالْكُرَةِ.", category: "Play", color: "sage" , colloquial: "طَابَة", colloquialTransliteration: "Taabah" },
  { arabic: "أُمّ", transliteration: "Umm", meaning: "Mother", example: "أُمِّي تُحِبُّ القِرَاءَةَ.", category: "Family", color: "blue" , colloquial: "مَاما", colloquialTransliteration: "Maama" },
  { arabic: "أَب", transliteration: "Ab", meaning: "Father", example: "أَبِي فِي الْبَيْتِ.", category: "Family", color: "coral" , colloquial: "أَبُويَ", colloquialTransliteration: "Abuy" },
  { arabic: "طَعَام", transliteration: "Taʿaam", meaning: "Food", example: "الطَّعَامُ لَذِيذٌ.", category: "Everyday", color: "gold" , colloquial: "أَكَل", colloquialTransliteration: "Akil" },
  { arabic: "حُبّ", transliteration: "Hubb", meaning: "Love", example: "الحُبُّ جَمِيلٌ.", category: "Feelings", color: "sage" , colloquial: "حُبّ", colloquialTransliteration: "Hubb" },
  { arabic: "فَرَح", transliteration: "Farah", meaning: "Joy", example: "أَشْعُرُ بِالْفَرَحِ.", category: "Feelings", color: "blue" , colloquial: "فَرَح", colloquialTransliteration: "Farah" },
  { arabic: "سَلَام", transliteration: "Salaam", meaning: "Peace", example: "السَّلَامُ عَلَيْكُمْ.", category: "Greetings", color: "blue" , colloquial: "سَلَام", colloquialTransliteration: "Salaam" },
  { arabic: "مِنْ فَضْلِكَ", transliteration: "Min fadlik", meaning: "Please", example: "مِنْ فَضْلِكَ، أَعِدِ السُّؤَالَ.", category: "Polite words", color: "coral" , colloquial: "لَو سَمَحْت", colloquialTransliteration: "Law samaht" },
  { arabic: "مُعَلِّم", transliteration: "Muʿallim", meaning: "Teacher", example: "هَذَا مُعَلِّمِي.", category: "People", color: "gold" , colloquial: "مُعَلِّم", colloquialTransliteration: "Mu'allim" },
  { arabic: "حَلِيب", transliteration: "Haleeb", meaning: "Milk", example: "أَشْرَبُ حَلِيبًا دَافِئًا.", category: "Everyday", color: "sage" , colloquial: "حَلِيب", colloquialTransliteration: "Haleeb" },
  { arabic: "حَدِيقَة", transliteration: "Hadeeqah", meaning: "Park", example: "نَلْعَبُ فِي الْحَدِيقَةِ.", category: "Places", color: "blue" , colloquial: "حَدِيقَة", colloquialTransliteration: "Hadeeqah" },
  { arabic: "دَفْتَر", transliteration: "Daftar", meaning: "Notebook", example: "أَكْتُبُ فِي دَفْتَرِي.", category: "School", color: "coral" , colloquial: "دَفْتَر", colloquialTransliteration: "Daftar" },
  { arabic: "وَرْدَة", transliteration: "Wardah", meaning: "Flower", example: "هَذِهِ وَرْدَةٌ جَمِيلَةٌ.", category: "Nature", color: "gold" , colloquial: "وَرْدَة", colloquialTransliteration: "Wardah" },
  { arabic: "كَلْب", transliteration: "Kalb", meaning: "Dog", example: "هَذَا كَلْبٌ لَطِيفٌ.", category: "Animals", color: "sage" , colloquial: "كَلْب", colloquialTransliteration: "Kalb" },
  { arabic: "جَدّ", transliteration: "Jadd", meaning: "Grandfather", example: "جَدِّي يَحْكِي لِي قِصَصًا جَمِيلَةً.", category: "Family", color: "coral", colloquial: "جَد", colloquialTransliteration: "Yad" },
  { arabic: "جَدَّة", transliteration: "Jaddah", meaning: "Grandmother", example: "جَدَّتِي تَخْبِزُ خُبْزًا لَذِيذًا.", category: "Family", color: "gold", colloquial: "حَبُّوبَة", colloquialTransliteration: "Habboubah" },
  { arabic: "أَخ", transliteration: "Akh", meaning: "Brother", example: "أَخِي أَكْبَرُ مِنِّي.", category: "Family", color: "sage", colloquial: "خُوي", colloquialTransliteration: "Khuy" },
  { arabic: "أُخْت", transliteration: "Ukht", meaning: "Sister", example: "أُخْتِي تَدْرُسُ فِي الْجَامِعَةِ.", category: "Family", color: "blue", colloquial: "أُخْتِي", colloquialTransliteration: "Ukhty" },
  { arabic: "عَمّ", transliteration: "Amm", meaning: "Uncle (father's brother)", example: "عَمِّي يَعِيشُ فِي مَدِينَةٍ أُخْرَى.", category: "Family", color: "coral", colloquial: "عَمّ", colloquialTransliteration: "Amm" },
  { arabic: "عَمَّة", transliteration: "Ammah", meaning: "Aunt (father's sister)", example: "عَمَّتِي زَارَتْنَا أَمْسِ.", category: "Family", color: "gold", colloquial: "عَمَّة", colloquialTransliteration: "Ammah" },
  { arabic: "خَال", transliteration: "Khaal", meaning: "Uncle (mother's brother)", example: "خَالِي يُحِبُّ الصَّيْدَ.", category: "Family", color: "sage", colloquial: "خَال", colloquialTransliteration: "Khaal" },
  { arabic: "خَالَة", transliteration: "Khaalah", meaning: "Aunt (mother's sister)", example: "خَالَتِي تَطْبُخُ جَيِّدًا.", category: "Family", color: "blue", colloquial: "خَالَة", colloquialTransliteration: "Khaalah" },
  { arabic: "ابْن", transliteration: "Ibn", meaning: "Son", example: "ابْنِي يَلْعَبُ كُرَةَ الْقَدَمِ.", category: "Family", color: "coral", colloquial: "وَلَد", colloquialTransliteration: "Walad" },
  { arabic: "ابْنَة", transliteration: "Ibnah", meaning: "Daughter", example: "ابْنَتِي تُحِبُّ الرَّسْمَ.", category: "Family", color: "gold", colloquial: "بِنْت", colloquialTransliteration: "Bint" },
  { arabic: "زَوْج", transliteration: "Zawj", meaning: "Husband", example: "زَوْجِي يَعْمَلُ فِي الْمُسْتَشْفَى.", category: "Family", color: "sage", colloquial: "رَيَّال", colloquialTransliteration: "Rayyal" },
  { arabic: "زَوْجَة", transliteration: "Zawjah", meaning: "Wife", example: "زَوْجَتِي مُعَلِّمَةٌ.", category: "Family", color: "blue", colloquial: "مَرَة", colloquialTransliteration: "Marah" },
  { arabic: "طِفْل", transliteration: "Tifl", meaning: "Baby / Child", example: "الطِّفْلُ يَنَامُ فِي الْمَهْدِ.", category: "Family", color: "coral", colloquial: "يَهَال", colloquialTransliteration: "Yihal" },
  { arabic: "عَائِلَة", transliteration: "A'ilah", meaning: "Family", example: "عَائِلَتِي كَبِيرَةٌ وَسَعِيدَةٌ.", category: "Family", color: "gold", colloquial: "أَهْل", colloquialTransliteration: "Ahal" },
  { arabic: "أَسَد", transliteration: "Asad", meaning: "Lion", example: "الْأَسَدُ مَلِكُ الْغَابَةِ.", category: "Animals", color: "coral", colloquial: "أَسَد", colloquialTransliteration: "Asad" },
  { arabic: "فِيل", transliteration: "Feel", meaning: "Elephant", example: "الْفِيلُ حَيَوَانٌ ضَخْمٌ.", category: "Animals", color: "gold", colloquial: "فِيل", colloquialTransliteration: "Feel" },
  { arabic: "جَمَل", transliteration: "Jamal", meaning: "Camel", example: "الْجَمَلُ يَعِيشُ فِي الصَّحْرَاءِ.", category: "Animals", color: "sage", colloquial: "جَمَل", colloquialTransliteration: "Jamal" },
  { arabic: "حِصَان", transliteration: "Hisaan", meaning: "Horse", example: "الْحِصَانُ يَجْرِي بِسُرْعَةٍ.", category: "Animals", color: "blue", colloquial: "خَيْل", colloquialTransliteration: "Khayl" },
  { arabic: "بَقَرَة", transliteration: "Baqarah", meaning: "Cow", example: "الْبَقَرَةُ تُعْطِينَا الْحَلِيبَ.", category: "Animals", color: "coral", colloquial: "بَقَرَة", colloquialTransliteration: "Baqarah" },
  { arabic: "خَرُوف", transliteration: "Kharoof", meaning: "Sheep", example: "الْخَرُوفُ صُوفُهُ نَاعِمٌ.", category: "Animals", color: "gold", colloquial: "خَرُوف", colloquialTransliteration: "Kharoof" },
  { arabic: "أَرْنَب", transliteration: "Arnab", meaning: "Rabbit", example: "الْأَرْنَبُ يُحِبُّ الْجَزَرَ.", category: "Animals", color: "sage", colloquial: "أَرْنَب", colloquialTransliteration: "Arnab" },
  { arabic: "طَائِر", transliteration: "Taa'ir", meaning: "Bird", example: "الطَّائِرُ يُغَرِّدُ فَوْقَ الشَّجَرَةِ.", category: "Animals", color: "blue", colloquial: "طِير", colloquialTransliteration: "Teer" },
  { arabic: "سَمَكَة", transliteration: "Samakah", meaning: "Fish", example: "السَّمَكَةُ تَسْبَحُ فِي الْبَحْرِ.", category: "Animals", color: "coral", colloquial: "سَمَكَة", colloquialTransliteration: "Samakah" },
  { arabic: "دَجَاجَة", transliteration: "Dajaajah", meaning: "Chicken", example: "الدَّجَاجَةُ تَضَعُ الْبَيْضَ.", category: "Animals", color: "gold", colloquial: "فَرُّوج", colloquialTransliteration: "Farrouj" },
  { arabic: "بَطَّة", transliteration: "Battah", meaning: "Duck", example: "الْبَطَّةُ تَسْبَحُ فِي الْبِرْكَةِ.", category: "Animals", color: "sage", colloquial: "بَطَّة", colloquialTransliteration: "Battah" },
  { arabic: "قِرْد", transliteration: "Qird", meaning: "Monkey", example: "الْقِرْدُ يَتَسَلَّقُ الْأَشْجَارَ.", category: "Animals", color: "blue", colloquial: "قِرْد", colloquialTransliteration: "Qird" },
  { arabic: "دُبّ", transliteration: "Dubb", meaning: "Bear", example: "الدُّبُّ كَبِيرٌ وَقَوِيٌّ.", category: "Animals", color: "coral", colloquial: "دُبّ", colloquialTransliteration: "Dubb" },
  { arabic: "نَمِر", transliteration: "Namir", meaning: "Tiger", example: "النَّمِرُ سَرِيعٌ جِدًّا.", category: "Animals", color: "gold", colloquial: "نَمِر", colloquialTransliteration: "Namir" },
  { arabic: "فَأْر", transliteration: "Fa'r", meaning: "Mouse", example: "الْفَأْرُ صَغِيرٌ وَسَرِيعٌ.", category: "Animals", color: "sage", colloquial: "فَار", colloquialTransliteration: "Faar" },
  { arabic: "ثَعْبَان", transliteration: "Thu'baan", meaning: "Snake", example: "الثُّعْبَانُ يَزْحَفُ عَلَى الْأَرْضِ.", category: "Animals", color: "blue", colloquial: "حَيَّة", colloquialTransliteration: "Hayyah" },
  { arabic: "سُلَحْفَاة", transliteration: "Sulahfah", meaning: "Turtle", example: "السُّلَحْفَاةُ تَمْشِي بِبُطْءٍ.", category: "Animals", color: "coral", colloquial: "سُلَحْفَاة", colloquialTransliteration: "Sulahfah" },
  { arabic: "ضِفْدَع", transliteration: "Difda'", meaning: "Frog", example: "الضِّفْدَعُ يَقْفِزُ عَالِيًا.", category: "Animals", color: "gold", colloquial: "ضِفْدَع", colloquialTransliteration: "Difda'" },
  { arabic: "حِمَار", transliteration: "Himaar", meaning: "Donkey", example: "الْحِمَارُ يَحْمِلُ الْأَغْرَاضَ.", category: "Animals", color: "sage", colloquial: "حِمَار", colloquialTransliteration: "Himaar" },
  { arabic: "ثَعْلَب", transliteration: "Tha'lab", meaning: "Fox", example: "الثَّعْلَبُ ذَكِيٌّ وَمَاكِرٌ.", category: "Animals", color: "blue", colloquial: "ثَعْلَب", colloquialTransliteration: "Tha'lab" },
  { arabic: "ذِئْب", transliteration: "Thi'b", meaning: "Wolf", example: "الذِّئْبُ يَعِيشُ فِي قَطِيعٍ.", category: "Animals", color: "coral", colloquial: "ذِيب", colloquialTransliteration: "Theeb" },
  { arabic: "غَزَال", transliteration: "Ghazaal", meaning: "Deer", example: "الْغَزَالُ يَجْرِي بِرَشَاقَةٍ.", category: "Animals", color: "gold", colloquial: "غَزَال", colloquialTransliteration: "Ghazaal" },
  { arabic: "تُفَّاح", transliteration: "Tuffaah", meaning: "Apple", example: "أَكَلْتُ تُفَّاحَةً حَمْرَاءَ.", category: "Fruits", color: "sage", colloquial: "تُفَّاح", colloquialTransliteration: "Tuffaah" },
  { arabic: "مَوْز", transliteration: "Mawz", meaning: "Banana", example: "الْمَوْزُ غَنِيٌّ بِالطَّاقَةِ.", category: "Fruits", color: "blue", colloquial: "مَوْز", colloquialTransliteration: "Mawz" },
  { arabic: "بُرْتُقَال", transliteration: "Burtuqaal", meaning: "Orange", example: "شَرِبْتُ عَصِيرَ الْبُرْتُقَالِ.", category: "Fruits", color: "coral", colloquial: "بُرْتُقَال", colloquialTransliteration: "Burtuqaal" },
  { arabic: "عِنَب", transliteration: "Inab", meaning: "Grape", example: "الْعِنَبُ حُلْوٌ وَطَازَجٌ.", category: "Fruits", color: "gold", colloquial: "عِنَب", colloquialTransliteration: "Inab" },
  { arabic: "بَطِّيخ", transliteration: "Battikh", meaning: "Watermelon", example: "الْبَطِّيخُ لَذِيذٌ فِي الصَّيْفِ.", category: "Fruits", color: "sage", colloquial: "حَبْحَب", colloquialTransliteration: "Habhab" },
  { arabic: "فَرَاوْلَة", transliteration: "Frawlah", meaning: "Strawberry", example: "الْفَرَاوْلَةُ حَمْرَاءُ وَحُلْوَةٌ.", category: "Fruits", color: "blue", colloquial: "فَرَاوْلَة", colloquialTransliteration: "Frawlah" },
  { arabic: "مَانْجَا", transliteration: "Mangaa", meaning: "Mango", example: "الْمَانْجَا فَاكِهَةٌ اسْتِوَائِيَّةٌ.", category: "Fruits", color: "coral", colloquial: "مَانْجَا", colloquialTransliteration: "Mangaa" },
  { arabic: "أَنَانَاس", transliteration: "Ananaas", meaning: "Pineapple", example: "الْأَنَانَاسُ حَامِضٌ وَحُلْوٌ.", category: "Fruits", color: "gold", colloquial: "أَنَانَاس", colloquialTransliteration: "Ananaas" },
  { arabic: "كُمَّثْرَى", transliteration: "Kummathra", meaning: "Pear", example: "الْكُمَّثْرَى طَرِيَّةٌ وَعَصِيرِيَّةٌ.", category: "Fruits", color: "sage", colloquial: "كُمَّثْرَى", colloquialTransliteration: "Kummathra" },
  { arabic: "خَوْخ", transliteration: "Khawkh", meaning: "Peach", example: "الْخَوْخُ فَاكِهَةُ الصَّيْفِ.", category: "Fruits", color: "blue", colloquial: "خَوْخ", colloquialTransliteration: "Khawkh" },
  { arabic: "كَرَز", transliteration: "Karaz", meaning: "Cherry", example: "الْكَرَزُ صَغِيرٌ وَلَذِيذٌ.", category: "Fruits", color: "coral", colloquial: "كَرَز", colloquialTransliteration: "Karaz" },
  { arabic: "لَيْمُون", transliteration: "Laymoon", meaning: "Lemon", example: "أُضِيفُ اللَّيْمُونَ إِلَى الشَّايِ.", category: "Fruits", color: "gold", colloquial: "لَيْمُون", colloquialTransliteration: "Laymoon" },
  { arabic: "تِين", transliteration: "Teen", meaning: "Fig", example: "التِّينُ غَنِيٌّ بِالْفَوَائِدِ.", category: "Fruits", color: "sage", colloquial: "تِين", colloquialTransliteration: "Teen" },
  { arabic: "تَمْر", transliteration: "Tamr", meaning: "Date", example: "نَأْكُلُ التَّمْرَ فِي رَمَضَانَ.", category: "Fruits", color: "blue", colloquial: "تَمْر", colloquialTransliteration: "Tamr" },
  { arabic: "رُمَّان", transliteration: "Rummaan", meaning: "Pomegranate", example: "الرُّمَّانُ مَلِيءٌ بِالْحَبَّاتِ.", category: "Fruits", color: "coral", colloquial: "رُمَّان", colloquialTransliteration: "Rummaan" },
  { arabic: "مِشْمِش", transliteration: "Mishmish", meaning: "Apricot", example: "الْمِشْمِشُ لَذِيذٌ حِينَ يَنْضَجُ.", category: "Fruits", color: "gold", colloquial: "مِشْمِش", colloquialTransliteration: "Mishmish" },
  { arabic: "بَرْقُوق", transliteration: "Barqooq", meaning: "Plum", example: "الْبَرْقُوقُ حُلْوٌ وَحَامِضٌ قَلِيلًا.", category: "Fruits", color: "sage", colloquial: "بَرْقُوق", colloquialTransliteration: "Barqooq" },
  { arabic: "جَوْزُ الْهِنْد", transliteration: "Jawz al-Hind", meaning: "Coconut", example: "جَوْزُ الْهِنْدِ يَحْتَوِي عَلَى مَاءٍ لَذِيذٍ.", category: "Fruits", color: "blue", colloquial: "نَارْجِيل", colloquialTransliteration: "Narjeel" },
  { arabic: "شَمَّام", transliteration: "Shammaam", meaning: "Melon", example: "الشَّمَّامُ مُنْعِشٌ فِي الصَّيْفِ.", category: "Fruits", color: "coral", colloquial: "شَمَّام", colloquialTransliteration: "Shammaam" },
  { arabic: "كِيوِي", transliteration: "Kiwi", meaning: "Kiwi", example: "الْكِيوِي أَخْضَرُ مِنْ الدَّاخِلِ.", category: "Fruits", color: "gold", colloquial: "كِيوِي", colloquialTransliteration: "Kiwi" },

];


const englishVocabulary: VocabularyItem[] = [
  { arabic: "Hello", transliteration: "Hello", meaning: "مَرْحَبًا", example: "Hello! How are you?", category: "Greetings", color: "coral" , colloquial: "هَلَا", colloquialTransliteration: "Hala" },
  { arabic: "Thank you", transliteration: "Thank you", meaning: "شُكْرًا", example: "Thank you very much.", category: "Polite words", color: "gold" , colloquial: "مَشْكُور", colloquialTransliteration: "Mashkoor" },
  { arabic: "Friend", transliteration: "Friend", meaning: "صَدِيق", example: "This is my friend.", category: "People", color: "sage" , colloquial: "صَاحِب", colloquialTransliteration: "Saahib" },
  { arabic: "Water", transliteration: "Water", meaning: "مَاء", example: "I want a glass of water.", category: "Everyday", color: "blue" , colloquial: "مَاي", colloquialTransliteration: "Maay" },
  { arabic: "House", transliteration: "House", meaning: "بَيْت", example: "This is my house.", category: "Places", color: "coral" , colloquial: "بَيْت", colloquialTransliteration: "Bayt" },
  { arabic: "Book", transliteration: "Book", meaning: "كِتَاب", example: "I read a book.", category: "School", color: "gold" , colloquial: "كِتَاب", colloquialTransliteration: "Kitaab" },
  { arabic: "Sun", transliteration: "Sun", meaning: "شَمْس", example: "The sun is bright.", category: "Nature", color: "sage" , colloquial: "شَمْس", colloquialTransliteration: "Shams" },
  { arabic: "Cat", transliteration: "Cat", meaning: "قِطَّة", example: "This is a small cat.", category: "Animals", color: "blue" , colloquial: "بَسَّة", colloquialTransliteration: "Bissah" },
  { arabic: "Yes", transliteration: "Yes", meaning: "نَعَم", example: "Yes, I like Arabic.", category: "Useful", color: "coral" , colloquial: "إِي", colloquialTransliteration: "Ee" },
  { arabic: "No", transliteration: "No", meaning: "لَا", example: "No, thank you.", category: "Useful", color: "gold" , colloquial: "لَا", colloquialTransliteration: "Laa" },
  { arabic: "Morning", transliteration: "Morning", meaning: "صَبَاح", example: "Good morning!", category: "Time", color: "sage" , colloquial: "صَبَاح", colloquialTransliteration: "Sabaah" },
  { arabic: "Night", transliteration: "Night", meaning: "لَيْل", example: "Good night.", category: "Time", color: "blue" , colloquial: "لَيْل", colloquialTransliteration: "Layl" },
  { arabic: "School", transliteration: "School", meaning: "مَدْرَسَة", example: "I go to school.", category: "Places", color: "coral" , colloquial: "مَدْرَسَة", colloquialTransliteration: "Madrasah" },
  { arabic: "Pen", transliteration: "Pen", meaning: "قَلَم", example: "This is my pen.", category: "School", color: "gold" , colloquial: "قَلَم", colloquialTransliteration: "Qalam" },
  { arabic: "Ball", transliteration: "Ball", meaning: "كُرَة", example: "I play with a ball.", category: "Play", color: "sage" , colloquial: "طَابَة", colloquialTransliteration: "Taabah" },
  { arabic: "Mother", transliteration: "Mother", meaning: "أُمّ", example: "My mother reads.", category: "Family", color: "blue" , colloquial: "مَاما", colloquialTransliteration: "Maama" },
  { arabic: "Father", transliteration: "Father", meaning: "أَب", example: "My father is at home.", category: "Family", color: "coral" , colloquial: "أَبُويَ", colloquialTransliteration: "Abuy" },
  { arabic: "Food", transliteration: "Food", meaning: "طَعَام", example: "The food is delicious.", category: "Everyday", color: "gold" , colloquial: "أَكَل", colloquialTransliteration: "Akil" },
  { arabic: "Love", transliteration: "Love", meaning: "حُبّ", example: "Love is beautiful.", category: "Feelings", color: "sage" , colloquial: "حُبّ", colloquialTransliteration: "Hubb" },
  { arabic: "Joy", transliteration: "Joy", meaning: "فَرَح", example: "I feel joy.", category: "Feelings", color: "blue" , colloquial: "فَرَح", colloquialTransliteration: "Farah" },
  { arabic: "Peace", transliteration: "Peace", meaning: "سَلَام", example: "Peace begins with kindness.", category: "Greetings", color: "blue" , colloquial: "سَلَام", colloquialTransliteration: "Salaam" },
  { arabic: "Please", transliteration: "Please", meaning: "مِنْ فَضْلِكَ", example: "Please repeat the question.", category: "Polite words", color: "coral" , colloquial: "لَو سَمَحْت", colloquialTransliteration: "Law samaht" },
  { arabic: "Teacher", transliteration: "Teacher", meaning: "مُعَلِّم", example: "This is my teacher.", category: "People", color: "gold" , colloquial: "مُعَلِّم", colloquialTransliteration: "Mu'allim" },
  { arabic: "Milk", transliteration: "Milk", meaning: "حَلِيب", example: "I drink warm milk.", category: "Everyday", color: "sage" , colloquial: "حَلِيب", colloquialTransliteration: "Haleeb" },
  { arabic: "Park", transliteration: "Park", meaning: "حَدِيقَة", example: "We play in the park.", category: "Places", color: "blue" , colloquial: "حَدِيقَة", colloquialTransliteration: "Hadeeqah" },
  { arabic: "Notebook", transliteration: "Notebook", meaning: "دَفْتَر", example: "I write in my notebook.", category: "School", color: "coral" , colloquial: "دَفْتَر", colloquialTransliteration: "Daftar" },
  { arabic: "Flower", transliteration: "Flower", meaning: "وَرْدَة", example: "This flower is beautiful.", category: "Nature", color: "gold" , colloquial: "وَرْدَة", colloquialTransliteration: "Wardah" },
  { arabic: "Dog", transliteration: "Dog", meaning: "كَلْب", example: "This is a friendly dog.", category: "Animals", color: "sage" , colloquial: "كَلْب", colloquialTransliteration: "Kalb" },
  { arabic: "Grandfather", transliteration: "Grandfather", meaning: "جَدّ", example: "My grandfather tells great stories.", category: "Family", color: "coral", colloquial: "جَد", colloquialTransliteration: "Yad" },
  { arabic: "Grandmother", transliteration: "Grandmother", meaning: "جَدَّة", example: "My grandmother bakes bread.", category: "Family", color: "gold", colloquial: "حَبُّوبَة", colloquialTransliteration: "Habboubah" },
  { arabic: "Brother", transliteration: "Brother", meaning: "أَخ", example: "My brother is older than me.", category: "Family", color: "sage", colloquial: "خُوي", colloquialTransliteration: "Khuy" },
  { arabic: "Sister", transliteration: "Sister", meaning: "أُخْت", example: "My sister studies at university.", category: "Family", color: "blue", colloquial: "أُخْتِي", colloquialTransliteration: "Ukhty" },
  { arabic: "Uncle (father's brother)", transliteration: "Uncle (father's brother)", meaning: "عَمّ", example: "My uncle lives in another city.", category: "Family", color: "coral", colloquial: "عَمّ", colloquialTransliteration: "Amm" },
  { arabic: "Aunt (father's sister)", transliteration: "Aunt (father's sister)", meaning: "عَمَّة", example: "My aunt visited us yesterday.", category: "Family", color: "gold", colloquial: "عَمَّة", colloquialTransliteration: "Ammah" },
  { arabic: "Uncle (mother's brother)", transliteration: "Uncle (mother's brother)", meaning: "خَال", example: "My uncle loves hunting.", category: "Family", color: "sage", colloquial: "خَال", colloquialTransliteration: "Khaal" },
  { arabic: "Aunt (mother's sister)", transliteration: "Aunt (mother's sister)", meaning: "خَالَة", example: "My aunt cooks very well.", category: "Family", color: "blue", colloquial: "خَالَة", colloquialTransliteration: "Khaalah" },
  { arabic: "Son", transliteration: "Son", meaning: "ابْن", example: "My son plays football.", category: "Family", color: "coral", colloquial: "وَلَد", colloquialTransliteration: "Walad" },
  { arabic: "Daughter", transliteration: "Daughter", meaning: "ابْنَة", example: "My daughter loves drawing.", category: "Family", color: "gold", colloquial: "بِنْت", colloquialTransliteration: "Bint" },
  { arabic: "Husband", transliteration: "Husband", meaning: "زَوْج", example: "My husband works at the hospital.", category: "Family", color: "sage", colloquial: "رَيَّال", colloquialTransliteration: "Rayyal" },
  { arabic: "Wife", transliteration: "Wife", meaning: "زَوْجَة", example: "My wife is a teacher.", category: "Family", color: "blue", colloquial: "مَرَة", colloquialTransliteration: "Marah" },
  { arabic: "Baby / Child", transliteration: "Baby / Child", meaning: "طِفْل", example: "The baby sleeps in the crib.", category: "Family", color: "coral", colloquial: "يَهَال", colloquialTransliteration: "Yihal" },
  { arabic: "Family", transliteration: "Family", meaning: "عَائِلَة", example: "My family is big and happy.", category: "Family", color: "gold", colloquial: "أَهْل", colloquialTransliteration: "Ahal" },
  { arabic: "Lion", transliteration: "Lion", meaning: "أَسَد", example: "The lion is the king of the jungle.", category: "Animals", color: "coral", colloquial: "أَسَد", colloquialTransliteration: "Asad" },
  { arabic: "Elephant", transliteration: "Elephant", meaning: "فِيل", example: "The elephant is a huge animal.", category: "Animals", color: "gold", colloquial: "فِيل", colloquialTransliteration: "Feel" },
  { arabic: "Camel", transliteration: "Camel", meaning: "جَمَل", example: "The camel lives in the desert.", category: "Animals", color: "sage", colloquial: "جَمَل", colloquialTransliteration: "Jamal" },
  { arabic: "Horse", transliteration: "Horse", meaning: "حِصَان", example: "The horse runs very fast.", category: "Animals", color: "blue", colloquial: "خَيْل", colloquialTransliteration: "Khayl" },
  { arabic: "Cow", transliteration: "Cow", meaning: "بَقَرَة", example: "The cow gives us milk.", category: "Animals", color: "coral", colloquial: "بَقَرَة", colloquialTransliteration: "Baqarah" },
  { arabic: "Sheep", transliteration: "Sheep", meaning: "خَرُوف", example: "The sheep has soft wool.", category: "Animals", color: "gold", colloquial: "خَرُوف", colloquialTransliteration: "Kharoof" },
  { arabic: "Rabbit", transliteration: "Rabbit", meaning: "أَرْنَب", example: "The rabbit loves carrots.", category: "Animals", color: "sage", colloquial: "أَرْنَب", colloquialTransliteration: "Arnab" },
  { arabic: "Bird", transliteration: "Bird", meaning: "طَائِر", example: "The bird sings on the tree.", category: "Animals", color: "blue", colloquial: "طِير", colloquialTransliteration: "Teer" },
  { arabic: "Fish", transliteration: "Fish", meaning: "سَمَكَة", example: "The fish swims in the sea.", category: "Animals", color: "coral", colloquial: "سَمَكَة", colloquialTransliteration: "Samakah" },
  { arabic: "Chicken", transliteration: "Chicken", meaning: "دَجَاجَة", example: "The chicken lays eggs.", category: "Animals", color: "gold", colloquial: "فَرُّوج", colloquialTransliteration: "Farrouj" },
  { arabic: "Duck", transliteration: "Duck", meaning: "بَطَّة", example: "The duck swims in the pond.", category: "Animals", color: "sage", colloquial: "بَطَّة", colloquialTransliteration: "Battah" },
  { arabic: "Monkey", transliteration: "Monkey", meaning: "قِرْد", example: "The monkey climbs the trees.", category: "Animals", color: "blue", colloquial: "قِرْد", colloquialTransliteration: "Qird" },
  { arabic: "Bear", transliteration: "Bear", meaning: "دُبّ", example: "The bear is big and strong.", category: "Animals", color: "coral", colloquial: "دُبّ", colloquialTransliteration: "Dubb" },
  { arabic: "Tiger", transliteration: "Tiger", meaning: "نَمِر", example: "The tiger is very fast.", category: "Animals", color: "gold", colloquial: "نَمِر", colloquialTransliteration: "Namir" },
  { arabic: "Mouse", transliteration: "Mouse", meaning: "فَأْر", example: "The mouse is small and quick.", category: "Animals", color: "sage", colloquial: "فَار", colloquialTransliteration: "Faar" },
  { arabic: "Snake", transliteration: "Snake", meaning: "ثَعْبَان", example: "The snake crawls on the ground.", category: "Animals", color: "blue", colloquial: "حَيَّة", colloquialTransliteration: "Hayyah" },
  { arabic: "Turtle", transliteration: "Turtle", meaning: "سُلَحْفَاة", example: "The turtle walks slowly.", category: "Animals", color: "coral", colloquial: "سُلَحْفَاة", colloquialTransliteration: "Sulahfah" },
  { arabic: "Frog", transliteration: "Frog", meaning: "ضِفْدَع", example: "The frog jumps high.", category: "Animals", color: "gold", colloquial: "ضِفْدَع", colloquialTransliteration: "Difda'" },
  { arabic: "Donkey", transliteration: "Donkey", meaning: "حِمَار", example: "The donkey carries the load.", category: "Animals", color: "sage", colloquial: "حِمَار", colloquialTransliteration: "Himaar" },
  { arabic: "Fox", transliteration: "Fox", meaning: "ثَعْلَب", example: "The fox is smart and cunning.", category: "Animals", color: "blue", colloquial: "ثَعْلَب", colloquialTransliteration: "Tha'lab" },
  { arabic: "Wolf", transliteration: "Wolf", meaning: "ذِئْب", example: "The wolf lives in a pack.", category: "Animals", color: "coral", colloquial: "ذِيب", colloquialTransliteration: "Theeb" },
  { arabic: "Deer", transliteration: "Deer", meaning: "غَزَال", example: "The deer runs gracefully.", category: "Animals", color: "gold", colloquial: "غَزَال", colloquialTransliteration: "Ghazaal" },
  { arabic: "Apple", transliteration: "Apple", meaning: "تُفَّاح", example: "I ate a red apple.", category: "Fruits", color: "sage", colloquial: "تُفَّاح", colloquialTransliteration: "Tuffaah" },
  { arabic: "Banana", transliteration: "Banana", meaning: "مَوْز", example: "The banana is full of energy.", category: "Fruits", color: "blue", colloquial: "مَوْز", colloquialTransliteration: "Mawz" },
  { arabic: "Orange", transliteration: "Orange", meaning: "بُرْتُقَال", example: "I drank orange juice.", category: "Fruits", color: "coral", colloquial: "بُرْتُقَال", colloquialTransliteration: "Burtuqaal" },
  { arabic: "Grape", transliteration: "Grape", meaning: "عِنَب", example: "The grape is sweet and fresh.", category: "Fruits", color: "gold", colloquial: "عِنَب", colloquialTransliteration: "Inab" },
  { arabic: "Watermelon", transliteration: "Watermelon", meaning: "بَطِّيخ", example: "Watermelon is delicious in summer.", category: "Fruits", color: "sage", colloquial: "حَبْحَب", colloquialTransliteration: "Habhab" },
  { arabic: "Strawberry", transliteration: "Strawberry", meaning: "فَرَاوْلَة", example: "The strawberry is red and sweet.", category: "Fruits", color: "blue", colloquial: "فَرَاوْلَة", colloquialTransliteration: "Frawlah" },
  { arabic: "Mango", transliteration: "Mango", meaning: "مَانْجَا", example: "Mango is a tropical fruit.", category: "Fruits", color: "coral", colloquial: "مَانْجَا", colloquialTransliteration: "Mangaa" },
  { arabic: "Pineapple", transliteration: "Pineapple", meaning: "أَنَانَاس", example: "Pineapple is sour and sweet.", category: "Fruits", color: "gold", colloquial: "أَنَانَاس", colloquialTransliteration: "Ananaas" },
  { arabic: "Pear", transliteration: "Pear", meaning: "كُمَّثْرَى", example: "The pear is soft and juicy.", category: "Fruits", color: "sage", colloquial: "كُمَّثْرَى", colloquialTransliteration: "Kummathra" },
  { arabic: "Peach", transliteration: "Peach", meaning: "خَوْخ", example: "Peach is a summer fruit.", category: "Fruits", color: "blue", colloquial: "خَوْخ", colloquialTransliteration: "Khawkh" },
  { arabic: "Cherry", transliteration: "Cherry", meaning: "كَرَز", example: "The cherry is small and tasty.", category: "Fruits", color: "coral", colloquial: "كَرَز", colloquialTransliteration: "Karaz" },
  { arabic: "Lemon", transliteration: "Lemon", meaning: "لَيْمُون", example: "I add lemon to my tea.", category: "Fruits", color: "gold", colloquial: "لَيْمُون", colloquialTransliteration: "Laymoon" },
  { arabic: "Fig", transliteration: "Fig", meaning: "تِين", example: "Figs are rich in benefits.", category: "Fruits", color: "sage", colloquial: "تِين", colloquialTransliteration: "Teen" },
  { arabic: "Date", transliteration: "Date", meaning: "تَمْر", example: "We eat dates in Ramadan.", category: "Fruits", color: "blue", colloquial: "تَمْر", colloquialTransliteration: "Tamr" },
  { arabic: "Pomegranate", transliteration: "Pomegranate", meaning: "رُمَّان", example: "The pomegranate is full of seeds.", category: "Fruits", color: "coral", colloquial: "رُمَّان", colloquialTransliteration: "Rummaan" },
  { arabic: "Apricot", transliteration: "Apricot", meaning: "مِشْمِش", example: "Apricot is tasty when ripe.", category: "Fruits", color: "gold", colloquial: "مِشْمِش", colloquialTransliteration: "Mishmish" },
  { arabic: "Plum", transliteration: "Plum", meaning: "بَرْقُوق", example: "The plum is sweet and a bit sour.", category: "Fruits", color: "sage", colloquial: "بَرْقُوق", colloquialTransliteration: "Barqooq" },
  { arabic: "Coconut", transliteration: "Coconut", meaning: "جَوْزُ الْهِنْد", example: "Coconut has tasty water inside.", category: "Fruits", color: "blue", colloquial: "نَارْجِيل", colloquialTransliteration: "Narjeel" },
  { arabic: "Melon", transliteration: "Melon", meaning: "شَمَّام", example: "Melon is refreshing in summer.", category: "Fruits", color: "coral", colloquial: "شَمَّام", colloquialTransliteration: "Shammaam" },
  { arabic: "Kiwi", transliteration: "Kiwi", meaning: "كِيوِي", example: "The kiwi is green inside.", category: "Fruits", color: "gold", colloquial: "كِيوِي", colloquialTransliteration: "Kiwi" },

];

const englishLetters: LetterItem[] = [
  { letter: "A", name: "A", sound: "ay", example: "Apple", exampleMeaning: "تفاحة", color: "coral" }, { letter: "B", name: "B", sound: "bee", example: "Book", exampleMeaning: "كتاب", color: "gold" }, { letter: "C", name: "C", sound: "see", example: "Cat", exampleMeaning: "قطة", color: "sage" }, { letter: "D", name: "D", sound: "dee", example: "Dog", exampleMeaning: "كلب", color: "blue" }, { letter: "E", name: "E", sound: "ee", example: "Egg", exampleMeaning: "بيضة", color: "coral" }, { letter: "F", name: "F", sound: "ef", example: "Fish", exampleMeaning: "سمكة", color: "gold" }, { letter: "G", name: "G", sound: "jee", example: "Gift", exampleMeaning: "هدية", color: "sage" }, { letter: "H", name: "H", sound: "aych", example: "House", exampleMeaning: "بيت", color: "blue" }, { letter: "I", name: "I", sound: "eye", example: "Ice", exampleMeaning: "ثلج", color: "coral" }, { letter: "J", name: "J", sound: "jay", example: "Juice", exampleMeaning: "عصير", color: "gold" }, { letter: "K", name: "K", sound: "kay", example: "Key", exampleMeaning: "مفتاح", color: "sage" }, { letter: "L", name: "L", sound: "el", example: "Lion", exampleMeaning: "أسد", color: "blue" }, { letter: "M", name: "M", sound: "em", example: "Moon", exampleMeaning: "قمر", color: "coral" }, { letter: "N", name: "N", sound: "en", example: "Nose", exampleMeaning: "أنف", color: "gold" }, { letter: "O", name: "O", sound: "oh", example: "Orange", exampleMeaning: "برتقال", color: "sage" }, { letter: "P", name: "P", sound: "pee", example: "Pen", exampleMeaning: "قلم", color: "blue" }, { letter: "Q", name: "Q", sound: "cue", example: "Queen", exampleMeaning: "ملكة", color: "coral" }, { letter: "R", name: "R", sound: "ar", example: "Rose", exampleMeaning: "وردة", color: "gold" }, { letter: "S", name: "S", sound: "es", example: "Sun", exampleMeaning: "شمس", color: "sage" }, { letter: "T", name: "T", sound: "tee", example: "Tree", exampleMeaning: "شجرة", color: "blue" }, { letter: "U", name: "U", sound: "you", example: "Umbrella", exampleMeaning: "مظلة", color: "coral" }, { letter: "V", name: "V", sound: "vee", example: "Van", exampleMeaning: "شاحنة", color: "gold" }, { letter: "W", name: "W", sound: "double-you", example: "Water", exampleMeaning: "ماء", color: "sage" }, { letter: "X", name: "X", sound: "ex", example: "X-ray", exampleMeaning: "أشعة", color: "blue" }, { letter: "Y", name: "Y", sound: "why", example: "Yellow", exampleMeaning: "أصفر", color: "coral" }, { letter: "Z", name: "Z", sound: "zee", example: "Zoo", exampleMeaning: "حديقة حيوان", color: "gold" },
];

const categoryTranslations: Record<string, string> = { Greetings: "التحيات", "Polite words": "كلمات مهذبة", People: "الأشخاص", Everyday: "يوميًا", Places: "الأماكن", School: "المدرسة", Nature: "الطبيعة", Animals: "الحيوانات", Useful: "مفيدة", Time: "الوقت", Play: "اللعب", Family: "العائلة", Feelings: "المشاعر", Fruits: "الفواكه" };

const englishQuizQuestions: QuizQuestion[] = [
  { prompt: "What does «صباح الخير» mean?", hint: "We say it at the beginning of the day.", options: ["Good evening", "Good morning", "Good night", "See you"], answer: "Good morning" },
  { prompt: "Choose the Arabic word for House.", hint: "It is the place where we live.", options: ["كتاب", "مدرسة", "بيت", "شارع"], answer: "بيت" },
  { prompt: "How do you say Thank you in Arabic?", hint: "It starts with the letter sheen.", options: ["من فضلك", "عفوًا", "شكرًا", "أهلًا"], answer: "شكرًا" },
  { prompt: "Which word means Water?", hint: "It is a short three-letter word.", options: ["ماء", "نور", "باب", "قلم"], answer: "ماء" },
  { prompt: "What does «مِنْ فَضْلِكَ» mean?", hint: "Use it when asking politely.", options: ["Please", "Goodbye", "Sorry", "Welcome"], answer: "Please" },
  { prompt: "Choose the Arabic word for Teacher.", hint: "It begins with the letter meem.", options: ["معلّم", "دفتر", "حديقة", "وردة"], answer: "معلّم" },
  { prompt: "Which word means Flower?", hint: "It is something beautiful from nature.", options: ["حليب", "وردة", "كلب", "سلام"], answer: "وردة" },
  { prompt: "How do you say Park in Arabic?", hint: "A place where children play.", options: ["حديقة", "مدرسة", "بيت", "سوق"], answer: "حديقة" },
  { prompt: "Which Arabic word means Dog?", hint: "It is a friendly animal.", options: ["قطّة", "كلب", "حصان", "سمك"], answer: "كلب" },
  { prompt: "What does «دفتر» mean?", hint: "You write lessons in it.", options: ["Notebook", "Flower", "Milk", "Teacher"], answer: "Notebook" },
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
  { prompt: "ماذا تعني كلمة «مِنْ فَضْلِكَ»؟", hint: "نستخدمها عند الطلب بأدب.", options: ["Please", "Goodbye", "Sorry", "Welcome"], answer: "Please" },
  { prompt: "اختر الكلمة العربية التي تعني Teacher.", hint: "تبدأ بحرف الميم.", options: ["معلّم", "دفتر", "حديقة", "وردة"], answer: "معلّم" },
  { prompt: "ما الكلمة التي تعني Flower؟", hint: "شيء جميل من الطبيعة.", options: ["حليب", "وردة", "كلب", "سلام"], answer: "وردة" },
  { prompt: "كيف تقول Park بالعربية؟", hint: "مكان يلعب فيه الأطفال.", options: ["حديقة", "مدرسة", "بيت", "سوق"], answer: "حديقة" },
  { prompt: "ما الكلمة العربية التي تعني Dog؟", hint: "حيوان أليف وودود.", options: ["قطّة", "كلب", "حصان", "سمك"], answer: "كلب" },
  { prompt: "ماذا تعني كلمة «دفتر»؟", hint: "نكتب فيه الدروس.", options: ["Notebook", "Flower", "Milk", "Teacher"], answer: "Notebook" },
];

const matchCards: MatchCard[] = [
  { word: "تُفَّاح", meaning: "apple", letter: "ت", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85", choices: ["تُفَّاح", "قِطَّة", "شَمْس", "كِتَاب"] },
  { word: "قِطَّة", meaning: "cat", letter: "ق", image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=85", choices: ["شَمْس", "قِطَّة", "كِتَاب", "تُفَّاح"] },
  { word: "شَمْس", meaning: "sun", letter: "ش", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85", choices: ["كِتَاب", "تُفَّاح", "شَمْس", "قِطَّة"] },
  { word: "كِتَاب", meaning: "book", letter: "ك", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85", choices: ["قِطَّة", "كِتَاب", "شَمْس", "تُفَّاح"] },
  { word: "سَلَام", meaning: "peace", letter: "س", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85", choices: ["سَلَام", "وَرْدَة", "كَلْب", "حَلِيب"] },
  { word: "وَرْدَة", meaning: "flower", letter: "و", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85", choices: ["كَلْب", "حَلِيب", "وَرْدَة", "سَلَام"] },
  { word: "كَلْب", meaning: "dog", letter: "ك", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85", choices: ["حَلِيب", "سَلَام", "كَلْب", "وَرْدَة"] },
  { word: "حَلِيب", meaning: "milk", letter: "ح", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=85", choices: ["وَرْدَة", "حَلِيب", "سَلَام", "كَلْب"] },
];

function getLetterChoices(card: MatchCard) {
  return [card.letter, ...["أ", "ب", "م", "س"].filter((letter) => letter !== card.letter)];
}

const phrases = [
  { arabic: "أَيْنَ الْمَطْعَم؟", meaning: "Where is the restaurant?", tag: "Conversation" },
  { arabic: "أَنَا أَتَعَلَّمُ الْعَرَبِيَّة.", meaning: "I am learning Arabic.", tag: "Introducing yourself" },
  { arabic: "مِنْ فَضْلِكَ، تَكَلَّمْ بِبُطْء.", meaning: "Please speak slowly.", tag: "Useful phrase" },
];

type VoiceGender = "male" | "female";

const femaleVoiceHints = ["female", "woman", "zira", "samantha", "salma", "hoda", "laila", "fatima", "amira", "hala"];
const maleVoiceHints = ["male", "man", "david", "majed", "maged", "tarik", "yousef", "hamed", "fred", "daniel", "khalid"];

function pickVoiceForLanguage(language: "en" | "ar", gender: VoiceGender): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const langPrefix = language === "ar" ? "ar" : "en";
  const langVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(langPrefix));
  const pool = langVoices.length ? langVoices : voices;
  const hints = gender === "female" ? femaleVoiceHints : maleVoiceHints;
  const matched = pool.find((voice) => hints.some((hint) => hint && voice.name.toLowerCase().includes(hint)));
  if (matched) return matched;
  const fallbackHints = gender === "female" ? maleVoiceHints : femaleVoiceHints;
  const notOpposite = pool.filter((voice) => !fallbackHints.some((hint) => hint && voice.name.toLowerCase().includes(hint)));
  return notOpposite[0] ?? pool[0] ?? null;
}

function speakArabic(text: string, rate = 0.82, gender: VoiceGender = "female") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = rate;
  utterance.pitch = 1;
  const voice = pickVoiceForLanguage("ar", gender);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function speakText(text: string, language: "en" | "ar", rate = 0.82, gender: VoiceGender = "female") {
  if (language === "ar") return speakArabic(text, rate, gender);
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  const voice = pickVoiceForLanguage("en", gender);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function SectionLabel({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return <div className="mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">{eyebrow}</p><h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{children}</h2></div><div className="hidden h-px flex-1 bg-ink/10 sm:block" /></div>;
}

function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [learningTarget, setLearningTarget] = useState<"opposite" | "arabic">("opposite");
  const [libraryTab, setLibraryTab] = useState<"words" | "letters">("words");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(englishLetters[0]);
  const [gameType, setGameType] = useState<"words" | "letters">("words");
  const [gameIndex, setGameIndex] = useState(() => Math.floor(Math.random() * matchCards.length));
  const [gameChoice, setGameChoice] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => {
    if (typeof window === "undefined") return "female";
    return (window.localStorage.getItem("voiceGender") as VoiceGender) || "female";
  });
  const toggleVoiceGender = (gender: VoiceGender) => {
    setVoiceGender(gender);
    if (typeof window !== "undefined") window.localStorage.setItem("voiceGender", gender);
  };
  const activeVocabulary = learningTarget === "arabic" ? vocabulary : language === "en" ? vocabulary : englishVocabulary;
  const activeLetters = learningTarget === "arabic" ? letters : language === "en" ? letters : englishLetters;
  const learningLanguage = activeVocabulary === vocabulary ? "ar" : "en";
  const activeQuizQuestions = language === "ar" ? quizQuestions : englishQuizQuestions;
  const question = activeQuizQuestions[quizIndex];
  const categories = [language === "ar" ? "الكل" : "All", ...Array.from(new Set(activeVocabulary.map((item) => item.category)))];
  const filteredWords = useMemo(() => activeVocabulary.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesQuery = !query || item.arabic.includes(searchTerm) || item.meaning.toLowerCase().includes(query) || item.transliteration.toLowerCase().includes(query);
    return matchesQuery && (category === "All" || category === "الكل" || item.category === category);
  }), [searchTerm, category, language, learningTarget]);
  const progress = ((quizIndex + (completed ? 1 : 0)) / activeQuizQuestions.length) * 100;

  const switchLanguage = (next: "en" | "ar") => { setLanguage(next); setLearningTarget("opposite"); setQuizIndex(0); setSelectedAnswer(null); setCompleted(false); setCategory(next === "ar" ? "الكل" : "All"); setSelectedLetter(next === "en" ? letters[0] : englishLetters[0]); };
  const switchLearningTarget = (target: "opposite" | "arabic") => { setLearningTarget(target); setCategory(language === "ar" ? "الكل" : "All"); setSelectedLetter(target === "arabic" || language === "en" ? letters[0] : englishLetters[0]); setQuizIndex(0); setSelectedAnswer(null); setCompleted(false); };
  const scrollTo = (id: string, label: string) => { setActiveNav(label); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const chooseAnswer = (answer: string) => { if (selectedAnswer) return; setSelectedAnswer(answer); if (answer === question.answer) setScore((current) => current + 1); };
  const chooseGameOption = (choice: string) => { if (gameChoice) return; setGameChoice(choice); if (choice === (gameType === "words" ? matchCards[gameIndex].word : matchCards[gameIndex].letter)) setGameScore((current) => current + 1); };
  const nextGameCard = () => { setGameIndex((current) => (current + 1) % matchCards.length); setGameChoice(null); };
  const resetGame = () => { setGameIndex(Math.floor(Math.random() * matchCards.length)); setGameChoice(null); setGameScore(0); };
  const nextQuestion = () => { if (quizIndex === activeQuizQuestions.length - 1) { setCompleted(true); return; } setQuizIndex((current) => current + 1); setSelectedAnswer(null); };
  const resetQuiz = () => { setQuizIndex(Math.floor(Math.random() * activeQuizQuestions.length)); setSelectedAnswer(null); setScore(0); setCompleted(false); };

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl"><div className="container flex h-[74px] items-center justify-between gap-6">
        <button className="flex items-center gap-3 text-right" onClick={() => scrollTo("top", "Home")} aria-label="Back to home"><span className="brand-logo"><img className="brand-icon-image" src="/icon-192.png" alt="ألف باء" /><span><span className="brand-wordmark">ألف باء</span><span className="brand-subtitle block" dir="ltr">Arabic for Beginners</span></span></span></button>
        <nav className="hidden items-center gap-7 text-sm font-bold text-ink/55 md:flex" aria-label="Main navigation">{(language === "ar" ? [["top", "الرئيسية"], ["library", "المكتبة"], ["games", "الألعاب"], ["practice", "التدريب"]] : [["top", "Home"], ["library", "Library"], ["games", "Games"], ["practice", "Practice"]]).map(([id, label]) => <button key={label} onClick={() => scrollTo(id, label)} className={`nav-link ${activeNav === label ? "is-active" : ""}`}>{label}</button>)}</nav>
        <div className="flex items-center gap-2"><div className="language-switch" role="group" aria-label="Choose language"><button onClick={() => switchLanguage("en")} className={language === "en" ? "is-selected" : ""}>EN</button><button onClick={() => switchLanguage("ar")} className={language === "ar" ? "is-selected" : ""}>ع</button></div><button className="button-ghost hidden sm:flex" onClick={() => scrollTo("quiz", "Practice")}>{language === "ar" ? "ابدأ درسًا سريعًا" : "Start a quick lesson"} <ArrowLeft size={16} /></button></div><button className="icon-button md:hidden" onClick={() => scrollTo("library", "Library")} aria-label="Go to learning library"><BookOpen size={19} /></button>
      </div></header>

      <main id="top"><section className="container relative pb-16 pt-10 sm:pb-24 sm:pt-16"><div className="hero-panel"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden rounded-l-[30px] lg:block"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(246,127,99,.22),transparent_33%),radial-gradient(circle_at_65%_70%,rgba(213,171,76,.18),transparent_35%)]" /><div className="calligraphy-art" aria-hidden="true"><span>أ</span><span>ل</span><span>ف</span></div><div className="absolute bottom-9 left-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-paper/80 backdrop-blur-md"><Sparkles size={14} className="text-saffron" /> {language === "ar" ? "درس اليوم: التحيات" : "Today’s lesson: greetings"}</div></div><div className="relative z-10 max-w-xl px-6 py-12 sm:px-12 sm:py-16 lg:mr-auto lg:min-h-[470px] lg:max-w-[58%] lg:px-14 lg:py-20"><div className="mb-6 flex items-center gap-2 text-xs font-bold text-saffron"><span className="h-2 w-2 rounded-full bg-[#f59e0b] shadow-[0_0_0_4px_rgba(245,158,11,.18)]" /> {language === "ar" ? "خطوات صغيرة، تقدم حقيقي" : "Small steps, real progress"}</div><h1 className="font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-paper sm:text-7xl">{language === "ar" ? <>العربية<br /><em>تبدأ من هنا.</em></> : <>Arabic<br /><em>starts here.</em></>}</h1><p className="mt-7 max-w-md text-base leading-8 text-paper/70 sm:text-lg">{language === "ar" ? "دروس قصيرة وكلمات واضحة وتدريب يساعدك على التحدث بالعربية بثقة — خطوة كل يوم." : "Short lessons, clear words, and practice that helps you speak Arabic with confidence — one step every day."}</p><div className="mt-9 flex flex-wrap items-center gap-3"><button className="button-primary" onClick={() => scrollTo("quiz", "Practice")}><PlayCircle size={18} />{language === "ar" ? "ابدأ التدريب" : "Start practice"}</button><button className="button-on-dark" onClick={() => scrollTo("library", "Library")}><BookOpen size={17} />{language === "ar" ? "استكشف المكتبة" : "Explore library"}</button></div><div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-paper/55"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sage" />{language === "ar" ? "بدون تسجيل" : "No sign-up"}</span><span className="flex items-center gap-2"><Zap size={15} className="text-saffron" />{language === "ar" ? "دروس لخمس دقائق" : "5-minute lessons"}</span><span className="flex items-center gap-2"><Globe2 size={15} className="text-coral" />{language === "ar" ? "للمبتدئين" : "For beginners"}</span></div></div></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="stat-card"><span className="stat-icon bg-coral/12 text-coral"><Flame size={18} /></span><div><strong>4 days</strong><span>Current streak</span></div></div><div className="stat-card"><span className="stat-icon bg-saffron/18 text-[#9b761e]"><BookOpen size={18} /></span><div><strong>12 words</strong><span>Ready to review</span></div></div><div className="stat-card"><span className="stat-icon bg-sage/20 text-[#347764]"><Trophy size={18} /></span><div><strong>Level 01</strong><span>Your first steps</span></div></div></div></section>

        <section id="library" className="container scroll-mt-24 pb-20 sm:pb-28"><SectionLabel eyebrow="01 / Learning library">{language === "ar" ? "الكلمات والحروف ببساطة" : "Words and letters, made simple"}</SectionLabel><div className="mb-8 flex flex-col gap-4 rounded-3xl border border-ink/10 bg-white/60 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"><div className="flex rounded-2xl bg-ink/5 p-1" role="tablist" aria-label="Learning library"><button dir={language === "ar" ? "rtl" : "ltr"} onClick={() => setLibraryTab("words")} className={`library-tab ${libraryTab === "words" ? "is-active" : ""}`} role="tab" aria-selected={libraryTab === "words"}><BookOpen size={16} className="library-tab-icon" /><span>{language === "ar" ? "كلمات أساسية" : "Essential words"}</span></button><button dir={language === "ar" ? "rtl" : "ltr"} onClick={() => setLibraryTab("letters")} className={`library-tab ${libraryTab === "letters" ? "is-active" : ""}`} role="tab" aria-selected={libraryTab === "letters"}><span className="library-tab-letters">أ ب ت</span><span>{language === "ar" ? "الحروف والأصوات" : "Letters & sounds"}</span></button></div>{language === "ar" && <button onClick={() => switchLearningTarget(learningTarget === "arabic" ? "opposite" : "arabic")} className={`target-switch ${learningTarget === "arabic" ? "is-active" : ""}`}><Sparkles size={15} /> {learningTarget === "arabic" ? "العودة إلى تعليم الإنجليزية" : "تعليم العربية للأطفال"}</button>}{libraryTab === "words" && <label className="flex min-w-0 items-center gap-2 rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm"><Search size={16} className="text-ink/40" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={language === "ar" ? "ابحث عن كلمة..." : "Search words..."} className="min-w-0 bg-transparent outline-none placeholder:text-ink/35" aria-label={language === "ar" ? "البحث عن كلمات" : "Search words"} /></label>}<div className="flex items-center gap-1 rounded-xl border border-ink/10 bg-paper p-1 text-xs font-extrabold" role="group" aria-label={language === "ar" ? "اختيار نوع الصوت" : "Voice type"}><button type="button" onClick={() => toggleVoiceGender("female")} className={`rounded-lg px-3 py-1.5 transition-colors ${voiceGender === "female" ? "bg-coral text-white" : "text-ink/50"}`}>{language === "ar" ? "👩 امرأة" : "👩 Female"}</button><button type="button" onClick={() => toggleVoiceGender("male")} className={`rounded-lg px-3 py-1.5 transition-colors ${voiceGender === "male" ? "bg-coral text-white" : "text-ink/50"}`}>{language === "ar" ? "👨 رجل" : "👨 Male"}</button></div></div>
          {libraryTab === "words" ? <><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`category-filter ${category === item ? "is-active" : ""}`}>{language === "ar" && item !== "الكل" ? (categoryTranslations[item] ?? item) : item}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filteredWords.map((item, index) => <article key={item.arabic} className={`vocab-card color-${item.color}`}><div className="flex items-center justify-between gap-2"><span className="mini-number">{String(index + 1).padStart(2, "0")}</span><button className="audio-button" onClick={() => speakText(item.arabic, learningLanguage, 0.82, voiceGender)} aria-label={`Listen to ${item.arabic}`}><Volume2 size={16} /></button></div><div className="mt-8"><p className="arabic-word">{item.arabic}</p><p className="mt-2 text-xs font-bold tracking-wide text-ink/48" dir="ltr">{item.transliteration}</p></div><div className="mt-7 border-t border-ink/10 pt-4"><span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40">{item.category}</span><p className="mt-1 font-bold text-ink">{item.meaning}</p><p className="mt-2 text-xs leading-6 text-ink/55">{item.example}</p>{item.colloquial && <p className="mt-2 text-[11px] font-bold text-ink/45">🇰🇼 {item.colloquial}{item.colloquialTransliteration ? ` (${item.colloquialTransliteration})` : ""}</p>}</div></article>)}</div>{filteredWords.length === 0 && <div className="rounded-2xl bg-ink/5 p-8 text-center text-sm font-bold text-ink/55">No words found. Try another search.</div>}</> : <div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-start"><div><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-extrabold text-ink">{language === "ar" ? "الحروف العربية الـ28" : "The English alphabet"}</p><p className="mt-1 text-xs text-ink/50">{language === "ar" ? "اضغط على الحرف ثم استمع وكرر." : "Tap a letter, then listen and repeat."}</p></div><span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-extrabold text-sage">{language === "ar" ? "مناسب للأطفال" : "Child-friendly"}</span></div><div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{activeLetters.map((item) => <button key={item.letter} onClick={() => setSelectedLetter(item)} className={`letter-tile color-${item.color} ${selectedLetter.letter === item.letter ? "is-selected" : ""}`} aria-label={`Learn ${item.name}`}><span>{item.letter}</span><small>{item.name}</small></button>)}</div></div><article className={`letter-detail color-${selectedLetter.color}`}><div className="flex items-start justify-between gap-3"><div><p className="eyebrow mb-2">Letter of the moment</p><h3 className="font-display text-2xl font-extrabold text-ink">{selectedLetter.name}</h3></div><button className="audio-button large" onClick={() => speakText(selectedLetter.letter, learningLanguage, 0.68, voiceGender)} aria-label={`Hear ${selectedLetter.name}`}><Headphones size={19} /></button></div><div className="my-4 flex items-center gap-5"><span className="letter-big">{selectedLetter.letter}</span><div><p className="text-xs font-bold uppercase tracking-wider text-ink/45">Sound</p><p className="mt-1 text-lg font-extrabold text-ink">{selectedLetter.sound}</p></div></div><div className="rounded-2xl bg-white/65 p-4"><p className="text-xs font-bold text-ink/45">Try this word</p><p className="mt-1 font-display text-3xl font-extrabold text-ink">{selectedLetter.example}</p><p className="text-sm font-bold text-ink/55">{selectedLetter.exampleMeaning}</p><button className="mt-3 flex items-center gap-2 text-xs font-extrabold text-sage" onClick={() => speakText(selectedLetter.example, learningLanguage, 0.7, voiceGender)}><Volume2 size={14} /> Hear the example</button></div></article></div>}
        </section>

        <section id="games" className="container scroll-mt-24 pb-20 sm:pb-28">
          <SectionLabel eyebrow="02 / Play and learn">Match, listen, and smile</SectionLabel>
          <div className="game-shell">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div><span className="game-kicker"><Sparkles size={14} /> Learning game</span><h2 className="mt-3 font-display text-3xl font-extrabold text-paper sm:text-4xl">{language === "ar" ? "هل تستطيع إيجاد المطابقة؟" : "Can you find the match?"}</h2><p className="mt-2 max-w-xl text-sm leading-7 text-paper/60">{language === "ar" ? "انظر إلى الصورة، اختر المطابقة العربية، واستمع إلى الكلمة. طريقة ممتعة للتعلم باللعب." : "Look at the picture, choose the Arabic match, and listen to the word. A friendly way to learn through play."}</p></div>
              <div className="flex items-center gap-3"><span className="game-score">Score <strong>{gameScore}/{matchCards.length}</strong></span><button className="quiz-reset" onClick={resetGame}><RotateCcw size={14} /> Restart</button></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2"><button onClick={() => { setGameType("words"); resetGame(); }} className={`game-tab ${gameType === "words" ? "is-active" : ""}`}>{language === "ar" ? "طابق الكلمة" : "Match the word"}</button><button onClick={() => { setGameType("letters"); resetGame(); }} className={`game-tab ${gameType === "letters" ? "is-active" : ""}`}>{language === "ar" ? "طابق الحرف الأول" : "Match the first letter"}</button></div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div className="game-picture-card"><img src={matchCards[gameIndex].image} alt={matchCards[gameIndex].meaning} /><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-ink/50">Picture {gameIndex + 1} of {matchCards.length}</span><button className="audio-button" onClick={() => speakArabic(matchCards[gameIndex].word, 0.82, voiceGender)} aria-label="استمع إلى الإجابة"><Volume2 size={16} /></button></div></div>
              <div><p className="text-xs font-extrabold uppercase tracking-wider text-saffron">{gameType === "words" ? "Which Arabic word is this?" : "Which letter starts this word?"}</p><p className="mt-3 font-display text-2xl font-extrabold text-paper">{gameType === "words" ? `It is a ${matchCards[gameIndex].meaning}.` : `The ${matchCards[gameIndex].meaning} begins with…`}</p><div className="mt-5 grid grid-cols-2 gap-3">{(gameType === "words" ? matchCards[gameIndex].choices : getLetterChoices(matchCards[gameIndex])).map((choice) => { const correct = gameType === "words" ? choice === matchCards[gameIndex].word : choice === matchCards[gameIndex].letter; const picked = gameChoice === choice; return <button key={choice} onClick={() => chooseGameOption(choice)} className={`game-option ${picked && correct ? "correct" : ""} ${picked && !correct ? "wrong" : ""} ${gameChoice && correct ? "correct" : ""}`}><span>{choice}</span>{gameChoice && correct && <Check size={17} />}{picked && !correct && <X size={17} />}</button>; })}</div>{gameChoice && <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className={`text-sm font-extrabold ${((gameType === "words" ? gameChoice === matchCards[gameIndex].word : gameChoice === matchCards[gameIndex].letter)) ? "text-sage" : "text-coral"}`}>{((gameType === "words" ? gameChoice === matchCards[gameIndex].word : gameChoice === matchCards[gameIndex].letter)) ? "Amazing! You found it." : `The answer is ${gameType === "words" ? matchCards[gameIndex].word : matchCards[gameIndex].letter}.`}</p><button className="button-primary" onClick={nextGameCard}>Next card <ArrowLeft size={16} /></button></div>}</div>
            </div>
          </div>
        </section>

        <section id="practice" className="border-y border-ink/10 bg-cream scroll-mt-24"><div className="container grid gap-10 py-20 sm:py-24 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><div className="lg:sticky lg:top-28"><p className="eyebrow mb-3">02 / How to learn</p><h2 className="font-display max-w-sm text-4xl font-bold leading-tight text-ink sm:text-5xl">Listen, try,<br /><span className="text-coral">then remember.</span></h2><p className="mt-5 max-w-sm text-sm leading-7 text-ink/58">Every word takes you from meaning to real use. Tap the speaker, then repeat it out loud.</p><div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-5 shadow-soft"><div className="flex items-start gap-3"><span className="rounded-xl bg-saffron/20 p-2 text-[#9b761e]"><Lightbulb size={18} /></span><div><p className="text-sm font-bold">A tip for children</p><p className="mt-1 text-xs leading-6 text-ink/55">Learn three letters or words at a time. Celebrate every small sound!</p></div></div></div></div><div className="space-y-4">{phrases.map((phrase, index) => <article key={phrase.arabic} className="phrase-card group"><div className="flex items-center gap-4"><span className="phrase-index">0{index + 1}</span><div className="min-w-0 flex-1"><span className="mb-2 inline-flex rounded-full bg-ink/6 px-2.5 py-1 text-[10px] font-extrabold text-ink/50">{phrase.tag}</span><p className="font-display text-2xl font-bold text-ink sm:text-3xl">{phrase.arabic}</p><p className="mt-2 text-sm text-ink/55" dir="ltr">{phrase.meaning}</p></div><button className="audio-button large" onClick={() => speakArabic(phrase.arabic, 0.82, voiceGender)} aria-label={`Listen to ${phrase.arabic}`}><Headphones size={19} /></button></div><div className="mt-5 h-1 overflow-hidden rounded-full bg-ink/8"><div className="h-full w-0 rounded-full bg-coral transition-all duration-500 group-hover:w-1/3" /></div></article>)}</div></div></section>

        <section id="quiz" className="container scroll-mt-24 py-20 sm:py-28"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow mb-3">03 / Test yourself</p><h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">{language === "ar" ? "سؤال واحد في كل مرة." : "One question at a time."}</h2></div><div className="flex items-center gap-3 text-sm font-bold text-ink/50"><CircleHelp size={18} className="text-coral" /> Practice score: <span className="text-ink">{score} / {activeQuizQuestions.length}</span></div></div><div className="quiz-shell"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="quiz-badge">{language === "ar" ? "اختبار سريع" : "Quick quiz"}</span><span className="text-xs font-bold text-paper/50">{language === "ar" ? "السؤال" : "Question"} {completed ? activeQuizQuestions.length : quizIndex + 1} {language === "ar" ? "من" : "of"} {activeQuizQuestions.length}</span></div><button className="quiz-reset" onClick={resetQuiz}><RotateCcw size={14} /> Restart quiz</button></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: `${completed ? 100 : Math.max(12, progress)}%` }} /></div>{!completed ? <div className="mt-10 grid gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-center"><div><p className="text-xs font-bold text-saffron">{language === "ar" ? "اختر الإجابة الصحيحة" : "Choose the correct answer"}</p><h3 className="mt-4 font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">{question.prompt}</h3><p className="mt-4 flex items-center gap-2 text-sm leading-7 text-paper/55"><Lightbulb size={15} className="shrink-0 text-saffron" /> {question.hint}</p></div><div className="grid gap-3 sm:grid-cols-2">{question.options.map((option, index) => { const isSelected = selectedAnswer === option; const isCorrect = Boolean(selectedAnswer) && option === question.answer; const isWrong = isSelected && option !== question.answer; return <button key={option} onClick={() => chooseAnswer(option)} className={`answer-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="flex-1 text-right">{option}</span>{isCorrect && <Check size={18} />}{isWrong && <X size={18} />}</button>; })}<div className="sm:col-span-2 mt-1 flex min-h-12 items-center justify-between gap-3">{selectedAnswer && <span className={`text-sm font-bold ${selectedAnswer === question.answer ? "text-sage" : "text-coral"}`}>{selectedAnswer === question.answer ? "Great job! Correct answer." : `Correct answer: ${question.answer}`}</span>}<button className={`button-primary mr-auto ${!selectedAnswer ? "pointer-events-none opacity-30" : ""}`} onClick={nextQuestion}>{quizIndex === activeQuizQuestions.length - 1 ? "See your result" : "Next question"}<ArrowLeft size={16} /></button></div></div></div> : <div className="py-12 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-saffron/18 text-saffron"><Trophy size={30} /></span><h3 className="mt-5 font-display text-4xl font-bold text-paper">Well done, you finished the quiz!</h3><p className="mt-3 text-paper/60">You answered <strong className="text-paper">{score} of {activeQuizQuestions.length}</strong> questions correctly.</p><button className="button-on-dark mt-7" onClick={resetQuiz}><RotateCcw size={16} /> Try again</button></div>}</div></section>

        <section className="container pb-20 sm:pb-28"><div className="closing-card"><div><p className="eyebrow mb-3 text-saffron">Your next step</p><h2 className="font-display max-w-xl text-3xl font-bold leading-tight text-paper sm:text-4xl">{language === "ar" ? <>خمس دقائق اليوم،<br />وتقترب أكثر من العربية.</> : <>Take five minutes today,<br />and get closer to Arabic.</>}</h2></div><button className="button-primary shrink-0" onClick={() => scrollTo("library", "Library")}>Learn one word <ArrowLeft size={17} /></button></div></section>
      </main><footer className="border-t border-ink/10"><div className="container flex flex-col items-center justify-between gap-4 py-8 text-center text-xs font-bold text-ink/45 sm:flex-row sm:text-right"><p>Learn Arabic — a simple space for a beautiful beginning.</p><div className="flex flex-col items-center gap-2 sm:items-end"><p dir="rtl">تم التطوير من قبل م/مختار البرتاني</p><a className="portfolio-link" href="https://mokhtarfolio-kpzbzpzq.manus.space/" target="_blank" rel="noreferrer">View portfolio <ArrowLeft size={13} /></a></div></div></footer>
    </div>
  );
}

export default Home;
