import express from "express";
import { realmConfig } from "../models";
import authenticate from "../middleware/authenticate";
import { UserInterface } from "../models/user";
import { ProductInterface } from "../models/product";
import buyer from "../middleware/buyer";
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

    const realm = await Realm.open(realmConfig);
    const users = realm.objects<UserInterface>("User");

    const products = realm.objects<ProductInterface>("Product");
    const product = products.find((p) => p._id === productId);

    if (!product) {
      return res.status(404).send({
        message: "product is not found",
      });
    }

    const user = users.find((user) => user._id === _id);
    if (!user) {
      return res.status(404).send({
        message: "user is not found",
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
        message: `there is not enough available product. There is only ${product.amountAvailable}`,
      });
    }

    // update deposit
    realm.write(() => {
      product.amountAvailable -= amount;
    });

    res.status(200).send();
  } catch {
    res.status(500).send();
  }
});

export { buyRouter };
