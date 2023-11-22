import mongoose from "mongoose";
import { Product, ProductInterface } from "../models/product";
import { User, UserInterface } from "../models/user";
import { v4 as uuidv4 } from "uuid";

interface DBInterface {
  getProducts(): Promise<ProductInterface[]>;
  getProductById(productId: string): Promise<ProductInterface | null>;
  createProduct(
    amountAvailable: string,
    productName: string,
    cost: number,
    user: string
  ): Promise<ProductInterface>;
  deleteProduct(productId: string): void;

  getUsers(): Promise<UserInterface[]>;
  getUser(userId: string): Promise<UserInterface | null>;
  createUser(
    userName: string,
    password: string,
    role: string
  ): Promise<UserInterface>;

  resetDeposit(userId: string): void;
  updateDeposit(userId: string, amount: number): void;

  updateAvailableAmount(productId: string, amount: number): void;
}

class MongodbService implements DBInterface {
  constructor() {
    mongoose.connect("mongodb://localhost:27017");
  }

  getProducts(): Promise<ProductInterface[]> {
    return Product.find({ deleted: false });
  }

  getProductById(productId: string): Promise<ProductInterface | null> {
    return Product.findById<ProductInterface>(productId).populate("seller");
  }

  createProduct(
    amountAvailable: string,
    productName: string,
    cost: number,
    userId: string
  ): Promise<ProductInterface> {
    const newProduct = new Product({
      _id: uuidv4(),
      amountAvailable,
      productName,
      cost,
      seller: userId,
    });

    const insertedProduct = newProduct.save();
    return insertedProduct;
  }

  deleteProduct(productId: string): void {
    Product.findOneAndUpdate({ _id: productId }, { deleted: true }).exec();
  }

  getUsers(): Promise<UserInterface[]> {
    return User.find();
  }

  getUser(userId: string): Promise<UserInterface | null> {
    return User.findById(userId);
  }

  createUser(
    userName: string,
    password: string,
    role: string
  ): Promise<UserInterface> {
    const newUser = new User({
      _id: uuidv4(),
      userName,
      password,
      deposit: 0,
      role,
    });

    const insertedUser = newUser.save();
    return insertedUser;
  }

  resetDeposit(userId: string): void {
    User.findOneAndUpdate({ _id: userId }, { deposit: 0 }).exec();
  }

  updateDeposit(userId: string, amount: number): void {
    User.findOneAndUpdate(
      { _id: userId },
      { $inc: { deposit: amount } }
    ).exec();
  }

  updateAvailableAmount(productId: string, amount: number): void {
    Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { amountAvailable: amount } }
    ).exec();
  }
}

export const mongodbService = new MongodbService();
