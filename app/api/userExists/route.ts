import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");
        console.log("User: ", user);
        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "An error occurred while checking for existing user." },
            { status: 500 }
        );
    }
}
