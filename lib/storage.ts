// AICODE-NOTE: Vercel Blob storage for persisting generated books.
// Each book is stored as books/{id}.json. A single _index.json tracks summaries.
// Requires BLOB_READ_WRITE_TOKEN env var (Vercel Blob store).

import { put, list } from "@vercel/blob";
import type { GeneratedBook } from "./schemas/book";

export interface BookMeta {
  id: string;
  title: string;
  authorName: string;
  level: string;
  topic: string;
  bookType: string;
  sectionCount: number;
  exerciseCount: number;
  createdAt: string;
}

export interface StoredBook extends GeneratedBook {
  id: string;
  createdAt: string;
}

const INDEX_PATH = "books/_index.json";

async function getIndex(): Promise<BookMeta[]> {
  try {
    const { blobs } = await list({ prefix: INDEX_PATH, limit: 1 });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function saveBook(book: GeneratedBook): Promise<BookMeta> {
  const id = crypto.randomUUID().slice(0, 8);
  const createdAt = new Date().toISOString();

  const stored: StoredBook = { ...book, id, createdAt };

  await put(`books/${id}.json`, JSON.stringify(stored), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });

  const meta: BookMeta = {
    id,
    title: book.config.title,
    authorName: book.config.authorName,
    level: book.config.level,
    topic: book.config.topic,
    bookType: book.config.bookType,
    sectionCount: book.sections.length,
    exerciseCount: book.sections.reduce(
      (sum, s) => sum + s.exercises.length,
      0,
    ),
    createdAt,
  };

  const currentIndex = await getIndex();
  currentIndex.unshift(meta);
  await put(INDEX_PATH, JSON.stringify(currentIndex), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });

  return meta;
}

export async function listBooks(): Promise<BookMeta[]> {
  return getIndex();
}

export async function getBook(id: string): Promise<StoredBook | null> {
  try {
    const { blobs } = await list({ prefix: `books/${id}.json`, limit: 1 });
    if (blobs.length === 0) return null;
    const res = await fetch(blobs[0].url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
