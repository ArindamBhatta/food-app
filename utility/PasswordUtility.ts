import bcrypt from "bcrypt";
import { VendorPayload } from "../dto";
import jwt from "jsonwebtoken";
import { API_SECRET } from "../config";
import { AuthPayload } from "../dto/auth.dto";
import { Request } from "express";

export const GeneratedSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
//decrypt password
export const ValidatePassword = async (
  enteredPassword: string,
  savePassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savePassword;
};

//token
export const GenerateSignature = (payload: VendorPayload) => {
  const signature: string = jwt.sign(payload, API_SECRET, { expiresIn: "1d" });
  return signature;
};

export const ValidateSignature = async (req: Request): Promise<boolean> => {
  const signature = req.get("Authorization");
  if (signature) {
    const token = signature.split(" ")[1];
    const payload: AuthPayload = jwt.verify(token, API_SECRET) as AuthPayload;
    req.user = payload as AuthPayload;
    return true;
  }
  return false;
};
