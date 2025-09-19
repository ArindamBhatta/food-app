// ------------------ IMPORTS ------------------
import { Request, Response } from "express";
import { validate } from "class-validator";
import mongoose, { Types } from "mongoose";
import { plainToClass, plainToInstance } from "class-transformer";

// Data Transfer Objects (DTOs)
import {
  CreateCustomerInput,
  EditCustomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/Customer.dto";

// Utility functions
import {
  GeneratedSalt, //generate random salt
  GeneratePassword, // hash password + salt
  GenerateSignature, // create JWT token
  ValidatePassword, // check password against hash
} from "../utility";

// OTP generator + sender
import { GenerateOpt, onRequestOtp } from "../utility/NotificationUtility";

// MongoDB models
import { Customer, CustomerDoc } from "../models/Customer";
import { Food } from "../models/Food";
import { Order } from "../models/Order";

// ------------------ AUTH SECTION ------------------

//SIGNUP some data are placeholder to make signup smooth
export const CustomerSignUp = async (req: Request, res: Response) => {
  try {
    // Step 1: Convert plain request body -> DTO instance
    const customerInputs = plainToInstance(CreateCustomerInput, req.body);

    // Step 2: Validate DTO instance (class-validator rules)
    const inputErrors = await validate(customerInputs, {
      whitelist: true, // only allow whitelisted properties
      forbidNonWhitelisted: true, // reject unknown properties
      validationError: { target: false },
    });

    if (inputErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: inputErrors,
      });
    }

    // Step 3: Extract required fields
    const { email, phone, password } = customerInputs;

    // Step 4: Hash password with salt
    const salt: string = await GeneratedSalt();
    const hashedPassword: string = await GeneratePassword(password, salt);

    // Step 5: Generate OTP
    const { otp, expiry } = GenerateOpt();

    // Step 6: Ensure no duplicate customer
    const existingCustomer = await Customer.findOne({ email: email });

    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Step 7: Save customer in DB a placeholder for now
    const customer: CustomerDoc = await Customer.create({
      email,
      password: hashedPassword,
      salt,
      phone,
      otp,
      otp_expiry: expiry,
      firstName: "",
      lastName: "",
      address: "",
      verified: false,
      lat: 0,
      lng: 0,
      orders: [],
    });

    if (!customer) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Step 8: Send OTP
    await onRequestOtp(otp, phone);

    // Step 9: Generate JWT
    const signature: string = GenerateSignature({
      _id: (customer._id as Types.ObjectId).toString(),
      email: customer.email,
      verified: customer.verified,
    });

    // Step 10: Generate jwt
    res.status(201).json({
      signature,
      verified: customer.verified,
      email: customer.email,
    });
  } catch (error) {
    console.error("Customer signup error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during signup" });
  }
};

//  VERIFY OTP but why?
/* 
Backend saves user with verified: false and generates OTP
OTP is sent to the user’s phone
Backend also issues a JWT (but it says verified: false inside)
OTP verification happens right after signup — usually before the user can fully use the app.
When the user logs in again later, they don’t need OTP unless you implement 2FA or their account is still verified: false.
That’s why the verified flag in JWT is important:
If false → app knows user still needs OTP verification.
If true → user is fully activated and can use all features.
*/
export const CustomerOTPVerify = async (req: Request, res: Response) => {
  // send the otp again
  const { otp } = req.body;

  const customer = req.user as CustomerDoc;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id);

    if (customerProfile) {
      //if otp not expired
      if (
        customerProfile.otp === parseInt(otp) &&
        customerProfile.otp_expiry >= new Date()
      ) {
        customerProfile.verified = true;
        const updatedCustomer = await customerProfile.save();

        const signature = GenerateSignature({
          _id: (updatedCustomer._id as Types.ObjectId).toString(),
          email: updatedCustomer.email,
          verified: updatedCustomer.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: updatedCustomer.verified,
          email: updatedCustomer.email,
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP or Expired" });
      }
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  }
};

//Login
export const CustomerLogin = async (req: Request, res: Response) => {
  const loginInput = plainToInstance(UserLoginInputs, req.body);

  const loginError = await validate(loginInput, {
    validationError: { target: false },
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (loginError.length > 0) {
    res.status(400).json({ message: "Validation failed", errors: loginError });
  }

  const { email, password } = loginInput;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: (customer._id as Types.ObjectId).toString(),
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    } else {
      return res.status(400).json({ message: "Invalid Password" });
    }
  } else {
    return res.status(400).json({ message: "Customer not found" });
  }
};

// REQUEST OTP AGAIN
export const RequestOtp = async (req: Request, res: Response) => {
  const customer = req.user as CustomerDoc;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOpt();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();

      await onRequestOtp(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent to your registered phone" });
    }
  } else {
    return res.status(404).json({ message: "Customer not found" });
  }
};
//fill the blank fields
export const getCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user as CustomerDoc;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  } else {
    return res.status(404).json({ message: "Customer not found" });
  }
};

export const EditCustomerProfile = async (req: Request, res: Response) => {
  const customer = req.user as CustomerDoc;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (profileErrors.length > 0) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: profileErrors });
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
    }
  }
};

// -------------------- card section ---------------------

// Controller to add/update/remove items from a customer's shopping cart
export const AddToCart = async (req: Request, res: Response) => {
  // The logged-in customer (coming from authentication middleware)
  const customer = req.user as CustomerDoc;

  if (!customer) {
    // If no customer found in request
    return res.status(404).json({ message: "Unable to create cart" });
  }

  // Find the customer in DB and populate 'cart.food' with actual Food documents
  const profile = await Customer.findById(customer._id).populate("cart.food");

  if (!profile) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // Extract foodId (_id) and unit (quantity) from request body
  const { _id, unit } = <OrderInputs>req.body;

  // Check if the food exists in the Food collection
  const food = await Food.findById(_id);
  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  // Work with the customer's current cart (array of items)
  let cartItems = profile.cart;

  // Check if this food item already exists in the cart
  const existingFoodItem = cartItems.find((item) =>
    item.food._id.equals(food._id)
  );

  if (existingFoodItem) {
    // If the item already exists in cart

    if (unit > 0) {
      // Update the quantity
      existingFoodItem.unit = unit;
    } else {
      // If unit <= 0, remove the item from the cart
      cartItems = cartItems.filter(
        (item) => !item.food._id.equals(food._id)
      ) as any;
    }
  } else {
    // If the item is not already in the cart, add it
    if (unit > 0) {
      cartItems.push({ food, unit });
    }
  }

  // Save the updated cart back to the customer profile
  profile.cart = cartItems;
  const updatedProfile = await profile.save();

  // Return updated cart to the client
  return res.status(200).json(updatedProfile);
};

export const GetCard = async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("card.food");
    if (profile) {
      return res.status(400).json({ message: "card is empty" });
    }
  }
};

export const DeleteCard = async (req: Request, res: Response) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("card.food");
    if (profile != null) {
      profile.cart = [] as any;
      const cardResult = await profile.save();
      return res.status(200).json(cardResult.cart);
    }
  }
  return res.status(400).json({ message: "Card is already empty" });
};

// ----------------------- order section ---------------------
export const CreateOrder = async (req: Request, res: Response) => {
  try {
    // 1. Get current logged-in customer
    const customer = req.user as CustomerDoc;
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2. Find customer profile
    const profile = await Customer.findById(customer._id);
    if (!profile) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 3. Get cart from request body
    const cart: OrderInputs[] = req.body as OrderInputs[];
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 4. Create order id
    const orderId = new Types.ObjectId().toString();

    let netAmount = 0;
    let cartItems: { foodId: string; unit: number }[] = [];

    // 5. Fetch all foods in the cart
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    // 6. Match foods with cart items and calculate total
    foods.forEach((food) => {
      cart.forEach(({ _id, unit }) => {
        if (food._id.toString() === _id) {
          netAmount += food.price * unit;
          cartItems.push({ foodId: food._id.toString(), unit });
        }
      });
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Invalid cart items" });
    }

    // 7. Create order
    const currentOrder = await Order.create({
      orderID: orderId,
      items: cartItems,
      totalAmount: netAmount,
      paidThrough: "COD",
      paymentResponse: "",
      orderStatus: "pending",
    });

    if (currentOrder) {
      profile.orders.push(currentOrder._id as mongoose.Types.ObjectId);
      const profileResponse = await profile.save();

      return res.status(200).json(profileResponse.orders);
    }
  } catch (error) {
    console.error("CreateOrder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Finally update orders to user account
export const GetOrders = async (req: Request, res: Response) => {
  const customer = req.user as CustomerDoc;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");
    if (profile) {
      return res.status(200).json(profile.orders);
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  } else {
    return res.status(404).json({ message: "Customer not found" });
  }
};

export const GetOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId).populate("items.food");
  if (order) {
    return res.status(200).json(order);
  } else {
    return res.status(404).json({ message: "Order not found" });
  }
};
