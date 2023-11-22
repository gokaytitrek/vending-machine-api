import { NextFunction, Request, Response } from "express";
import { mongodbService } from "../services/MongodbService";

export default async function seller(
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

    if (role !== "SELLER") {
      return res.status(401).send({
        message: "user is not a seller",
      });
    }
    next();
  } catch (e) {
    next(e);
  }
}
