import About from "@/screen/about/About";

export const metadata = {
  title: "About — Benzene Plus Academy",

  description:
    "Learn the story, mission and tutors behind Benzene Plus Academy — Nigeria's trusted JAMB & WAEC prep academy.",

  keywords: ["JAMB", "WAEC", "tutorial academy", "Nigeria"],

  openGraph: {
    title: "About Benzene Plus Academy",
    description: "Nigeria's trusted JAMB & WAEC prep academy.",
    url: "https://benzeneplusacademy.com/about",
    siteName: "Benzene Plus Academy",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Benzene Plus Academy",
    description: "Nigeria's trusted JAMB & WAEC prep academy.",
  },
};
export default function Page() {
  return <About />;
}
