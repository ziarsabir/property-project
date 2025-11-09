// /types/listing.ts

export type Listing = {
  id: string;
  title: string;
  price: number;            // GBP or monthly rent
  listingType: "SALE" | "RENT";
  beds: number;
  baths: number;
  city: string;
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  photo?: string;
  listedAt: string;         // ISO timestamp string
};
