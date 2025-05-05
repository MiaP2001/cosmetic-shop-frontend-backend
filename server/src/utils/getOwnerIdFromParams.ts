import { Request } from "express";

export const getOwnerIdFromParams = (req: Request): string => req.params.id;
