import { Listing } from "@/data/listings";
import { fmtGBP } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

export default function ListingCard({ l }: { l: Listing }) {
  return (
    <Link href={`/listing/${l.id}`} className="block border rounded-lg overflow-hidden hover:shadow-md transition">
      <div className="relative h-40 bg-slate-100">
        {l.photo && <Image src={l.photo} alt={l.title} fill className="object-cover" />}
      </div>
      <div className="p-3">
        <div className="text-sm text-slate-500">{l.city} • {l.postcode}</div>
        <h3 className="font-semibold">{l.title}</h3>
        <div className="text-sm mt-1">{l.beds} bed • {l.baths} bath • {l.listingType}</div>
        <div className="mt-2 font-bold">
          {fmtGBP(l.price)}{l.listingType === "RENT" ? " pcm" : ""}
        </div>
      </div>
    </Link>
  );
}
