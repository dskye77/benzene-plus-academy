import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import RootLayoutShell from "@/components/layout/RootLayoutShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Benzene Plus Academy — JAMB & WAEC Tutorial Centre in Nigeria",
  description:
    "Pass JAMB, WAEC, NECO & Post-UTME with confidence at Benzene Plus Academy. Trusted by 4,200+ families with 312+ top scorers and a 96% pass rate.",
  keywords: [
    "Benzene Plus Academy",
    "JAMB tutorial centre",
    "WAEC coaching Nigeria",
    "Post UTME classes",
    "NECO tutorial",
    "CBT training",
    "JAMB lessons",
    "WAEC preparation",
    "tutorial academy Nigeria",
    "best JAMB tutorial centre",
  ],
  openGraph: {
    title: "Benzene Plus Academy — Pass JAMB & WAEC With Confidence",
    description:
      "Structured JAMB, WAEC, NECO & CBT preparation for Nigerian students. 312+ top scorers and a proven track record.",
    url: "https://benzeneplusacademy.com",
    siteName: "Benzene Plus Academy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Benzene Plus Academy students",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benzene Plus Academy",
    description:
      "Trusted JAMB & WAEC tutorial academy helping Nigerian students succeed.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootLayoutShell>{children}</RootLayoutShell>
      </body>
    </html>
  );
}
