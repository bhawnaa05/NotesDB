import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

// GET SINGLE NOTE
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectMongoDB();
  const found = await Note.findById(id).lean();
  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const note = {
    ...found,
    _id: (found as any)._id.toString(),
    createdAt: found.createdAt?.toISOString() ?? new Date().toISOString(),
  };

  return NextResponse.json({ note });
}

// UPDATE NOTE
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, content } = await request.json();

  await connectMongoDB();
  await Note.findByIdAndUpdate(id, { title, content });

  return NextResponse.json({ message: "Note updated" });
}

// DELETE NOTE
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectMongoDB();
  await Note.findByIdAndDelete(id);

  return NextResponse.json({ message: "Note deleted" });
}
