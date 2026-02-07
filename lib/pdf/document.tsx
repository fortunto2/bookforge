// AICODE-NOTE: KDP trim sizes and margins are critical for print-ready PDFs.
// 6x9 inch: margins 0.75" inside, 0.5" outside, 0.5" top/bottom
// 8.5x11 inch: margins 0.75" inside, 0.5" outside, 0.625" top/bottom
// "Inside" margin is the gutter (binding side), alternates per page.

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { GeneratedBook, Exercise, BookSection, TrimSize } from "@/lib/schemas/book";
import { EXERCISE_TYPE_LABELS } from "@/lib/schemas/book";

// KDP trim size dimensions in points (1 inch = 72 points)
const TRIM_SIZES: Record<TrimSize, { width: number; height: number }> = {
  "6x9": { width: 432, height: 648 },
  "8.5x11": { width: 612, height: 792 },
};

const MARGINS = {
  "6x9": { inside: 54, outside: 36, top: 36, bottom: 36 },
  "8.5x11": { inside: 54, outside: 36, top: 45, bottom: 45 },
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  titlePage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  bookTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  bookSubtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  authorName: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  tocTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
  },
  tocEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  tocText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 11,
    color: "#555",
    marginBottom: 16,
  },
  exerciseTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    marginTop: 16,
  },
  exerciseType: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
  },
  instructions: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 10,
  },
  exerciseItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  itemNumber: {
    fontFamily: "Helvetica-Bold",
    marginRight: 4,
  },
  blankLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    width: 80,
    marginBottom: -2,
  },
  answerKeyTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
  },
  answerSection: {
    marginBottom: 12,
  },
  answerSectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 10,
    color: "#333",
    marginBottom: 2,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#aaa",
  },
  optionRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 16,
  },
  optionLetter: {
    width: 20,
    fontFamily: "Helvetica-Bold",
  },
  matchingRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center",
  },
  matchingLeft: {
    width: "40%",
  },
  matchingArrow: {
    width: "20%",
    textAlign: "center",
  },
  matchingRight: {
    width: "40%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 2,
  },
});

function getPageStyle(trimSize: TrimSize, pageIndex: number) {
  const m = MARGINS[trimSize];
  const isEven = pageIndex % 2 === 0;
  return {
    ...styles.page,
    paddingTop: m.top,
    paddingBottom: m.bottom + 20,
    paddingLeft: isEven ? m.inside : m.outside,
    paddingRight: isEven ? m.outside : m.inside,
  };
}

function renderExercise(exercise: Exercise, index: number) {
  const content = exercise.content as Record<string, unknown>;

  return (
    <View key={index} wrap={false}>
      <Text style={styles.exerciseTitle}>
        {index + 1}. {exercise.title}
      </Text>
      <Text style={styles.exerciseType}>
        {EXERCISE_TYPE_LABELS[exercise.type] ?? exercise.type}
      </Text>
      <Text style={styles.instructions}>{exercise.instructions}</Text>

      {exercise.type === "fill_in_blank" &&
        renderFillInBlank(content as { sentences: { text: string; hint?: string }[] })}
      {exercise.type === "multiple_choice" &&
        renderMultipleChoice(
          content as {
            questions: { question: string; options: string[] }[];
          },
        )}
      {exercise.type === "matching" &&
        renderMatching(content as { pairs: { left: string; right: string }[] })}
      {exercise.type === "true_false" &&
        renderTrueFalse(content as { statements: { statement: string }[] })}
      {exercise.type === "sentence_reorder" &&
        renderSentenceReorder(content as { sentences: { scrambled: string[] }[] })}
      {exercise.type === "error_correction" &&
        renderErrorCorrection(content as { sentences: { incorrect: string }[] })}
      {exercise.type === "reading_passage" &&
        renderReadingPassage(
          content as { passage: string; questions: { question: string }[] },
        )}
      {exercise.type === "short_answer" &&
        renderShortAnswer(content as { questions: { question: string }[] })}
      {exercise.type === "word_search" &&
        renderWordSearch(content as { words: string[] })}
    </View>
  );
}

function renderFillInBlank(content: { sentences: { text: string; hint?: string }[] }) {
  return (
    <View>
      {content.sentences?.map((s, i) => (
        <View key={i} style={styles.exerciseItem}>
          <Text>
            <Text style={styles.itemNumber}>{i + 1}.</Text> {s.text.replace("___", "________")}
            {s.hint ? ` (${s.hint})` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderMultipleChoice(content: {
  questions: { question: string; options: string[] }[];
}) {
  const letters = ["A", "B", "C", "D"];
  return (
    <View>
      {content.questions?.map((q, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          <View style={styles.exerciseItem}>
            <Text>
              <Text style={styles.itemNumber}>{i + 1}.</Text> {q.question}
            </Text>
          </View>
          {q.options?.map((opt, j) => (
            <View key={j} style={styles.optionRow}>
              <Text style={styles.optionLetter}>{letters[j]})</Text>
              <Text>{opt}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function renderMatching(content: { pairs: { left: string; right: string }[] }) {
  // Shuffle right column for the exercise
  const shuffledRight = [...(content.pairs ?? [])].sort(() => Math.random() - 0.5);
  return (
    <View>
      {content.pairs?.map((p, i) => (
        <View key={i} style={styles.matchingRow}>
          <Text style={styles.matchingLeft}>
            {i + 1}. {p.left}
          </Text>
          <Text style={styles.matchingArrow}>___</Text>
          <Text style={styles.matchingRight}>
            {String.fromCharCode(65 + i)}. {shuffledRight[i]?.right}
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderTrueFalse(content: { statements: { statement: string }[] }) {
  return (
    <View>
      {content.statements?.map((s, i) => (
        <View key={i} style={styles.exerciseItem}>
          <Text>
            <Text style={styles.itemNumber}>{i + 1}.</Text> {s.statement}
            {"   "}True / False
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderSentenceReorder(content: { sentences: { scrambled: string[] }[] }) {
  return (
    <View>
      {content.sentences?.map((s, i) => (
        <View key={i} style={styles.exerciseItem}>
          <Text>
            <Text style={styles.itemNumber}>{i + 1}.</Text>{" "}
            {s.scrambled?.join(" / ")}
          </Text>
          <Text style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
            _______________________________________________
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderErrorCorrection(content: { sentences: { incorrect: string }[] }) {
  return (
    <View>
      {content.sentences?.map((s, i) => (
        <View key={i} style={styles.exerciseItem}>
          <Text>
            <Text style={styles.itemNumber}>{i + 1}.</Text> {s.incorrect}
          </Text>
          <Text style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
            Corrected: _______________________________________________
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderReadingPassage(content: {
  passage: string;
  questions: { question: string }[];
}) {
  return (
    <View>
      <Text style={{ marginBottom: 10, lineHeight: 1.6 }}>{content.passage}</Text>
      {content.questions?.map((q, i) => (
        <View key={i} style={styles.exerciseItem}>
          <Text>
            <Text style={styles.itemNumber}>{i + 1}.</Text> {q.question}
          </Text>
          <Text style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
            _______________________________________________
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderShortAnswer(content: { questions: { question: string }[] }) {
  return (
    <View>
      {content.questions?.map((q, i) => (
        <View key={i} style={styles.exerciseItem}>
          <Text>
            <Text style={styles.itemNumber}>{i + 1}.</Text> {q.question}
          </Text>
          <Text style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
            _______________________________________________
          </Text>
          <Text style={{ fontSize: 9, color: "#999" }}>
            _______________________________________________
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderWordSearch(content: { words: string[] }) {
  return (
    <View>
      <Text style={{ marginBottom: 8 }}>Find these words in the grid:</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {content.words?.map((w, i) => (
          <Text key={i} style={{ width: "33%", marginBottom: 4, fontSize: 10 }}>
            {"\u2022"} {w}
          </Text>
        ))}
      </View>
      <Text style={{ marginTop: 8, fontSize: 9, color: "#999" }}>
        (Word search grid will be generated in print version)
      </Text>
    </View>
  );
}

function renderAnswerKey(sections: BookSection[]) {
  return (
    <View>
      <Text style={styles.answerKeyTitle}>Answer Key</Text>
      {sections.map((section, si) => (
        <View key={si} style={styles.answerSection}>
          <Text style={styles.answerSectionTitle}>{section.title}</Text>
          {section.exercises.map((ex, ei) => {
            const answers = extractAnswers(ex);
            if (!answers) return null;
            return (
              <View key={ei} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
                  {ei + 1}. {ex.title}
                </Text>
                <Text style={styles.answerText}>{answers}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function extractAnswers(exercise: Exercise): string | null {
  const c = exercise.content as Record<string, unknown>;
  switch (exercise.type) {
    case "fill_in_blank": {
      const items = c.sentences as { blank: string }[] | undefined;
      return items?.map((s, i) => `${i + 1}. ${s.blank}`).join("  ") ?? null;
    }
    case "multiple_choice": {
      const letters = ["A", "B", "C", "D"];
      const items = c.questions as { correctIndex: number }[] | undefined;
      return items?.map((q, i) => `${i + 1}. ${letters[q.correctIndex]}`).join("  ") ?? null;
    }
    case "true_false": {
      const items = c.statements as { isTrue: boolean }[] | undefined;
      return items?.map((s, i) => `${i + 1}. ${s.isTrue ? "True" : "False"}`).join("  ") ?? null;
    }
    case "sentence_reorder": {
      const items = c.sentences as { correct: string }[] | undefined;
      return items?.map((s, i) => `${i + 1}. ${s.correct}`).join("\n") ?? null;
    }
    case "error_correction": {
      const items = c.sentences as { correct: string; errorType: string }[] | undefined;
      return items?.map((s, i) => `${i + 1}. ${s.correct} (${s.errorType})`).join("\n") ?? null;
    }
    case "reading_passage": {
      const items = (c as { questions: { answer: string }[] }).questions;
      return items?.map((q, i) => `${i + 1}. ${q.answer}`).join("\n") ?? null;
    }
    case "matching": {
      const items = c.pairs as { left: string; right: string }[] | undefined;
      return items?.map((p, i) => `${i + 1}. ${p.left} → ${p.right}`).join("  ") ?? null;
    }
    case "short_answer": {
      const items = (c as { questions: { sampleAnswer: string }[] }).questions;
      return items?.map((q, i) => `${i + 1}. ${q.sampleAnswer}`).join("\n") ?? null;
    }
    default:
      return null;
  }
}

interface BookDocumentProps {
  book: GeneratedBook;
}

export function BookDocument({ book }: BookDocumentProps) {
  const { config, sections } = book;
  const trim = TRIM_SIZES[config.trimSize];
  let pageIndex = 0;

  return (
    <Document title={config.title} author={config.authorName}>
      {/* Title Page */}
      <Page size={[trim.width, trim.height]} style={getPageStyle(config.trimSize, pageIndex++)}>
        <View style={styles.titlePage}>
          <Text style={styles.bookTitle}>{config.title}</Text>
          <Text style={styles.bookSubtitle}>
            {config.level} | {config.topic}
          </Text>
          <Text style={styles.authorName}>{config.authorName}</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size={[trim.width, trim.height]} style={getPageStyle(config.trimSize, pageIndex++)}>
        <Text style={styles.tocTitle}>Table of Contents</Text>
        {sections.map((section, i) => (
          <View key={i} style={styles.tocEntry}>
            <Text style={styles.tocText}>{section.title}</Text>
          </View>
        ))}
        {config.includeAnswerKey && (
          <View style={styles.tocEntry}>
            <Text style={styles.tocText}>Answer Key</Text>
          </View>
        )}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
          fixed
        />
      </Page>

      {/* Content Sections */}
      {sections.map((section, si) => (
        <Page
          key={si}
          size={[trim.width, trim.height]}
          style={getPageStyle(config.trimSize, pageIndex++)}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.description && (
            <Text style={styles.sectionDescription}>{section.description}</Text>
          )}
          {section.exercises.map((ex, ei) => renderExercise(ex, ei))}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        </Page>
      ))}

      {/* Answer Key */}
      {config.includeAnswerKey && (
        <Page
          size={[trim.width, trim.height]}
          style={getPageStyle(config.trimSize, pageIndex++)}
        >
          {renderAnswerKey(sections)}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        </Page>
      )}
    </Document>
  );
}
