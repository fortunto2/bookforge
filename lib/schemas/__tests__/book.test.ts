import { describe, it, expect } from "vitest";
import { BookConfig, CEFRLevel, BookType, ExerciseType } from "../book";

describe("BookConfig schema", () => {
  it("accepts valid config", () => {
    const result = BookConfig.safeParse({
      title: "English Grammar Practice",
      bookType: "grammar_workbook",
      level: "A2",
      topic: "Travel",
      pageCount: 40,
      trimSize: "8.5x11",
      exerciseTypes: ["fill_in_blank", "multiple_choice"],
      includeAnswerKey: true,
      authorName: "John Doe",
    });
    expect(result.success).toBe(true);
  });

  it("rejects title shorter than 3 chars", () => {
    const result = BookConfig.safeParse({
      title: "AB",
      bookType: "grammar_workbook",
      level: "A2",
      topic: "Travel",
      pageCount: 40,
      exerciseTypes: ["fill_in_blank", "multiple_choice"],
      authorName: "John",
    });
    expect(result.success).toBe(false);
  });

  it("rejects page count below 20", () => {
    const result = BookConfig.safeParse({
      title: "Valid Title",
      bookType: "grammar_workbook",
      level: "A2",
      topic: "Travel",
      pageCount: 5,
      exerciseTypes: ["fill_in_blank", "multiple_choice"],
      authorName: "John",
    });
    expect(result.success).toBe(false);
  });

  it("requires at least 2 exercise types", () => {
    const result = BookConfig.safeParse({
      title: "Valid Title",
      bookType: "grammar_workbook",
      level: "A2",
      topic: "Travel",
      pageCount: 40,
      exerciseTypes: ["fill_in_blank"],
      authorName: "John",
    });
    expect(result.success).toBe(false);
  });

  it("defaults trimSize to 8.5x11", () => {
    const result = BookConfig.parse({
      title: "Valid Title",
      bookType: "grammar_workbook",
      level: "A2",
      topic: "Travel",
      pageCount: 40,
      exerciseTypes: ["fill_in_blank", "multiple_choice"],
      authorName: "John",
    });
    expect(result.trimSize).toBe("8.5x11");
  });
});

describe("Enum schemas", () => {
  it("CEFRLevel accepts valid levels", () => {
    expect(CEFRLevel.safeParse("A1").success).toBe(true);
    expect(CEFRLevel.safeParse("C2").success).toBe(true);
    expect(CEFRLevel.safeParse("D1").success).toBe(false);
  });

  it("BookType accepts valid types", () => {
    expect(BookType.safeParse("grammar_workbook").success).toBe(true);
    expect(BookType.safeParse("invalid").success).toBe(false);
  });

  it("ExerciseType accepts all 9 types", () => {
    expect(ExerciseType.options).toHaveLength(9);
  });
});
