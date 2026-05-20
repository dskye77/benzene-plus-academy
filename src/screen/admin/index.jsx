import {
  Trophy,
  FileText,
  Image as ImageIcon,
  TrendingUp,
} from "lucide-react";

const STATS = [
  {
    label: "Top scorers",
    value: "312",
    delta: "+47 in 2025",
    icon: Trophy,
    tint: "bg-accent/10 text-accent",
  },
  {
    label: "Blog posts",
    value: "48",
    delta: "4 drafts",
    icon: FileText,
    tint: "bg-primary/10 text-primary",
  },
  {
    label: "Gallery images",
    value: "186",
    delta: "+22 this month",
    icon: ImageIcon,
    tint: "bg-accent/10 text-accent",
  },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h2 className="text-2xl font-bold mt-1">
          Here&apos;s what&apos;s happening at Benzene Plus.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-card border border-border p-5"
          >
            <div className="flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${s.tint}`}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-4 text-3xl font-display font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-accent font-medium mt-2">{s.delta}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
