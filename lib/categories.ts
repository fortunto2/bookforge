// AI-NOTE: Category catalog. Each category defines defaults, exercise types,
// suggested topics, and a custom system prompt that tells the AI how to generate
// content for that specific subject. The exercise structure stays the same —
// only the content theme changes per category.

import type { ExerciseType } from "./schemas/book";

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  defaultBookType: string;
  defaultLevel: string;
  defaultExerciseTypes: ExerciseType[];
  suggestedTopics: string[];
  systemPrompt: string;
  difficultyLabels: Record<string, string>;
}

const GENERIC_DIFFICULTY: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Intermediate",
  C1: "Advanced",
  C2: "Expert",
};

const CEFR_DIFFICULTY: Record<string, string> = {
  A1: "A1 — Beginner",
  A2: "A2 — Elementary",
  B1: "B1 — Intermediate",
  B2: "B2 — Upper Intermediate",
  C1: "C1 — Advanced",
  C2: "C2 — Proficiency",
};

export const categories: Category[] = [
  {
    slug: "english-grammar",
    name: "English Grammar",
    description:
      "Grammar workbooks for ESL/EFL learners. Fill-in-the-blank, error correction, sentence reordering.",
    icon: "📝",
    seoTitle: "Free English Grammar Worksheet Generator — Printable PDF Exercises",
    seoDescription: "Generate printable English grammar worksheets PDF. ESL/EFL exercises: fill-in-the-blank, error correction, sentence reorder. CEFR A1-C2. Download free.",
    h1: "English Grammar Worksheet Generator",
    defaultBookType: "grammar_workbook",
    defaultLevel: "A2",
    defaultExerciseTypes: ["fill_in_blank", "multiple_choice", "error_correction", "sentence_reorder"],
    suggestedTopics: [
      "Present Simple & Continuous",
      "Past Tenses",
      "Future Forms",
      "Modal Verbs",
      "Conditionals",
      "Passive Voice",
      "Articles & Determiners",
      "Prepositions",
      "Reported Speech",
      "Relative Clauses",
    ],
    systemPrompt: `You are an expert English language teacher and textbook author.
You create high-quality grammar exercises for English learners.
- Match difficulty precisely to the CEFR level
- Use natural, contemporary English
- For fill_in_blank: sentences with grammar gaps (e.g. verb forms, prepositions)
- For error_correction: sentences with one grammatical error each
- For sentence_reorder: scrambled words forming grammatically correct sentences
- For multiple_choice: grammar questions with exactly 4 options`,
    difficultyLabels: CEFR_DIFFICULTY,
  },
  {
    slug: "english-vocabulary",
    name: "English Vocabulary",
    description:
      "Vocabulary builders with word searches, matching, and contextual exercises.",
    icon: "📖",
    seoTitle: "Free English Vocabulary Worksheet Generator — Word Search, Matching PDF",
    seoDescription: "Create printable English vocabulary worksheets. Word searches, matching exercises, fill-in-the-blank. ESL vocabulary practice PDF for all CEFR levels.",
    h1: "English Vocabulary Worksheet Generator",
    defaultBookType: "vocabulary_builder",
    defaultLevel: "A2",
    defaultExerciseTypes: ["fill_in_blank", "matching", "word_search", "multiple_choice"],
    suggestedTopics: [
      "Travel & Transportation",
      "Food & Cooking",
      "Business & Office",
      "Health & Body",
      "Technology & Internet",
      "Nature & Environment",
      "Shopping & Clothes",
      "Emotions & Feelings",
      "Home & Furniture",
      "Sports & Hobbies",
    ],
    systemPrompt: `You are an expert English vocabulary teacher.
You create engaging vocabulary-building exercises for English learners.
- Focus on thematic vocabulary groups
- Include context clues and definitions
- For fill_in_blank: sentences where context reveals the missing vocabulary word
- For matching: match words to their definitions or synonyms
- For word_search: vocabulary words from the theme
- For multiple_choice: choose the word that best completes the sentence`,
    difficultyLabels: CEFR_DIFFICULTY,
  },
  {
    slug: "math-practice",
    name: "Math Practice",
    description:
      "Math drills: arithmetic, word problems, fractions, algebra. All grade levels.",
    icon: "🔢",
    seoTitle: "Free Math Worksheet Generator — Printable Practice Problems PDF",
    seoDescription: "Generate free printable math worksheets PDF. Addition, subtraction, multiplication, fractions, algebra, word problems. Grades 1-9. Download instantly.",
    h1: "Math Worksheet Generator — Free Printable PDF",
    defaultBookType: "mixed_skills",
    defaultLevel: "A2",
    defaultExerciseTypes: ["fill_in_blank", "multiple_choice", "short_answer", "true_false"],
    suggestedTopics: [
      "Addition & Subtraction",
      "Multiplication & Division",
      "Fractions & Decimals",
      "Geometry Basics",
      "Word Problems",
      "Percentages",
      "Basic Algebra",
      "Measurement & Units",
      "Time & Money",
      "Patterns & Sequences",
    ],
    systemPrompt: `You are an expert math teacher creating practice workbooks.
Generate math exercises appropriate for the difficulty level.
- A1/A2 = Grades 1-3 (basic arithmetic, counting, simple word problems)
- B1/B2 = Grades 4-6 (fractions, decimals, multi-step problems, basic geometry)
- C1/C2 = Grades 7-9 (algebra, ratios, percentages, advanced geometry)
- For fill_in_blank: math equations with a missing number (e.g. "15 + ___ = 23")
- For multiple_choice: math problems with 4 answer options
- For short_answer: word problems requiring calculation
- For true_false: mathematical statements to evaluate (e.g. "7 × 8 = 54")`,
    difficultyLabels: {
      A1: "Grades 1-2",
      A2: "Grades 2-3",
      B1: "Grades 4-5",
      B2: "Grades 5-6",
      C1: "Grades 7-8",
      C2: "Grades 8-9",
    },
  },
  {
    slug: "science-nature",
    name: "Science & Nature",
    description:
      "Science quizzes: biology, physics, chemistry, earth science. Fun facts and experiments.",
    icon: "🔬",
    seoTitle: "Free Science Worksheet Generator — Biology, Physics, Chemistry PDF",
    seoDescription: "Generate printable science worksheets PDF. Biology, physics, chemistry, earth science quizzes. Multiple choice, true/false, reading passages. All grade levels.",
    h1: "Science Worksheet Generator — Quiz & Practice PDF",
    defaultBookType: "mixed_skills",
    defaultLevel: "B1",
    defaultExerciseTypes: ["multiple_choice", "true_false", "matching", "fill_in_blank", "reading_passage"],
    suggestedTopics: [
      "Human Body",
      "Animals & Habitats",
      "Plants & Photosynthesis",
      "Solar System & Space",
      "Weather & Climate",
      "Chemistry Basics",
      "Forces & Motion",
      "Electricity & Magnets",
      "Ecosystems",
      "Water Cycle & Earth Science",
    ],
    systemPrompt: `You are a science educator creating engaging workbooks.
Generate science exercises appropriate for the difficulty level.
- A1/A2 = Elementary science (basic facts, simple concepts, nature observation)
- B1/B2 = Middle school science (systems, processes, cause-effect)
- C1/C2 = High school science (detailed mechanisms, scientific method, analysis)
- For multiple_choice: science questions with 4 options
- For true_false: scientific statements to evaluate
- For matching: match terms to definitions, organisms to habitats, etc.
- For fill_in_blank: sentences about scientific concepts with missing key terms
- For reading_passage: short informational text with comprehension questions`,
    difficultyLabels: GENERIC_DIFFICULTY,
  },
  {
    slug: "spanish-beginners",
    name: "Spanish for Beginners",
    description:
      "Learn Spanish: vocabulary, grammar, common phrases. Beginner to intermediate.",
    icon: "🇪🇸",
    seoTitle: "Free Spanish Worksheets for Beginners — Vocabulary & Grammar PDF",
    seoDescription: "Generate free Spanish worksheets for beginners PDF. Vocabulary, grammar, matching, fill-in-the-blank. Learn Spanish with printable practice exercises.",
    h1: "Spanish Worksheets for Beginners — Free PDF Generator",
    defaultBookType: "vocabulary_builder",
    defaultLevel: "A1",
    defaultExerciseTypes: ["fill_in_blank", "matching", "multiple_choice", "sentence_reorder"],
    suggestedTopics: [
      "Greetings & Introductions",
      "Family & Friends",
      "Food & Restaurant",
      "Travel & Directions",
      "Shopping & Numbers",
      "Daily Routine",
      "Weather & Seasons",
      "Colors & Descriptions",
      "At the Doctor",
      "Hobbies & Free Time",
    ],
    systemPrompt: `You are a Spanish language teacher creating workbooks for learners.
Generate Spanish learning exercises at the specified difficulty level.
- All exercises teach SPANISH vocabulary and grammar
- Include Spanish words/phrases with English translations in hints
- For fill_in_blank: sentences mixing English and Spanish, student fills in Spanish word
- For matching: match Spanish words/phrases to English translations
- For multiple_choice: choose the correct Spanish translation or grammar form
- For sentence_reorder: arrange Spanish words into correct sentence order`,
    difficultyLabels: CEFR_DIFFICULTY,
  },
  {
    slug: "french-beginners",
    name: "French for Beginners",
    description:
      "Learn French: vocabulary, grammar, pronunciation tips. Beginner to intermediate.",
    icon: "🇫🇷",
    seoTitle: "Free French Worksheets for Beginners — Vocabulary & Grammar PDF",
    seoDescription: "Generate free French worksheets for beginners PDF. Vocabulary, grammar, matching, fill-in-the-blank. Learn French with printable practice exercises.",
    h1: "French Worksheets for Beginners — Free PDF Generator",
    defaultBookType: "vocabulary_builder",
    defaultLevel: "A1",
    defaultExerciseTypes: ["fill_in_blank", "matching", "multiple_choice", "sentence_reorder"],
    suggestedTopics: [
      "Greetings & Politeness",
      "Family & Relationships",
      "Food & Café Culture",
      "Travel & Transportation",
      "Shopping & Fashion",
      "Daily Life",
      "French Culture & Holidays",
      "City & Directions",
      "Health & Body",
      "Work & Professions",
    ],
    systemPrompt: `You are a French language teacher creating workbooks for learners.
Generate French learning exercises at the specified difficulty level.
- All exercises teach FRENCH vocabulary and grammar
- Include French words/phrases with English translations in hints
- For fill_in_blank: sentences where students fill in French words
- For matching: match French words/phrases to English translations
- For multiple_choice: choose the correct French translation or grammar form
- For sentence_reorder: arrange French words into correct sentence order`,
    difficultyLabels: CEFR_DIFFICULTY,
  },
  {
    slug: "world-history",
    name: "World History",
    description:
      "History quizzes: ancient civilizations, world wars, geography, famous figures.",
    icon: "🏛️",
    seoTitle: "Free World History Worksheets — Quiz & Study Guide PDF",
    seoDescription: "Generate printable world history worksheets PDF. Ancient civilizations, world wars, geography quizzes. Multiple choice, matching, reading passages. All levels.",
    h1: "World History Worksheet Generator — Free Printable PDF",
    defaultBookType: "reading_comprehension",
    defaultLevel: "B1",
    defaultExerciseTypes: ["multiple_choice", "true_false", "matching", "reading_passage", "short_answer"],
    suggestedTopics: [
      "Ancient Egypt & Mesopotamia",
      "Ancient Greece & Rome",
      "Medieval Europe",
      "Renaissance & Exploration",
      "American Revolution",
      "World War I & II",
      "Cold War Era",
      "Ancient China & Japan",
      "Industrial Revolution",
      "Modern World Events",
    ],
    systemPrompt: `You are a history teacher creating educational workbooks.
Generate history exercises appropriate for the difficulty level.
- A1/A2 = Basic historical facts, famous figures, simple timelines
- B1/B2 = Events, causes and effects, comparing civilizations
- C1/C2 = Analysis, primary sources, historical arguments
- For multiple_choice: history questions with 4 options
- For true_false: historical statements to evaluate
- For matching: match dates to events, people to achievements, etc.
- For reading_passage: short historical text with comprehension questions
- For short_answer: questions requiring brief historical explanations`,
    difficultyLabels: GENERIC_DIFFICULTY,
  },
  {
    slug: "kids-activities",
    name: "Kids Activity Book",
    description:
      "Fun learning for ages 4-10: puzzles, word games, matching, basic skills.",
    icon: "🧒",
    seoTitle: "Free Kids Activity Worksheets — Printable Puzzles & Games PDF",
    seoDescription: "Generate free kids activity worksheets PDF. Fun puzzles, word games, matching for ages 4-10. Printable educational activities. Download instantly.",
    h1: "Kids Activity Worksheet Generator — Free Printable PDF",
    defaultBookType: "mixed_skills",
    defaultLevel: "A1",
    defaultExerciseTypes: ["matching", "word_search", "fill_in_blank", "true_false", "multiple_choice"],
    suggestedTopics: [
      "Animals & Pets",
      "Dinosaurs",
      "Fairy Tales & Stories",
      "Superheroes",
      "Ocean & Sea Life",
      "Space & Planets",
      "Farm & Countryside",
      "Seasons & Holidays",
      "My Body & Health",
      "Vehicles & Transport",
    ],
    systemPrompt: `You are a children's educational content creator making fun activity books.
Generate engaging, age-appropriate exercises for kids.
- A1 = Ages 4-5 (very simple, short words, basic concepts)
- A2 = Ages 6-7 (simple sentences, basic vocabulary)
- B1 = Ages 8-10 (longer content, more challenging)
- Use fun, exciting language that kids enjoy
- Keep instructions simple and clear
- For matching: match pictures/words to descriptions (use emoji in content)
- For word_search: simple vocabulary words (max 8-10 letters)
- For fill_in_blank: easy sentences with obvious context clues
- For true_false: fun facts kids can evaluate
- For multiple_choice: kid-friendly questions with clear options`,
    difficultyLabels: {
      A1: "Ages 4-5",
      A2: "Ages 6-7",
      B1: "Ages 8-9",
      B2: "Ages 10-11",
      C1: "Ages 11-12",
      C2: "Ages 12+",
    },
  },
  {
    slug: "test-prep",
    name: "Test Prep (SAT/GED)",
    description:
      "Standardized test practice: reading, writing, math, reasoning skills.",
    icon: "🎓",
    seoTitle: "Free SAT & GED Practice Worksheets — Test Prep PDF Generator",
    seoDescription: "Generate free SAT, ACT, GED practice worksheets PDF. Reading comprehension, math, grammar, vocabulary. Printable test prep exercises. Download free.",
    h1: "SAT & GED Practice Worksheet Generator — Free PDF",
    defaultBookType: "mixed_skills",
    defaultLevel: "B2",
    defaultExerciseTypes: ["multiple_choice", "reading_passage", "fill_in_blank", "short_answer", "error_correction"],
    suggestedTopics: [
      "Reading Comprehension",
      "Grammar & Writing",
      "Vocabulary in Context",
      "Math — No Calculator",
      "Math — Calculator",
      "Critical Reasoning",
      "Data Analysis",
      "Essay Writing Prompts",
      "Science Reasoning",
      "Social Studies",
    ],
    systemPrompt: `You are a test preparation expert creating practice material for standardized tests (SAT, ACT, GED).
Generate rigorous, test-like exercises at the appropriate difficulty.
- B1/B2 = GED level (fundamental skills, practical applications)
- C1/C2 = SAT/ACT level (advanced reasoning, analytical thinking)
- Use formal, academic language
- For multiple_choice: test-style questions with 4 options, one clearly correct answer
- For reading_passage: academic-style passages (200+ words) with analytical questions
- For fill_in_blank: grammar/vocabulary questions in academic contexts
- For short_answer: questions requiring brief analytical responses
- For error_correction: sentences with grammar/usage errors to identify and fix`,
    difficultyLabels: {
      A1: "Pre-GED",
      A2: "GED Basic",
      B1: "GED Standard",
      B2: "SAT Foundation",
      C1: "SAT Standard",
      C2: "SAT Advanced",
    },
  },
  {
    slug: "business-english",
    name: "Business English",
    description:
      "Professional vocabulary, email writing, meetings, presentations, negotiations.",
    icon: "💼",
    seoTitle: "Free Business English Worksheets — Professional Vocabulary PDF",
    seoDescription: "Generate free business English worksheets PDF. Professional vocabulary, email writing, meetings, presentations. Printable exercises for all CEFR levels.",
    h1: "Business English Worksheet Generator — Free PDF",
    defaultBookType: "vocabulary_builder",
    defaultLevel: "B1",
    defaultExerciseTypes: ["fill_in_blank", "multiple_choice", "matching", "reading_passage", "short_answer"],
    suggestedTopics: [
      "Email & Correspondence",
      "Meetings & Discussions",
      "Presentations & Public Speaking",
      "Negotiations & Deals",
      "Job Interviews",
      "Marketing & Sales",
      "Finance & Banking",
      "Startup & Entrepreneurship",
      "Human Resources",
      "International Trade",
    ],
    systemPrompt: `You are a business English instructor creating professional development workbooks.
Generate business English exercises appropriate for the level.
- A1/A2 = Basic workplace vocabulary, simple emails, introductions
- B1/B2 = Professional communication, meetings, reports, negotiation
- C1/C2 = Advanced business writing, strategy, leadership, presentations
- For fill_in_blank: business sentences with missing professional vocabulary
- For multiple_choice: choose the most appropriate professional expression
- For matching: match business terms to definitions or situations
- For reading_passage: business scenarios (emails, reports) with comprehension questions
- For short_answer: professional communication tasks`,
    difficultyLabels: CEFR_DIFFICULTY,
  },
  {
    slug: "general-knowledge",
    name: "General Knowledge",
    description:
      "Trivia workbooks: geography, culture, famous people, fun facts for all ages.",
    icon: "🌍",
    seoTitle: "Free General Knowledge Quiz Worksheets — Trivia PDF Generator",
    seoDescription: "Generate free general knowledge quiz worksheets PDF. Trivia, geography, science, history, culture. Printable quiz workbooks for all ages. Download free.",
    h1: "General Knowledge Quiz Generator — Free Printable PDF",
    defaultBookType: "mixed_skills",
    defaultLevel: "B1",
    defaultExerciseTypes: ["multiple_choice", "true_false", "matching", "fill_in_blank", "short_answer"],
    suggestedTopics: [
      "World Geography",
      "Famous Scientists",
      "Music & Arts",
      "Sports Champions",
      "Inventions & Technology",
      "World Capitals & Flags",
      "Food Around the World",
      "Famous Books & Authors",
      "Movies & Pop Culture",
      "Record Breakers & Fun Facts",
    ],
    systemPrompt: `You are a trivia and general knowledge expert creating fun quiz workbooks.
Generate engaging general knowledge exercises.
- A1/A2 = Basic trivia, well-known facts, simple questions
- B1/B2 = Intermediate trivia, requires broader knowledge
- C1/C2 = Advanced trivia, obscure facts, analytical questions
- Make content fun, interesting, and educational
- For multiple_choice: trivia questions with 4 options
- For true_false: interesting fact statements to evaluate
- For matching: match facts, people, places, or events
- For fill_in_blank: famous quotes, facts with missing key words
- For short_answer: questions requiring brief factual responses`,
    difficultyLabels: GENERIC_DIFFICULTY,
  },
  {
    slug: "word-puzzles",
    name: "Word Puzzles & Games",
    description:
      "Word searches, scrambles, matching games. Perfect for all ages and classrooms.",
    icon: "🧩",
    seoTitle: "Free Word Puzzle Worksheets — Word Search & Games PDF Generator",
    seoDescription: "Generate free word puzzle worksheets PDF. Word searches, scrambles, matching games. Printable puzzles for kids, classrooms, and adults. Download instantly.",
    h1: "Word Puzzle & Game Worksheet Generator — Free PDF",
    defaultBookType: "mixed_skills",
    defaultLevel: "A2",
    defaultExerciseTypes: ["word_search", "matching", "sentence_reorder", "fill_in_blank"],
    suggestedTopics: [
      "Animals",
      "Food & Drinks",
      "Countries & Cities",
      "Sports & Games",
      "Colors & Shapes",
      "Jobs & Professions",
      "Weather & Nature",
      "Music & Instruments",
      "Clothing & Fashion",
      "Holidays & Celebrations",
    ],
    systemPrompt: `You are a puzzle designer creating fun word game workbooks.
Generate engaging word puzzles and games.
- A1/A2 = Simple words (3-6 letters), basic vocabulary
- B1/B2 = Medium words (5-10 letters), broader vocabulary
- C1/C2 = Complex words, idioms, advanced vocabulary
- Make puzzles fun and satisfying to solve
- For word_search: 8-12 themed vocabulary words
- For matching: match words to clues, synonyms, or categories
- For sentence_reorder: unscramble words to form sentences/phrases
- For fill_in_blank: word games with contextual clues`,
    difficultyLabels: GENERIC_DIFFICULTY,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
