/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ScorerDisplay from "@/components/ScorerDisplay";
import { Plus, Pencil, Trash2, Search, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { YEARS } from "@/lib/data";

import useDashboardStore from "@/store/useDashboard";

const SORT_OPTIONS = [
  { value: "score-desc", label: "Score (High to Low)" },
  { value: "score-asc", label: "Score (Low to High)" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "exam-asc", label: "Exam (A–Z)" },
  { value: "exam-desc", label: "Exam (Z–A)" },
];

export default function ManageScores() {
  const { scorers, loading, error, fetchScorers, deleteScorer } =
    useDashboardStore();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("score-desc");
  const [selectedYear, setSelectedYear] = useState(null);
  const [editingScorer, setEditingScorer] = useState(null);

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
      if (!grouped[s.year]) grouped[s.year] = [];
      grouped[s.year].push(s);
    });

    const years = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a);
    return { years, entries: grouped };
  }, [scorers, q, sort]);

  useEffect(() => {
    if (groupedScorers.years.length === 0) return;
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
        onEdit={setEditingScorer}
      />

      {editingScorer && (
        <EditModal
          scorer={editingScorer}
          onClose={() => setEditingScorer(null)}
          onSaved={() => {
            setEditingScorer(null);
            fetchScorers();
          }}
        />
      )}
    </div>
  );
}

/* ─── PAGE HEADER ─────────────────────────────────────────────────────────── */

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

/* ─── FILTERS ─────────────────────────────────────────────────────────────── */

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

/* ─── YEAR FILTERS ────────────────────────────────────────────────────────── */

function YearFilters({ years, entries, selectedYear, setSelectedYear }) {
  if (years.length === 0) return null;
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

/* ─── MAIN CONTENT ────────────────────────────────────────────────────────── */

function ScoresContent({
  loading,
  groupedScorers,
  selectedYear,
  activeYearData,
  deleteScorer,
  onEdit,
}) {
  if (loading) {
    return <p className="text-center text-muted-foreground py-10">Loading…</p>;
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
          onEdit={onEdit}
        />
      ) : (
        groupedScorers.years.map((year) => (
          <YearSection
            key={year}
            year={year}
            data={groupedScorers.entries[year]}
            onDelete={deleteScorer}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
}

/* ─── YEAR SECTION ────────────────────────────────────────────────────────── */

function YearSection({ year, data, onDelete, onEdit }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg font-bold">{year}</span>
        <span className="text-xs text-muted-foreground">
          {data.length} scorer{data.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data.map((s) => (
          <ScorerCard
            key={s.id || `${s.name}-${s.exam}-${s.year}`}
            scorer={s}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── SCORER CARD ─────────────────────────────────────────────────────────── */

function ScorerCard({ scorer, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const note = scorer.note?.trim();

  async function handleDelete() {
    setDeleting(true);

    try {
      await onDelete(scorer.id, scorer.imagePublicId);
      toast.success("Scorer deleted");
      setShowDelete(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete scorer",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="group relative isolate overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
        <div className="relative">
          <ScorerDisplay scorer={scorer} />
        </div>

        <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(scorer)}
            aria-label="Edit scorer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border bg-background/80 shadow-sm backdrop-blur-md transition hover:scale-105 hover:bg-background"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowDelete(true)}
            aria-label="Delete scorer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-background/80 text-red-500 shadow-sm backdrop-blur-md transition hover:scale-105 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setShowDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">Delete scorer?</h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                disabled={deleting}
                className="h-11 flex-1 rounded-2xl border transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-11 flex-1 rounded-2xl bg-red-500 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
/* ─── EDIT MODAL ──────────────────────────────────────────────────────────── */

function EditModal({ scorer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: scorer.name || "",
    year: String(scorer.year || ""),
    score: String(scorer.score || ""),
    note: scorer.note || "",
  });

  // WAEC/NECO specific
  const [numDistinctions, setNumDistinctions] = useState(
    scorer.waecNecoSummary?.distinctions?.toString() || "",
  );
  const [numCredits, setNumCredits] = useState(
    scorer.waecNecoSummary?.credits?.toString() || "",
  );

  // Subject breakdown (for all types)
  const [subjects, setSubjects] = useState(scorer.subjectBreakdown || []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isWaecOrNeco = scorer.exam === "WAEC" || scorer.exam === "NECO";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        score: Number(form.score),
        year: Number(form.year),
        note: form.note.trim() || undefined,
      };

      // Add WAEC/NECO summary if applicable
      if (isWaecOrNeco) {
        payload.waecNecoSummary = {
          distinctions: Number(numDistinctions) || 0,
          credits: Number(numCredits) || 0,
        };
      }

      // Add subject breakdown if exists
      if (subjects.length > 0) {
        payload.subjectBreakdown = subjects
          .filter((s) => s.subject && (s.score || s.grade))
          .map((s) => ({
            subject: s.subject,
            ...(s.score ? { score: Number(s.score) } : {}),
            ...(s.grade ? { grade: s.grade } : {}),
          }));
      }

      const res = await fetch(`/api/admin/scorers/${scorer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update");
      }

      toast.success("Scorer updated successfully");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-card rounded-2xl border shadow-elevated p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">Edit Scorer</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exam Type (Locked) */}
          <div>
            <label className="text-xs font-semibold">Exam Type</label>
            <div className="mt-1.5 px-4 py-3 bg-muted rounded-xl text-sm font-medium">
              {scorer.exam} • {scorer.year}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Exam type cannot be changed after creation
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold">Full Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="mt-1.5 w-full h-11 rounded-xl border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Year</label>
              <select
                value={form.year}
                onChange={(e) =>
                  setForm((p) => ({ ...p, year: e.target.value }))
                }
                required
                className="mt-1.5 w-full h-11 rounded-xl border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
              >
                <option value="">Select year</option>
                {YEARS?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Score / Distinctions Section */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-4">{scorer.exam} Results</h3>

            {isWaecOrNeco ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold">
                    Number of Distinctions (A1-B3)
                  </label>
                  <input
                    type="number"
                    value={numDistinctions}
                    onChange={(e) => setNumDistinctions(e.target.value)}
                    className="mt-2 w-full h-11 rounded-xl border px-4 text-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">
                    Number of Credits (C4-C6)
                  </label>
                  <input
                    type="number"
                    value={numCredits}
                    onChange={(e) => setNumCredits(e.target.value)}
                    className="mt-2 w-full h-11 rounded-xl border px-4 text-lg font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold">
                  {scorer.exam === "JAMB" ? "Total JAMB Score" : "Score"}
                </label>
                <input
                  type="number"
                  value={form.score}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, score: e.target.value }))
                  }
                  required
                  className="mt-2 w-full h-11 rounded-xl border px-4 text-lg font-semibold"
                />
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-semibold">Additional Note</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="e.g. Outstanding performance, Best in Chemistry..."
              rows={3}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-sm resize-y min-h-[80px]"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border text-sm font-medium hover:bg-secondary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
