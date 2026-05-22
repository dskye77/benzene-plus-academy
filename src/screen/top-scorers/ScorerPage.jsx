"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CircleCheckBig,
  Calendar,
  Award,
  BookOpen,
  FileText,
  User,
  Sparkles,
} from "lucide-react";
// Import your single record retrieval API function
import { fetchScorer } from "@/lib/client/scorers";

export default function StudentScorerPage() {
  const params = useParams();
  const id = params.id;

  const [scorer, setScorer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadStudentData() {
      try {
        const student = await fetchScorer(id);
        setScorer(student);
      } catch (err) {
        console.error("Error fetching single student profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading student profile...
        </p>
      </div>
    );
  }

  if (!scorer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-xl font-bold text-foreground">Profile Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          The requested top scorer record doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
    );
  }

  const {
    name,
    exam,
    score,
    year,
    note,
    waecNecoSummary,
    image,
    subjectBreakdown,
    about,
    successStory,
  } = scorer;

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isWaecOrNeco = exam === "WAEC" || exam === "NECO";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/top-scorers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Top Scorers
        </Link>

        {/* Main Card Profile Wrapper */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border/40 overflow-hidden">
          {/* Header Banner Area */}
          <div className="relative h-44 bg-linear-to-r from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center">
            {image ? (
              <div className="absolute -bottom-12 w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-md bg-background">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="absolute -bottom-12 w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground shadow-md">
                {initials}
              </div>
            )}
          </div>

          {/* Identity Block & Key Statistics Grid */}
          <div className="pt-16 p-6 md:p-8 text-center border-b border-border/50">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {name}
              </h1>
              <CircleCheckBig className="w-6 h-6 text-teal-700 dark:text-green-400 shrink-0" />
            </div>

            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              Official Academic Record
            </p>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl max-w-md mx-auto">
              <div className="flex flex-col items-center justify-center p-2 border-r border-border/60">
                <Award className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Exam
                </span>
                <span className="text-sm font-bold text-foreground mt-0.5">
                  {exam}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 border-r border-border/60">
                <Calendar className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Year
                </span>
                <span className="text-sm font-bold text-foreground mt-0.5">
                  {year}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2">
                <BookOpen className="w-4 h-4 text-muted-foreground mb-1" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Overall
                </span>
                <span className="text-sm font-black text-primary mt-0.5">
                  {isWaecOrNeco && waecNecoSummary
                    ? `${waecNecoSummary.distinctions} As`
                    : score}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Summary Details */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Optional About Field */}
            {about?.trim() && (
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> About
                  Student
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {about}
                </p>
              </div>
            )}

            {/* Performance Ledger rows */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Subject Performance Metrics
              </h3>

              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border/40 divide-y divide-border/60">
                {subjectBreakdown && subjectBreakdown.length > 0 ? (
                  subjectBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-4 py-3 text-sm"
                    >
                      <span className="text-muted-foreground font-medium capitalize">
                        {item.subject}
                      </span>
                      <span className="font-bold text-foreground bg-white dark:bg-slate-800 px-3 py-1 rounded-md border shadow-2xs">
                        {item.score !== undefined ? item.score : item.grade}
                      </span>
                    </div>
                  ))
                ) : isWaecOrNeco && waecNecoSummary ? (
                  <>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground font-medium">
                        Distinctions (A1 - B3)
                      </span>
                      <span className="font-bold text-foreground">
                        {waecNecoSummary.distinctions || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground font-medium">
                        Credits (C4 - C6)
                      </span>
                      <span className="font-bold text-foreground">
                        {waecNecoSummary.credits || 0}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No subject breakdown data attached to this score record.
                  </div>
                )}
              </div>
            </div>

            {/* Optional Success Story Field */}
            {successStory?.trim() && (
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-5">
                <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Journey & Success Story
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {successStory}
                </p>
              </div>
            )}

            {/* Note Panel Block */}
            {note?.trim() && (
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  Honorable Mention & Notes
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">
                  &quot;{note}&quot;
                </p>
              </div>
            )}

            {/* Action Buttons Footer Row */}
            <div className="pt-2">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all outline-none border bg-primary text-primary-foreground shadow-md h-11 px-4 w-full hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring">
                <FileText className="w-4 h-4" />
                Download / Print Result Slip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
