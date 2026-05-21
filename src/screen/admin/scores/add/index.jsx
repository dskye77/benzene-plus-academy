"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadScorer } from "@/lib/api/scorers";
import Image from "next/image";
import { Upload, Plus, Trash2, ChevronDown } from "lucide-react";

import { YEARS } from "@/lib/data";


// ─── Constants ────────────────────────────────────────────────────────────────

const EXAM_TYPES = ["JAMB", "WAEC", "NECO", "Post-UTME", "Other"];



const JAMB_SUBJECTS = [
  "Accounting",
  "Agricultural Science",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Civic Education",
  "Commerce",
  "Computer Science",
  "Economics",
  "English Language",
  "Further Mathematics",
  "Geography",
  "Government",
  "History",
  "Home Economics",
  "Islamic Religious Studies",
  "Literature in English",
  "Mathematics",
  "Physical & Health Education",
  "Physics",
  "Technical Drawing",
];

const WAEC_NECO_SUBJECTS = [
  "Accounting",
  "Agricultural Science",
  "Animal Husbandry",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Civic Education",
  "Commerce",
  "Computer Science",
  "Data Processing",
  "Economics",
  "English Language",
  "Fine Art",
  "Fisheries",
  "Food and Nutrition",
  "French",
  "Further Mathematics",
  "Geography",
  "Government",
  "Hausa",
  "Health Science",
  "History",
  "Home Economics",
  "Igbo",
  "Islamic Religious Studies",
  "Literature in English",
  "Mathematics",
  "Physical & Health Education",
  "Physics",
  "Technical Drawing",
  "Visual Art",
  "Yoruba",
];

const WAEC_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

// ─── Reusable Components ──────────────────────────────────────────────────────

function FieldLabel({ children, optional }) {
  return (
    <label className="block mb-1.5 text-sm font-semibold text-foreground">
      {children}
      {optional && (
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
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

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      rows={5}
      className={`w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition resize-y min-h-[80px] ${className}`}
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

// ─── JAMB Fields ──────────────────────────────────────────────────────────────

function JambFields({
  totalScore,
  onTotalScoreChange,
  subjects,
  onSubjectsChange,
}) {
  const [showSubjects, setShowSubjects] = useState(subjects.length > 0);

  // Initialize with 4 slots when enabling
  useEffect(() => {
    if (showSubjects && subjects.length !== 4) {
      const newSubjects = Array.from({ length: 4 }, () => ({
        subject: "",
        score: "",
      }));
      onSubjectsChange(newSubjects);
    }
    if (!showSubjects) {
      onSubjectsChange([]);
    }
  }, [showSubjects, onSubjectsChange, subjects.length]);

  function updateSubject(i, key, value) {
    const updated = subjects.map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s,
    );
    onSubjectsChange(updated);
  }

  const calculatedSum = subjects.reduce(
    (sum, s) => sum + (Number(s.score) || 0),
    0,
  );

  const sumMatches = !totalScore || calculatedSum === Number(totalScore);

  // Check if all 4 are properly filled
  const allFilled =
    subjects.length === 4 && subjects.every((s) => s.subject && s.score);

  const someFilled = subjects.some((s) => s.subject || s.score);

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Total JAMB Score</FieldLabel>
        <Input
          type="number"
          min={0}
          max={400}
          required
          placeholder="e.g. 320"
          value={totalScore}
          onChange={(e) => onTotalScoreChange(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Out of 400</p>
      </div>

      {/* Toggle for Subject Scores */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSubjects}
            onChange={(e) => setShowSubjects(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">
            Add individual subject scores (optional)
          </span>
        </label>
      </div>

      {/* Subject Fields */}
      {showSubjects && (
        <div>
          <FieldLabel>Individual Subject Scores (All 4 required)</FieldLabel>
          <div className="space-y-3">
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
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
                <div className="w-28">
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
            <p className="mt-2 text-sm text-amber-600">
              Please fill all 4 subjects and scores if you want to show them.
            </p>
          )}

          {!sumMatches && totalScore && (
            <p className="mt-2 text-sm text-destructive">
              Sum of subject scores ({calculatedSum}) does not match total JAMB
              score ({totalScore})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── WAEC / NECO Fields ───────────────────────────────────────────────────────

function WaecNecoFields({
  numDistinctions,
  onNumDistinctionsChange,
  numCredits,
  onNumCreditsChange,
  subjects,
  onSubjectsChange,
}) {
  function addSubject() {
    onSubjectsChange([...subjects, { subject: "", grade: "" }]);
  }

  function removeSubject(i) {
    onSubjectsChange(subjects.filter((_, idx) => idx !== i));
  }

  function updateSubject(i, key, value) {
    const updated = subjects.map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s,
    );
    onSubjectsChange(updated);
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Number of Distinctions (A1 - B3)</FieldLabel>
          <Input
            type="number"
            min={0}
            max={20}
            placeholder="e.g. 7"
            value={numDistinctions}
            onChange={(e) => onNumDistinctionsChange(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>
        <div>
          <FieldLabel>Number of Credits (C4 - C6)</FieldLabel>
          <Input
            type="number"
            min={0}
            max={20}
            placeholder="e.g. 5"
            value={numCredits}
            onChange={(e) => onNumCreditsChange(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>
      </div>

      {/* Individual Subjects */}
      <div>
        <FieldLabel optional>Individual Subject Grades</FieldLabel>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-1">
                <SelectInput
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
              </div>
              <div className="w-32">
                <SelectInput
                  value={s.grade}
                  onChange={(e) => updateSubject(i, "grade", e.target.value)}
                >
                  <option value="">Grade…</option>
                  {WAEC_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </SelectInput>
              </div>
              <button
                type="button"
                onClick={() => removeSubject(i)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSubject}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add subject grade
        </button>
      </div>
    </div>
  );
}

// ─── Generic Fields (Post-UTME & Other) ───────────────────────────────────────

function GenericScoreFields({
  score,
  onScoreChange,
  subjects,
  onSubjectsChange,
}) {
  function addSubject() {
    onSubjectsChange([...subjects, { subject: "", score: "" }]);
  }

  function removeSubject(i) {
    onSubjectsChange(subjects.filter((_, idx) => idx !== i));
  }

  function updateSubject(i, key, value) {
    const updated = subjects.map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s,
    );
    onSubjectsChange(updated);
  }

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Score</FieldLabel>
        <Input
          type="number"
          min={0}
          required
          placeholder="e.g. 85"
          value={score}
          onChange={(e) => onScoreChange(e.target.value)}
        />
      </div>

      <div>
        <FieldLabel optional>Individual Subject Scores</FieldLabel>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Subject name"
                  value={s.subject}
                  onChange={(e) => updateSubject(i, "subject", e.target.value)}
                />
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  placeholder="Score"
                  value={s.score}
                  onChange={(e) => updateSubject(i, "score", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSubject(i)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSubject}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add subject score
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddScorer() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", year: "" });
  const [exam, setExam] = useState("");
  const [totalScore, setTotalScore] = useState("");
  const [numDistinctions, setNumDistinctions] = useState("");
  const [numCredits, setNumCredits] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [note, setNote] = useState("");

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
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function buildScorerPayload() {
    let scoreValue = 0;

    if (exam === "WAEC" || exam === "NECO") {
      scoreValue = Number(numDistinctions) || 0;
    } else {
      scoreValue = Number(totalScore) || 0;
    }

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

    // JAMB Validation
    // JAMB Validation
    if (exam === "JAMB") {
      const sum = subjects.reduce((a, s) => a + (Number(s.score) || 0), 0);

      if (subjects.length > 0) {
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
    }

    try {
      setUploading(true);


      const payload = buildScorerPayload();
      await uploadScorer({ ...payload, selectedImageFile });
      router.push("/admin/scores");
    } catch (err) {
      setError(err.message || "Failed to add scorer");
    } finally {
      setUploading(false);
    }
  }

  const isWaecOrNeco = exam === "WAEC" || exam === "NECO";

  return (
    <div className="max-w-2xl mx-auto py-6 md:px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Scorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select the exam type first — the form will adapt accordingly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Type */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Exam
          </h2>
          <div className="flex flex-wrap gap-2">
            {EXAM_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleExamChange(type)}
                className={`h-9 px-4 rounded-full text-sm font-semibold border transition ${
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

        {/* Student Info */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Student Info
          </h2>

          <div>
            <FieldLabel>Full Name</FieldLabel>
            <Input
              type="text"
              required
              placeholder="e.g. Aisha Bello"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div>
            <FieldLabel>Year</FieldLabel>
            <SelectInput
              value={form.year}
              onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
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

        {/* Exam Results */}
        {exam && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {exam} Results
            </h2>

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

        {/* Additional Note */}
        {exam && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Additional Note / About
            </h2>
            <div>
              <FieldLabel optional>About this scorer</FieldLabel>
              <Textarea
                placeholder="e.g. Outstanding performance, Best in Chemistry, School valedictorian"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Photo Upload */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Student Photo
          </h2>

          <div className="relative w-full aspect-4/3 rounded-xl border overflow-hidden bg-secondary/40">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm">No image selected</span>
              </div>
            )}
          </div>
    

          <label className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-80 transition">
            <Upload className="w-4 h-4" />
            {preview ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 h-11 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !exam}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {uploading ? "Adding…" : "Add Scorer"}
          </button>
        </div>
      </form>
    </div>
  );
}
