import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials as any;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) return null;

                    return user;
                } catch (error) {
                    console.log("Error: ", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user._id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
});
