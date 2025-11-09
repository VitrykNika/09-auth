import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css"; 

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://08-zustand-two-livid.vercel.app/";
const OG_IMAGE =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description:
    "Створіть нову нотатку в NoteHub: назва, вміст і тег у простій формі.",
  openGraph: {
    title: "Create note | NoteHub",
    description:
      "Сторінка створення нової нотатки у застосунку NoteHub.",
    url: `${SITE_URL}/notes/action/create`,
    images: [{ url: OG_IMAGE }],
    siteName: "NoteHub",
    type: "website",
  },
  alternates: { canonical: "/notes/action/create" },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}