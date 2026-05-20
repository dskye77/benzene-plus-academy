import { Pencil } from "lucide-react";
import { PROGRAMS } from "@/lib/site";

export default function ManagePrograms() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Programs</h2>
        <p className="text-sm text-muted-foreground">
          Edit program details, schedule and fees.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => (
          <div
            key={p.code}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1">
                  {p.code}
                </span>
                <h3 className="mt-3 font-semibold text-lg">{p.title}</h3>
              </div>
              <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border border-border text-xs font-medium hover:bg-secondary">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Schedule</dt>
                <dd className="mt-0.5 font-medium">{p.schedule}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="mt-0.5 font-medium">{p.duration}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
