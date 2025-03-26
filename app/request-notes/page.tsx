import RequestNotesComponent from "./components/RequestNotesComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/request-notes",
    languages: {
      "en-US": "/en-US",
    },
  },

  title: "Request Notes | UniNotes",
  description:
    "Need specific notes? Request them here! Provide your university, degree, year, semester, and subject to help us fulfill your notes request at UniNotes.",

  keywords: [
    "request notes",
    "UniNotes",
    "submit notes request",
    "medicaps university",
    "b.tech notes",
    "engineering notes",
    "semester-wise notes",
    "online study resources",
    "study tools",
    "notes on demand",
  ],

  robots: "index, follow",

  openGraph: {
    title: "Request Notes | UniNotes",
    description:
      "Missing any notes or resources? Fill out this form with your university details and course info, and we'll work on providing the notes you need.",
    url: `${process.env.NEXTAUTH_URL}/request-notes`,
    type: "website",
    siteName: "UniNotes",
    images: [
      {
        url: "/OG/opengraph-request.png",
        width: 1200,
        height: 630,
        alt: "Request Notes Page at UniNotes",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "UniNotes.in",
    creator: "sohandsouza03",
    title: "Request Notes | UniNotes",
    description:
      "Use our notes request form to specify university, degree, year, semester, and subject. We'll strive to provide exactly what you need!",
  },
};

export default function page() {
  return (
    <>
      <RequestNotesComponent />
    </>
  );
}
