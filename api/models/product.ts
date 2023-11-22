import mongoose from "mongoose";
import { User, UserInterface } from "./user";

export interface ProductInterface {
  _id: string;
  amountAvailable: number;
  productName: string;
  cost: number;
  seller: UserInterface;
  deleted: boolean;
}

const ProductSchema = new mongoose.Schema<ProductInterface>({
  _id: {
    type: String,
    required: true,
  },
  amountAvailable: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  seller: {
    type: String,
    ref: User,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export const Product = mongoose.model("Product", ProductSchema);
