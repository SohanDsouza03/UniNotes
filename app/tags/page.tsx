import { posts } from "#site/content";
import Link from "next/link";

const normalizeTag = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

export default function TagsPage() {
  const allTags = posts.reduce((acc, post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <h1 className="text-[2.3rem] lg:text-[4.5rem] md:text-[4rem] leading-[1] font-bold dark:bg-gradient-to-b dark:from-[rgba(244,244,255,1)] dark:to-[rgba(181,180,207,1)] dark:text-transparent dark:bg-clip-text py-2 text-center uppercase pb-6">
        All Tags
      </h1>
      <ul className="flex flex-wrap gap-2">
        {Object.entries(allTags).map(([tag, count]) => {
          const normalizedTag = normalizeTag(tag);
          return (
            <li
              key={normalizedTag}
              className="flex justify-center"
            >
              <Link href={`/tags/${normalizedTag}`}>
              <span className="inline-block px-3 py-1 text-sm rounded-lg cursor-pointer border text-center">
                {tag} ({count})
              </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
