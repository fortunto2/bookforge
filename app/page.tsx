"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  BookConfig,
  type BookConfig as BookConfigType,
  BOOK_TYPE_LABELS,
  CEFR_LABELS,
  EXERCISE_TYPE_LABELS,
  ExerciseType,
} from "@/lib/schemas/book";
import type { BookMeta } from "@/lib/storage";

export default function Home() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<BookMeta[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookConfigType>({
    resolver: zodResolver(BookConfig),
    defaultValues: {
      title: "",
      bookType: "grammar_workbook",
      level: "A2",
      topic: "",
      pageCount: 40,
      trimSize: "8.5x11",
      exerciseTypes: ["fill_in_blank", "multiple_choice", "matching"],
      includeAnswerKey: true,
      authorName: "",
    },
  });

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, []);

  async function onSubmit(data: BookConfigType) {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const result = await res.json();

      if (result.id) {
        window.location.href = `/preview/${result.id}`;
      } else {
        // Fallback: sessionStorage if blob storage unavailable
        sessionStorage.setItem(
          "bookforge:book",
          JSON.stringify({ config: result.config, sections: result.sections }),
        );
        window.location.href = "/preview";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setGenerating(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">BookForge</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          AI-powered English workbook generator for Amazon KDP
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium">Book Title</label>
          <input
            {...register("title")}
            placeholder="English Grammar Practice: Travel Edition"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.title.message}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="mb-1 block text-sm font-medium">Author Name</label>
          <input
            {...register("authorName")}
            placeholder="Your name as it appears on the book"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          {errors.authorName && (
            <p className="mt-1 text-sm text-[var(--destructive)]">
              {errors.authorName.message}
            </p>
          )}
        </div>

        {/* Book Type + Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Book Type</label>
            <select
              {...register("bookType")}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              {Object.entries(BOOK_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">CEFR Level</label>
            <select
              {...register("level")}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              {Object.entries(CEFR_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="mb-1 block text-sm font-medium">Topic / Theme</label>
          <input
            {...register("topic")}
            placeholder="Travel, Business English, Daily Life, Food & Cooking..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          {errors.topic && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.topic.message}</p>
          )}
        </div>

        {/* Page Count + Trim Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Page Count</label>
            <input
              {...register("pageCount", { valueAsNumber: true })}
              type="number"
              min={20}
              max={200}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Trim Size</label>
            <select
              {...register("trimSize")}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="8.5x11">8.5 x 11 inch (Letter)</option>
              <option value="6x9">6 x 9 inch (Trade)</option>
            </select>
          </div>
        </div>

        {/* Exercise Types */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Exercise Types (select 2-10)
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ExerciseType.options.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--accent)]"
              >
                <input
                  type="checkbox"
                  value={type}
                  {...register("exerciseTypes")}
                  className="rounded"
                />
                {EXERCISE_TYPE_LABELS[type]}
              </label>
            ))}
          </div>
          {errors.exerciseTypes && (
            <p className="mt-1 text-sm text-[var(--destructive)]">
              {errors.exerciseTypes.message}
            </p>
          )}
        </div>

        {/* Answer Key */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("includeAnswerKey")} className="rounded" />
          Include Answer Key
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={generating}
          className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
        >
          {generating ? "Generating book..." : "Generate Book"}
        </button>

        {error && (
          <div className="rounded-lg border border-[var(--destructive)] bg-red-50 p-3 text-sm text-[var(--destructive)] dark:bg-red-950">
            {error}
          </div>
        )}
      </form>

      {/* Generated Books List */}
      {books.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold">Generated Books</h2>
          <div className="space-y-3">
            {books.map((b) => (
              <Link
                key={b.id}
                href={`/preview/${b.id}`}
                className="block rounded-lg border border-[var(--border)] p-4 transition-colors hover:bg-[var(--accent)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{b.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {b.level} | {b.topic} | {b.sectionCount} sections,{" "}
                      {b.exerciseCount} exercises
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      by {b.authorName}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-[var(--muted-foreground)]">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
