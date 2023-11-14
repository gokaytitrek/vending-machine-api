import { NextFunction, Request, Response } from "express";

export default function seller(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const { role } = req.user;

  if (role !== "SELLER")
    res.status(401).send({
      message: "user is not a seller",
    });

  next();
}
