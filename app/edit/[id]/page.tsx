"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NoteType } from "@/types/note";
import { ArrowLeft, Save, Loader2, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditNote({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<NoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => setNote(data.note))
      .catch(() => toast.error("Could not load note"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Updating note...");

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Note updated successfully", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update note", { id: toastId });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
          <Loader2 className="w-10 h-10 absolute inset-0 m-auto text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-medium">Loading note...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 glass-card rounded-2xl border-2 border-dashed border-border mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Note not found</h2>
        <p className="text-muted-foreground mb-6">The note you are looking for does not exist or has been deleted.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Notes
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Edit3 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Edit Note
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Refine your thoughts and keeping everything up to date.
        </p>
      </div>

      <form
        onSubmit={updateNote}
        className="glass-card rounded-2xl p-8 relative overflow-hidden"
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="space-y-6 relative">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2 ml-1">Title</label>
            <div className="relative group">
              <input
                id="title"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                value={note.title}
                onChange={e =>
                  setNote({ ...note, title: e.target.value })
                }
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-violet-600 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2 ml-1">Content</label>
            <div className="relative group">
              <textarea
                id="content"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 min-h-[300px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y placeholder:text-muted-foreground/50"
                value={note.content}
                onChange={e =>
                  setNote({ ...note, content: e.target.value })
                }
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-violet-600 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-border/50">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl text-muted-foreground font-medium hover:bg-secondary/80 hover:text-foreground transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!note.title.trim() || !note.content.trim() || isSubmitting}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-primary/25 transition-all ${!note.title.trim() || !note.content.trim() || isSubmitting
              ? "bg-slate-400 cursor-not-allowed transform-none shadow-none opacity-50"
              : "bg-gradient-to-r from-primary to-violet-600 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Note
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
