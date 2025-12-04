//moving the interface out of the Mongoose fil
export interface VendorEntity {
  id?: string; // vendorId but not MongoDB-specific
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: string[];
  rating: number;
  foods: string[]; // use IDs only (domain doesn’t know what Mongoose "ref" is)
  refreshToken?: string | null;
  refreshTokenUpdatedAt?: Date | null;
}
