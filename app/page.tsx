"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NoteType } from "@/types/note";
import { Trash2, PenSquare, Plus, Loader2, Calendar, Clock, ArrowUpRight, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function HomePage() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");

      if (res.status === 401) {
        router.push("/login"); // Redirect to login if unauthorized (expired)
        return;
      }

      const data = await res.json();
      setNotes(data.notes || []);
    } catch (error) {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting note...");

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");

      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete note", { id: toastId });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
          <Loader2 className="w-10 h-10 absolute inset-0 m-auto text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-medium">Loading your notes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          Welcome to{" "}
          <span className="text-gradient relative">
            Notionary
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary to-violet-600 rounded-full"></span>
          </span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          A professional workspace for your thoughts, ideas, and daily tasks.
          Everything stays organized, beautiful, and accessible.
        </p>
      </div>

      {/* Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
              <p className="text-3xl font-bold mt-2">{notes.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PenSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold mt-2">{notes.filter(n => n.updatedAt).length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage</p>
              <p className="text-3xl font-bold mt-2">∞</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Create Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-card rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <Link
          href="/create"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Create Note</span>
        </Link>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border-2 border-dashed border-border">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-violet-600/10 flex items-center justify-center">
            <PenSquare className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {search ? "No matching notes" : "Your notebook is empty"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            {search ? "Try a different search term" : "Start capturing your thoughts, ideas, and tasks"}
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create your first note
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              All Notes <span className="text-muted-foreground">({filteredNotes.length})</span>
            </h2>
            <div className="text-sm text-muted-foreground">
              Sorted by: <span className="font-medium text-foreground">Recent</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Link
                key={note._id}
                href={`/edit/${note._id}`}
                className="group relative glass-card border border-border rounded-2xl p-6 hover-card flex flex-col h-full overflow-hidden"
              >
                {/* Note accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors pr-4">
                      {note.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>

                  <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed mb-6">
                    {note.content}
                  </p>
                </div>

                <div className="pt-5 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <time className="text-xs font-medium text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => deleteNote(note._id, e)}
                      className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Mobile FAB */}
      <Link
        href="/create"
        className="fixed md:hidden bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-br from-primary to-violet-600 text-white rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform" />
      </Link>
    </div>
  );
}