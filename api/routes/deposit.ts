import express from "express";
import authenticate from "../middleware/authenticate";
import buyer from "../middleware/buyer";
import { mongodbService } from "../services/MongodbService";
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

    await mongodbService.updateDeposit(_id, amount);

    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

export { depositRouter };
