"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import type { GeneratedBook } from "@/lib/schemas/book";

// AICODE-NOTE: @react-pdf/renderer must be loaded client-side only.
// Dynamic import with ssr:false prevents server-side rendering issues.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);
const BookDocument = dynamic(
  () => import("@/lib/pdf/document").then((mod) => mod.BookDocument),
  { ssr: false },
);

function PreviewContent() {
  const searchParams = useSearchParams();

  const book = useMemo<GeneratedBook | null>(() => {
    const raw = searchParams.get("book");
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch {
      return null;
    }
  }, [searchParams]);

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--muted-foreground)]">No book data found. Go back and generate a book first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{book.config.title}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {book.config.level} | {book.config.topic} | {book.config.trimSize}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--accent)]"
            >
              Back
            </a>
            <Suspense fallback={<span className="px-4 py-2 text-sm">Loading...</span>}>
              <PDFDownloadLink
                document={<BookDocument book={book} />}
                fileName={`${book.config.title.replace(/\s+/g, "-").toLowerCase()}.pdf`}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
              >
                {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
              </PDFDownloadLink>
            </Suspense>
          </div>
        </div>
      </header>

      {/* PDF Preview */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Suspense
          fallback={
            <div className="flex h-[80vh] items-center justify-center text-[var(--muted-foreground)]">
              Loading preview...
            </div>
          }
        >
          <PDFViewer
            width="100%"
            height="800px"
            className="rounded-lg border border-[var(--border)]"
          >
            <BookDocument book={book} />
          </PDFViewer>
        </Suspense>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
