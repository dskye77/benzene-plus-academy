/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(scorer.id, scorer.imagePublicId);
      toast.success("Scorer deleted");
      setShowDelete(false); // close modal after success
    } catch (err) {
      toast.error(err.message || "Failed to delete scorer");
    } finally {
      setDeleting(false);
    }
  }

  const initials = scorer.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="group rounded-2xl border p-0 flex flex-col items-center relative bg-card shadow-lg overflow-hidden">
      {/* IMAGE */}
      <div className="w-full h-[220px] relative bg-gray-100">
        {scorer.image ? (
          <Image
            src={scorer.image}
            alt={scorer.name}
            fill
            className="object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
            {initials}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center w-full p-5">
        <h3 className="font-bold text-lg">{scorer.name}</h3>
        <span className="mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {scorer.exam}
        </span>
        <p className="mt-3 text-3xl font-bold">{scorer.score}</p>
      </div>

      {/* ACTIONS */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-1">
        <button
          className="p-2 rounded-lg bg-white/80"
          onClick={() => onEdit(scorer)}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          className="p-2 rounded-lg bg-white/80 text-red-500"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl p-5 border">
            <h3 className="font-bold text-lg">Delete Scorer?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 h-10 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* ─── EDIT MODAL ──────────────────────────────────────────────────────────── */

function EditModal({ scorer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: scorer.name || "",
    exam: scorer.exam || "",
    score: String(scorer.score || ""),
    year: String(scorer.year || ""),
    note: scorer.note || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/scorers/${scorer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          exam: form.exam,
          score: Number(form.score),
          year: Number(form.year),
          note: form.note,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      toast.success("Scorer updated");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-elevated p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">Edit Scorer</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1.5 w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Exam</label>
            <input
              name="exam"
              value={form.exam}
              onChange={handleChange}
              required
              placeholder="JAMB, WAEC…"
              className="mt-1.5 w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">Score</label>
              <input
                name="score"
                type="number"
                value={form.score}
                onChange={handleChange}
                required
                className="mt-1.5 w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Year</label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                className="mt-1.5 w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold">Note (optional)</label>
            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. 9 A1s"
              className="mt-1.5 w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border text-sm font-medium hover:bg-secondary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
