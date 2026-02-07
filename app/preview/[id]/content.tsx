"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { GeneratedBook } from "@/lib/schemas/book";

const PDFPreview = dynamic(
  () => import("@/components/pdf-preview").then((m) => m.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[80vh] items-center justify-center text-[var(--muted-foreground)]">
        Loading PDF preview...
      </div>
    ),
  },
);

export default function PreviewContent({
  book,
  title,
}: {
  book: GeneratedBook;
  title: string;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{title}</h1>
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
