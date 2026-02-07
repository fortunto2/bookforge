import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/categories";
import CategoryGenerator from "./generator";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return <CategoryGenerator category={category} />;
}
