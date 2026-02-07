"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  BookConfig,
  type BookConfig as BookConfigType,
  EXERCISE_TYPE_LABELS,
  ExerciseType,
} from "@/lib/schemas/book";
import type { Category } from "@/lib/categories";
import type { BookMeta } from "@/lib/storage";

export default function CategoryGenerator({ category }: { category: Category }) {
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
      bookType: category.defaultBookType as BookConfigType["bookType"],
      level: category.defaultLevel as BookConfigType["level"],
      topic: "",
      pageCount: 30,
      trimSize: "8.5x11",
      exerciseTypes: category.defaultExerciseTypes,
      includeAnswerKey: true,
      authorName: "",
    },
  });

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((all: BookMeta[]) =>
        setBooks(all.filter((b) => b.category === category.slug)),
      )
      .catch(() => {});
  }, [category.slug]);

  async function onSubmit(data: BookConfigType) {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, category: category.slug }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const result = await res.json();

      if (result.id) {
        window.location.href = `/preview/${result.id}`;
      } else {
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
      <div className="mb-6">
        <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:underline">
          &larr; All categories
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.h1}</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">{category.description}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium">Book Title</label>
          <input
            {...register("title")}
            placeholder={`${category.name}: ${category.suggestedTopics[0]} Workbook`}
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

        {/* Topic — with suggested chips */}
        <div>
          <label className="mb-1 block text-sm font-medium">Topic / Theme</label>
          <input
            {...register("topic")}
            placeholder="Choose from suggestions below or type your own"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {category.suggestedTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={(e) => {
                  const form = e.currentTarget.closest("form");
                  const input = form?.querySelector<HTMLInputElement>(
                    'input[name="topic"]',
                  );
                  if (input) {
                    // Use native setter to trigger react-hook-form
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value",
                    )?.set;
                    nativeInputValueSetter?.call(input, topic);
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs transition-colors hover:bg-[var(--accent)]"
              >
                {topic}
              </button>
            ))}
          </div>
          {errors.topic && (
            <p className="mt-1 text-sm text-[var(--destructive)]">{errors.topic.message}</p>
          )}
        </div>

        {/* Difficulty + Trim Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Difficulty</label>
            <select
              {...register("level")}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              {Object.entries(category.difficultyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
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

        {/* Hidden fields */}
        <input type="hidden" {...register("trimSize")} />
        <input type="hidden" {...register("bookType")} />

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
          {generating ? "Generating..." : `Generate ${category.name} Workbook`}
        </button>

        {error && (
          <div className="rounded-lg border border-[var(--destructive)] bg-red-50 p-3 text-sm text-[var(--destructive)] dark:bg-red-950">
            {error}
          </div>
        )}
      </form>

      {/* Books in this category */}
      {books.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-bold">
            {category.icon} Recent {category.name} Books
          </h2>
          <div className="space-y-2">
            {books.map((b) => (
              <Link
                key={b.id}
                href={`/preview/${b.id}`}
                className="block rounded-lg border border-[var(--border)] p-3 transition-colors hover:bg-[var(--accent)]"
              >
                <h3 className="font-medium">{b.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {b.topic} | {b.sectionCount}s, {b.exerciseCount} exercises | by{" "}
                  {b.authorName}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
