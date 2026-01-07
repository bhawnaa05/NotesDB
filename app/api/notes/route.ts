import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// CREATE NOTE
export async function POST(request: Request) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;

  if (!session || !user || !user.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { title, content } = await request.json();

  await connectMongoDB();

  // Optimized: Use ID from session
  const created = await Note.create({ title, content, userId: user.id });

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;

  if (!session || !user || !user.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  await connectMongoDB();

  // Optimized: Use ID from session directly
  // Using lean() for performance
  const notes = await Note.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

  const serialized = notes.map(n => ({
    ...n,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: (n as any)._id.toString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt: (n as any).createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  return NextResponse.json({ notes: serialized });
}
