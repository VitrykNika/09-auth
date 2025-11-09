import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-app.vercel.app";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Params = Promise<{ id: string }>;

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const short = (note.content ?? "").trim();
    const description =
      short.length > 0 ? (short.length > 160 ? `${short.slice(0, 157)}…` : short)
                       : "Перегляд детальної інформації про нотатку в NoteHub.";
    const url = `${SITE_URL}/notes/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [{ url: OG_IMAGE }],
        siteName: "NoteHub",
        type: "article",
      },
      alternates: { canonical: url },
    };
  } catch {
    // Фолбек, якщо нотатку не знайдено/помилка
    const title = `Note details | NoteHub`;
    const description = "Перегляд нотатки в NoteHub.";
    const url = `${SITE_URL}/notes/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [{ url: OG_IMAGE }],
        siteName: "NoteHub",
        type: "article",
      },
      alternates: { canonical: url },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}