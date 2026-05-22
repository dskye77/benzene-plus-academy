"use client";

import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function ScorerDisplay({ scorer }) {
  const {
    name,
    exam,
    score,
    year,
    note,
    waecNecoSummary,
    image,
    subjectBreakdown,
  } = scorer;

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isJamb = exam === "JAMB";
  const isWaecOrNeco = exam === "WAEC" || exam === "NECO";

  // Simple tier badge for JAMB scores matching your requested format
  const getMedalBadge = () => {
    if (!isJamb) return null;
    const numericScore = Number(score) || 0;
    if (numericScore >= 340) return "🥇 Gold";
    if (numericScore >= 320) return "🥈 Silver";
    if (numericScore >= 300) return "🥉 Bronze";
    return null;
  };

  const medalBadge = getMedalBadge();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer flex flex-col h-full">
      {/* Top Banner Area with Centered Circular Avatar */}
      <div className="relative h-32 bg-linear-to-r from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
        {image ? (
          <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
            {initials}
          </div>
        )}
      </div>

      {/* Card Body Details */}
      <div className="p-6 flex flex-col grow">
        {/* Name & Verification Badge */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-1">
            {name}
          </h3>
          <CircleCheckBig className="w-5 h-5 text-teal-700 dark:text-green-400 shrink-0" />
        </div>

        {/* Score & Badge Metadata */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl font-bold text-primary">
            {isWaecOrNeco && waecNecoSummary
              ? `${waecNecoSummary.distinctions} As`
              : score}
          </span>

          {medalBadge ? (
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              {medalBadge}
            </span>
          ) : (
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              {exam} {year}
            </span>
          )}
        </div>

        {/* Subject Breakdown Content Panel */}
        <div className="space-y-2 mb-4 grow">
          {subjectBreakdown && subjectBreakdown.length > 0 ? (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Subject Scores
              </p>
              {subjectBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-muted-foreground capitalize">
                    {item.subject}
                  </span>
                  <span className="font-semibold text-foreground">
                    {item.score !== undefined ? item.score : item.grade}
                  </span>
                </div>
              ))}
            </>
          ) : (
            /* Fallback metrics text display if no fine-grained ledger list is submitted */
            isWaecOrNeco &&
            waecNecoSummary && (
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Exam Breakdown
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Distinctions</span>
                  <span className="font-semibold text-foreground">
                    {waecNecoSummary.distinctions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-semibold text-foreground">
                    {waecNecoSummary.credits || 0}
                  </span>
                </div>
              </>
            )
          )}
        </div>

        {/* Action button container pinned to the bottom */}
        <Link
          href={"/top-scorers/" + scorer.id}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none border bg-transparent shadow-xs h-9 px-4 py-2 w-full text-primary border-primary hover:bg-primary/5 dark:border-primary/40 dark:hover:bg-primary/10 shrink-0"
        >
          View Result Slip
        </Link>
      </div>
    </div>
  );
}
