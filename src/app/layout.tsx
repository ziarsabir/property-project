import type { Metadata } from "next";
import Link from "next/link"; 
import "./globals.css";

export const metadata: Metadata = {
  title: "Homefinder (dev)",
  description: "Zoopla-style marketplace (MVP)",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <Header />
          <main className="py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="py-4 flex items-center justify-between border-b">
      <Link href="/" className="text-xl font-bold">
        Homefinder
      </Link>

      <nav className="flex gap-4 text-sm">
        <Link href="/search" className="hover:underline">
          Search
        </Link>
        <span className="opacity-60">Sign in (later)</span>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t mt-10 text-sm text-slate-500">
      <p>© {new Date().getFullYear()} Homefinder • MVP</p>
    </footer>
  );
}
