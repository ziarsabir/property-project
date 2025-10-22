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
  },
  {
    id: "l4",
    title: "4-bed detached family home",
    price: 625000,
    listingType: "SALE",
    beds: 4,
    baths: 3,
    city: "Birmingham",
    postcode: "B15 3AA",
    address: "10 Edgbaston Rd, Birmingham",
    lat: 52.4534,
    lng: -1.9341,
    photo: "https://images.unsplash.com/photo-1572120360610-d971b9b78825",
    listedAt: "2025-09-15T15:45:00Z"
  },
  {
    id: "l5",
    title: "Modern 2-bed apartment in city centre",
    price: 1650,
    listingType: "RENT",
    beds: 2,
    baths: 2,
    city: "Leeds",
    postcode: "LS1 4AG",
    address: "22 Wellington St, Leeds",
    lat: 53.7974,
    lng: -1.5536,
    photo: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    listedAt: "2025-09-14T11:00:00Z"
  },
  {
    id: "l6",
    title: "1-bed flat overlooking the Royal Mile",
    price: 310000,
    listingType: "SALE",
    beds: 1,
    baths: 1,
    city: "Edinburgh",
    postcode: "EH1 1QS",
    address: "7 High St, Edinburgh",
    lat: 55.9508,
    lng: -3.1903,
    photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    listedAt: "2025-09-12T09:15:00Z"
  },
  {
    id: "l7",
    title: "Spacious 3-bed apartment with waterfront views",
    price: 2250,
    listingType: "RENT",
    beds: 3,
    baths: 2,
    city: "Liverpool",
    postcode: "L3 1BP",
    address: "45 The Strand, Liverpool",
    lat: 53.4034,
    lng: -2.9935,
    photo: "https://images.unsplash.com/photo-1501183638710-841dd1904471",
    listedAt: "2025-09-10T17:20:00Z"
  },
  {
    id: "l8",
    title: "2-bed flat near Clifton Suspension Bridge",
    price: 495000,
    listingType: "SALE",
    beds: 2,
    baths: 2,
    city: "Bristol",
    postcode: "BS8 3AH",
    address: "14 Royal York Crescent, Bristol",
    lat: 51.4545,
    lng: -2.6204,
    photo: "https://images.unsplash.com/photo-1502005097973-6a7082348e28",
    listedAt: "2025-09-08T13:00:00Z"
  }
];