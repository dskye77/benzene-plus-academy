"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Save,
  X,
  Loader2,
  Send,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { getBlogs, createBlog, updateBlog, deleteBlog } from "@/lib/api/blog";

const CATEGORIES = [
  "Announcement",
  "Study Tips",
  "Student Story",
  "News",
  "Events",
];

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function emptyDraft() {
  return {
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    category: CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10),
    status: "draft",
    selectedImageFile: null,
    imagePreviewUrl: null,
    id: undefined,
    image: null,
  };
}

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [previewing, setPreviewing] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const blogs = await getBlogs();
        setPosts(Array.isArray(blogs) ? blogs : []);
      } catch (error) {
        toast.error("Failed to load blog posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    const safePosts = Array.isArray(posts) ? posts : [];
    return safePosts.filter((p) => {
      if (statusFilter !== "All" && p.status !== statusFilter.toLowerCase())
        return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (p.title ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [posts, query, statusFilter]);

  function openNew() {
    setEditingId(null);
    setDraft(emptyDraft());
    setOpen(true);
  }

  function openEdit(p) {
    setEditingId(p.id);
    setDraft({
      ...p,
      selectedImageFile: null,
      imagePreviewUrl: p.image || null,
    });
    setOpen(true);
  }

  async function remove(id) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await deleteBlog(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  }

  async function handleSave(targetStatus) {
    if (!draft.title.trim()) return toast.error("Title is required");
    if (!draft.excerpt.trim()) return toast.error("Excerpt is required");
    if (!draft.body.trim()) return toast.error("Body is required");

    // Resolve slug, ensuring uniqueness
    const baseSlug = draft.slug.trim() || slugify(draft.title);
    let finalSlug = baseSlug;
    const taken = new Set(
      posts.filter((p) => p.id !== editingId).map((p) => p.slug),
    );
    let i = 2;
    while (taken.has(finalSlug)) finalSlug = `${baseSlug}-${i++}`;

    // Build payload — selectedImageFile is passed through so the API
    // function (createBlog / updateBlog) can handle the Cloudinary upload
    // internally via uploadImageViaApi, matching the { selectedImageFile, ...blogData }
    // destructuring in lib/api/blog.
    const payload = {
      ...draft,
      slug: finalSlug,
      status: targetStatus,
      // keep selectedImageFile in payload if a new file was chosen
      selectedImageFile:
        draft.selectedImageFile instanceof File
          ? draft.selectedImageFile
          : undefined,
    };

    // imagePreviewUrl is only used for local preview — strip it before sending
    delete payload.imagePreviewUrl;

    try {
      if (editingId) {
        const updated = await updateBlog(editingId, payload);
        setPosts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p)),
        );
        toast.success(
          `Post updated as ${targetStatus.charAt(0).toUpperCase() + targetStatus.slice(1)}`,
        );
      } else {
        const created = await createBlog(payload);
        setPosts((prev) => [created, ...prev]);
        toast.success(
          `Post created as ${targetStatus.charAt(0).toUpperCase() + targetStatus.slice(1)}`,
        );
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        editingId ? "Failed to update post" : "Failed to create post",
      );
      console.error(error);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setDraft((d) => ({
      ...d,
      selectedImageFile: file,
      imagePreviewUrl: URL.createObjectURL(file),
    }));
  }

  function handleRemoveImage() {
    setDraft((d) => ({
      ...d,
      selectedImageFile: null,
      imagePreviewUrl: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  function mapStatusToLabel(s) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Blog & Announcements</h2>
          <p className="text-sm text-muted-foreground">
            Create, edit and publish posts live to the platform.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or category…"
            className="pl-9"
          />
        </div>
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
          {["All", "Published", "Draft"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Image</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Loading posts...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    No posts match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-border hover:bg-secondary/30"
                  >
                    <td className="px-5 py-3 font-medium max-w-md">
                      <div className="line-clamp-1">{p.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        /{p.slug}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                      {p.date && !isNaN(new Date(p.date).getTime())
                        ? new Date(p.date).toLocaleDateString("en-NG")
                        : "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full text-xs font-semibold px-2 py-0.5 ${
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {mapStatusToLabel(p.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={56} height={40}
                          className="w-14 h-10 object-cover rounded bg-muted"
                        />
                      ) : (
                        <div className="w-14 h-10 flex items-center justify-center bg-muted rounded text-muted-foreground">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => setPreviewing(p)}
                          title="Preview"
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          title="Edit"
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          title="Delete"
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit post" : "New post"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update post content and status configuration."
                : "Draft or instantly publish a new article."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    title: e.target.value,
                    slug: editingId ? d.slug : slugify(e.target.value),
                  }))
                }
                placeholder="e.g. JAMB 2026 Registration Guide"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
                  }
                  placeholder="jamb-2026-registration"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Publish date</Label>
                <Input
                  id="date"
                  type="date"
                  value={draft.date}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={draft.category}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, category: e.target.value }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={draft.excerpt}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, excerpt: e.target.value }))
                }
                rows={2}
                placeholder="Short summary shown in the blog list."
              />
            </div>

            {/* Image uploader */}
            <div className="space-y-2">
              <Label>Cover image</Label>
              <div className="flex items-start gap-4">
                <div>
                  {draft.imagePreviewUrl ? (
                    <div className="relative group">
                      <Image
                        src={draft.imagePreviewUrl}
                        width={56} height={40}

                        alt="Blog cover"
                        className="h-28 w-40 object-cover rounded border border-border"
                      />
                      <button
                        type="button"
                        aria-label="Remove image"
                        title="Remove image"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:scale-110 shadow border border-white/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-40 h-28 rounded border border-border items-center justify-center bg-muted/50">
                      <ImageIcon className="w-9 h-9 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    id="blog-image-upload-input"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {draft.imagePreviewUrl ? "Change Image" : "Upload Image"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    PNG/JPEG/WebP. Max 2MB.
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={draft.body}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, body: e.target.value }))
                }
                rows={10}
                placeholder="Write your post here. Line breaks are preserved."
              />
              <p className="text-xs text-muted-foreground">
                {draft.body.length} characters
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row justify-between items-center border-t pt-4 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto order-3 sm:order-1"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>

            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2 mb-2 sm:mb-0">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => handleSave("draft")}
              >
                <Save className="h-4 w-4" /> Save as Draft
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => handleSave("published")}
              >
                <Send className="h-4 w-4" />{" "}
                {editingId ? "Update & Publish" : "Publish Now"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewing}
        onOpenChange={(v) => !v && setPreviewing(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {previewing && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-accent/10 text-accent font-semibold px-2 py-0.5">
                    {previewing.category}
                  </span>
                  <span className="text-muted-foreground">
                    {previewing.date &&
                    !isNaN(new Date(previewing.date).getTime())
                      ? new Date(previewing.date).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <DialogTitle className="text-2xl">
                  {previewing.title}
                </DialogTitle>
                <DialogDescription>{previewing.excerpt}</DialogDescription>
              </DialogHeader>
              {previewing.image && (
                <Image
                  src={previewing.image}
                  width={56} height={40}

                  alt={previewing.title}
                  className="w-full h-44 object-cover mb-5 rounded border border-border"
                />
              )}
              <article className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {previewing.body}
              </article>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
