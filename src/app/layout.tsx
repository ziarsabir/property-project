import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers"; // 👈 ADD THIS

export const metadata: Metadata = {
  title: "Homefinder (dev)",
  description: "Zoopla-style marketplace (MVP)",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        {/* 👇 WRAP EVERYTHING IN PROVIDERS */}
        <Providers>
          <div className="max-w-5xl mx-auto px-4">
            <Header />
            <main className="py-6">{children}</main>
            <Footer />
          </div>
        </Providers>
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

      <nav className="flex gap-4 text-sm items-center">
        <Link href="/search" className="hover:underline">
          Search
        </Link>

        <Link href="/contact" className="hover:underline">
          Contact
        </Link>

        <Link
          href="/signin"
          className="rounded-md border px-3 py-1 font-medium hover:bg-slate-100 transition"
        >
          Sign in
        </Link>
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