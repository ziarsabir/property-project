/**
 * Represents raw property listing data used by Homefinder.
 *
 * Dates are stored as strings because Listing objects represent
 * data received from sources such as the listings API.
 */
export type Listing = {
  id: string;
  title: string;
  price: number;
  listingType: "SALE" | "RENT";
  beds: number;
  baths: number;
  town: string;
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  photo?: string;
  listedAt: string;
};