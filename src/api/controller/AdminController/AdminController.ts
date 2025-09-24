import { Request, Response } from "express";
import AdminService from "../../services/AdminService/AdminService";
import IAdminController from "./AdminController.interface";
import { CreateVendorDTO, VendorResponseDTO } from "../../dto/Vendor.dto";
import { ControllerPayload } from "../../../constants";
import { ValidationError, BusinessLogicError } from "../../utils/Error";
import { VendorDoc } from "../../entities";
import logger from "../../../infrastructure/logger/winston";

export default class AdminController implements IAdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  createVendor = async (
    payload: ControllerPayload
  ): Promise<VendorResponseDTO> => {
    try {
      // step 1: - take the request body from frontend and create a instance of CreateVendorDTO
      const createVendorDTO: CreateVendorDTO = new CreateVendorDTO(
        payload.req.body
      );

      // step 2: - call service layer or logic layer pass the dto instance
      const vendor: VendorDoc = await this.adminService.createVendor(
        createVendorDTO
      );

      // step 3: - convert to response dto to exclude sensitive data
      const vendorResponse: VendorResponseDTO = new VendorResponseDTO(vendor);
      return vendorResponse;
    } catch (error) {
      logger.error("Error in AdminController.createVendor:", error);
      throw new Error("Failed to create vendor");
    }
  };

  getAllVendor = async (
    payload: ControllerPayload
  ): Promise<VendorResponseDTO[]> => {
    try {
      const vendors: VendorDoc[] = await this.adminService.getAllVendor();

      const vendorResponse: VendorResponseDTO[] = vendors.map((vendor) => {
        return new VendorResponseDTO(vendor);
      });

      return vendorResponse;
    } catch (error) {
      logger.error("Error in AdminController.getAllVendor:", error);
      throw new Error("Failed to get vendors");
    }
  };

  getVendorById = async (
    payload: ControllerPayload
  ): Promise<VendorResponseDTO> => {
    const vendorId: string = payload.req.params.id;

    try {
      const vendor: VendorDoc = await this.adminService.getVendorByID(vendorId);

      const vendorResponse: VendorResponseDTO = new VendorResponseDTO(vendor);

      return vendorResponse;
    } catch (error) {
      logger.error("Error in AdminController.getVendorByID:", error);
      throw new Error("Failed to get vendor by ID");
    }
  };
}
