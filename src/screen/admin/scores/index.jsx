/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import useDashboardStore from "@/store/useDashboard";

const SORT_OPTIONS = [
  {
    value: "score-desc",
    label: "Score (High to Low)",
  },
  {
    value: "score-asc",
    label: "Score (Low to High)",
  },
  {
    value: "name-asc",
    label: "Name (A–Z)",
  },
  {
    value: "name-desc",
    label: "Name (Z–A)",
  },
  {
    value: "exam-asc",
    label: "Exam (A–Z)",
  },
  {
    value: "exam-desc",
    label: "Exam (Z–A)",
  },
];

export default function ManageScores() {
  const { scorers, loading, error, fetchScorers, deleteScorer } =
    useDashboardStore();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("score-desc");
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchScorers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!error) return;

    toast.error(error.message || "Failed to fetch scorers");
  }, [error]);

  const groupedScorers = useMemo(() => {
    let filtered = Array.isArray(scorers)
      ? scorers.filter((s) => {
          const query = q.toLowerCase();

          return (
            (s.name || "").toLowerCase().includes(query) ||
            (s.exam || "").toLowerCase().includes(query) ||
            String(s.year).includes(query) ||
            String(s.score).includes(query)
          );
        })
      : [];

    filtered.sort((a, b) => {
      switch (sort) {
        case "score-desc":
          return b.score - a.score;

        case "score-asc":
          return a.score - b.score;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        case "exam-asc":
          return a.exam.localeCompare(b.exam);

        case "exam-desc":
          return b.exam.localeCompare(a.exam);

        default:
          return 0;
      }
    });

    const grouped = {};

    filtered.forEach((s) => {
      if (!grouped[s.year]) {
        grouped[s.year] = [];
      }

      grouped[s.year].push(s);
    });

    const years = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a);

    return {
      years,
      entries: grouped,
    };
  }, [scorers, q, sort]);

  useEffect(() => {
    if (groupedScorers.years.length === 0) {
      return;
    }

    if (selectedYear !== null && !groupedScorers.years.includes(selectedYear)) {
      setSelectedYear(null);
    }
  }, [groupedScorers.years, selectedYear]);

  const activeYearData =
    selectedYear !== null ? groupedScorers.entries[selectedYear] : null;

  return (
    <div className="space-y-6">
      <PageHeader />

      <Filters q={q} setQ={setQ} sort={sort} setSort={setSort} />

      <YearFilters
        years={groupedScorers.years}
        entries={groupedScorers.entries}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <ScoresContent
        loading={loading}
        groupedScorers={groupedScorers}
        selectedYear={selectedYear}
        activeYearData={activeYearData}
        deleteScorer={deleteScorer}
      />
    </div>
  );
}

/* ----------------------------- HEADER ----------------------------- */

function PageHeader() {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 className="text-2xl font-bold">Top Scorers</h2>

        <p className="text-sm text-muted-foreground">
          Add, edit and remove published scorers.
        </p>
      </div>

      <Link
        href="/admin/scores/add"
        className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add scorer
      </Link>
    </div>
  );
}

/* ----------------------------- FILTERS ----------------------------- */

function Filters({ q, setQ, sort, setSort }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <input
          type="search"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full h-11 rounded-xl border pl-10 pr-3 text-sm"
        />
      </div>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="h-11 px-3 rounded-xl border text-sm"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* --------------------------- YEAR FILTERS -------------------------- */

function YearFilters({ years, entries, selectedYear, setSelectedYear }) {
  if (years.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedYear(null)}
        className={`px-4 py-1.5 rounded-full text-sm border transition ${
          selectedYear === null
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-primary/10"
        }`}
      >
        All years
      </button>

      {years.map((year) => (
        <button
          key={year}
          onClick={() => setSelectedYear(year)}
          className={`px-4 py-1.5 rounded-full text-sm border transition ${
            selectedYear === year
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-primary/10"
          }`}
        >
          {year}

          <span
            className={`ml-2 text-xs font-medium ${
              selectedYear === year
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            }`}
          >
            {entries[year].length}
          </span>
        </button>
      ))}
    </div>
  );
}

/* --------------------------- MAIN CONTENT -------------------------- */

function ScoresContent({
  loading,
  groupedScorers,
  selectedYear,
  activeYearData,
  deleteScorer,
}) {
  if (loading) {
    return (
      <p className="text-center text-muted-foreground py-10">Loading...</p>
    );
  }

  if (groupedScorers.years.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No scorers found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {selectedYear ? (
        <YearSection
          year={selectedYear}
          data={activeYearData || []}
          onDelete={deleteScorer}
        />
      ) : (
        groupedScorers.years.map((year) => (
          <YearSection
            key={year}
            year={year}
            data={groupedScorers.entries[year]}
            onDelete={deleteScorer}
          />
        ))
      )}
    </div>
  );
}

/* --------------------------- YEAR SECTION -------------------------- */

function YearSection({ year, data, onDelete }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg font-bold">{year}</span>

        <span className="text-xs text-muted-foreground">
          {data.length} scorer
          {data.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data.map((s) => (
          <ScorerCard
            key={s.id || `${s.name}-${s.exam}-${s.year}`}
            scorer={s}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- SCORE CARD --------------------------- */

function ScorerCard({ scorer, onDelete }) {
  async function handleDelete() {
    try {
      await onDelete(scorer.id, scorer.imagePublicId);

      toast.success("Scorer deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete scorer");
    }
  }

  return (
    <div className="group rounded-2xl border p-0 flex flex-col items-center relative bg-card shadow-lg overflow-hidden">
      <div className="w-full flex justify-center bg-gray-100">
        <Image
          src={scorer.image || "/def_person.jpg"}
          alt={scorer.name}
          width={220}
          height={220}
          className="rounded-t-2xl object-cover w-full h-[220px]"
        />
      </div>

      <div className="flex flex-col items-center w-full p-5">
        <h3 className="font-bold text-lg text-center mt-3">{scorer.name}</h3>

        <span className="mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {scorer.exam}
        </span>

        <p className="mt-3 text-3xl font-bold">{scorer.score}</p>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button className="p-2 rounded-lg hover:bg-muted">
          <Pencil className="h-4 w-4" />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-red-100 text-red-500"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
