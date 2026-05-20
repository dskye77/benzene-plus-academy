import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { POSTS } from "@/lib/site";

export default function ManageBlog() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <span className="text-5xl mb-4">🚧</span>
      <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
      <p className="text-center max-w-md">
        The blog & announcements management feature is coming soon. Check back
        later!
      </p>
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Blog & Announcements</h2>
          <p className="text-sm text-muted-foreground">
            Create, edit and publish posts.
          </p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {POSTS.map((p) => (
              <tr
                key={p.slug}
                className="border-t border-border hover:bg-secondary/30"
              >
                <td className="px-5 py-3 font-medium max-w-xs">{p.title}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5">
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(p.date).toLocaleDateString("en-NG")}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold px-2 py-0.5">
                    Published
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
