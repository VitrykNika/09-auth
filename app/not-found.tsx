import type { Metadata } from "next";
import css from "./page.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://08-zustand-two-livid.vercel.app/";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "404 — Page not found | NoteHub",
  description: "Такої сторінки не існує. Спробуйте перейти на головну або до нотаток.",
  openGraph: {
    title: "404 — Page not found | NoteHub",
    description: "Сторінку не знайдено. Поверніться на головну або відкрийте нотатки.",
    url: `${SITE_URL}/404`,
    images: [{ url: OG_IMAGE }],
    siteName: "NoteHub",
  },
  alternates: { canonical: "/404" },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}