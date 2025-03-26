import NotesPageComponent from "./components/NotesPageComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/notes",
    languages: {
      "en-US": "/en-US",
    },
  },

  title: "Notes | UniNotes",
  description:
    "Explore our comprehensive collection of notes for multiple subjects, semesters, and years. From B.Tech to engineering courses, find the study resources you need in one place with UniNotes!",

  keywords: [
    "UniNotes",
    "notes",
    "b.tech notes",
    "engineering notes",
    "medicaps university",
    "semester-wise notes",
    "flashcards",
    "PYQs",
    "exam preparation",
    "study resources",
    "online learning",
  ],

  robots: "index, follow",

  openGraph: {
    title: "Notes | UniNotes",
    description:
      "Access a wide range of notes curated by semesters and subjects. Simplify your studies with UniNotes’s user-friendly resources.",
    url: `${process.env.NEXTAUTH_URL}/notes`,
    type: "website",
    siteName: "UniNotes",
    images: [
      {
        url: "/OG/opengraph-notes.png",
        width: 1200,
        height: 630,
        alt: "All Notes on UniNotes",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "UniNotes.in",
    creator: "sohandsouza03",
    title: "Notes | UniNotes",
    description:
      "Browse semester-wise notes for various subjects. Prepare smarter and faster with our in-depth study materials at UniNotes.",
  },
};

export default function page() {
  return (
    <>
      <NotesPageComponent />
    </>
  );
}
