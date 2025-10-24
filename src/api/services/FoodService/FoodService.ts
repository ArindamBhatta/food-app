import { FoodDoc, VendorDoc } from "../../entities";
import { CreateFoodInput } from "../../dto/interface/Food.dto";
import VendorRepo from "../../repos/VendorRepo/VendorRepo";
import { UploadApiResponse } from "cloudinary";
import { uploadBuffer } from "../../utils/UploadPicture.utility";
import IFoodService from "./FoodService.interface";
import FoodRepo from "../../repos/FoodRepo/FoodRepo";

export default class FoodService implements IFoodService {
  private vendorRepo: VendorRepo;
  private foodRepo: FoodRepo;

  constructor(vendorRepo: VendorRepo, foodRepo: FoodRepo) {
    this.vendorRepo = vendorRepo;
    this.foodRepo = foodRepo;
  }

  addFood = async (
    vendorId: string,
    input: CreateFoodInput,
    files: Express.Multer.File[]
  ): Promise<FoodDoc> => {
    // 1) find vendor
    const vendor: VendorDoc | null = await this.vendorRepo.findVendor({
      vendorId,
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // 2) upload images to Cloudinary
    const uploads: Promise<UploadApiResponse>[] = files.map((f) =>
      uploadBuffer(f)
    );
    const results = await Promise.all(uploads);
    const imageUrls = results.map((r) => r.secure_url);

    // 3) call repo layer
    const createdFood = await this.foodRepo.addFood(vendorId, input, imageUrls);
    return createdFood;
  };

  getFoods = async (vendorId: string) => {
    // ensure vendor exists (optional but consistent with other flows)
    const vendor: VendorDoc | null = await this.vendorRepo.findVendor({
      vendorId,
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return this.foodRepo.getFoods(vendorId);
  };
}
