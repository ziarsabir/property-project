import type { Listing } from "@/data/listings";

/**
 * The Property class represents a property listing within the application.
 *
 * It encapsulates the data and behaviour that belong specifically
 * to a property, such as its details, location and listing information.
 *
 * This class is not responsible for rendering UI, fetching data,
 * or reading/writing data to storage. Those responsibilities belong
 * to other parts of the application.
 */

// Provides type safety by allowing only two valid listing types
export type ListingType = "SALE" | "RENT";

// Describes the information required to create a Property object
type PropertyConstructor = {
  id: string;
  title: string;
  price: number;
  listingType: ListingType;
  beds: number;
  baths: number;
  city: string;
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  photo?: string;
  listedAt: Date;
};

export class Property {
  // These properties represent the state owned by every Property object
  id: string;
  title: string;
  price: number;
  listingType: ListingType;
  beds: number;
  baths: number;
  city: string;
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  photo?: string;
  listedAt: Date;

  // The constructor runs whenever a new Property object is created.
  // Destructuring gives direct access to each constructor value.
  constructor({
    id,
    title,
    price,
    listingType,
    beds,
    baths,
    city,
    postcode,
    address,
    lat,
    lng,
    photo,
    listedAt,
  }: PropertyConstructor) {
    // Prevent invalid Property objects from being created
    if (price <= 0) {
      throw new Error("Property price must be greater than zero.");
    }

    if (beds < 0) {
      throw new Error("Bedrooms cannot be negative.");
    }

    if (baths < 0) {
      throw new Error("Bathrooms cannot be negative.");
    }

    // Store the incoming constructor values on the new Property object
    this.id = id;
    this.title = title;
    this.price = price;
    this.listingType = listingType;
    this.beds = beds;
    this.baths = baths;
    this.city = city;
    this.postcode = postcode;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.photo = photo;
    this.listedAt = listedAt;
  }

  /**
   * Creates a Property object from raw listing data.
   *
   * The Listing type represents data received from an external source
   * (for example a REST API), where dates are typically strings.
   * This factory method converts that raw data into a richer
   * Property domain object.
   */
  static fromListing(listing: Listing): Property {
    return new Property({
      ...listing,
      listedAt: new Date(listing.listedAt),
    });
  }

  // Checks whether the property is listed for sale
  isForSale(): boolean {
    return this.listingType === "SALE";
  }

  // Checks whether the property is listed for rent
  isForRent(): boolean {
    return this.listingType === "RENT";
  }

  // Updates the property's price after validating it
  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error("Property price must be greater than zero.");
    }

    this.price = newPrice;
  }
}