import ListingCard from "@/components/ListingCard";
import { Property } from "@/models/Property";
import { getPropertyListings } from "@/lib/propertyListings";

export default async function HomePage() {
  // Load the real Nest property listings from Azure Blob Storage
  const listings = await getPropertyListings();

  /**
   * Sort the listings by their listed date so the newest
   * properties appear first.
   *
   * Create a copy with [...listings] before sorting so the
   * original listings array is not changed.
   */
  const latestListings = [...listings]
    .sort(
      (a, b) =>
        new Date(b.listedAt).getTime() -
        new Date(a.listedAt).getTime()
    )
    .slice(0, 4);

  // Convert the raw Listing objects into richer Property domain objects
  // before passing them into ListingCard.
  const latestProperties = latestListings.map((listing) =>
    Property.fromListing(listing)
  );

  return (
    <div>
      <section className="py-8">
        <h1 className="mb-2 text-2xl font-bold">
          Find your next home
        </h1>

        <p className="mb-6 text-slate-600">
          Search properties for sale or to rent across the UK.
        </p>

        <a
          href="/search"
          className="inline-block rounded bg-slate-900 px-4 py-2 text-white"
        >
          Start searching
        </a>
      </section>

      <section className="py-6">
        <h2 className="mb-4 text-xl font-semibold">
          Latest listings
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {latestProperties.map((property) => (
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