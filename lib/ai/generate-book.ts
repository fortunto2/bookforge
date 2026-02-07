// AICODE-NOTE: Uses OpenAI structured output with Zod schemas.
// Each section is generated separately to stay within token limits.
// Content field is JSON string because OpenAI structured output doesn't support z.any().

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { BookConfig, BookSection, ExerciseType } from "@/lib/schemas/book";

// AICODE-NOTE: Lazy init — OpenAI client throws at import time if OPENAI_API_KEY is missing.
function getClient() {
  return new OpenAI();
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

// AICODE-NOTE: content is a JSON string because OpenAI structured output
// requires concrete types — z.any() is not allowed. We parse it after receiving.
const GeneratedSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  exercises: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      instructions: z.string(),
      content_json: z
        .string()
        .describe(
          "Exercise content as a JSON string. Structure depends on exercise type.",
        ),
    }),
  ),
});

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

IMPORTANT: The "content_json" field must be a valid JSON string (not an object).

Exercise content_json structures by type:

fill_in_blank:
  {"sentences": [{"text": "I ___ to the store yesterday.", "blank": "went", "hint": "past tense of go"}]}

multiple_choice:
  {"questions": [{"question": "What is the past tense of 'go'?", "options": ["goed", "went", "gone", "going"], "correctIndex": 1}]}

matching:
  {"pairs": [{"left": "happy", "right": "glad"}, {"left": "sad", "right": "unhappy"}]}

true_false:
  {"statements": [{"statement": "The sun rises in the east.", "isTrue": true}]}

sentence_reorder:
  {"sentences": [{"scrambled": ["yesterday", "I", "store", "went", "the", "to"], "correct": "I went to the store yesterday."}]}

error_correction:
  {"sentences": [{"incorrect": "He go to school every day.", "correct": "He goes to school every day.", "errorType": "subject-verb agreement"}]}

reading_passage:
  {"passage": "Text here...", "questions": [{"question": "What is the main idea?", "answer": "The main idea is..."}]}

short_answer:
  {"questions": [{"question": "Describe your favorite holiday.", "sampleAnswer": "My favorite holiday is..."}]}

word_search:
  {"words": ["travel", "journey", "adventure", "explore"]}`;
}

function buildSectionPrompt(
  sectionNumber: number,
  totalSections: number,
  exerciseTypes: ExerciseType[],
): string {
  const types = exerciseTypes.map((t) => t.replace("_", " ")).join(", ");
  return `Generate section ${sectionNumber} of ${totalSections}.
Include 3-5 exercises using these types: ${types}.
Make this section progressively harder than the previous one.
Remember: content_json must be a valid JSON STRING, not an object. Use JSON.stringify format.
Type field must use underscore format: fill_in_blank, multiple_choice, matching, true_false, sentence_reorder, error_correction, reading_passage, short_answer, word_search.`;
}

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
      // Parse content_json strings back into objects
      const section: BookSection = {
        title: parsed.title,
        description: parsed.description,
        exercises: parsed.exercises.map((ex) => ({
          type: ex.type as ExerciseType,
          title: ex.title,
          instructions: ex.instructions,
          content: JSON.parse(ex.content_json),
        })),
      };
      sections.push(section);
    }
  }

  return sections;
}
