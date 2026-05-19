import ContactPage from "@/screen/contact/Contact";
export const metadata = {
  title: "Contact Us | Benzene Plus Academy",

  description:
    "Contact Benzene Plus Academy for JAMB, WAEC, NECO and Post-UTME coaching enquiries. Reach us via phone, WhatsApp, email or visit our Ibadan campus.",

  keywords: [
    "contact Benzene Plus Academy",
    "JAMB tutorial Ibadan",
    "WAEC lesson center",
    "NECO coaching",
    "Post UTME tutorial",
    "tutorial academy Ibadan",
    "JAMB coaching Nigeria",
    "WAEC tutorial center",
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
    canonical: "/contact",
  },

  openGraph: {
    title: "Contact Us | Benzene Plus Academy",

    description:
      "Speak with the admissions team at Benzene Plus Academy about registration, schedules and tutorial programs.",

    url: "https://benzeneplusacademy.com/contact",

    siteName: "Benzene Plus Academy",

    locale: "en_NG",

    type: "website",

    images: [
      {
        url: "/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Benzene Plus Academy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Contact Us | Benzene Plus Academy",

    description:
      "Reach Benzene Plus Academy by WhatsApp, phone, email or visit our campus.",

    images: ["/og-contact.jpg"],
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

export default function Page() {
  return <ContactPage />;
}