import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookforge-iota.vercel.app"),
  title: {
    default:
      "Free AI Worksheet & Workbook Generator — Math, English, Science PDF | BookForge",
    template: "%s | BookForge",
  },
  description:
    "Free AI-powered worksheet generator. Create printable PDF workbooks in seconds — Math, English Grammar, Spanish, Science, Kids Activities, SAT Prep & more. KDP-ready.",
  keywords: [
    "AI worksheet generator",
    "AI workbook generator",
    "workbook creator online",
    "PDF worksheet generator",
    "KDP workbook generator",
    "KDP workbook creator",
    "free worksheet maker",
    "printable worksheets PDF",
    "math worksheet generator",
    "English grammar worksheets",
    "ESL worksheet creator",
    "ESL workbook generator",
    "CEFR workbook maker",
    "English workbook maker KDP",
    "grammar workbook creator online",
    "create English learning book KDP",
  ],
  openGraph: {
    title: "BookForge — Free AI Worksheet & Workbook Generator",
    description:
      "Create printable PDF workbooks in seconds. 12 categories: Math, English, Science, Spanish, Kids, SAT Prep & more.",
    type: "website",
    url: "https://bookforge-iota.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookForge — Free AI Worksheet & Workbook Generator",
    description:
      "Create printable PDF workbooks in seconds. Math, English, Science, Spanish, Kids, SAT Prep & more.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "BookForge",
      url: "https://bookforge-iota.vercel.app",
      description:
        "Free AI-powered worksheet generator. Create printable PDF workbooks for Math, English, Science, and more.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://bookforge-iota.vercel.app/c/{search_term}",
        "query-input": "required name=search_term",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "BookForge",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: "https://bookforge-iota.vercel.app",
      description:
        "AI-powered educational workbook generator. Create KDP-ready PDF workbooks with structured exercises.",
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          name: "Free",
          description: "1 book/month, 3 exercise types, watermark",
        },
        {
          "@type": "Offer",
          price: "19",
          priceCurrency: "USD",
          name: "Pro",
          description: "Unlimited books, all exercise types, no watermark",
        },
        {
          "@type": "Offer",
          price: "99",
          priceCurrency: "USD",
          name: "Lifetime",
          description: "Pay once, everything in Pro forever",
        },
      ],
      featureList: [
        "AI-powered exercise generation",
        "12 subject categories",
        "9 exercise types",
        "KDP-ready PDF export",
        "CEFR difficulty levels",
        "Answer key generation",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--muted-foreground)]">
          <p>
            Powered by{" "}
            <a
              href="https://superduperai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              SuperDuperAI
            </a>
            {" · "}
            <a
              href="https://github.com/fortunto2/bookforge"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              GitHub
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
