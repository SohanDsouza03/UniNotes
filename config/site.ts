export const siteConfig = {
  name: "UniNotes",
  url: "https://UniNotes.in",
  description:
    "UniNotes is your one stop solution for Notes, PYQ's, FlashCards, Quiz and More!",
  author: "sohandsouza03",
  links: {
    twitter: "https://twitter.com/sohandsouza03",
    github: "https://github.com/sohandsouza03",
    personalSite: "https://ramx.in",
  },
  notes: [
    {
      title: "View All Notes",
      href: "/notes",
      description: "Click here to view all notes.",
    },
    {
      title: "B.Tech First Year Notes",
      href: "/tags/1st-Year",
      description: "Click here to view notes for the first Year.",
    },
    {
      title: "B.Tech Second Year Notes",
      href: "/tags/2nd-Year",
      description: "Click here to view notes for the second Year.",
    },
    {
      title: "B.Tech Third Year Notes",
      href: "/tags/3rd-Year",
      description: "Click here to view notes for the third Year.",
    },
    // {
    //   title: "B.Tech Fourth Year Notes",
    //   href: "/tags/4th-Year",
    //   description: "Click here to view notes for the fourth Year.",
    // },
  ],
};

export type SiteConfig = typeof siteConfig;
