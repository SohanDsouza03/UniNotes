/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <hr className="opacity-100 dark:opacity-35" />
      <div className="mb-6 mt-14 flex justify-between items-center mx-6 md:mx-16 lg:mx-32 flex-col md:flex-row font-wotfard">
        <div className="opacity-50 hidden lg:block">
          &#169; UniNotes 2025
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out hidden lg:block"
            href="/"
          >
            Home
          </Link>
          <span className="opacity-40 hidden lg:block">|</span>

          <Link
            className="opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out hidden lg:block"
            href="/notes"
          >
            Notes
          </Link>
          <span className="opacity-40 hidden lg:block">|</span>
          <Link
            className="flex gap-2 hover:text-green-500 transition-colors duration-300 ease-in-out opacity-50"
            target="_blank"
            href="https://wa.me/+919448819406"
          >
            <svg
              className=""
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width={24}
              height={24}
              strokeWidth={2}
            >
              <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>{" "}
              <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>{" "}
            </svg>
            <span>Join Whatsapp Community</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 group">
          <img
            className="size-12 border border-gray-400 rounded-2xl hidden md:block group-hover:border-2"
            src="/sohan.jpg"
            alt=""
          />
          <p className="opacity-50 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <Link target="_blank" href="https://www.instagram.com/sohan.dsouza.0302/">
              Build with ❤️ <span className="group-hover:underline transition-all duration-300 ease-in-out">Sohan</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
