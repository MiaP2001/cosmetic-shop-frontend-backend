import { Request, Response, NextFunction, RequestHandler } from "express";

export const checkAdminOrOwner = (
  getOwnerId: (req: Request) => string
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.userId;
    const userRole = req.userRole;

    console.log("✅ checkAdminOrOwner triggered", { userId, userRole });

    if (userRole === "admin" || userId === getOwnerId(req)) {
      return next();
    }

    res.status(403).json({ message: "Forbidden: Access denied" });
  };
};

export const checkAdminOnly = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.userRole;

    if (userRole === "admin") {
      return next();
    }

    res.status(403).json({ message: "Forbidden: Admins only" });
  };
};
