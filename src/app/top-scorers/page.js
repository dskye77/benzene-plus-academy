import TopScorers from "@/screen/top-scorers/TopScorers";
export const metadata = {
  title: "Top Scorers — Benzene Plus Academy",
  description:
    "Meet the JAMB, WAEC, NECO and Post-UTME top scorers from Benzene Plus Academy.",

  openGraph: {
    title: "Top Scorers — Benzene Plus Academy",
    description:
      "Meet the JAMB, WAEC, NECO and Post-UTME top scorers from Benzene Plus Academy.",
    type: "website",
    url: "https://benzeneplusacademy.com/top-scorers",
  },
};
export default function Page() {
  return <TopScorers />;
}
