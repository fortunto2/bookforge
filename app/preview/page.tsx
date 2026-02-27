"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { GeneratedBook } from "@/lib/schemas/book";

// AI-NOTE: PDFPreview must be loaded with ssr:false because @react-pdf/renderer
// uses browser-only APIs. Dynamic import keeps it out of the SSR bundle entirely.
const PDFPreview = dynamic(() => import("@/components/pdf-preview").then((m) => m.PDFPreview), {
  ssr: false,
  loading: () => (
    <div className="flex h-[80vh] items-center justify-center text-[var(--muted-foreground)]">
      Loading PDF preview...
    </div>
  ),
});

export default function PreviewPage() {
  const [book, setBook] = useState<GeneratedBook | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bookforge:book");
    if (raw) {
      try {
        setBook(JSON.parse(raw));
      } catch {
        // invalid data
      }
    }
  }, []);

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--muted-foreground)]">
          No book data found. Go back and generate a book first.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{book.config.title}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {book.config.level} | {book.config.topic} | {book.config.trimSize}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--accent)]"
          >
            Back
          </Link>
        </div>
      </header>

      <div className="px-4 py-6">
        <PDFPreview book={book} />
      </div>
    </div>
  );
}
