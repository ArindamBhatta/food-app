import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromAdminPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromAdminPhone) {
  throw new Error(
    "Twilio environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not set. Please check your .env file."
  );
}

const client = new Twilio(accountSid, authToken);

/**
 * Generates a random 6-digit OTP and its expiry time (30 minutes).
 */
export const GenerateOpt = (): { otp: number; expiry: Date } => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000); // 30 minutes expiry
  return { otp, expiry };
};

export const onRequestOtp = async (
  otp: number,
  toPhoneNumber: string
): Promise<boolean> => {
  try {
    if (!toPhoneNumber.startsWith("+")) {
      toPhoneNumber = `+91${toPhoneNumber.replace(/^0+/, "")}`;
    }

    await client.messages.create({
      body: `Your OTP for Food Order App is ${otp}`,
      from: fromAdminPhone,
      to: toPhoneNumber,
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP via Twilio:", error);
    return false; // Or handle the error more gracefully
  }
};
