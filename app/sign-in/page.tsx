import SignInComponent from "./SignInComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/sign-in",
    languages: {
      "en-US": "/en-US",
    },
  },

  title: "Sign In | UniNotes",
  description:
    "Access your personalized notes, flashcards, quizzes, and more by signing in to your UniNotes account. Join the smarter way to learn!",

  keywords: [
    "UniNotes",
    "sign in",
    "login",
    "b.tech notes",
    "engineering notes",
    "medicaps university",
    "study smarter",
    "online resources",
    "student portal",
  ],


  robots: "index, follow",

  openGraph: {
    title: "Sign In | UniNotes",
    description:
      "Log in to your UniNotes account to access your notes, flashcards, and more. Simplify your study routine!",
    url: `${process.env.NEXTAUTH_URL}/request-notes`,
    type: "website",
    siteName: "UniNotes",
    images: [
      {
        url: "/OG/opengraph-sign-in.png", 
        width: 1200,
        height: 630,
        alt: "Sign In to UniNotes",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "UniNotes.in",
    creator: "sohandsouza03",
    title: "Sign In | UniNotes",
    description:
      "Sign in to UniNotes for a personalized study experience. Manage your notes, quizzes, and flashcards in one place.",
  },
};

export default function page() {
  return (
    <>
      <SignInComponent />
    </>
  );
}
