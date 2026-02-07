import { NextResponse } from "next/server";
import { BookConfig } from "@/lib/schemas/book";
import { generateBookContent } from "@/lib/ai/generate-book";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = BookConfig.parse(body);
    const sections = await generateBookContent(config);

    return NextResponse.json({
      config,
      sections,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid book configuration", details: error }, { status: 400 });
    }
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate book content" },
      { status: 500 },
    );
  }
}
