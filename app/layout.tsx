import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookForge — AI Workbook Generator",
  description:
    "Generate print-ready educational workbooks for Amazon KDP in minutes. 12 categories: English, Math, Science, Languages, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
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
