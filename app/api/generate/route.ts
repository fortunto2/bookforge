import { NextResponse } from "next/server";
import { BookConfig } from "@/lib/schemas/book";
import { generateBookContent } from "@/lib/ai/generate-book";
import { saveBook } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = BookConfig.parse(body);
    const sections = await generateBookContent(config);

    const book = { config, sections };

    // Persist to Vercel Blob (non-blocking — generation still returns even if save fails)
    let id: string | null = null;
    try {
      const meta = await saveBook(book);
      id = meta.id;
    } catch (e) {
      console.error("Failed to save book to storage:", e);
    }

    return NextResponse.json({ id, config, sections });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid book configuration", details: error },
        { status: 400 },
      );
    }
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate book content" },
      { status: 500 },
    );
  }
}
