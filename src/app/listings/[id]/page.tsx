import Image from "next/image";
import { fmtGBP } from "@/lib/format";
import { notFound } from "next/navigation";
import EnquiryBox from "@/components/EnquiryBox";
import SavePropertyButton from "@/components/SavePropertyButton";
import { getPropertyListingById } from "@/lib/propertyListings";

export const revalidate = 60;

export default async function ListingPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  // Get the real Nest property ID from the URL
  const { id } = await params;

  // Find the property in the Nest data stored in Azure
  const property = await getPropertyListingById(id);

  // Return the Next.js 404 page if no matching property exists
  if (!property) {
    return notFound();
  }

  return (
    <article className="grid gap-6 lg:grid-cols-2">
      <section>
        {/* Main property image */}
        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-100">
          {property.photo ? (
            <Image
              src={property.photo}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-600">
              No image available
            </div>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold">
          {property.title}
        </h1>

        <p className="mt-1 text-slate-600">
          {property.address}
        </p>

        <div className="mt-3 text-lg font-semibold">
          {fmtGBP(property.price)}
          {property.listingType === "RENT"
            ? " pcm"
            : ""}
        </div>

        {/* Save button sends the real Nest property ID */}
        <div className="mt-4">
          <SavePropertyButton
            listingId={property.id}
          />
        </div>

        <div className="mt-2 text-sm text-slate-700">
          {property.beds} bed •{" "}
          {property.baths} bath •{" "}
          {property.town}{" "}
          {property.postcode}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 h-fit">
        <EnquiryBox
          subject={`Enquiry about: ${property.title} (${property.id})`}
        />
      </aside>
    </article>
  );
}