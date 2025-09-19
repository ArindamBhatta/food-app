import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AuthPayload } from "../dto/Auth.dto";
import { Request } from "express";

const API_SECRET = process.env.API_SECRET;

if (!API_SECRET) {
  console.error(
    "❌ API_SECRET environment variable not set. Please check your .env file."
  );
  process.exit(1);
}

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
export const GenerateSignature = (payload: AuthPayload) => {
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
