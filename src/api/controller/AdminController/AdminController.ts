import { Request, Response } from "express";
import AdminService from "../../services/AdminService/AdminService";
import { IAdminController } from "./AdminController.interface";
import { CreateVendorDTO, VendorResponseDTO } from "../../dto/Vendor.dto";
import { ControllerPayload } from "../../../constants";
import { ValidationError, BusinessLogicError } from "../../utils/Error";

export default class AdminController implements IAdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  createVendor = async (payload: ControllerPayload): Promise<Response> => {
    try {
      // Validate and create DTO
      const createVendorDTO = new CreateVendorDTO(payload.req.body);

      // Call service layer
      const vendor = await this.adminService.createVendor(createVendorDTO);

      // Convert to response DTO to exclude sensitive data
      const vendorResponse = new VendorResponseDTO(vendor);

      return payload.res.status(201).json({
        success: true,
        message: "Vendor created successfully!",
        data: vendorResponse,
      });
    } catch (error) {
      console.error("Error in AdminController.createVendor:", error);

      if (error instanceof ValidationError) {
        return payload.res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      if (error instanceof BusinessLogicError) {
        return payload.res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return payload.res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
