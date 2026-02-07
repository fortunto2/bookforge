# CLAUDE.md — BookForge

## Project Overview

**BookForge** is an AI-powered web app that generates print-ready educational workbooks for Amazon KDP. Supports 12 categories (English, Math, Science, Languages, History, Kids, Test Prep, and more). Users pick a category, customize difficulty, topic, and exercises — AI generates structured content — one-click PDF export.

**Problem:** Creating quality workbooks takes weeks. BookForge does it in minutes.

**Live:** https://bookforge-iota.vercel.app

## Tech Stack

- **Framework:** Next.js 16 (App Router, RSC, Turbopack)
- **UI:** React 19 + Tailwind CSS 4 + shadcn/ui
- **PDF:** @react-pdf/renderer (client-side preview + server-side CLI export)
- **AI:** OpenAI SDK with Zod structured output (`z.discriminatedUnion`)
- **Storage:** Vercel Blob (persistent book storage, unique URLs)
- **Validation:** Zod (schemas → inferred types)
- **Forms:** react-hook-form + @hookform/resolvers
- **Testing:** Vitest + @testing-library/react
- **Package Manager:** pnpm
- **Deploy:** Vercel

## Directory Structure

```
bookforge/
├── app/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home: category grid + recent books
│   ├── globals.css               # Tailwind + CSS variables
│   ├── c/[slug]/
│   │   ├── page.tsx              # Category page (SSG, 12 categories)
│   │   └── generator.tsx         # Category-specific form (client)
│   ├── preview/
│   │   ├── page.tsx              # Fallback preview (sessionStorage)
│   │   └── [id]/
│   │       ├── page.tsx          # Book preview (server, fetches from Blob)
│   │       └── content.tsx       # PDF viewer (client, dynamic import)
│   ├── api/
│   │   ├── generate/route.ts     # POST: AI generation + blob save
│   │   └── books/route.ts        # GET: list saved books
├── lib/
│   ├── schemas/book.ts           # Zod schemas (source of truth)
│   ├── ai/generate-book.ts       # OpenAI structured output (discriminatedUnion)
│   ├── pdf/document.tsx          # @react-pdf/renderer components (KDP margins)
│   ├── categories.ts             # 12 category definitions + custom prompts
│   ├── storage.ts                # Vercel Blob save/load/list
│   └── utils.ts                  # cn() helper
├── components/
│   ├── pdf-preview.tsx           # PDFViewer + PDFDownloadLink (ssr:false)
│   └── ui/                       # shadcn components
├── scripts/
│   └── test-generate.ts          # CLI: generate + PDF export (excluded from build)
├── docs/
│   └── prd.md                    # Product requirements
├── vercel.json                   # Function timeout config (60s for generate)
├── tsconfig.json                 # scripts/ excluded from build
└── .env.local.example
```

## Common Commands

```bash
pnpm dev                          # Start dev server (Turbopack)
pnpm build                        # Production build
pnpm lint                         # ESLint
pnpm format                       # Prettier
pnpm test                         # Vitest (watch mode)
pnpm test:run                     # Vitest (single run)
pnpm generate                     # CLI: generate book + print to console
pnpm generate --pdf               # CLI: generate + save PDF to output/
pnpm generate --level B1 --topic Food --pdf  # CLI: custom params
pnpm generate --dry-run            # Show config without calling AI
```

## SGR / Domain-First

**Schemas are the source of truth.** Read `lib/schemas/book.ts` FIRST before any work.

| Schema | Purpose |
|--------|---------|
| `BookConfig` | User input: title, type, level, topic, exercises |
| `Exercise` | Single exercise with typed content (discriminatedUnion of 9 types) |
| `BookSection` | Group of exercises with title/description |
| `GeneratedBook` | Complete book: config + sections |
| `CEFRLevel` | A1-C2 enum (reused as generic difficulty) |
| `BookType` | grammar_workbook, vocabulary_builder, etc. |
| `ExerciseType` | 9 types: fill_in_blank, multiple_choice, matching, etc. |

**Data flow:** Category → `BookConfig` → OpenAI (structured output) → `GeneratedBook` → Vercel Blob + `@react-pdf/renderer` → PDF

## Architecture

- **Server Components by default** — only `"use client"` where needed (forms, PDF viewer)
- **API Route** (`app/api/generate/route.ts`) — OpenAI calls server-side, saves to Vercel Blob
- **PDF preview is client-side** — @react-pdf/renderer loaded via `dynamic({ ssr: false })`
- **PDF CLI export is server-side** — `renderToBuffer` in `scripts/test-generate.ts`
- **Vercel Blob** — each book gets permanent URL `/preview/{id}`, index at `books/_index.json`
- **Categories** — 12 categories at `/c/{slug}`, each with custom AI system prompt, difficulty labels, suggested topics
- **Zod everywhere** — form validation, API validation, AI structured output (`zodResponseFormat`)

## Categories

Each category has: slug, custom system prompt, difficulty labels, default exercise types, suggested topics.

| Category | Slug | Key Exercise Types |
|----------|------|--------------------|
| English Grammar | `english-grammar` | fill_in_blank, error_correction, sentence_reorder |
| English Vocabulary | `english-vocabulary` | fill_in_blank, matching, word_search |
| Math Practice | `math-practice` | fill_in_blank, multiple_choice, short_answer |
| Science & Nature | `science-nature` | multiple_choice, true_false, reading_passage |
| Spanish | `spanish-beginners` | fill_in_blank, matching, sentence_reorder |
| French | `french-beginners` | fill_in_blank, matching, sentence_reorder |
| World History | `world-history` | multiple_choice, matching, reading_passage |
| Kids Activities | `kids-activities` | matching, word_search, fill_in_blank |
| Test Prep (SAT/GED) | `test-prep` | multiple_choice, reading_passage, error_correction |
| Business English | `business-english` | fill_in_blank, reading_passage, short_answer |
| General Knowledge | `general-knowledge` | multiple_choice, true_false, matching |
| Word Puzzles | `word-puzzles` | word_search, matching, sentence_reorder |

## Marketing & SEO

> Source: deep research (solopreneur/3-opportunities/bookforge/research.md)

**Naming:** "BookForge" is taken (bookforge.app, bookforge.co). Must rename to **WorkbookAI** or **LessonPress** before marketing push.

**SEO keywords (low competition, high intent):**
- "AI workbook generator" — landing page title
- "KDP workbook creator" — main category
- "ESL workbook generator" — teacher audience
- "CEFR workbook maker" — niche differentiator
- "AI worksheet generator" — already in metadata

**Key competitors:** BookBolt ($19.99/mo, templates only), BookAutoAI ($35-100/mo, prose not exercises), Royalty Profits AI ($27-37 one-time, low quality). **None specialize in AI educational workbooks.**

**Pricing plan:** Free (1 book/mo, watermark) → Pro $19/mo → Lifetime $99

## Key Decisions

- **OpenAI structured output** — `z.discriminatedUnion("type", [...])` maps to JSON Schema `anyOf`. Each of 9 exercise types has its own typed schema. Uses `client.beta.chat.completions.parse()` with `zodResponseFormat()`.
- **Vercel Blob for persistence** — no database needed. Books stored as JSON files, index file for listing. `allowOverwrite: true` for index updates.
- **Category-specific prompts** — same exercise engine, different AI prompts per category (math = equations, Spanish = translations, etc.)
- **Client-side PDF** — avoids server memory issues, user sees preview before download
- **KDP margins** — hardcoded per trim size (6x9, 8.5x11) in `lib/pdf/document.tsx`
- **scripts/ excluded from tsconfig** — CLI tool has React type mismatches that fail Next.js build type-checking
- **Function timeout 60s** — OpenAI generation takes 30-40s, configured in `vercel.json`

## Environment Variables

```
OPENAI_API_KEY=sk-...              # Required
OPENAI_MODEL=gpt-4o               # Optional (default: gpt-4o)
BLOB_READ_WRITE_TOKEN=vercel_...   # Required for persistence (auto-set by Vercel Blob store)
```

## Do

- Define schemas in `lib/schemas/` before writing any logic
- Use Zod for all validation (forms, API, AI output)
- Add new categories in `lib/categories.ts` — they auto-generate pages via `generateStaticParams`
- Keep components small and focused
- Use Server Components where possible
- Test schemas and business logic (not UI layout)

## Don't

- Don't add a database — Vercel Blob handles persistence
- Don't add authentication for MVP
- Don't use raw untyped data — always go through schemas
- Don't import @react-pdf/renderer in SSR context — use `dynamic({ ssr: false })`
- Don't hardcode exercise content — everything comes from AI generation
- Don't edit `scripts/` and expect it to be type-checked in build (excluded from tsconfig)

---

*Stack: Next.js 16 + Vercel Blob | Generated by /scaffold-project*
