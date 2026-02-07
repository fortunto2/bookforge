#!/usr/bin/env tsx
/**
 * CLI tool to test book generation and PDF export.
 *
 * Usage:
 *   pnpm generate                                    # generate + print to console
 *   pnpm generate --pdf output.pdf                   # generate + save PDF
 *   pnpm generate --level B1 --topic Food --pdf      # custom params + auto-named PDF
 *   pnpm generate --json                             # output raw JSON
 *   pnpm generate --dry-run                          # show config, skip AI
 */

import { generateBookContent } from "../lib/ai/generate-book";
import {
  BookConfig,
  type BookConfig as BookConfigType,
  type GeneratedBook,
  type BookSection,
  BOOK_TYPE_LABELS,
  CEFR_LABELS,
  EXERCISE_TYPE_LABELS,
  type ExerciseType,
} from "../lib/schemas/book";

// --- CLI arg parsing ---

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag);
    return i !== -1 && i + 1 < args.length ? args[i + 1] : undefined;
  };
  const has = (flag: string) => args.includes(flag);

  const config = BookConfig.parse({
    title: get("--title") ?? "Test Workbook: English Practice",
    bookType: get("--type") ?? "grammar_workbook",
    level: get("--level") ?? "A2",
    topic: get("--topic") ?? "Travel",
    pageCount: Number(get("--pages") ?? "30"),
    trimSize: get("--trim") ?? "8.5x11",
    exerciseTypes: get("--exercises")?.split(",") ?? [
      "fill_in_blank",
      "multiple_choice",
      "matching",
    ],
    includeAnswerKey: !has("--no-answers"),
    authorName: get("--author") ?? "Test Author",
  });

  // --pdf with optional path
  let pdfPath: string | null = null;
  if (has("--pdf")) {
    const next = get("--pdf");
    if (next && !next.startsWith("--")) {
      pdfPath = next;
    } else {
      // Auto-generate filename
      const slug = config.title.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
      pdfPath = `output/${slug}.pdf`;
    }
  }

  return {
    config,
    json: has("--json"),
    dryRun: has("--dry-run"),
    pdfPath,
  };
}

// --- Pretty print ---

function printConfig(config: BookConfigType) {
  console.log("\n📚 Book Configuration:");
  console.log(`   Title:     ${config.title}`);
  console.log(`   Type:      ${BOOK_TYPE_LABELS[config.bookType]}`);
  console.log(`   Level:     ${CEFR_LABELS[config.level]}`);
  console.log(`   Topic:     ${config.topic}`);
  console.log(`   Pages:     ${config.pageCount}`);
  console.log(`   Trim:      ${config.trimSize}`);
  console.log(
    `   Exercises: ${config.exerciseTypes.map((t) => EXERCISE_TYPE_LABELS[t]).join(", ")}`,
  );
  console.log(`   Answers:   ${config.includeAnswerKey ? "yes" : "no"}`);
  console.log(`   Author:    ${config.authorName}`);
}

function printSection(section: BookSection, index: number) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`📖 Section ${index + 1}: ${section.title}`);
  if (section.description) {
    console.log(`   ${section.description}`);
  }

  for (const [ei, ex] of section.exercises.entries()) {
    const label = EXERCISE_TYPE_LABELS[ex.type] ?? ex.type;
    console.log(`\n   ${ei + 1}. [${label}] ${ex.title}`);
    console.log(`      ${ex.instructions}`);

    const c = ex.content as Record<string, unknown>;

    switch (ex.type) {
      case "fill_in_blank": {
        const items = c.sentences as { text: string; blank: string }[];
        items?.slice(0, 3).forEach((s, i) => {
          console.log(`      ${i + 1}) ${s.text}  → [${s.blank}]`);
        });
        if (items?.length > 3) console.log(`      ... +${items.length - 3} more`);
        break;
      }
      case "multiple_choice": {
        const items = c.questions as {
          question: string;
          options: string[];
          correctIndex: number;
        }[];
        items?.slice(0, 2).forEach((q, i) => {
          console.log(`      ${i + 1}) ${q.question}`);
          q.options.forEach((o, j) => {
            const mark = j === q.correctIndex ? " ✓" : "";
            console.log(`         ${["A", "B", "C", "D"][j]}) ${o}${mark}`);
          });
        });
        if (items?.length > 2) console.log(`      ... +${items.length - 2} more`);
        break;
      }
      case "matching": {
        const items = c.pairs as { left: string; right: string }[];
        items?.slice(0, 4).forEach((p, i) => {
          console.log(`      ${i + 1}) ${p.left}  →  ${p.right}`);
        });
        if (items?.length > 4) console.log(`      ... +${items.length - 4} more`);
        break;
      }
      case "true_false": {
        const items = c.statements as { statement: string; isTrue: boolean }[];
        items?.slice(0, 3).forEach((s, i) => {
          console.log(`      ${i + 1}) ${s.statement}  → [${s.isTrue}]`);
        });
        if (items?.length > 3) console.log(`      ... +${items.length - 3} more`);
        break;
      }
      case "reading_passage": {
        const passage = c.passage as string;
        const questions = c.questions as { question: string }[];
        console.log(`      Passage: ${passage?.substring(0, 100)}...`);
        console.log(`      Questions: ${questions?.length ?? 0}`);
        break;
      }
      default: {
        const keys = Object.keys(c);
        console.log(`      Content keys: ${keys.join(", ")}`);
        break;
      }
    }
  }
}

function printSummary(sections: BookSection[], elapsed: number) {
  const totalExercises = sections.reduce(
    (sum, s) => sum + s.exercises.length,
    0,
  );
  const typeCounts: Record<string, number> = {};
  for (const s of sections) {
    for (const e of s.exercises) {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`✅ Generation complete in ${(elapsed / 1000).toFixed(1)}s`);
  console.log(`   Sections:  ${sections.length}`);
  console.log(`   Exercises: ${totalExercises}`);
  console.log(`   By type:`);
  for (const [type, count] of Object.entries(typeCounts).sort(
    (a, b) => b[1] - a[1],
  )) {
    const label = EXERCISE_TYPE_LABELS[type as ExerciseType] ?? type;
    console.log(`     ${label}: ${count}`);
  }
}

// --- PDF export ---

async function exportPdf(book: GeneratedBook, outputPath: string) {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const { createElement } = await import("react");
  const { BookDocument } = await import("../lib/pdf/document");
  const { mkdirSync, writeFileSync } = await import("fs");
  const { dirname } = await import("path");

  console.log(`\n📄 Rendering PDF...`);

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true });

  const element = createElement(BookDocument, { book });
  const buffer = await renderToBuffer(element);

  writeFileSync(outputPath, buffer);
  const sizeKB = (buffer.byteLength / 1024).toFixed(1);
  console.log(`✅ PDF saved: ${outputPath} (${sizeKB} KB)`);
}

// --- Main ---

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`
BookForge CLI — test book generation + PDF export

Usage: pnpm generate [options]

Options:
  --title <string>      Book title (default: "Test Workbook: English Practice")
  --type <string>       grammar_workbook, vocabulary_builder,
                        reading_comprehension, mixed_skills (default: grammar_workbook)
  --level <string>      A1, A2, B1, B2, C1, C2 (default: A2)
  --topic <string>      Topic/theme (default: Travel)
  --pages <number>      Page count, 20-200 (default: 30)
  --trim <string>       6x9, 8.5x11 (default: 8.5x11)
  --exercises <list>    Comma-separated types (default: fill_in_blank,multiple_choice,matching)
  --author <string>     Author name (default: Test Author)
  --no-answers          Skip answer key
  --pdf [path]          Export PDF (default: output/<title-slug>.pdf)
  --json                Output raw JSON
  --dry-run             Show config only
  --help, -h            Show this help
    `);
    process.exit(0);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "❌ OPENAI_API_KEY not set. Create .env.local or export it.",
    );
    process.exit(1);
  }

  const { config, json, dryRun, pdfPath } = parseArgs();
  printConfig(config);

  if (dryRun) {
    console.log("\n🔸 Dry run — skipping AI generation.");
    process.exit(0);
  }

  const sectionsCount = Math.max(3, Math.floor(config.pageCount / 10));
  console.log(
    `\n⏳ Generating ${sectionsCount} sections via ${process.env.OPENAI_MODEL || "gpt-4o"}...`,
  );

  const start = Date.now();

  try {
    const sections = await generateBookContent(config);
    const elapsed = Date.now() - start;

    if (json) {
      console.log(JSON.stringify({ config, sections }, null, 2));
    } else {
      for (const [i, section] of sections.entries()) {
        printSection(section, i);
      }
      printSummary(sections, elapsed);
    }

    // PDF export
    if (pdfPath) {
      const book: GeneratedBook = { config, sections };
      await exportPdf(book, pdfPath);
    }
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(
      `\n❌ Generation failed after ${(elapsed / 1000).toFixed(1)}s`,
    );
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if ("status" in error) {
        console.error(
          `   HTTP status: ${(error as { status: number }).status}`,
        );
      }
    }
    process.exit(1);
  }
}

main();
