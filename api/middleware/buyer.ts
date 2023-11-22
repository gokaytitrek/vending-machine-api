import { NextFunction, Request, Response } from "express";
import { mongodbService } from "../services/MongodbService";

export default async function buyer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore
    const { _id, role } = req.user;

    const user = await mongodbService.getUser(_id);

    if (!user) {
      return res.status(401).send({
        message: "user does not exist",
      });
    }

    if (role !== "BUYER")
      return res.status(401).send({
        message: "user is not a buyer",
      });

    next();
  } catch (error) {
    next(error);
  }
}
