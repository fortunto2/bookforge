// AICODE-NOTE: Uses OpenAI structured output with Zod schemas.
// Each section is generated separately to stay within token limits.

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { BookConfig, BookSection, ExerciseType } from "@/lib/schemas/book";

const openai = new OpenAI();

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

const GeneratedSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  exercises: z.array(
    z.object({
      type: z.string(),
      title: z.string(),
      instructions: z.string(),
      content: z.any(),
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
- For fill_in_blank: provide sentences with one word removed, store the answer in "blank"
- For multiple_choice: always provide exactly 4 options with correctIndex (0-3)
- For matching: provide 5-8 pairs to match
- For true_false: provide clear statements that are unambiguously true or false
- For sentence_reorder: provide 4-6 word scrambled sentences
- For error_correction: provide sentences with one grammatical error
- For reading_passage: write a 100-200 word passage with 3-5 comprehension questions
- For short_answer: provide open-ended questions requiring 1-2 sentence answers
- For word_search: provide 8-12 vocabulary words related to the topic`;
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
Return a JSON object with title, description, and exercises array.
Each exercise must have: type (use underscore format like "fill_in_blank"), title, instructions, and content matching the exercise type structure.`;
}

export async function generateBookContent(
  config: BookConfig,
): Promise<BookSection[]> {
  const sectionsCount = Math.max(3, Math.floor(config.pageCount / 10));
  const sections: BookSection[] = [];

  for (let i = 1; i <= sectionsCount; i++) {
    const completion = await openai.chat.completions.parse({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(config) },
        {
          role: "user",
          content: buildSectionPrompt(i, sectionsCount, config.exerciseTypes),
        },
      ],
      response_format: zodResponseFormat(GeneratedSectionSchema, "book_section"),
      temperature: 0.7,
    });

    const parsed = completion.choices[0].message.parsed;
    if (parsed) {
      sections.push(parsed as BookSection);
    }
  }

  return sections;
}
