# BookForge

AI-powered English learning workbook generator for Amazon KDP. Generate print-ready PDF workbooks in minutes, not weeks.

## Features

- **Book Builder** — Select type, CEFR level (A1-C2), topic, exercise types
- **AI Generation** — OpenAI generates structured pedagogical content
- **9 Exercise Types** — Fill-in-blank, multiple choice, matching, true/false, word search, and more
- **KDP-Ready PDF** — Correct trim sizes (6x9, 8.5x11), margins, page numbers, TOC
- **Answer Key** — Auto-generated at the end of the book
- **Live Preview** — See your book before downloading

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

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |
| `pnpm test` | Run tests (watch) |
| `pnpm test:run` | Run tests (single run) |

## Tech Stack

- Next.js 16 + React 19
- Tailwind CSS 4 + shadcn/ui
- @react-pdf/renderer (PDF generation)
- OpenAI SDK (structured output with Zod)
- Vitest + Testing Library

## How It Works

1. User fills out the book configuration form (type, level, topic, exercises)
2. Form data is validated with Zod and sent to `/api/generate`
3. Server calls OpenAI with structured output format — each section generated separately
4. Client receives structured book data and renders PDF preview
5. User downloads KDP-ready PDF

## License

Private
