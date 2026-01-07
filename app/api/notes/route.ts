import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";


// CREATE NOTE
// CREATE NOTE
export async function POST(request: Request) {
  const { title, content } = await request.json();

  await connectMongoDB();

  const created = await Note.create({ title, content });

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
  await connectMongoDB();

  const notes = await Note.find({}).sort({ createdAt: -1 }).lean();

  const serialized = notes.map(n => ({
    ...n,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: (n as any)._id.toString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt: (n as any).createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  return NextResponse.json({ notes: serialized });
}
