import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

import type { Metadata } from "next";
import { IMG_URL, SITE_URL } from "@/lib/constants";
import { fetchNotes } from "@/lib/api/serverApi";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: { page?: string };
};
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0] === "all" ? undefined : slug[0];
  const title = category ?? "All notes";

  return {
    title,
    description: `Explore the best notes in the "${category ?? "all"}" category on NoteHub.`,
    openGraph: {
      title,
      description: `Explore the best notes in the "${category ?? "all"}" category on NoteHub.`,
      url: `${SITE_URL}/notes/filter/${slug[0]}`,
      siteName: "NoteHub",
      images: [
        {
          url: IMG_URL,
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotePage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  const category = slug[0] === "all" ? undefined : slug[0];
  const page = Number(searchParams.page ?? "1");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", tag: category, page }],
    queryFn: () => fetchNotes("", page, category),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} />
    </HydrationBoundary>
  );
}