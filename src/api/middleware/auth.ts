import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

export const auth = (context: any = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          error: "No token provided",
        });
      }

      // In a real app, verify the JWT token here
      // For this example, we'll just check for a dummy token
      if (token === "dummy-jwt-token") {
        // Mock user data - in a real app, this would come from the token
        req.user = {
          id: "1",
          email: "admin@example.com",
          role: "admin",
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        error: "Authentication failed",
      });
    }
  };
};

// Role-based access control middleware
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
};
