---
type: opportunity
status: draft
title: "Bookforge — PRD"
created: 2026-02-07
updated: 2026-02-08
tags: [bookforge, prd, nextjs-supabase]
opportunity_score: 7.5
evidence_sources: 15
related:
  - 3-opportunities/bookforge/research.md
  - 1-methodology/stacks/nextjs-supabase.yaml
  - 1-methodology/dev-principles.md
  - 0-principles/manifest.md
---

# Bookforge — Product Requirements Document

> **Naming conflict:** "BookForge" is taken — bookforge.app (AI writing app), bookforge.co (kids activity books), bookforge.co.uk (writers group). **Must rename before launch.** Top candidates: **WorkbookAI** (.com likely available, immediately descriptive) or **LessonPress** (brandable, implies education + publishing). See research.md section 4.

## Problem

Creating quality English learning workbooks for Amazon KDP is time-consuming (weeks per book) and requires both pedagogical expertise and design skills — most self-publishers have neither, resulting in low-quality books that don't sell.

## Target User

**Primary:** Self-publishers and side-hustlers who want passive income from Amazon KDP educational books but lack time/skills to create quality content manually. Age 25-45, tech-savvy, familiar with KDP basics.

**Secondary:** English teachers who want to create supplementary materials for students and monetize their expertise on Amazon.

## Market Opportunity

### Market Size (TAM/SAM/SOM)

- **TAM:** Amazon KDP education category — $2.5B+ annually (self-published education books)
- **SAM:** English learning workbooks/activity books on KDP — ~$200M
- **SOM:** Year 1 realistic: 500 users × $29/mo = $174K ARR (or one-time: 2000 × $99 = $198K)

### Evidence-Based Pain Points

1. **Pain point 1:** Creating a single quality workbook takes 2-4 weeks manually. With BookForge — 30 minutes.
2. **Pain point 2:** Most KDP English books are low quality (AI-generated garbage without structure). Teachers know what works but can't design/format books.
3. **Pain point 3:** KDP formatting is painful — interior margins, bleed, trim sizes, page numbering. PDF generation must be pixel-perfect.

### Competitive Analysis

> Source: deep research — 8 competitors mapped, none specialize in AI educational workbooks

| Competitor | URL | Pricing | Key Features | Gap |
|-----------|-----|---------|-------------|-----|
| BookBolt | bookbolt.io | $9.99-$19.99/mo | KDP research, cover/interior designer, PuzzleWiz, 1200+ templates | No AI content, no pedagogical structure, puzzle-focused |
| Self Publishing Titans | selfpublishingtitans.com | Free-$44/mo | Chrome extension, keyword research, puzzle/coloring makers | Generic low-content only, no AI generation |
| BookAutoAI | bookautoai.com | $35-$100/mo | Full nonfiction book generation (100+ pages), auto-format | Nonfiction prose, not workbooks/exercises |
| Royalty Profits AI | royalprofitsai.com | $27-$37 one-time | 25+ book types in under 6 min | Low quality AI, not specialized for education |
| BooksGenie AI | booksgenie.ai | Subscription | Crossword, Sudoku, WordSearch, Mazes, coloring pages | Puzzle-only, no educational content |
| A Book Creator | abookcreator.com | $15.99/mo | Low content book platform, AI descriptions | Generic templates, no exercise generation |
| Canva | canva.com | Free/$12.99/mo | Huge template library, book interiors | Not KDP-optimized, no AI content |
| ChatGPT + manual | — | $20/mo | AI text generation | No integrated PDF, no exercise templates, manual formatting |

### Our Advantage

**No competitor combines AI content generation + pedagogical structure (CEFR levels) + KDP-ready export.** All tools are either generic KDP template editors (BookBolt) or generic AI text generators (BookAutoAI). BookForge is the only tool generating structured educational exercises.

---

## Solution

Web app that combines AI content generation with professional PDF export. User selects book type (grammar workbook, vocabulary builder, reading comprehension, themed lessons), target level (A1-C2 CEFR), topic/theme, and page count. AI generates structured pedagogical content with exercises, answer keys, and illustrations placeholders. One-click export to KDP-ready PDF with correct trim size, margins, and formatting.

### Core Features (MVP)

1. **Book Builder:** Select type (grammar/vocabulary/reading/mixed), CEFR level (A1-C2), topic, page count → AI generates structured content with exercises
2. **Live Preview:** Real-time preview of book pages in browser, edit any section, regenerate individual exercises
3. **KDP-Ready PDF Export:** Generate print-ready PDF with correct trim sizes (6×9, 8.5×11), margins, bleed, page numbers, TOC
4. **Exercise Templates:** 10+ exercise types — fill-in-the-blank, matching, multiple choice, word search, crossword, sentence reorder, error correction, reading passage + questions
5. **Answer Key:** Auto-generated answer key section at the end of the book

### Non-Goals (v1)

- Ebook/Kindle format (only print PDF)
- Cover design (use Canva or Book Bolt for covers)
- KDP upload automation
- Multi-language (English-learning books only in v1)
- User accounts / saved projects (local-first, download PDF immediately)
- Marketplace for templates

---

## Tech Stack

**Stack:** Next.js Full-Stack
**Platform:** web
**Language:** typescript
**Framework:** nextjs@16
**UI Framework:** react@19
**Styling:** tailwindcss@4
**Components:** shadcn-ui
**Database:** supabase (PostgreSQL)
**Auth:** superduperai-auth (@superduperai/auth + Supabase Auth)
**Package Manager:** pnpm

**Key Packages:**
- next
- react
- zod (validation)
- shadcn/ui + radix-ui (components)
- tailwindcss@4 (styling)
- @react-pdf/renderer (PDF generation in browser)
- openai (AI content generation via API)
- react-hook-form (book configuration forms)
- eslint + typescript-eslint + prettier (code quality)
- vitest + @testing-library/react (testing)

**Removed from default stack (not needed for MVP):**
- supabase, drizzle-orm (no database needed — stateless tool)
- stripe (free MVP, add payments later)
- next-intl (English-only UI for v1)
- react-email + resend (no emails)
- recharts (no charts)

**Stack Notes:**
- Drizzle ORM for database queries and migrations (not raw SQL)
- Use Server Components by default
- Zod for all validation (forms, API)
- Supabase SSR for auth, superduperai-auth for shared login
- next-intl for i18n: messages/en.json + messages/ru.json
- Stripe Checkout + Customer Portal for subscriptions
- pnpm as package manager (not npm/yarn)
- ESLint flat config (eslint.config.mjs) + Prettier
- Husky + lint-staged for pre-commit checks
- Vitest for unit/integration tests, @testing-library/react for components
- English first, then localize

**Architecture:** app_router_rsc

### Example Projects Using This Stack

- miralinka-marafon
- kissmytask-web

---

## Architecture Principles

### Universal (from dev-principles.md)

SOLID, DRY — Don't Repeat Yourself, KISS — Keep It Simple, Stupid, TDD — Test-Driven Development, DDD — Domain-Driven Design, Clean Architecture, Project Documentation, Privacy-First (из manifest.md), Internationalization (i18n), Shared Infrastructure, Infrastructure & DevOps, SGR — Schema-Guided Reasoning (Schemas First), Error Handling

Full reference: `1-methodology/dev-principles.md`

### Manifesto Principles (from manifest.md)

- Privacy isn't a feature. It's architecture.** On-device processing. Local storage. No accounts when possible. If I can't see your data, I can't leak it, sell it, or be forced to hand it over.
- Offline-first when possible.** Independence from connectivity. Independence from servers. Your tool should work on a plane, in a village, during an outage.
- One pain â†’ one feature â†’ launch.** Not platforms. Not roadmaps. One problem, one solution, shipped in days. If nobody wants it â€” kill it and move on.
- Speed over perfection.** Ship, learn, iterate. The market teaches faster than planning.

Full reference: `0-principles/manifest.md`

---

## Marketing & SEO Strategy

### Primary Keywords (low competition, commercial intent)

| Keyword | Competition | Priority |
|---------|-----------|----------|
| AI workbook generator | low | P0 — landing page title |
| English workbook maker KDP | low | P0 — H1 variant |
| KDP workbook creator | medium | P0 — main category |
| ESL workbook generator | low | P0 — teacher audience |
| CEFR workbook maker | low | P1 — niche differentiator |
| grammar workbook creator online | low | P1 — long-tail |
| create English learning book KDP | medium | P1 — how-to content |
| AI worksheet generator | medium | P0 — already in metadata |
| printable worksheets PDF | medium | P1 — informational |

### Content Strategy

1. **Landing page** — target "AI workbook generator" + "KDP workbook creator". Show before/after: weeks of manual work vs 30 seconds.
2. **Blog / SEO pages** — "How to create English workbooks for Amazon KDP", "Best exercise types for ESL workbooks", "CEFR levels explained for KDP publishers"
3. **YouTube** — screen recordings of book generation process. KDP community watches YouTube for tool reviews.
4. **Reddit** — r/KDP, r/selfpublish, r/teachingresources. Answer formatting questions, mention tool.
5. **Product Hunt** — launch day. No direct competitor has "AI + educational workbook" positioning.

### Competitor SEO Gap

BookBolt dominates "KDP book creator" (100+ blog posts, affiliate network). **Nobody targets education-specific keywords.** "English workbook generator" and "CEFR workbook creator" are open — first mover wins.

---

## Pricing Strategy

| Tier | Price | Includes | Competitor reference |
|------|-------|----------|---------------------|
| Free | $0 | 1 book/month, watermark, 3 exercise types | Canva free tier, BookBolt free trial |
| Pro | $19/mo | Unlimited books, all exercise types, no watermark | BookBolt Pro ($19.99/mo), below BookAutoAI ($35/mo) |
| Lifetime | $99 one-time | Everything in Pro, forever | Royalty Profits AI ($27-37), Tangent Templates ($59) |

**Launch strategy:** Free tier (current) → collect emails → ProductHunt launch → offer $49 lifetime (early bird) → raise to $99.

---

## Testing Strategy

**Framework:** vitest + @testing-library/react + @testing-library/jest-dom

- [ ] Unit tests for business logic
- [ ] Integration tests for API/DB
- [ ] E2E tests for critical user flows
- [ ] Edge cases and error handling

---

## Deployment

**Platform:** vercel | cloudflare_pages

- [ ] CI/CD pipeline setup
- [ ] Environment variables / secrets
- [ ] Monitoring and error tracking
- [ ] Analytics (privacy-respecting)

---

## Pydantic Schemas

```typescript
// Zod schemas (TypeScript equivalent of Pydantic)
import { z } from "zod";

const CEFRLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

const BookType = z.enum([
  "grammar_workbook",
  "vocabulary_builder",
  "reading_comprehension",
  "mixed_skills",
]);

const ExerciseType = z.enum([
  "fill_in_blank",
  "multiple_choice",
  "matching",
  "word_search",
  "sentence_reorder",
  "error_correction",
  "reading_passage",
  "crossword",
  "true_false",
  "short_answer",
]);

const TrimSize = z.enum(["6x9", "8.5x11"]);

const BookConfig = z.object({
  title: z.string().min(3).max(100),
  bookType: BookType,
  level: CEFRLevel,
  topic: z.string().min(3).max(200).describe("Theme: travel, business, daily life, etc."),
  pageCount: z.number().int().min(20).max(200),
  trimSize: TrimSize.default("8.5x11"),
  exerciseTypes: z.array(ExerciseType).min(3).max(10),
  includeAnswerKey: z.boolean().default(true),
  authorName: z.string().min(1).max(100),
});

const Exercise = z.object({
  type: ExerciseType,
  title: z.string(),
  instructions: z.string(),
  content: z.any(), // varies by exercise type
  answer: z.any().optional(),
});

const BookPage = z.object({
  pageNumber: z.number().int(),
  section: z.string(),
  exercises: z.array(Exercise),
});

const GeneratedBook = z.object({
  config: BookConfig,
  pages: z.array(BookPage),
  tableOfContents: z.array(z.object({
    section: z.string(),
    pageNumber: z.number().int(),
  })),
  answerKey: z.array(z.object({
    pageRef: z.number().int(),
    exerciseTitle: z.string(),
    answer: z.string(),
  })).optional(),
});
```

---

## Launch Checklist

- [x] MVP features complete (12 categories, PDF export, Vercel Blob)
- [ ] **Rename project** (WorkbookAI / LessonPress) — register domain
- [ ] Tests passing
- [x] Deployed to Vercel (bookforge-iota.vercel.app)
- [ ] Landing page SEO (target: "AI workbook generator", "KDP workbook creator")
- [ ] SEO blog: "How to create English workbooks for KDP"
- [ ] Analytics (PostHog)
- [ ] Product Hunt draft
- [ ] Reddit r/KDP intro post
- [ ] Pricing page (Free / Pro $19/mo / Lifetime $99)
- [ ] First 5 users onboarded (free tier)

---

*Generated by `make prd` on 2026-02-07*
*Stack: nextjs-supabase | Principles: dev-principles.md + manifest.md*
