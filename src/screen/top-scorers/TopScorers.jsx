"use client";
import { useMemo, useState } from "react";
import { Search, Trophy } from "lucide-react";
import { SCORERS } from "@/lib/site";

const EXAMS = ["All", "JAMB", "WAEC", "NECO", "Post-UTME"];

export default function TopScorers() {
  const [q, setQ] = useState("");
  const [exam, setExam] = useState("All");

  const filtered = useMemo(
    () =>
      SCORERS.filter(
        (s) =>
          (exam === "All" || s.exam === exam) &&
          s.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, exam],
  );

  return (
    <>
      <section className="relative gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-grid-fade opacity-25" />
        <div className="relative container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Hall of fame
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            Our top scorers — proof that the structure works.
          </h1>
          <p className="mt-5 max-w-2xl text-white/80 text-lg">
            <span className="font-bold text-accent">47 students</span> scored
            above 300 in JAMB 2025. Search the full roll below.
          </p>
        </div>
      </section>

      <section className="container-page -mt-10 relative z-10">
        <div className="rounded-2xl bg-card border border-border shadow-card p-5 md:p-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name…"
              className="w-full h-11 rounded-xl border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMS.map((e) => (
              <button
                key={e}
                onClick={() => setExam(e)}
                className={`h-9 px-3.5 rounded-full text-xs font-semibold border transition ${
                  exam === e
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-secondary"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        {filtered.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            No scorers match your filters.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((s) => (
              <div
                key={`${s.name}-${s.year}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all"
              >
                <div className="aspect-4/5 gradient-hero relative">
                  <div className="absolute inset-0 grid place-items-center text-6xl font-display font-bold text-white/85">
                    {s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold tracking-wider text-accent-foreground">
                    {s.exam}
                  </span>
                  <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
                    <Trophy className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold leading-snug">{s.name}</p>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-3xl font-display font-bold text-primary">
                      {s.score}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {s.year}
                    </span>
                  </div>
                  {s.note && (
                    <p className="mt-1 text-[11px] text-accent font-semibold">
                      {s.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
