import express from "express";
import { Product, realmConfig } from "../models";
import { v4 as uuidv4 } from "uuid";
import { UserInterface } from "../models/user";
import { ProductInterface } from "../models/product";
import authenticate from "../middleware/authenticate";
import seller from "../middleware/seller";
let productRouter = express.Router();

// /product
productRouter.get("/", async (req, res) => {
  try {
    // return all products
    const realm = await Realm.open(realmConfig);
    const products = realm.objects("Product");

    res.status(201).send(products);

    realm.close();
  } catch {
    res.status(500).send();
  }
});

// /product/id
productRouter.get("/:id", async (req, res) => {
  try {
    // return specific product
    const productId = req.params.id;
    const realm = await Realm.open(realmConfig);

    const products = realm.objects("Product");
    const product = products.filtered("_id == $0", productId);

    if (product.length === 1) {
      res.status(201).send(product);
    } else {
      res.status(404).send({
        message: "Not found",
      });
    }

    realm.close();
  } catch {
    res.status(500).send();
  }
});

// delete product
// /product
// params
// productId
productRouter.delete(
  "/",
  [authenticate, seller],
  async (req: any, res: any) => {
    try {
      // check product is created by seller user
      const realm = await Realm.open(realmConfig);
      // const { productId } = req.body.source; //axios
      console.log(req.body)
      const { productId } = req.body;

      if (!productId) {
        return res.status(403).send({
          message: "Parameters are not correct",
        });
      }

      // @ts-ignore
      const { _id, role } = req.user;

      const products = realm.objects<ProductInterface>("Product");
      const product = products.filtered("_id == $0", productId);

      if (product.length !== 1) {
        return res.status(404).send({
          message: "Product not found",
        });
      }

      if (product[0].seller && product[0].seller._id === _id) {
        realm.write(() => {
          realm.delete(product);
        });

        realm.close();
        res.status(201).send({
          message: "product deleted",
        });
      } else {
        return res.status(401).send({
          message: "product is created by different seller",
        });
      }
    } catch {
      res.status(500).send();
    }
  }
);

// create product
// /product
// params
// amountAvailable, productName, cost
productRouter.post("/", [authenticate, seller], async (req: any, res: any) => {
  try {
    const realm = await Realm.open(realmConfig);

    const { amountAvailable, productName, cost } = req.body;

    if (!amountAvailable || !productName || !cost) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    // @ts-ignore
    const { _id, role } = req.user;

    // find user
    const users = realm.objects<UserInterface>("User");
    const user = users.filtered("_id == $0", _id);

    if (user.length !== 1) {
      res.status(404).send({
        message: "User not found",
      });
      return;
    }

    const products = realm.objects<ProductInterface>("Product");

    const product = products.find(
      (t) => t.productName.toLowerCase() === productName.toLowerCase()
    );
    if (product) {
      return res.status(403).send({
        message: "Product exists",
      });
    }

    // create product
    realm.write(() => {
      realm.create(Product, {
        _id: uuidv4(),
        amountAvailable,
        productName,
        cost,
        seller: user[0] as UserInterface,
      } as Product);
    });

    realm.close();
    res.status(201).send({
      message: "Product created",
    });
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
});

export { productRouter };
