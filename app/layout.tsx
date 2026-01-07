import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Notionary | Premium Notes",
  description: "Capture your thoughts in style. A professional note-taking experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 selection:bg-primary/20 selection:text-primary-foreground antialiased">
        <Providers>
          {/* Animated background */}
          <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

          {/* Gradient orb effects */}
          <div className="fixed top-0 left-1/4 -z-10 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="fixed bottom-0 right-1/4 -z-10 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid hsl(var(--border))',
                boxShadow: 'var(--shadow-xl)',
                padding: '16px',
                fontSize: '14px'
              }
            }}
          />

          <Navbar />

          <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28">
            {children}
          </main>

          {/* Enhanced Footer */}
          <footer className="border-t border-border/40 py-8">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600"></div>
                  <span className="font-semibold text-gradient">Notionary</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Notionary. All thoughts preserved with care.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}