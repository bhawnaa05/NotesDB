"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <header className="sticky top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-violet-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/25 ring-2 ring-white/20 group-hover:shadow-primary/35 group-hover:scale-105 transition-all duration-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gradient">Notionary</span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        {status === "loading" ? (
                            // Loading skeleton
                            <div className="h-9 w-24 bg-muted/20 rounded-lg animate-pulse"></div>
                        ) : session?.user ? (
                            <UserMenu user={session.user} />
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
