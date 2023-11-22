import express from "express";
import authenticate from "../middleware/authenticate";
import buyer from "../middleware/buyer";
import { mongodbService } from "../services/MongodbService";
let buyRouter = express.Router();

// deposit money
// /deposit
// params
// productId, amount
buyRouter.post("/", [authenticate, buyer], async (req: any, res: any) => {
  try {
    const { productId, amount } = req.body;

    // @ts-ignore
    const { _id } = req.user;

    if (!productId || !amount) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    const product = await mongodbService.getProduct(productId);

    if (!product) {
      return res.status(404).send({
        message: "product is not found",
      });
    }

    const user = await mongodbService.getUser(_id);
    if (!user) {
      return res.status(404).send({
        message: "user does not exist",
      });
    }

    const totalAmount = product.cost * amount;

    if (user.deposit < totalAmount) {
      return res.status(403).send({
        message: `user does not have enough deposit. Please add ${Math.abs(
          user.deposit - totalAmount
        )}`,
      });
    }

    if (product.amountAvailable - amount < 0) {
      return res.status(403).send({
        message: `there is not enough available product. Available: ${product.amountAvailable}`,
      });
    }

    const cost = amount * product.cost;
    await mongodbService.updateDeposit(_id, cost * -1);
    await mongodbService.updateAvailableAmount(productId, amount * -1);

    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

export { buyRouter };
