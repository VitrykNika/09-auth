import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://08-zustand-two-livid.vercel.app/";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Params = Promise<{ slug: string[] }>;

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { slug } = await params;
  const tagParam = slug?.[0];
  const effectiveTag =
    !tagParam || tagParam.toLowerCase() === "all" ? "All" : tagParam;

  const title = `Notes — Filter: ${effectiveTag} | NoteHub`;
  const description = `Перегляд нотаток із фільтром за тегом: ${effectiveTag}. Зручно шукайте та упорядковуйте нотатки в NoteHub.`;
  const url =
    effectiveTag.toLowerCase() === "all"
      ? `${SITE_URL}/notes/filter/all`
      : `${SITE_URL}/notes/filter/${encodeURIComponent(effectiveTag)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: OG_IMAGE }],
      siteName: "NoteHub",
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export default async function FilteredNotesPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const tagParam = slug?.[0]; 
  const effectiveTag =
    !tagParam || tagParam.toLowerCase() === "all" ? undefined : tagParam;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", "", 1, { tag: effectiveTag }],
    queryFn: () => fetchNotes({ search: "", page: 1, tag: effectiveTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
       <NotesClient key={effectiveTag ?? "all"} initialTag={effectiveTag ?? ""} />
    </HydrationBoundary>
  );
}