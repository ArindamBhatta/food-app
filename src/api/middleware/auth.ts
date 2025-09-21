import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { validateToken } from "../utils/hash";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Authentication middleware that validates JWT tokens and checks user roles
 * @param requiredRoles - Array of roles that are allowed to access the route
 */
export const auth = (requiredRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // DEVELOPMENT ONLY: Skip auth for specific routes
      const originalUrl = req.originalUrl || "";
      if (
        originalUrl.includes("create-vendor") &&
        process.env.NODE_ENV !== "production"
      ) {
        console.warn(
          "WARNING: Authentication bypassed for create-vendor - THIS SHOULD NOT BE USED IN PRODUCTION"
        );
        return next();
      }

      // Get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "No authorization header provided",
        });
      }

      const [bearer, token] = authHeader.split(" ");

      if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization format. Use 'Bearer <token>'",
        });
      }

      // Validate token and get user payload
      const isValid = await validateToken(req);

      if (!isValid || !req.user) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Check if user has required role if any roles are specified
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${requiredRoles.join(", ")}`,
        });
      }

      // If we get here, authentication was successful
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
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
