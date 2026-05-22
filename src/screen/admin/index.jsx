import Link from "next/link";
import { Home, Trophy, FileText } from "lucide-react";

const CARDS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    tint: "bg-card text-primary",
  },
  {
    label: "Top Scorers",
    href: "/admin/top-scorers",
    icon: Trophy,
    tint: "bg-accent/10 text-accent",
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: FileText,
    tint: "bg-primary/10 text-primary",
  },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h2 className="text-2xl font-bold mt-1">
          Quick admin navigation
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-card border border-border p-6 flex items-center gap-4 transition-shadow hover:shadow-lg group"
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-xl text-2xl ${card.tint} group-hover:scale-105 transition-transform`}
            >
              <card.icon className="h-6 w-6" />
            </span>
            <span className="text-lg font-medium">{card.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
