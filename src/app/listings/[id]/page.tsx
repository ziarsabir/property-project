import { fmtGBP } from "@/lib/format";
import { notFound } from "next/navigation";
import EnquiryBox from "@/components/EnquiryBox";
import SavePropertyButton from "@/components/SavePropertyButton";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import { getPropertyListingById } from "@/lib/propertyListings";
import { getPropertyImageUrls } from "@/lib/propertyImages";

export const revalidate = 60;

export default async function ListingPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  // Get the real Nest property ID from the dynamic URL.
  // Example:
  // /listings/22466427
  // gives us id = "22466427"
  const { id } = await params;

  // Use the Nest property ID to find the matching property
  // from the Nest Excel data stored in Azure Blob Storage.
  const property = await getPropertyListingById(id);

  // If no property exists with this ID,
  // show the standard Next.js 404 page.
  if (!property) {
    return notFound();
  }

  // Get all Azure image URLs belonging to this property.
  //
  // Example result:
  // [
  //   "/api/property-images/22466427/1.jpeg",
  //   "/api/property-images/22466427/2.jpeg",
  //   "/api/property-images/22466427/3.jpeg"
  // ]
  const images = await getPropertyImageUrls(property.id);

  return (
    <article className="grid gap-6 lg:grid-cols-2">
      <section>
        {/* 
          Pass all of this property's Azure image URLs
          into the client-side gallery component.

          The gallery controls which image is currently
          selected and displayed as the large main image.
        */}
        <PropertyImageGallery
          images={images}
          title={property.title}
        />

        {/* Property information */}
        <h1 className="mt-4 text-2xl font-bold">
          {property.title}
        </h1>

        <p className="mt-1 text-slate-600">
          {property.address}
        </p>

        {/* Property price */}
        <div className="mt-3 text-lg font-semibold">
          {fmtGBP(property.price)}
          {property.listingType === "RENT"
            ? " pcm"
            : ""}
        </div>

        {/* 
          Save button sends the real Nest property ID
          to the saved-properties API route.
        */}
        <div className="mt-4">
          <SavePropertyButton
            listingId={property.id}
          />
        </div>

        {/* Basic property details */}
        <div className="mt-2 text-sm text-slate-700">
          {property.beds} bed •{" "}
          {property.baths} bath •{" "}
          {property.town}{" "}
          {property.postcode}
        </div>
      </section>

      {/* Property enquiry form */}
      <aside className="lg:sticky lg:top-6 h-fit">
        <EnquiryBox
          subject={`Enquiry about: ${property.title} (${property.id})`}
        />
      </aside>
    </article>
  );
}