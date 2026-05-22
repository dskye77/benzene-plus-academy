/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  Upload,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { YEARS } from "@/lib/data";
import {
  fetchScorers,
  addScorer,
  deleteScorer,
  updateScorer,
} from "@/lib/admin/scorers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Constants ────────────────────────────────────────────────────────────────
import {
  EXAM_TYPES,
  JAMB_SUBJECTS,
  WAEC_NECO_SUBJECTS,
  WAEC_GRADES,
  SORT_OPTIONS,
} from "@/lib/data";

// ─── Reusable Input UI Elements ───────────────────────────────────────────────────
function FieldLabel({ children, optional }) {
  return (
    <label className="block mb-1.5 text-xs font-semibold text-foreground">
      {children}
      {optional && (
        <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
          (optional)
        </span>
      )}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition ${className}`}
      {...props}
    />
  );
}

function SelectInput({ children, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-10 transition ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Dashboard Manage Page View ──────────────────────────────────────────────
export default function ManageScores() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("score-desc");
  const [selectedYear, setSelectedYear] = useState(null);
  const [editingScorer, setEditingScorer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fallback states for data table binding architecture
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerFetch = async () => {
    setLoading(true);
    try {
      const data = await fetchScorers();
      if (data) setScorers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerFetch();
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Top Scorers</h2>
          <p className="text-sm text-muted-foreground">
            Add, edit and remove published scorers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add scorer
        </button>
      </div>

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
        deleteScorer={async (id, publicId) => {
          await deleteScorer(id, publicId);
          triggerFetch();
        }}
        onEdit={setEditingScorer}
      />

      {showAddModal && (
        <AddModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            triggerFetch();
          }}
        />
      )}

      {editingScorer && (
        <EditModal
          open={!!editingScorer}
          scorer={editingScorer}
          onClose={() => setEditingScorer(null)}
          onSaved={() => {
            setEditingScorer(null);
            triggerFetch();
          }}
        />
      )}
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
        className="h-11 px-3 rounded-xl border text-sm bg-background"
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
  if (loading)
    return <p className="text-center text-muted-foreground py-10">Loading…</p>;
  if (groupedScorers.years.length === 0)
    return (
      <p className="text-center text-muted-foreground py-10">
        No scorers found.
      </p>
    );

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

/* ─── YEAR SECTION (TABLE FORMAT) ─────────────────────────────────────────── */
function YearSection({ year, data, onDelete, onEdit }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-lg font-bold">{year}</span>
        <span className="text-xs text-muted-foreground">
          {data.length} scorer{data.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Exam</th>
              <th className="p-4">Score / Summary</th>
              <th className="p-4">Additional Note</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((s) => (
              <ScorerTableRow
                key={s.id || `${s.name}-${s.exam}-${s.year}`}
                scorer={s}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── SCORER TABLE ROW ────────────────────────────────────────────────────── */
function ScorerTableRow({ scorer, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const initials = scorer.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const isWaecOrNeco = scorer.exam === "WAEC" || scorer.exam === "NECO";

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
      <tr className="hover:bg-muted/40 transition-colors group">
        <td className="p-4 font-medium max-w-[240px]">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted border flex items-center justify-center">
              {scorer.image ? (
                <Image
                  src={scorer.image}
                  alt={scorer.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">
                  {initials}
                </span>
              )}
            </div>
            <span className="truncate block text-foreground font-semibold">
              {scorer.name}
            </span>
          </div>
        </td>

        <td className="p-4">
          <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {scorer.exam}
          </span>
        </td>

        <td className="p-4">
          {isWaecOrNeco && scorer.waecNecoSummary ? (
            <div className="text-xs space-y-0.5 text-muted-foreground">
              <p>
                Distinctions:{" "}
                <span className="font-bold text-foreground">
                  {scorer.waecNecoSummary.distinctions || 0}
                </span>
              </p>
              <p>
                Credits:{" "}
                <span className="font-semibold text-foreground">
                  {scorer.waecNecoSummary.credits || 0}
                </span>
              </p>
            </div>
          ) : (
            <span className="text-base font-black text-foreground">
              {scorer.score}
            </span>
          )}
        </td>

        <td className="p-4 text-muted-foreground max-w-xs">
          <p className="truncate text-xs" title={scorer.note}>
            {scorer.note?.trim() ? scorer.note : "—"}
          </p>
        </td>

        <td className="p-4 text-right">
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(scorer)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background shadow-sm hover:bg-muted transition-all"
              title="Edit Scorer"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-background text-red-500 shadow-sm hover:bg-red-50 transition-all"
              title="Delete Scorer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal using Standard Fallback Styling overlay */}
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
                className="h-11 flex-1 rounded-2xl border transition hover:bg-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-11 flex-1 rounded-2xl bg-red-500 font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
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

/* ─── ADD MODAL (SHADCN/UI DIALOG POPUP) ────────────────────────────────────── */
function AddModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", year: "" });
  const [exam, setExam] = useState("");
  const [totalScore, setTotalScore] = useState("");
  const [numDistinctions, setNumDistinctions] = useState("");
  const [numCredits, setNumCredits] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [note, setNote] = useState("");
  const [about, setAbout] = useState("");
  const [successStory, setSuccessStory] = useState("");

  const [preview, setPreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  function handleExamChange(value) {
    setExam(value);
    setTotalScore("");
    setNumDistinctions("");
    setNumCredits("");
    setSubjects([]);
    setNote("");
    setAbout(""); // clear optional fields
    setSuccessStory("");
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function buildScorerPayload() {
    let scoreValue =
      exam === "WAEC" || exam === "NECO"
        ? Number(numDistinctions) || 0
        : Number(totalScore) || 0;

    const subjectBreakdown = subjects
      .filter((s) => s.subject && (s.score || s.grade))
      .map((s) => ({
        subject: s.subject,
        ...(s.score ? { score: Number(s.score) } : {}),
        ...(s.grade ? { grade: s.grade } : {}),
      }));

    return {
      name: form.name.trim(),
      exam,
      score: scoreValue,
      year: Number(form.year),
      note: note.trim() || undefined,
      about: about.trim() || undefined,
      successStory: successStory.trim() || undefined,
      ...(subjectBreakdown.length ? { subjectBreakdown } : {}),
      ...(exam === "WAEC" || exam === "NECO"
        ? {
            waecNecoSummary: {
              distinctions: Number(numDistinctions) || 0,
              credits: Number(numCredits) || 0,
            },
          }
        : {}),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.year || !exam) {
      setError("Please fill all required fields");
      return;
    }

    if (exam === "JAMB" && subjects.length > 0) {
      const sum = subjects.reduce((a, s) => a + (Number(s.score) || 0), 0);
      if (
        subjects.length !== 4 ||
        !subjects.every((s) => s.subject && s.score)
      ) {
        setError(
          "If you add individual JAMB subject scores, you must fill all 4 completely.",
        );
        return;
      }
      if (sum !== Number(totalScore)) {
        setError("JAMB subject scores must add up to the total score");
        return;
      }
    }

    try {
      setUploading(true);
      const payload = buildScorerPayload();
      await addScorer({ ...payload, selectedImageFile });
      toast.success("Scorer added successfully");
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to add scorer");
    } finally {
      setUploading(false);
    }
  }

  const isWaecOrNeco = exam === "WAEC" || exam === "NECO";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full max-w-2xl bg-card rounded-2xl border shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-bold text-xl text-foreground">
            Add New Scorer
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Select the exam type first — the form adapts accordingly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Exam Type Options */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Exam
            </h4>
            <div className="flex flex-wrap gap-2">
              {EXAM_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleExamChange(type)}
                  className={`h-8 px-3 rounded-full text-xs font-semibold border transition ${
                    exam === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Student Info Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                type="text"
                required
                placeholder="e.g. Aisha Bello"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div>
              <FieldLabel>Year</FieldLabel>
              <SelectInput
                value={form.year}
                onChange={(e) =>
                  setForm((p) => ({ ...p, year: e.target.value }))
                }
                required
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          {/* Conditional Result Sub-Forms */}
          {exam && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {exam} Results
              </h4>

              {exam === "JAMB" && (
                <JambFields
                  totalScore={totalScore}
                  onTotalScoreChange={setTotalScore}
                  subjects={subjects}
                  onSubjectsChange={setSubjects}
                />
              )}

              {isWaecOrNeco && (
                <WaecNecoFields
                  numDistinctions={numDistinctions}
                  onNumDistinctionsChange={setNumDistinctions}
                  numCredits={numCredits}
                  onNumCreditsChange={setNumCredits}
                  subjects={subjects}
                  onSubjectsChange={setSubjects}
                />
              )}

              {(exam === "Post-UTME" || exam === "Other") && (
                <GenericScoreFields
                  score={totalScore}
                  onScoreChange={setTotalScore}
                  subjects={subjects}
                  onSubjectsChange={setSubjects}
                />
              )}
            </div>
          )}

          {/* About Input (optional) */}
          {exam && (
            <div>
              <FieldLabel optional>About this scorer</FieldLabel>
              <textarea
                placeholder="e.g. Academic background, achievements, character..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition resize-y min-h-[70px]"
              />
            </div>
          )}

          {/* Note Input */}
          {exam && (
            <div>
              <FieldLabel optional>Additional Note</FieldLabel>
              <input
                type="text"
                placeholder="e.g. Outstanding performance, Best in Chemistry..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition min-h-[44px]"
              />
        
            </div>
          )}

          {/* Success Story Input (optional) */}
          {exam && (
            <div>
              <FieldLabel optional>Success Story</FieldLabel>
              <textarea
                placeholder="e.g. How this scorer achieved their results, journey, milestones..."
                value={successStory}
                onChange={(e) => setSuccessStory(e.target.value)}
                rows={3}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition resize-y min-h-[70px]"
              />
            </div>
          )}

          {/* Image Upload Input Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center rounded-xl border p-4 bg-muted/10">
            <div className="relative w-full aspect-4/3 rounded-lg border overflow-hidden bg-secondary/30">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground text-xs">
                  <Upload className="h-5 w-5" />
                  <span>No profile photo</span>
                </div>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer hover:opacity-80 transition">
                <Upload className="w-3.5 h-3.5" />
                {preview ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          {/* Action Modifiers */}
          <DialogFooter className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 h-11 rounded-xl border text-sm font-medium py-2 hover:bg-secondary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !exam}
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 py-2"
            >
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              {uploading ? "Adding Scorer…" : "Add Scorer"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── ADD SUB-MODAL HELPERS ─────────────────────────────────────────
function JambFields({
  totalScore,
  onTotalScoreChange,
  subjects,
  onSubjectsChange,
}) {
  const [showSubjects, setShowSubjects] = useState(subjects.length > 0);

  useEffect(() => {
    if (showSubjects && subjects.length !== 4) {
      onSubjectsChange(
        Array.from({ length: 4 }, () => ({ subject: "", score: "" })),
      );
    } else if (!showSubjects && subjects.length > 0) {
      onSubjectsChange([]);
    }
  }, [showSubjects, subjects.length, onSubjectsChange]);

  function updateSubject(i, key, value) {
    onSubjectsChange(
      subjects.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );
  }

  const calculatedSum = subjects.reduce(
    (sum, s) => sum + (Number(s.score) || 0),
    0,
  );
  const sumMatches = !totalScore || calculatedSum === Number(totalScore);
  const allFilled =
    subjects.length === 4 && subjects.every((s) => s.subject && s.score);
  const someFilled = subjects.some((s) => s.subject || s.score);

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Total JAMB Score (Out of 400)</FieldLabel>
        <Input
          type="number"
          min={0}
          max={400}
          required
          placeholder="e.g. 320"
          value={totalScore}
          onChange={(e) => onTotalScoreChange(e.target.value)}
        />
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSubjects}
            onChange={(e) => setShowSubjects(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-xs font-medium">
            Add individual subject breakdowns
          </span>
        </label>
      </div>

      {showSubjects && (
        <div className="space-y-2.5 border-t pt-3">
          <FieldLabel>Subject Breakdown (All 4 required)</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <SelectInput
                    value={s.subject}
                    onChange={(e) =>
                      updateSubject(i, "subject", e.target.value)
                    }
                  >
                    <option value="">Select subject…</option>
                    {JAMB_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </SelectInput>
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Score"
                    value={s.score}
                    onChange={(e) => updateSubject(i, "score", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          {!allFilled && someFilled && (
            <p className="text-xs text-amber-600">
              Please complete all 4 configurations.
            </p>
          )}
          {!sumMatches && totalScore && (
            <p className="text-xs text-destructive">
              Sum ({calculatedSum}) mismatch with absolute input ({totalScore}).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function WaecNecoFields({
  numDistinctions,
  onNumDistinctionsChange,
  numCredits,
  onNumCreditsChange,
  subjects,
  onSubjectsChange,
}) {
  function updateSubject(i, key, value) {
    onSubjectsChange(
      subjects.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Distinctions (A1 - B3)</FieldLabel>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 7"
            value={numDistinctions}
            onChange={(e) => onNumDistinctionsChange(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Credits (C4 - C6)</FieldLabel>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 5"
            value={numCredits}
            onChange={(e) => onNumCreditsChange(e.target.value)}
          />
        </div>
      </div>
      <div>
        <FieldLabel optional>Grade Breakdown Ledger</FieldLabel>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <SelectInput
                className="flex-1"
                value={s.subject}
                onChange={(e) => updateSubject(i, "subject", e.target.value)}
              >
                <option value="">Select subject…</option>
                {WAEC_NECO_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </SelectInput>
              <SelectInput
                className="w-24"
                value={s.grade}
                onChange={(e) => updateSubject(i, "grade", e.target.value)}
              >
                <option value="">Grade</option>
                {WAEC_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </SelectInput>
              <button
                type="button"
                onClick={() =>
                  onSubjectsChange(subjects.filter((_, idx) => idx !== i))
                }
                className="p-2.5 rounded-xl border text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onSubjectsChange([...subjects, { subject: "", grade: "" }])
          }
          className="mt-2 text-xs font-semibold text-primary inline-flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Add subject grade
        </button>
      </div>
    </div>
  );
}

function GenericScoreFields({
  score,
  onScoreChange,
  subjects,
  onSubjectsChange,
}) {
  function updateSubject(i, key, value) {
    onSubjectsChange(
      subjects.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );
  }
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Absolute Score</FieldLabel>
        <Input
          type="number"
          required
          placeholder="e.g. 85"
          value={score}
          onChange={(e) => onScoreChange(e.target.value)}
        />
      </div>
      <div>
        <FieldLabel optional>Subject Segment Metrics</FieldLabel>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="Subject name"
                value={s.subject}
                onChange={(e) => updateSubject(i, "subject", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Score"
                value={s.score}
                onChange={(e) => updateSubject(i, "score", e.target.value)}
                className="w-24"
              />
              <button
                type="button"
                onClick={() =>
                  onSubjectsChange(subjects.filter((_, idx) => idx !== i))
                }
                className="p-2.5 rounded-xl border text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onSubjectsChange([...subjects, { subject: "", score: "" }])
          }
          className="mt-2 text-xs font-semibold text-primary inline-flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Add score target
        </button>
      </div>
    </div>
  );
}

/* ─── EDIT MODAL (SHADCN/UI DIALOG POPUP) ───────────────────────────────────── */
function EditModal({ open, scorer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: scorer.name || "",
    year: String(scorer.year || ""),
    score: String(scorer.score || ""),
    note: scorer.note || "",
    about: scorer.about || "",
    successStory: scorer.successStory || "",
  });

  const [numDistinctions, setNumDistinctions] = useState(
    scorer.waecNecoSummary?.distinctions?.toString() || "",
  );
  const [numCredits, setNumCredits] = useState(
    scorer.waecNecoSummary?.credits?.toString() || "",
  );
  const [subjects, setSubjects] = useState(scorer.subjectBreakdown || []);
  const [preview, setPreview] = useState(scorer.image || null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isWaecOrNeco = scorer.exam === "WAEC" || scorer.exam === "NECO";

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        score: isWaecOrNeco ? Number(numDistinctions) || 0 : Number(form.score),
        year: Number(form.year),
        note: form.note.trim() || undefined,
        about: form.about?.trim() || undefined,
        successStory: form.successStory?.trim() || undefined,
        image: scorer.image,
        imagePublicId: scorer.imagePublicId,
      };

      if (isWaecOrNeco) {
        payload.waecNecoSummary = {
          distinctions: Number(numDistinctions) || 0,
          credits: Number(numCredits) || 0,
        };
      }

      if (subjects.length > 0) {
        payload.subjectBreakdown = subjects
          .filter((s) => s.subject && (s.score || s.grade))
          .map((s) => ({
            subject: s.subject,
            ...(s.score ? { score: Number(s.score) } : {}),
            ...(s.grade ? { grade: s.grade } : {}),
          }));
      }

      // Using the integrated updateScorer API invocation variant supporting image data parameters
      await updateScorer(scorer.id, { ...payload, selectedImageFile });

      toast.success("Scorer updated successfully");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full max-w-2xl bg-card rounded-2xl border shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-bold text-xl text-foreground">
            Edit Scorer
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Modify values associated with this top scorer entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-semibold">Exam Type</label>
            <div className="mt-1.5 px-4 py-3 bg-muted rounded-xl text-sm font-medium">
              {scorer.exam} • {scorer.year}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Exam type cannot be changed after creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold">Full Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="mt-1.5 w-full h-11 rounded-xl border px-4 text-sm focus:outline-none"
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
                className="mt-1.5 w-full h-11 rounded-xl border px-4 text-sm bg-background"
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

          <div>
            <label className="text-xs font-semibold">About this scorer</label>
            <textarea
              value={form.about}
              onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
              placeholder="e.g. Academic background, achievements, character..."
              rows={3}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-sm resize-y min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Additional Note</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="e.g. Outstanding performance..."
              rows={3}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-sm resize-y min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Success Story</label>
            <textarea
              value={form.successStory}
              onChange={(e) =>
                setForm((p) => ({ ...p, successStory: e.target.value }))
              }
              placeholder="e.g. How this scorer achieved their results, journey, milestones..."
              rows={3}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-sm resize-y min-h-[80px]"
            />
          </div>

          {/* Image Update Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center rounded-xl border p-4 bg-muted/10">
            <div className="relative w-full aspect-video rounded-lg border overflow-hidden bg-secondary/30">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground text-xs">
                  <Upload className="h-5 w-5" />
                  <span>No profile photo</span>
                </div>
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer hover:opacity-80 transition">
                <Upload className="w-3.5 h-3.5" />
                {preview ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border text-sm font-medium hover:bg-secondary"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
