import { ControllerPayload } from "../../../constants";
import {
  CreateCustomerDTO,
  CustomerLoginDTO,
  EditCustomerProfileInputs,
} from "../../dto/interface/Customer.dto";
import ICustomerController from "./CustomerController.interface";
import { Customer, CustomerDoc } from "../../entities/Customer";
import { Food } from "../../entities/Food";
import { OrderInputs } from "../../dto/interface/Customer.dto";
import CustomerService from "../../services/CustomerService/CustomerService";
import { AuthPayload } from "../../dto/Auth.dto";

export default class CustomerController implements ICustomerController {
  private customerService: CustomerService;
  constructor(customerService: CustomerService) {
    this.customerService = customerService;
  }
  AddToCart: (payload: ControllerPayload) => any;

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

  //order section
  createOrder = async (payload: ControllerPayload) => {
    try {
      // // 1. Get current logged-in customer
      // const customer = req.user as CustomerDoc;
      // if (!customer) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }
      // // 2. Find customer profile
      // const profile = await Customer.findById(customer._id);
      // if (!profile) {
      //   return res.status(404).json({ message: "Customer not found" });
      // }
      // // 3. Get cart from request body
      // const cart: OrderInputs[] = req.body as OrderInputs[];
      // if (!cart || cart.length === 0) {
      //   return res.status(400).json({ message: "Cart is empty" });
      // }
      // // 4. Create order id
      // const orderId = new Types.ObjectId().toString();
      // let netAmount = 0;
      // let cartItems: { foodId: string; unit: number }[] = [];
      // // 5. Fetch all foods in the cart
      // const foods = await Food.find()
      //   .where("_id")
      //   .in(cart.map((item) => item._id))
      //   .exec();
      // // 6. Match foods with cart items and calculate total
      // foods.forEach((food) => {
      //   cart.forEach(({ _id, unit }) => {
      //     if (food._id.toString() === _id) {
      //       netAmount += food.price * unit;
      //       cartItems.push({ foodId: food._id.toString(), unit });
      //     }
      //   });
      // });
      // if (cartItems.length === 0) {
      //   return res.status(400).json({ message: "Invalid cart items" });
      // }
      // // 7. Create order
      // const currentOrder = await Order.create({
      //   orderID: orderId,
      //   items: cartItems,
      //   totalAmount: netAmount,
      //   paidThrough: "COD",
      //   paymentResponse: "",
      //   orderStatus: "pending",
      // });
      // if (currentOrder) {
      //   profile.orders.push(currentOrder._id as mongoose.Types.ObjectId);
      //   const profileResponse = await profile.save();
      //   return res.status(200).json({ currentOrder, profileResponse });
    } catch (error) {
      console.error("CreateOrder error:", error);
      return {
        status: 500,
        error: { message: "Internal server error" },
      };
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

  removeOrder = async (payload: ControllerPayload) => {};

  getOrderById = async (payload: ControllerPayload) => {};
}
