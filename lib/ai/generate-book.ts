// AICODE-NOTE: Uses OpenAI structured output with Zod schemas.
// Each section is generated separately to stay within token limits.
// Exercise content uses z.discriminatedUnion on "type" field — maps to anyOf in JSON Schema.

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { BookConfig, BookSection, ExerciseType } from "@/lib/schemas/book";

function getClient() {
  return new OpenAI();
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

// --- Typed exercise schemas for structured output (anyOf via discriminatedUnion) ---

const FillInBlankExercise = z.object({
  type: z.literal("fill_in_blank"),
  title: z.string(),
  instructions: z.string(),
  sentences: z.array(
    z.object({
      text: z.string(),
      blank: z.string(),
      hint: z.string(),
    }),
  ),
});

const MultipleChoiceExercise = z.object({
  type: z.literal("multiple_choice"),
  title: z.string(),
  instructions: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(),
    }),
  ),
});

const MatchingExercise = z.object({
  type: z.literal("matching"),
  title: z.string(),
  instructions: z.string(),
  pairs: z.array(
    z.object({
      left: z.string(),
      right: z.string(),
    }),
  ),
});

const TrueFalseExercise = z.object({
  type: z.literal("true_false"),
  title: z.string(),
  instructions: z.string(),
  statements: z.array(
    z.object({
      statement: z.string(),
      isTrue: z.boolean(),
    }),
  ),
});

const SentenceReorderExercise = z.object({
  type: z.literal("sentence_reorder"),
  title: z.string(),
  instructions: z.string(),
  sentences: z.array(
    z.object({
      scrambled: z.array(z.string()),
      correct: z.string(),
    }),
  ),
});

const ErrorCorrectionExercise = z.object({
  type: z.literal("error_correction"),
  title: z.string(),
  instructions: z.string(),
  sentences: z.array(
    z.object({
      incorrect: z.string(),
      correct: z.string(),
      errorType: z.string(),
    }),
  ),
});

const ReadingPassageExercise = z.object({
  type: z.literal("reading_passage"),
  title: z.string(),
  instructions: z.string(),
  passage: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

const ShortAnswerExercise = z.object({
  type: z.literal("short_answer"),
  title: z.string(),
  instructions: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      sampleAnswer: z.string(),
    }),
  ),
});

const WordSearchExercise = z.object({
  type: z.literal("word_search"),
  title: z.string(),
  instructions: z.string(),
  words: z.array(z.string()),
});

const ExerciseSchema = z.discriminatedUnion("type", [
  FillInBlankExercise,
  MultipleChoiceExercise,
  MatchingExercise,
  TrueFalseExercise,
  SentenceReorderExercise,
  ErrorCorrectionExercise,
  ReadingPassageExercise,
  ShortAnswerExercise,
  WordSearchExercise,
]);

const GeneratedSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  exercises: z.array(ExerciseSchema),
});

// --- Prompts ---

function buildSystemPrompt(config: BookConfig): string {
  return `You are an expert English language teacher and textbook author.
You create high-quality educational exercises for English learners.

Book details:
- Type: ${config.bookType.replace("_", " ")}
- CEFR Level: ${config.level}
- Topic/Theme: ${config.topic}
- Target page count: ${config.pageCount} pages

Guidelines:
- Match difficulty precisely to CEFR level ${config.level}
- Keep all content thematically connected to "${config.topic}"
- Use natural, contemporary English
- Include clear instructions for each exercise
- Provide correct answers for all exercises
- Vary exercise difficulty within the level range
- For fill_in_blank: 5-8 sentences, use ___ in text where the blank word goes
- For multiple_choice: 4-6 questions, always exactly 4 options, correctIndex 0-3
- For matching: 5-8 pairs
- For true_false: 5-8 statements
- For sentence_reorder: 4-6 sentences with scrambled words
- For error_correction: 4-6 sentences with one grammatical error each
- For reading_passage: 100-200 word passage with 3-5 questions
- For short_answer: 4-6 open-ended questions
- For word_search: 8-12 vocabulary words`;
}

function buildSectionPrompt(
  sectionNumber: number,
  totalSections: number,
  exerciseTypes: ExerciseType[],
): string {
  const types = exerciseTypes.join(", ");
  return `Generate section ${sectionNumber} of ${totalSections}.
Include 3-5 exercises using these types: ${types}.
Make this section progressively harder than the previous one.`;
}

// --- Transform AI response to BookSection ---

type GeneratedExercise = z.infer<typeof ExerciseSchema>;

function toBookSection(parsed: z.infer<typeof GeneratedSectionSchema>): BookSection {
  return {
    title: parsed.title,
    description: parsed.description,
    exercises: parsed.exercises.map((ex: GeneratedExercise) => {
      const { type, title, instructions, ...rest } = ex;
      return {
        type: type as ExerciseType,
        title,
        instructions,
        content: rest,
      };
    }),
  };
}

// --- Main generation ---

export async function generateBookContent(
  config: BookConfig,
): Promise<BookSection[]> {
  const sectionsCount = Math.max(3, Math.floor(config.pageCount / 10));
  const sections: BookSection[] = [];

  for (let i = 1; i <= sectionsCount; i++) {
    const completion = await getClient().beta.chat.completions.parse({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(config) },
        {
          role: "user",
          content: buildSectionPrompt(i, sectionsCount, config.exerciseTypes),
        },
      ],
      response_format: zodResponseFormat(
        GeneratedSectionSchema,
        "book_section",
      ),
      temperature: 0.7,
    });

    const parsed = completion.choices[0].message.parsed;
    if (parsed) {
      sections.push(toBookSection(parsed));
    }
  }

  return sections;
}
