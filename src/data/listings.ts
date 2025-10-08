export type Listing = {
  id: string;
  title: string;
  price: number;            // GBP
  listingType: "SALE" | "RENT";
  beds: number;
  baths: number;
  city: string;
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  photo?: string;
  listedAt: string;         // ISO
};

export const listings: Listing[] = [
  {
    id: "l1",
    title: "1-bed flat near Hyde Park",
    price: 525000,
    listingType: "SALE",
    beds: 1,
    baths: 1,
    city: "London",
    postcode: "W2 2UH",
    address: "12 Bayswater Rd, London",
    lat: 51.5115,
    lng: -0.1848,
    photo: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    listedAt: "2025-09-20T10:00:00Z"
  },
  {
    id: "l2",
    title: "3-bed terraced house",
    price: 2850, // monthly rent
    listingType: "RENT",
    beds: 3,
    baths: 2,
    city: "London",
    postcode: "SW11 1AA",
    address: "24 Lavender Hill, London",
    lat: 51.4647,
    lng: -0.1636,
    photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
    listedAt: "2025-09-18T09:00:00Z"
  },
  {
    id: "l3",
    title: "2-bed flat with balcony",
    price: 375000,
    listingType: "SALE",
    beds: 2,
    baths: 1,
    city: "Manchester",
    postcode: "M1 1AE",
    address: "3 Piccadilly, Manchester",
    lat: 53.4794,
    lng: -2.2453,
    photo: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    listedAt: "2025-09-17T12:30:00Z"
  }
];
