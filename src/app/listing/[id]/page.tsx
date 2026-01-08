import { listings } from "@/data/listings";
import Image from "next/image";
import { fmtGBP } from "@/lib/format";
import { notFound } from "next/navigation";
import EnquiryBox from "@/components/EnquiryBox";

export async function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export const revalidate = 60;

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const l = listings.find((x) => x.id === id);
  if (!l) return notFound();

  return (
    <article className="grid gap-6 lg:grid-cols-2">
      <section>
        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-100">
          {l.photo ? (
            <Image
              src={l.photo}
              alt={l.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : null}
        </div>

        <h1 className="mt-4 text-2xl font-bold">{l.title}</h1>
        <p className="mt-1 text-slate-600">{l.address}</p>

        <div className="mt-3 text-lg font-semibold">
          {fmtGBP(l.price)}
          {l.listingType === "RENT" ? " pcm" : ""}
        </div>

        <div className="mt-2 text-sm text-slate-700">
          {l.beds} bed • {l.baths} bath • {l.city} {l.postcode}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 h-fit">
        <EnquiryBox subject={`Enquiry about: ${l.title} (${l.id})`} />
      </aside>
    </article>
  );
}