import { listings } from "@/data/listings";
import Image from "next/image";
import { fmtGBP } from "@/lib/format";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return listings.map(l => ({ id: l.id }));
}

export const revalidate = 60;

export default function ListingPage({ params }: { params: { id: string } }) {
  const l = listings.find(x => x.id === params.id);
  if (!l) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": l.title,
    "address": { "@type": "PostalAddress", "addressLocality": l.city, "postalCode": l.postcode, "streetAddress": l.address },
    "offers": { "@type": "Offer", "price": l.price, "priceCurrency": "GBP" }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="grid md:grid-cols-2 gap-6">
        <div className="relative w-full h-80 bg-slate-100 rounded-md overflow-hidden">
          {l.photo && <Image src={l.photo} alt={l.title} fill className="object-cover" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{l.title}</h1>
          <p className="text-slate-600 mt-1">{l.address}</p>
          <div className="mt-3 text-lg font-semibold">
            {fmtGBP(l.price)}{l.listingType === "RENT" ? " pcm" : ""}
          </div>
          <div className="mt-2 text-sm">{l.beds} bed • {l.baths} bath • {l.city} {l.postcode}</div>
          <div className="mt-6">
            <button className="px-4 py-2 rounded bg-slate-900 text-white">Contact agent</button>
          </div>
        </div>
      </article>
    </>
  );
}
