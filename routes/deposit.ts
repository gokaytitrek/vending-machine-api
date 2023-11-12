import express from "express";
import { realmConfig } from "../models";
import authenticate from "../middleware/authenticate";
import { UserInterface } from "../models/user";
import buyer from "../middleware/buyer";
let depositRouter = express.Router();

// deposit money
// /deposit
// params
// amount
depositRouter.post("/", [authenticate, buyer], async (req: any, res: any) => {
  try {
    const { amount } = req.body;

    // @ts-ignore
    const { _id } = req.user;

    if (!amount) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    if (![5, 10, 20, 50, 100].includes(amount)) {
      return res.status(403).send({
        message: `${amount} is not accepted. Only 5,10,20,50,100`,
      });
    }

    const realm = await Realm.open(realmConfig);
    const users = realm.objects<UserInterface>("User");

    // find user
    const user = users.find((user) => user._id === _id);

    if (user) {
      // update deposit
      realm.write(() => {
        user.deposit = user.deposit + amount;
      });
    } else {
      return res.status(404).send({
        message: "user is not found",
      });
    }
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

export { depositRouter };
