"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";
import type { BookMeta } from "@/lib/storage";

export default function Home() {
  const [books, setBooks] = useState<BookMeta[]>([]);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">BookForge</h1>
        <p className="mt-2 text-lg text-[var(--muted-foreground)]">
          AI-powered workbook generator for Amazon KDP
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Choose a category, customize your workbook, download PDF — ready to publish.
        </p>
      </header>

      {/* Categories grid */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Choose a Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className="group rounded-xl border border-[var(--border)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-2 font-semibold leading-tight group-hover:text-[var(--primary)]">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs leading-snug text-[var(--muted-foreground)]">
                {cat.description.slice(0, 80)}
                {cat.description.length > 80 ? "..." : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent books */}
      {books.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-bold">Recently Generated</h2>
          <div className="space-y-3">
            {books.slice(0, 20).map((b) => {
              const cat = categories.find((c) => c.slug === b.category);
              return (
                <Link
                  key={b.id}
                  href={`/preview/${b.id}`}
                  className="block rounded-lg border border-[var(--border)] p-4 transition-colors hover:bg-[var(--accent)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {cat && <span className="text-lg">{cat.icon}</span>}
                        <h3 className="font-medium">{b.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {b.level} | {b.topic} | {b.sectionCount} sections,{" "}
                        {b.exerciseCount} exercises
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        by {b.authorName}
                        {cat && ` — ${cat.name}`}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-[var(--muted-foreground)]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
