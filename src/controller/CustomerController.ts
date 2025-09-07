import e, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import mongoose, { Types } from "mongoose";

import { plainToClass, plainToInstance } from "class-transformer";
import {
  CreateCustomerInput,
  EditCustomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/Customer.dto";
import {
  GeneratedSalt,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import { GenerateOpt, onRequestOtp } from "../utility/NotificationUtility";
import { Customer, CustomerDoc } from "../models/Customer";
import { Food } from "../models/Food";
import { Order } from "../models/Order";

export const CustomerSignUp = async (req: Request, res: Response) => {
  try {
    console.log("Incoming request body:", req.body);

    // Step 1: Convert plain object to DTO instance
    const customerInputs = plainToInstance(CreateCustomerInput, req.body);

    // Step 2: Validate DTO instance
    const inputErrors = await validate(customerInputs, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (inputErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: inputErrors,
      });
    }

    // Step 3: Extract fields
    const { email, phone, password } = customerInputs;
    console.log("Validated input:", email, phone, password);

    // Step 4: Generate salt & hash password
    const salt = await GeneratedSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    // Step 5: Generate OTP
    const { otp, expiry } = GenerateOpt();
    console.log("Generated OTP:", otp, expiry);

    const existingCustomer = await Customer.findOne({ email: email });

    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Step 6: Save customer
    const result: CustomerDoc = await Customer.create({
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

    if (!result) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Step 7: Send OTP
    await onRequestOtp(otp, phone);

    // Step 8: Generate JWT
    const signature: string = GenerateSignature({
      _id: (result._id as Types.ObjectId).toString(),
      email: result.email,
      verified: result.verified,
    });

    // Step 9: Send response
    res.status(201).json({
      signature,
      verified: result.verified,
      email: result.email,
    });
  } catch (error) {
    console.error("Customer signup error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during signup" });
  }
};

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

export const CustomerVerify = async (req: Request, res: Response) => {
  const { otp } = req.body;
  const customer = req.user as CustomerDoc;

  if (customer) {
    const customerProfile = await Customer.findById(customer._id);

    if (customerProfile) {
      if (
        customerProfile.otp === parseInt(otp) &&
        customerProfile.otp_expiry >= new Date()
      ) {
        //modify boolean
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

export const AddToCard = async (req: Request, res: Response) => {
  const customer = req.user as CustomerDoc;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("card.food");
    let cardItem = Array();
    const { _id, unit } = <OrderInputs>req.body;

    const food = await Food.findById(_id);

    if (food) {
      if (profile != null) {
        //check for card item
        const cardItems = profile.card;
        if (cardItems.length > 0) {
          //check and update unit
          const existingFoodItem = cardItems.filter((item) =>
            item.food._id.equals(food._id)
          );

          if (existingFoodItem.length > 0) {
            const index = cardItem.indexOf(existingFoodItem[0]);
            if (unit > 0) {
              cardItem[index] = { food, unit };
            } else {
              cardItem.splice(index, 1);
            }
          }
        } else {
          //add new item to card
          cardItem.push({ food: food, unit: unit });
        }

        if (cardItem) {
          profile.card = cardItem as any;
          const cardResult = await profile.save();
          return res.status(200).json(cardResult);
        }
      }
    }
  } else {
    return res.status(404).json({ message: "Unable to Create card" });
  }
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
      profile.card = [] as any;
      const cardResult = await profile.save();
      return res.status(200).json(cardResult.card);
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
