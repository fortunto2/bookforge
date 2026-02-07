"use client";

// AICODE-NOTE: This component is loaded dynamically with ssr:false from preview/page.tsx.
// All @react-pdf/renderer imports must stay in this file to avoid SSR bundling issues.

import { Suspense } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { BookDocument } from "@/lib/pdf/document";
import type { GeneratedBook } from "@/lib/schemas/book";

interface PDFPreviewProps {
  book: GeneratedBook;
}

export function PDFPreview({ book }: PDFPreviewProps) {
  const fileName = `${book.config.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;

  return (
    <>
      {/* Download button */}
      <Suspense fallback={<span className="px-4 py-2 text-sm">Preparing...</span>}>
        <PDFDownloadLink
          document={<BookDocument book={book} />}
          fileName={fileName}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </Suspense>

      {/* PDF Viewer */}
      <div className="mx-auto mt-6 max-w-5xl">
        <PDFViewer
          width="100%"
          height="800px"
          className="rounded-lg border border-[var(--border)]"
        >
          <BookDocument book={book} />
        </PDFViewer>
      </div>
    </>
  );
}
