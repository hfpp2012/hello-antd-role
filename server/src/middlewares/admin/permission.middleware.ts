import { Request, Response, NextFunction } from "express";
import { FORBIDDEN } from "http-status-codes";
import HttpException from "../../exceptions/HttpException";

const permit = (...allowed: Array<string>) => {
  const isAllowed = (role: string) => allowed.indexOf(role) > -1;

  return (req: Request, _res: Response, next: NextFunction) => {
    if (
      req.currentAdmin &&
      (req.currentAdmin.isAdmin || isAllowed(req.currentAdmin.role))
    ) {
      next();
    } else {
      next(new HttpException(FORBIDDEN, "Access Denied"));
    }
  };
};

export default permit;
