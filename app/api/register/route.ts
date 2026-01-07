import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email }).select("_id");
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User registered." }, { status: 201 });
    } catch (error: any) {
        console.error("Registration Error:", error);

        // Handle duplicate key error if it slips through race condition
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "User already exists." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }
}
