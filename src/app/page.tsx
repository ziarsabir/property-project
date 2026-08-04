import { listings } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { Property } from "@/models/Property";

export default function HomePage() {
  // Convert the raw listing data into Property objects
  const latest = listings
    .slice(0, 4)
    .map((listing) => Property.fromListing(listing));

  return (
    <div>
      <section className="py-8">
        <h1 className="text-2xl font-bold mb-2">
          Find your next home
        </h1>

        <p className="text-slate-600 mb-6">
          Search properties for sale or to rent across the UK.
        </p>

        <a
          href="/search"
          className="inline-block px-4 py-2 rounded bg-slate-900 text-white"
        >
          Start searching
        </a>
      </section>

      <section className="py-6">
        <h2 className="text-xl font-semibold mb-4">
          Latest listings
        </h2>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {latest.map((property) => (
            <ListingCard
              key={property.id}
              l={property}
            />
          ))}
        </div>
      </section>
    </div>
  );
}