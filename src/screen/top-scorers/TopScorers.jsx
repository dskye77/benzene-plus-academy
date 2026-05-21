"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, Trophy } from "lucide-react";
import useScorersStore from "@/store/useScorers";
import ScorerDisplay from "@/components/ScorerDisplay";

const EXAMS = ["All", "JAMB", "WAEC", "NECO", "Post-UTME"];
const MOCK_YEARS = [2026, 2025, 2024, 2023];

export default function TopScorers() {
  const [q, setQ] = useState("");
  const [exam, setExam] = useState("All");
  const [selectedYear, setSelectedYear] = useState(MOCK_YEARS[0]);

  const { scorers, loading, setYear, fetchPage } = useScorersStore();

  useEffect(() => {
    if (selectedYear != null) {
      setYear(selectedYear);
      fetchPage(1, true);
    }
  }, [selectedYear, setYear, fetchPage]);

  // Count scorers per year from the already-fetched list
  // (the store holds one year at a time; show count for current year only)
  const yearCount = useMemo(() => {
    const counts = {};
    MOCK_YEARS.forEach((yr) => {
      counts[yr] = scorers.filter((s) => String(s.year) === String(yr)).length;
    });
    return counts;
  }, [scorers]);

  const filtered = useMemo(() => {
    return scorers
      .filter((s) => String(s.year) === String(selectedYear))
      .filter(
        (s) =>
          (exam === "All" || s.exam === exam) &&
          s.name.toLowerCase().includes(q.toLowerCase()),
      );
  }, [scorers, selectedYear, exam, q]);

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
            <span className="font-bold text-accent">
              {filtered.length} student{filtered.length !== 1 ? "s" : ""}
            </span>{" "}
            found for {selectedYear || "all years"}. Search the full roll below.
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

        {/* Year tabs */}
        <div className="flex flex-wrap gap-2 mt-5">
          {MOCK_YEARS.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                selectedYear === yr
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted border-border hover:bg-primary/10"
              }`}
            >
              {yr}
              {selectedYear === yr && (
                <span className="ml-2 text-xs font-medium text-primary-foreground/80">
                  {yearCount[yr]}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        {loading ? (
          <p className="text-center py-20 text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            No scorers match your filters.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((s) => (
              <ScorerDisplay key={`${s.id || s.name}-${s.year}`} scorer={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
