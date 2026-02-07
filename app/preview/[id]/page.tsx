import { notFound } from "next/navigation";
import { getBook } from "@/lib/storage";
import PreviewContent from "./content";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stored = await getBook(id);
  if (!stored) notFound();

  const book = { config: stored.config, sections: stored.sections };
  return <PreviewContent book={book} title={stored.config.title} />;
}
