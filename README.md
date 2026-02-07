# BookForge

AI-powered workbook generator for Amazon KDP. Generate print-ready PDF workbooks in minutes — English, Math, Science, Languages, History, Kids activities, Test Prep, and more.

**Live demo:** https://bookforge-iota.vercel.app

## Features

- **12 Categories** — English Grammar, Math, Science, Spanish, French, History, Kids, Test Prep, Business English, General Knowledge, Word Puzzles
- **AI Generation** — OpenAI creates structured pedagogical content with category-specific prompts
- **9 Exercise Types** — Fill-in-blank, multiple choice, matching, true/false, word search, sentence reorder, error correction, reading passage, short answer
- **KDP-Ready PDF** — Correct trim sizes (6x9, 8.5x11), margins, page numbers, TOC, answer key
- **Persistent Storage** — Every book gets a unique shareable URL (`/preview/{id}`)
- **Public Gallery** — Browse all previously generated books on the home page
- **CLI Tool** — Generate and export PDF from the command line without running the web server

## How It Works

1. **Pick a category** — e.g., Math Practice, Spanish for Beginners, Kids Activities
2. **Customize** — choose difficulty, topic (with smart suggestions), exercise types
3. **Generate** — AI creates structured exercises tailored to the category
4. **Preview & Download** — see the PDF in-browser, download KDP-ready file

Each category has custom AI prompts, so "fill_in_blank" generates math equations for Math, Spanish translations for Spanish, and grammar gaps for English.

## Prerequisites

- Node.js 20+
- pnpm
- OpenAI API key

## Setup

```bash
# Install dependencies
pnpm install

# Copy env file and add your OpenAI key
cp .env.local.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For persistent storage (unique book URLs), create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` in `.env.local`.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |
| `pnpm test` | Run tests (watch) |
| `pnpm test:run` | Run tests (single run) |
| `pnpm generate` | CLI: generate book to console |
| `pnpm generate --pdf` | CLI: generate + save PDF |
| `pnpm generate --level B1 --topic Food --pdf` | CLI: custom params |
| `pnpm generate --dry-run` | Show config only |

## Tech Stack

- **Next.js 16** — App Router, React Server Components, Turbopack
- **React 19** + Tailwind CSS 4 + shadcn/ui
- **@react-pdf/renderer** — PDF generation (client-side preview + server-side CLI)
- **OpenAI SDK** — Structured output with Zod (`z.discriminatedUnion`)
- **Vercel Blob** — Persistent book storage with unique URLs
- **Vitest** + Testing Library

## Categories

| | Category | Slug | Description |
|---|----------|------|-------------|
| 📝 | English Grammar | `/c/english-grammar` | Grammar exercises for ESL/EFL learners |
| 📖 | English Vocabulary | `/c/english-vocabulary` | Vocabulary building with word searches and matching |
| 🔢 | Math Practice | `/c/math-practice` | Arithmetic, word problems, fractions, algebra |
| 🔬 | Science & Nature | `/c/science-nature` | Biology, physics, chemistry, earth science |
| 🇪🇸 | Spanish | `/c/spanish-beginners` | Spanish vocabulary and grammar |
| 🇫🇷 | French | `/c/french-beginners` | French vocabulary and grammar |
| 🏛️ | World History | `/c/world-history` | Ancient civilizations, world wars, geography |
| 🧒 | Kids Activities | `/c/kids-activities` | Fun learning for ages 4-10 |
| 🎓 | Test Prep | `/c/test-prep` | SAT/ACT/GED practice material |
| 💼 | Business English | `/c/business-english` | Professional vocabulary and communication |
| 🌍 | General Knowledge | `/c/general-knowledge` | Trivia, geography, culture, fun facts |
| 🧩 | Word Puzzles | `/c/word-puzzles` | Word searches, scrambles, matching games |

## Architecture

```
User → /c/{category} → form → POST /api/generate → OpenAI (structured output)
                                                   → Vercel Blob (save)
                                                   → /preview/{id} (PDF)
```

- **Schemas first** — `lib/schemas/book.ts` defines all types with Zod
- **OpenAI structured output** — `z.discriminatedUnion` ensures typed exercise content
- **Category-driven prompts** — same engine, different AI instructions per subject
- **PDF is client-side** — `@react-pdf/renderer` loaded with `dynamic({ ssr: false })`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_MODEL` | No | Model name (default: `gpt-4o`) |
| `BLOB_READ_WRITE_TOKEN` | For persistence | Auto-set when Vercel Blob store is connected |

## License

MIT
