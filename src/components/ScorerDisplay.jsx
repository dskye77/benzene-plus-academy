"use client";

import Image from "next/image";

export default function ScorerDisplay({ scorer }) {
  const { name, exam, score, year, note, waecNecoSummary, image } = scorer;

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isJamb = exam === "JAMB";
  const isWaecOrNeco = exam === "WAEC" || exam === "NECO";

  const jambScore = Number(score) || 0;

  const scoreTier = isJamb
    ? jambScore >= 320
      ? "elite"
      : jambScore >= 300
        ? "excellent"
        : jambScore >= 250
          ? "strong"
          : jambScore >= 200
            ? "good"
            : "low"
    : "neutral";

  const tierStyles = {
    elite: {
      card: "border-emerald-400/50 bg-gradient-to-br from-emerald-500/10 via-card to-card shadow-[0_0_0_1px_rgba(16,185,129,0.20),0_24px_60px_rgba(16,185,129,0.20)]",
      score: "text-emerald-700 drop-shadow-[0_0_18px_rgba(16,185,129,0.35)]",
      glow: "from-emerald-500/20",
      ring: "ring-1 ring-emerald-400/30",
    },
    excellent: {
      card: "border-sky-400/45 bg-gradient-to-br from-sky-500/10 via-card to-card shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_20px_50px_rgba(56,189,248,0.15)]",
      score: "text-sky-700 drop-shadow-[0_0_16px_rgba(56,189,248,0.28)]",
      glow: "from-sky-500/20",
      ring: "ring-1 ring-sky-400/25",
    },
    strong: {
      card: "border-violet-400/40 bg-gradient-to-br from-violet-500/10 via-card to-card shadow-[0_0_0_1px_rgba(168,85,247,0.14),0_18px_40px_rgba(168,85,247,0.12)]",
      score: "text-violet-700 drop-shadow-[0_0_14px_rgba(168,85,247,0.24)]",
      glow: "from-violet-500/18",
      ring: "ring-1 ring-violet-400/20",
    },
    good: {
      card: "border-amber-400/30 bg-gradient-to-br from-amber-500/5 via-card to-card shadow-[0_0_0_1px_rgba(245,158,11,0.10),0_14px_30px_rgba(245,158,11,0.08)]",
      score: "text-amber-700",
      glow: "from-amber-500/12",
      ring: "ring-1 ring-amber-400/15",
    },
    low: {
      card: "border-border bg-card shadow-sm",
      score: "text-foreground",
      glow: "from-transparent",
      ring: "",
    },
    neutral: {
      card: "border-border bg-card shadow-sm",
      score: "text-foreground",
      glow: "from-transparent",
      ring: "",
    },
  };

  const styles = tierStyles[scoreTier];

  const scoreSizeClass = isWaecOrNeco
    ? "text-4xl"
    : jambScore >= 300
      ? "text-5xl"
      : jambScore >= 250
        ? "text-4xl"
        : "text-4xl";

  // Check if main score metrics should remain hidden below when they are already featured on top of the card preview
  const holdsFloatingHeaderMetrics =
    (isJamb && scoreTier !== "low") || isWaecOrNeco;

  return (
    <div
      className={`flex h-[420px] flex-col overflow-hidden rounded-3xl border bg-card ${styles.card}`}
    >
      {/* Top Banner / Image Area */}
      <div
        className={`relative overflow-hidden h-[240px] ${
          isWaecOrNeco
            ? "bg-linear-to-br from-muted via-background to-muted/50"
            : "bg-muted"
        }`}
      >
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
              fill
              className={`transition duration-500 ${
                isWaecOrNeco
                  ? "object-contain p-2"
                  : "object-cover group-hover:scale-[1.03]"
              }`}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

            {isJamb && scoreTier !== "low" && (
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-linear-to-b ${styles.glow} via-transparent to-transparent`}
              />
            )}

            {/* Top Exam Badges */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black backdrop-blur">
                {exam}
              </span>

              <span className="inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {year}
              </span>
            </div>

            {/* Floating Score Metrics Badge — Bottom Right */}
            <div className="absolute right-4 bottom-4">
              {isJamb && scoreTier !== "low" && (
                <div
                  className={`rounded-3xl border border-white/15 bg-black/35 px-5 py-3 backdrop-blur-xl ${styles.ring}`}
                >
                  <p
                    className={`${scoreSizeClass} font-black leading-none tracking-tighter text-white`}
                  >
                    {score}
                  </p>
                </div>
              )}

              {isWaecOrNeco && waecNecoSummary?.distinctions !== undefined && (
                <div className="rounded-2xl border border-white/20 bg-black/50 px-4 py-2 backdrop-blur-md text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                    Distinctions
                  </p>
                  <p className="mt-0.5 text-2xl font-black leading-none text-white">
                    {waecNecoSummary.distinctions}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
            <span className="text-5xl font-bold tracking-tight text-muted-foreground/70">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Content Details Area */}
      <div className="flex flex-col p-5">
        <div>
          <h3 className="line-clamp-2 text-xl font-bold tracking-tight mb-2">
            {name}
          </h3>
        </div>

        {/* Render main score metrics down here only if it hasn't floated into the card header above */}
        {!holdsFloatingHeaderMetrics && (
          <div className="mt-5 flex items-end gap-3">
            <p
              className={`${scoreSizeClass} font-black leading-none tracking-tighter ${isJamb ? styles.score : ""}`}
            >
              {score}
            </p>

            <p className="pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isJamb ? "JAMB Score" : isWaecOrNeco ? "Distinctions" : "Score"}
            </p>
          </div>
        )}

        {/* Contextual Secondary Info blocks */}
        {isWaecOrNeco && waecNecoSummary && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-2 py-1.5 w-fit">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Credits
              </span>
              <span className="ml-1 text-base font-bold leading-none">
                {waecNecoSummary.credits}
              </span>
            </div>
          </div>
        )}

        {note?.trim() && (
          <div className="mt-auto border-t pt-4">
            <p className="text-sm leading-7 text-muted-foreground line-clamp-3">
              {note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
