// import { Request, Response, NextFunction } from "express";
// import { AuthPayload } from "../dto/Auth.dto";
// import { ValidateSignature } from "../utility";

// //Normally, req.user doesn’t exist in Express types → TS would error. This block adds an optional property user of type AuthPayload to all Request objects.
// declare global {
//   namespace Express {
//     interface Request {
//       user?: AuthPayload;
//     }
//   }
// }

// export const Authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const validate = await ValidateSignature(req);

//   if (validate) {
//     next();
//   } else {
//     res.json({ message: "Unauthorized" });
//   }
// };
