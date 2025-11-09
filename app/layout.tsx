
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://08-zustand-two-livid.vercel.app/";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NoteHub — Simple notes manager",
  description:
    "NoteHub — простий та ефективний застосунок для створення, перегляду та фільтрації нотаток. Підтримує пошук, теги, SSR/CSR та модальні перегляди.",
  openGraph: {
    title: "NoteHub — Simple notes manager",
    description:
      "Керуйте нотатками зручно: пошук, теги, попередній перегляд у модалці, SSR/CSR.",
    url: SITE_URL,
    images: [{ url: OG_IMAGE }],
    siteName: "NoteHub",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children, modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable}`}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}