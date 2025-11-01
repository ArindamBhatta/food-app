import { ControllerPayload } from "../../../constants";
import {
  CreateCustomerDTO,
  CustomerLoginDTO,
  CustomerPayload,
  EditCustomerProfileInputs,
} from "../../dto/interface/Customer.dto";
import ICustomerController from "./CustomerController.interface";
import { Customer, CustomerDoc } from "../../entities/Customer";
import { Food } from "../../entities/Food";
import { OrderInputs } from "../../dto/interface/Customer.dto";
import CustomerService from "../../services/CustomerService/CustomerService";
import { AuthPayload } from "../../dto/Auth.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth.utility";

export default class CustomerController implements ICustomerController {
  private customerService: CustomerService;
  constructor(customerService: CustomerService) {
    this.customerService = customerService;
  }

  signUp = async (payload: ControllerPayload) => {
    try {
      const input: CreateCustomerDTO = new CreateCustomerDTO(payload.req.body);
      const { otp } = await this.customerService.signUp(input);

      // Don't generate tokens here - wait for OTP verification
      return payload.res.status(201).json({
        otp,
        message:
          "Customer created, OTP sent. Please verify OTP to complete registration.",
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Customer signup failed" },
      });
    }
  };

  otpVerify = async (payload: ControllerPayload) => {
    try {
      const { otp, email, phone } = payload.req.body;

      // Validate that we have either email or phone to identify the user
      if (!email && !phone) {
        return payload.res.status(400).json({
          error: {
            message: "Email or phone number is required for OTP verification",
          },
        });
      }

      if (!otp) {
        return payload.res.status(400).json({
          error: { message: "OTP is required" },
        });
      }

      const result = await this.customerService.verifyOtp(
        parseInt(otp),
        email,
        phone
      );

      if (!result.customer) {
        return payload.res.status(400).json({
          error: { message: "Invalid OTP or Expired" },
        });
      }

      // Generate tokens after OTP verification
      const authPayload: CustomerPayload = {
        _id: (result.customer._id as any).toString(),
        email: result.customer.email,
        role: "customer" as const,
        verified: result.customer.verified,
      };
      const accessToken = generateAccessToken(authPayload);
      const refreshToken = generateRefreshToken(authPayload);

      return payload.res.status(201).json({
        accessToken,
        refreshToken,
        verified: result.customer.verified,
        email: result.customer.email,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "OTP verification failed" },
      });
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
        return payload.res.status(401).json({
          error: { message: "Invalid email or password" },
        });
      }
      if (!customer.customer.verified) {
        return payload.res.status(403).json({
          error: { message: "Please verify OTP first." },
        });
      }
      // Generate tokens after successful sign-in
      const tokenPayload = {
        _id: (customer.customer._id as any).toString(),
        email: customer.customer.email,
        role: "customer" as const,
        verified: customer.customer.verified,
      };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);
      return payload.res.status(200).json({
        accessToken,
        refreshToken,
        signature: customer.signature,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Sign-in failed" },
      });
    }
  };

  requestOtp = async (payload: ControllerPayload) => {
    try {
      const input: CustomerLoginDTO = payload.req.body;
      const customer = await this.customerService.requestOtp(input.email);
      if (!customer) {
        return payload.res.status(401).json({
          error: { message: "Invalid email or password" },
        });
      }
      return payload.res.status(200).json({
        customer,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Request OTP failed" },
      });
    }
  };

  fillProfile = async (payload: ControllerPayload) => {
    try {
      const customer = payload.req.user;
      const input: EditCustomerProfileInputs = payload.req.body;

      if (!customer) {
        return payload.res.status(401).json({
          error: { message: "User not authenticated" },
        });
      }

      const updatedCustomer = await this.customerService.updateProfile(
        customer._id.toString(),
        input
      );
      return payload.res.status(200).json({
        customer: updatedCustomer,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Profile update failed" },
      });
    }
  };

  // card section
  addToCart = async (payload: ControllerPayload) => {
    const customer = payload.req.user as AuthPayload;
    if (!customer) {
      return {
        status: 404,
        error: { message: "Unable to create cart" },
      };
    }
    // document reference. customer.cart.food
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (!profile) {
      return {
        status: 404,
        error: { message: "Customer not found" },
      };
    }
    const { _id, unit } = payload.req.body as OrderInputs;
    const food = await Food.findById(_id);
    if (!food) {
      return {
        status: 404,
        error: { message: "Food not found" },
      };
    }
    let cartItems = profile.cart;
    const existingFoodItem = cartItems.find((item: any) =>
      item.food._id.equals(food._id)
    );
    if (existingFoodItem) {
      if (unit > 0) {
        existingFoodItem.unit = unit;
      } else {
        cartItems = cartItems.filter(
          (item: any) => !item.food._id.equals(food._id)
        );
      }
    } else {
      if (unit > 0) {
        cartItems.push({ food, unit });
      }
    }
    profile.cart = cartItems;
    await profile.save();
    return {
      status: 200,
      cart: cartItems,
    };
  };

  getCard = async (payload: ControllerPayload) => {
    const customer = payload.req.user;
    if (customer) {
      const profile = await Customer.findById(customer._id).populate(
        "cart.food"
      );
      if (profile) {
        return {
          status: 200,
          cart: profile.cart,
        };
      }
    }
    return {
      status: 400,
      error: { message: "Card is empty" },
    };
  };
  AddToCart: (payload: ControllerPayload) => any;

  removeFromCart = async (payload: ControllerPayload) => {
    const customer = payload.req.user;
    if (customer) {
      const profile = await Customer.findById(customer._id).populate(
        "cart.food"
      );
      if (profile) {
        const { _id } = payload.req.body as OrderInputs;
        const food = await Food.findById(_id);
        if (!food) {
          return {
            status: 404,
            error: { message: "Food not found" },
          };
        }
        let cartItems = profile.cart;
        cartItems = cartItems.filter(
          (item: any) => !item.food._id.equals(food._id)
        );
        profile.cart = cartItems;
        await profile.save();
        return {
          status: 200,
          cart: cartItems,
        };
      }
    }
    return {
      status: 400,
      error: { message: "Card is empty" },
    };
  };

  createOrder = async (payload: ControllerPayload) => {
    try {
      return payload.res.status(501).json({
        error: { message: "Create order functionality not implemented yet" },
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Create order failed" },
      });
    }
  };

  getOrder = async (payload: ControllerPayload) => {
    try {
      const customer = payload.req.user as AuthPayload;
      if (customer) {
        const profile = await Customer.findById(customer._id).populate(
          "orders"
        );
        if (profile) {
          return {
            status: 200,
            orders: profile.orders,
          };
        } else {
          return {
            status: 404,
            error: { message: "Customer not found" },
          };
        }
      } else {
        return {
          status: 404,
          error: { message: "Customer not found" },
        };
      }
    } catch (error) {
      console.error("GetOrder error:", error);
      return {
        status: 500,
        error: { message: "Internal server error" },
      };
    }
  };

  removeOrder = async (payload: ControllerPayload) => {
    try {
      return payload.res.status(501).json({
        error: { message: "Remove order functionality not implemented yet" },
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Remove order failed" },
      });
    }
  };

  getOrderById = async (payload: ControllerPayload) => {
    try {
      return payload.res.status(501).json({
        error: { message: "Get order by ID functionality not implemented yet" },
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Get order by ID failed" },
      });
    }
  };
}
