"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";
import type { BookMeta } from "@/lib/storage";

export default function RecentBooks() {
  const [books, setBooks] = useState<BookMeta[]>([]);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
  }, []);

  if (books.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="mb-6 text-2xl font-bold">Recently Generated</h2>
      <div className="space-y-3">
        {books.slice(0, 10).map((b) => {
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
  );
}
