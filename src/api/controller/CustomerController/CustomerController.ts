import { ControllerPayload } from "../../../constants";
import {
  CreateCustomerDTO,
  CustomerLoginDTO,
  EditCustomerProfileInputs,
} from "../../dto/interface/Customer.dto";
import ICustomerController from "./CustomerController.interface";
import CustomerService from "../../services/CustomerService/CustomerService";

export default class CustomerController implements ICustomerController {
  private customerService: CustomerService;
  constructor(customerService: CustomerService) {
    this.customerService = customerService;
  }

  signUp = async (payload: ControllerPayload) => {
    try {
      const input: CreateCustomerDTO = new CreateCustomerDTO(payload.req.body);
      const { customer, otp } = await this.customerService.signUp(input);
      // Optionally send OTP here
      return {
        status: 201,
        customer,
        otp, // In production, never return OTP in response!
        message: "Customer created, OTP sent",
      };
    } catch (error: any) {
      return {
        status: 500,
        error: { message: error.message || "Customer signup failed" },
      };
    }
  };

  otpVerify = async (payload: ControllerPayload) => {
    try {
      const { otp } = payload.req.body;
      const customer = payload.req.user;
      if (!customer || !customer._id) {
        return {
          status: 401,
          error: { message: "User not authenticated" },
        };
      }
      const result = await this.customerService.verifyOtp(
        customer._id.toString(),
        parseInt(otp)
      );
      if (!result.customer) {
        return {
          status: 400,
          error: { message: "Invalid OTP or Expired" },
        };
      }
      return {
        status: 201,
        signature: result.signature,
        verified: result.customer.verified,
        email: result.customer.email,
      };
    } catch (error: any) {
      return {
        status: 500,
        error: { message: error.message || "OTP verification failed" },
      };
    }
  };

  signIn = async (payload: ControllerPayload) => {
    try {
      const input: CustomerLoginDTO = payload.req.body;
      const customer = await this.customerService.signIn(
        input.email,
        input.password
      );
      if (!customer) {
        return {
          status: 401,
          error: { message: "Invalid email or password" },
        };
      }
      return {
        status: 200,
        signature: customer.signature,
      };
    } catch (error: any) {
      return {
        status: 500,
        error: { message: error.message || "Sign-in failed" },
      };
    }
  };

  requestOtp = async (payload: ControllerPayload) => {
    try {
      const input: CustomerLoginDTO = payload.req.body;
      const customer = await this.customerService.requestOtp(input.email);
      if (!customer) {
        return {
          status: 401,
          error: { message: "Invalid email or password" },
        };
      }
      return {
        status: 200,
        customer,
      };
    } catch (error: any) {
      return {
        status: 500,
        error: { message: error.message || "Sign-in failed" },
      };
    }
  };

  fillProfile = async (payload: ControllerPayload) => {
    const customer = payload.req.user;

    const input: EditCustomerProfileInputs = payload.req.body;

    if (customer) {
      const updatedCustomer = await this.customerService.updateProfile(
        customer._id.toString(),
        input
      );
      return {
        status: 200,
        customer: updatedCustomer,
      };
    }
    return {
      status: 401,
      error: { message: "User not authenticated" },
    };
  };
}
