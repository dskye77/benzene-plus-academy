import Blog from "@/screen/blog/Blog";

export const metadata = {
  title: "Blog & Announcements | Benzene Plus Academy",

  description:
    "Get the latest JAMB updates, WAEC news, NECO registration deadlines, CBT tips, study strategies and announcements from Benzene Plus Academy.",

  keywords: [
    "JAMB updates",
    "WAEC news",
    "NECO updates",
    "Post UTME tips",
    "CBT exam tips",
    "JAMB registration",
    "study tips Nigeria",
    "Benzene Plus Academy",
    "tutorial academy blog",
  ],

  authors: [
    {
      name: "Benzene Plus Academy",
    },
  ],

  creator: "Benzene Plus Academy",

  publisher: "Benzene Plus Academy",

  metadataBase: new URL("https://benzeneplusacademy.com"),

  alternates: {
    canonical: "/blog",
  },

  openGraph: {
    title: "Blog & Announcements | Benzene Plus Academy",

    description:
      "JAMB updates, WAEC news, study tips and academy announcements for Nigerian students.",

    url: "https://benzeneplusacademy.com/blog",

    siteName: "Benzene Plus Academy",

    locale: "en_NG",

    type: "website",

    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Benzene Plus Academy Blog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Blog & Announcements | Benzene Plus Academy",

    description:
      "Latest JAMB, WAEC and NECO updates plus study tips for Nigerian students.",

    images: ["/og-blog.jpg"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
export default function page() {
  return <Blog />;
}
