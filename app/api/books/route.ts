import { NextResponse } from "next/server";
import { listBooks } from "@/lib/storage";

export async function GET() {
  try {
    const books = await listBooks();
    return NextResponse.json(books);
  } catch {
    return NextResponse.json([]);
  }
}
