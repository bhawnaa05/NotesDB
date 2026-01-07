"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, PenLine, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Creating note...");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Note created successfully!", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create note", { id: toastId });
      setIsSubmitting(false);
    }
  };

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
            <PenLine className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            New Note
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Capture your thoughts, ideas, or task lists in a distraction-free environment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-8 relative overflow-hidden"
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="space-y-6 relative">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2 ml-1">Title</label>
            <div className="relative group">
              <input
                id="title"
                placeholder="Give your note a meaningful title..."
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
                placeholder="Start typing your thoughts here..."
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 min-h-[300px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y placeholder:text-muted-foreground/50"
                value={content}
                onChange={e => setContent(e.target.value)}
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
            disabled={!title.trim() || !content.trim() || isSubmitting}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-primary/25 transition-all ${!title.trim() || !content.trim() || isSubmitting
                ? "bg-slate-400 cursor-not-allowed transform-none shadow-none opacity-50"
                : "bg-gradient-to-r from-primary to-violet-600 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Note
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
