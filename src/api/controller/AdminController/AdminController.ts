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

  createVendor = async (payload: ControllerPayload): Promise<Response> => {
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

  getVendorById = async (payload: ControllerPayload) => {
    const vendorId: string = payload.req.params.id;

    try {
      const vendor: VendorDoc = await this.adminService.getVendorByID(vendorId);

      const vendorResponse: VendorResponseDTO = new VendorResponseDTO(vendor);

      return payload.res.status(200).json({
        success: true,
        message: "Vendor retrieved successfully!",
        data: vendorResponse,
      });
    } catch (error) {
      logger.error("Error in AdminController.getVendorByID:", error);

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
