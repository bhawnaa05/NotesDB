import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// CREATE NOTE
export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { title, content } = await request.json();

  await connectMongoDB();
  // We can lookup userId from email, but for now let's modify User model to be used or just store email if sufficient, 
  // but better to fetch user ID. Since we are using an adapter-less setup for now, let's fetch user by email first.
  // Actually, let's update User model reference or just use email as unique identifier if we don't want another roundtrip?
  // No, we should use session.user.email to find the user.

  // Since we don't have user ID in session by default with Credentials unless we customize it, let's assume we find user.
  // We need to import User model to find ID.
  // Optimization: Customize auth.ts to include ID in session.

  // For now, let's do a lookup.
  const User = (await import("@/models/User")).default;
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const created = await Note.create({ title, content, userId: user._id });

  const note = {
    _id: created._id.toString(),
    title: created.title,
    content: created.content,
    createdAt: created.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  return NextResponse.json({ note }, { status: 201 });
}

// GET ALL NOTES
export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  await connectMongoDB();
  const User = (await import("@/models/User")).default;
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    // Return empty if user technically doesn't exist yet but has session (rare edge case)
    return NextResponse.json({ notes: [] });
  }

  const notes = await Note.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

  const serialized = notes.map(n => ({
    ...n,
    _id: (n as any)._id.toString(),
    createdAt: n.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  return NextResponse.json({ notes: serialized });
}
