import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

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
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 selection:bg-primary/20 selection:text-primary-foreground antialiased">
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

        {/* Enhanced Header */}
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
                <a 
                  href="https://github.com/bhawnaa05/NotesDB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </nav>
            </div>
          </div>
        </header>

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
      </body>
    </html>
  );
}