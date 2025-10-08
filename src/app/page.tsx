import { listings } from "@/data/listings";
import ListingCard from "@/components/ListingCard";

export default function HomePage() {
  const latest = listings.slice(0, 6);
  return (
    <div>
      <section className="py-8">
        <h1 className="text-2xl font-bold mb-2">Find your next home</h1>
        <p className="text-slate-600 mb-6">Search properties for sale or to rent across the UK.</p>
        <a href="/search" className="inline-block px-4 py-2 rounded bg-slate-900 text-white">Start searching</a>
      </section>
      <section className="py-6">
        <h2 className="text-xl font-semibold mb-4">Latest listings</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {latest.map(l => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>
    </div>
  );
}
