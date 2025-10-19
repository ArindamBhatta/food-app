import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { validateAccessToken } from "../utils/auth.utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Authentication middleware that validates JWT tokens and checks user roles
 */

export const auth = (requiredRoles: string[] = []): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isValid = await validateAccessToken(req);

      if (!isValid || !req.user) {
        res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
        return;
      }

      // Check if user has required role if any roles are specified
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${requiredRoles.join(", ")}`,
        });
        return;
      }
      // If we get here, authentication was successful
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  };
};

/**
 * Role-based access control middleware (alternative to auth with roles)
 * Use this when you want to apply role checks separately from authentication
 */
export const requireRole = (roles: string | string[]) => {
  const roleList = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (roleList.length > 0 && !roleList.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roleList.join(", ")}`,
      });
    }

    next();
  };
};
