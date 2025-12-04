import { ControllerPayload } from "../../../constants";
import {
  CreateCustomerDTO,
  CustomerLoginDTO,
  CustomerPayload,
  EditCustomerProfileInputs,
} from "../../dto/interface/Customer.dto";
import ICustomerController from "./CustomerController.interface";
import { Customer } from "../../models/CustomerModel";
import { OrderInputs } from "../../dto/interface/Customer.dto";
import CustomerService from "../../services/CustomerService/CustomerService";
import { AuthPayload } from "../../dto/Auth.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth.utility";
import { Food } from "../../models";

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

      // Validate that we have either email or phone to identify the user
      if (!input.email && !input.phone) {
        return payload.res.status(400).json({
          error: { message: "Email or phone number is required for login" },
        });
      }

      if (!input.password) {
        return payload.res.status(400).json({
          error: { message: "Password is required" },
        });
      }

      const customer = await this.customerService.signIn(
        input.password,
        input.email,
        input.phone
      );

      if (!customer) {
        return payload.res.status(401).json({
          error: { message: "Invalid credentials" },
        });
      }

      if (!customer.customer.verified) {
        return payload.res.status(403).json({
          error: { message: "Please verify OTP first." },
        });
      }

      // Generate only access token after successful sign-in
      const tokenPayload = {
        _id: (customer.customer._id as any).toString(),
        email: customer.customer.email,
        role: "customer" as const,
        verified: customer.customer.verified,
      };
      const accessToken = generateAccessToken(tokenPayload);

      return payload.res.status(200).json({
        accessToken,
        signature: customer.signature,
        verified: customer.customer.verified,
        email: customer.customer.email,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Sign-in failed" },
      });
    }
  };

  profileDetails = async (payload: ControllerPayload) => {
    try {
      const customer = payload.req.user;
      if (!customer || !customer._id) {
        return payload.res.status(401).json({
          error: { message: "User not authenticated" },
        });
      }

      const profile = await this.customerService.getCustomerById(customer._id);

      return payload.res.status(200).json({
        profile,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Customer signup failed" },
      });
    }
  };

  addDetailsOfUser = async (payload: ControllerPayload) => {
    try {
      // 1. Use access token for access the user data. req.user
      const customer = payload.req.user;

      if (!customer || !customer._id) {
        return payload.res.status(401).json({
          error: { message: "User not authenticated" },
        });
      }
      // 2. EditCustomerProfileInputs DTO and update in repo layer
      const input: EditCustomerProfileInputs = new EditCustomerProfileInputs(
        payload.req.body
      );

      const updatedCustomer = await this.customerService.updateProfile(
        customer._id.toString(),
        input
      );

      if (!updatedCustomer) {
        return payload.res.status(404).json({
          error: { message: "Customer not found" },
        });
      }

      return payload.res.status(200).json({
        message: "Profile updated successfully",
        customer: updatedCustomer,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Operation failed" },
      });
    }
  };

  // card section
  addToWishlist = async (payload: ControllerPayload) => {
    const customer = payload.req.user as AuthPayload;
    if (!customer) {
      return payload.res
        .status(404)
        .json({ error: { message: "Unable to create cart" } });
    }
    const { foodDocId, unit } = payload.req.body as OrderInputs;
    if (!foodDocId || typeof unit !== "number") {
      return payload.res
        .status(400)
        .json({ error: { message: "Invalid input" } });
    }
    try {
      const updatedCart = await this.customerService.addToCart(
        customer._id,
        foodDocId,
        unit
      );

      if (!updatedCart) {
        return payload.res
          .status(404)
          .json({ error: { message: "Customer or food not found" } });
      }
      return payload.res.status(200).json({ cart: updatedCart });
    } catch (error: any) {
      return payload.res
        .status(500)
        .json({ error: { message: error.message || "Operation failed" } });
    }
  };
  //get all wishlist food
  allWishlistFood = async (payload: ControllerPayload) => {
    const customer = payload.req.user;
    if (!customer || !customer._id) {
      return payload.res
        .status(401)
        .json({ error: { message: "User not authenticated" } });
    }
    try {
      const cart = await this.customerService.getCart(customer._id);
      if (!cart || cart.length === 0) {
        return payload.res
          .status(404)
          .json({ error: { message: "Cart is empty" } });
      }
      return payload.res.status(200).json({ cart });
    } catch (error: any) {
      return payload.res
        .status(500)
        .json({ error: { message: error.message || "Failed to fetch cart" } });
    }
  };
  //TODO:
  removeWishlistData = async (payload: ControllerPayload) => {
    const customer = payload.req.user;
    if (customer) {
      const profile = await Customer.findById(customer._id).populate(
        "cart.food"
      );
      if (profile) {
        const { wishlistId } = payload.req.body;
        const food = await Food.findById(wishlistId);
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
