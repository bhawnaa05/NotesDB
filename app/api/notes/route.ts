import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

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
  const notes = await Note.find().sort({ createdAt: -1 }).lean();

  const serialized = notes.map(n => ({
    ...n,
    _id: (n as any)._id.toString(),
    createdAt: n.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  return NextResponse.json({ notes: serialized });
}
