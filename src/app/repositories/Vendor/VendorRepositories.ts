import { Vendor, VendorDoc } from "../../entities";
import { CreateVendorInput } from "../../dto";

export class VendorRepository {
  /**
   * Find vendor by ID or email
   */
  static async findVendor(
    id?: string,
    email?: string
  ): Promise<VendorDoc | null> {
    if (email) {
      return await Vendor.findOne({ email: email });
    } else if (id) {
      return await Vendor.findById(id);
    }
    return null;
  }

  /**
   * Create a new vendor
   */
  static async createVendor(
    vendorData: CreateVendorInput & {
      password: string;
      salt: string;
    }
  ): Promise<VendorDoc> {
    return await Vendor.create({
      name: vendorData.name,
      address: vendorData.address,
      pincode: vendorData.pincode,
      foodType: vendorData.foodType,
      email: vendorData.email,
      password: vendorData.password,
      salt: vendorData.salt,
      ownerName: vendorData.ownerName,
      phone: vendorData.phone,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
      foods: [],
    });
  }

  /**
   * Get all vendors
   */
  static async findAllVendors(): Promise<VendorDoc[]> {
    return await Vendor.find();
  }

  /**
   * Find vendor by ID
   */
  static async findVendorById(id: string): Promise<VendorDoc | null> {
    return await Vendor.findById(id);
  }

  /**
   * Update vendor by ID
   */
  static async updateVendor(
    id: string,
    updateData: Partial<VendorDoc>
  ): Promise<VendorDoc | null> {
    return await Vendor.findByIdAndUpdate(id, updateData, { new: true });
  }

  /**
   * Delete vendor by ID
   */
  static async deleteVendor(id: string): Promise<VendorDoc | null> {
    return await Vendor.findByIdAndDelete(id);
  }

  /**
   * Check if vendor exists by email
   */
  static async existsByEmail(email: string): Promise<boolean> {
    const vendor = await Vendor.findOne({ email });
    return vendor !== null;
  }
}
