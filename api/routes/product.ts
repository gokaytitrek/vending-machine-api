import express from "express";
import authenticate from "../middleware/authenticate";
import seller from "../middleware/seller";
import { mongodbService } from "../services/MongodbService";
let productRouter = express.Router();

// /product
productRouter.get("/", async (req, res) => {
  try {
    const products = await mongodbService.getProducts();

    res.status(201).send(products);
  } catch {
    res.status(500).send();
  }
});

// /product/id
productRouter.get("/:id", async (req, res) => {
  try {
    // return specific product
    const productId = req.params.id;

    const product = await mongodbService.getProduct(productId);

    if (product) {
      res.status(201).send(product);
    } else {
      res.status(404).send({
        message: "Not found",
      });
    }
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
      const { productId } = req.body;

      if (!productId) {
        return res.status(403).send({
          message: "Parameters are not correct",
        });
      }

      // @ts-ignore
      const { _id, role } = req.user;

      const product = await mongodbService.getProduct(productId);

      if (!product) {
        return res.status(404).send({
          message: "Product not found",
        });
      }

      if (product.seller && product.seller._id === _id) {
        await mongodbService.deleteProduct(productId);

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
    const { amountAvailable, productName, cost } = req.body;

    if (!amountAvailable || !productName || !cost) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    // @ts-ignore
    const { _id } = req.user;

    const products = await mongodbService.getProducts();

    const product = products.find(
      (t) => t.productName.toLowerCase() === productName.toLowerCase()
    );
    if (product) {
      return res.status(403).send({
        message: "Product exists",
      });
    }

    await mongodbService.createProduct(amountAvailable, productName, cost, _id);

    res.status(201).send({
      message: "Product created",
    });
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export { productRouter };
