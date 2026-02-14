import type { Metadata } from "next";
import Link from "next/link";
import { isStripeConfigured } from "@/lib/stripe";
import { CheckoutButton } from "./checkout-button";

export const metadata: Metadata = {
  title: "Pricing — Free AI Workbook Generator",
  description:
    "BookForge pricing: Free tier (1 book/month), Pro ($19/mo, unlimited), Lifetime ($99 one-time). Create AI-powered educational workbooks for Amazon KDP.",
  openGraph: {
    title: "BookForge Pricing — Free, Pro & Lifetime Plans",
    description:
      "Start free. Upgrade when you're ready. Create unlimited AI workbooks for KDP.",
  },
};

const PLANS = [
  {
    name: "Free" as const,
    price: "$0",
    period: "forever",
    description: "Try it out. No credit card required.",
    features: [
      "1 book per month",
      "3 exercise types",
      "PDF download with watermark",
      "All 12 categories",
      "Community support",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro" as const,
    price: "$19",
    period: "/month",
    description: "For publishers and teachers who need volume.",
    features: [
      "Unlimited books",
      "All 9 exercise types",
      "No watermark",
      "KDP-ready formatting",
      "Priority generation",
      "Email support",
    ],
    cta: "Get Pro",
    highlight: true,
  },
  {
    name: "Lifetime" as const,
    price: "$99",
    period: "one-time",
    description: "Pay once, use forever. Best value.",
    features: [
      "Everything in Pro",
      "Lifetime access",
      "All future features",
      "Early access to new categories",
      "Priority support",
    ],
    cta: "Get Lifetime",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Can I really use it for free?",
    a: "Yes! The free tier lets you generate 1 book per month with 3 exercise types. No signup or credit card needed.",
  },
  {
    q: "Are the PDFs ready for Amazon KDP?",
    a: "Yes. All PDFs use correct KDP trim sizes (6x9, 8.5x11), margins, and formatting. Upload directly to KDP.",
  },
  {
    q: "What's the difference between free and paid?",
    a: "Free includes watermark and limited exercise types. Pro/Lifetime removes the watermark, unlocks all 9 exercise types, and allows unlimited generation.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Cancel anytime from your account. You keep access until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe. Payments are secure and encrypted.",
  },
];

function SuccessBanner() {
  return (
    <div className="mb-8 rounded-lg border border-green-300 bg-green-50 p-4 text-center text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
      Payment successful! Thank you for your purchase.
    </div>
  );
}

function CanceledBanner() {
  return (
    <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
      Payment canceled. No charges were made.
    </div>
  );
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const success = params.success === "true";
  const canceled = params.canceled === "true";
  const stripeReady = isStripeConfigured();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          Start free. Upgrade when you need more.
        </p>
      </header>

      {success && <SuccessBanner />}
      {canceled && <CanceledBanner />}

      {/* Plans */}
      <div className="mb-20 grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-xl border p-6 ${
              plan.highlight
                ? "border-[var(--primary)] shadow-lg"
                : "border-[var(--border)]"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-0.5 text-xs font-semibold text-[var(--primary-foreground)]">
                Most Popular
              </span>
            )}
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">{plan.price}</span>
              <span className="text-sm text-[var(--muted-foreground)]">
                {plan.period}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {plan.description}
            </p>
            <ul className="mt-6 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-green-600">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            {plan.name === "Free" ? (
              <Link
                href="/#categories"
                className="mt-6 block rounded-lg border border-[var(--border)] py-2.5 text-center text-sm font-semibold transition-opacity hover:bg-[var(--accent)] hover:opacity-90"
              >
                {plan.cta}
              </Link>
            ) : stripeReady ? (
              <CheckoutButton
                plan={plan.name === "Pro" ? "pro" : "lifetime"}
                className={`mt-6 block cursor-pointer rounded-lg py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
                  plan.highlight
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)] hover:bg-[var(--accent)]"
                }`}
              >
                {plan.cta}
              </CheckoutButton>
            ) : (
              <span
                className={`mt-6 block cursor-not-allowed rounded-lg py-2.5 text-center text-sm font-semibold opacity-50 ${
                  plan.highlight
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)]"
                }`}
              >
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Competitor comparison */}
      <section className="mb-20">
        <h2 className="mb-6 text-center text-2xl font-bold">
          How We Compare
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-3 text-left font-semibold">Feature</th>
                <th className="pb-3 text-center font-semibold">BookForge</th>
                <th className="pb-3 text-center font-semibold text-[var(--muted-foreground)]">
                  BookBolt
                </th>
                <th className="pb-3 text-center font-semibold text-[var(--muted-foreground)]">
                  BookAutoAI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                ["AI exercise generation", "✅", "❌", "❌"],
                ["Educational structure (CEFR)", "✅", "❌", "❌"],
                ["9 exercise types", "✅", "❌", "❌"],
                ["KDP-ready PDF", "✅", "✅", "✅"],
                ["Free tier", "✅", "❌", "❌"],
                ["Price", "Free / $19/mo", "$19.99/mo", "$35-100/mo"],
              ].map(([feature, bf, bb, ba]) => (
                <tr key={feature}>
                  <td className="py-2.5">{feature}</td>
                  <td className="py-2.5 text-center font-medium">{bf}</td>
                  <td className="py-2.5 text-center text-[var(--muted-foreground)]">
                    {bb}
                  </td>
                  <td className="py-2.5 text-center text-[var(--muted-foreground)]">
                    {ba}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-lg border border-[var(--border)] px-5 py-4"
            >
              <summary className="cursor-pointer font-medium">
                {q}
              </summary>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold">Start Creating Workbooks Today</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">
          No signup, no credit card. Just pick a category and go.
        </p>
        <Link
          href="/#categories"
          className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          Generate Your First Workbook — Free
        </Link>
      </section>
    </main>
  );
}
