import Link from "next/link";
import { categories } from "@/lib/categories";
import RecentBooks from "./recent-books";

const STEPS = [
  {
    icon: "1️⃣",
    title: "Pick a Category",
    description: "Choose from 12 subjects — Math, English, Science, Languages, and more.",
  },
  {
    icon: "2️⃣",
    title: "Customize",
    description: "Set difficulty level, topic, and exercise types. AI adapts to your needs.",
  },
  {
    icon: "3️⃣",
    title: "Download PDF",
    description: "Get a print-ready PDF workbook in seconds. KDP-formatted, ready to sell.",
  },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "AI-Powered Content",
    description:
      "GPT-4o generates structured exercises with answer keys. Not random text — real pedagogical content.",
  },
  {
    icon: "📐",
    title: "KDP-Ready Format",
    description:
      "Correct trim sizes, margins, bleed. Upload directly to Amazon KDP. No reformatting needed.",
  },
  {
    icon: "🎯",
    title: "9 Exercise Types",
    description:
      "Fill-in-the-blank, multiple choice, matching, word search, reading passages, and more.",
  },
  {
    icon: "📊",
    title: "6 Difficulty Levels",
    description:
      "CEFR A1–C2 for languages. Grade-based for Math & Science. Age-based for Kids.",
  },
  {
    icon: "⚡",
    title: "30 Seconds, Not 30 Days",
    description:
      "What takes weeks manually, BookForge does in seconds. Generate, preview, download.",
  },
  {
    icon: "🆓",
    title: "Free, No Signup",
    description:
      "Start generating immediately. No account, no credit card, no friction.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Free AI Worksheet &amp; Workbook Generator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
          Create printable PDF workbooks in seconds — Math, English, Science,
          Spanish, Kids Activities, SAT Prep &amp; 6 more categories.
          KDP-ready. No signup required.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#categories"
            className="rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            Start Generating — Free
          </a>
          <Link
            href="/pricing"
            className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--accent)]"
          >
            View Pricing
          </Link>
        </div>
      </header>

      {/* How It Works */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">
          How It Works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="text-center">
              <span className="text-4xl">{step.icon}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mb-20 scroll-mt-8">
        <h2 className="mb-6 text-2xl font-bold">Choose a Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className="group rounded-xl border border-[var(--border)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-2 font-semibold leading-tight group-hover:text-[var(--primary)]">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs leading-snug text-[var(--muted-foreground)]">
                {cat.description.slice(0, 80)}
                {cat.description.length > 80 ? "..." : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Why BookForge?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--border)] p-5"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-2 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who Is This For */}
      <section className="mb-20 rounded-xl border border-[var(--border)] p-8">
        <h2 className="mb-6 text-2xl font-bold">Who Is This For?</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">KDP Publishers</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Create quality educational workbooks in minutes instead of weeks.
              Upload to Amazon KDP and start earning passive income.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Teachers &amp; Tutors</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Generate supplementary worksheets for your classes. Customize
              difficulty, topic, and exercise types for any subject.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Homeschool Parents</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Create personalized practice materials for your children.
              Math drills, vocabulary builders, science quizzes — all in one place.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Content Creators</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Build educational lead magnets, course supplements, or printable
              freebies for your audience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-16 text-center">
        <h2 className="text-2xl font-bold">
          Ready to Create Your First Workbook?
        </h2>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Pick a category and generate a professional PDF in under a minute.
        </p>
        <a
          href="#categories"
          className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          Get Started — It&apos;s Free
        </a>
      </section>

      {/* Recent Books (client component) */}
      <RecentBooks />
    </main>
  );
}
