// AICODE-NOTE: These schemas are the source of truth for the entire app.
// AI generation, PDF rendering, and UI forms all derive from these types.

import { z } from "zod";

export const CEFRLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
export type CEFRLevel = z.infer<typeof CEFRLevel>;

export const BookType = z.enum([
  "grammar_workbook",
  "vocabulary_builder",
  "reading_comprehension",
  "mixed_skills",
]);
export type BookType = z.infer<typeof BookType>;

export const ExerciseType = z.enum([
  "fill_in_blank",
  "multiple_choice",
  "matching",
  "word_search",
  "sentence_reorder",
  "error_correction",
  "reading_passage",
  "true_false",
  "short_answer",
]);
export type ExerciseType = z.infer<typeof ExerciseType>;

export const TrimSize = z.enum(["6x9", "8.5x11"]);
export type TrimSize = z.infer<typeof TrimSize>;

export const BookConfig = z.object({
  title: z.string().min(3).max(100),
  bookType: BookType,
  level: CEFRLevel,
  topic: z.string().min(3).max(200),
  pageCount: z.number().int().min(20).max(200),
  trimSize: TrimSize.default("8.5x11"),
  exerciseTypes: z.array(ExerciseType).min(2).max(10),
  includeAnswerKey: z.boolean().default(true),
  authorName: z.string().min(1).max(100),
});
export type BookConfig = z.infer<typeof BookConfig>;

export const FillInBlankContent = z.object({
  sentences: z.array(
    z.object({
      text: z.string(),
      blank: z.string(),
      hint: z.string().optional(),
    }),
  ),
});

export const MultipleChoiceContent = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().int().min(0).max(3),
    }),
  ),
});

export const MatchingContent = z.object({
  pairs: z.array(
    z.object({
      left: z.string(),
      right: z.string(),
    }),
  ),
});

export const TrueFalseContent = z.object({
  statements: z.array(
    z.object({
      statement: z.string(),
      isTrue: z.boolean(),
    }),
  ),
});

export const SentenceReorderContent = z.object({
  sentences: z.array(
    z.object({
      scrambled: z.array(z.string()),
      correct: z.string(),
    }),
  ),
});

export const ErrorCorrectionContent = z.object({
  sentences: z.array(
    z.object({
      incorrect: z.string(),
      correct: z.string(),
      errorType: z.string(),
    }),
  ),
});

export const ReadingPassageContent = z.object({
  passage: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

export const ShortAnswerContent = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      sampleAnswer: z.string(),
    }),
  ),
});

export const WordSearchContent = z.object({
  words: z.array(z.string()),
  gridSize: z.number().int().min(8).max(20).default(12),
});

export const Exercise = z.object({
  type: ExerciseType,
  title: z.string(),
  instructions: z.string(),
  content: z.union([
    FillInBlankContent,
    MultipleChoiceContent,
    MatchingContent,
    TrueFalseContent,
    SentenceReorderContent,
    ErrorCorrectionContent,
    ReadingPassageContent,
    ShortAnswerContent,
    WordSearchContent,
  ]),
});
export type Exercise = z.infer<typeof Exercise>;

export const BookSection = z.object({
  title: z.string(),
  description: z.string().optional(),
  exercises: z.array(Exercise),
});
export type BookSection = z.infer<typeof BookSection>;

export const GeneratedBook = z.object({
  config: BookConfig,
  sections: z.array(BookSection),
});
export type GeneratedBook = z.infer<typeof GeneratedBook>;

// Labels for UI display
export const BOOK_TYPE_LABELS: Record<BookType, string> = {
  grammar_workbook: "Grammar Workbook",
  vocabulary_builder: "Vocabulary Builder",
  reading_comprehension: "Reading Comprehension",
  mixed_skills: "Mixed Skills",
};

export const CEFR_LABELS: Record<CEFRLevel, string> = {
  A1: "A1 - Beginner",
  A2: "A2 - Elementary",
  B1: "B1 - Intermediate",
  B2: "B2 - Upper Intermediate",
  C1: "C1 - Advanced",
  C2: "C2 - Proficiency",
};

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  fill_in_blank: "Fill in the Blank",
  multiple_choice: "Multiple Choice",
  matching: "Matching",
  word_search: "Word Search",
  sentence_reorder: "Sentence Reorder",
  error_correction: "Error Correction",
  reading_passage: "Reading Passage",
  true_false: "True / False",
  short_answer: "Short Answer",
};
