import { NextFunction, Request, Response } from "express";

export default function buyer(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const { role } = req.user;

  if (role !== "BUYER")
    res.status(401).send({
      message: "user is not a buyer",
    });

  next();
}
