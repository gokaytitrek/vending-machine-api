import { ObjectSchema } from "realm";
import { UserInterface } from './user';

export interface ProductInterface {
  _id: string;
  amountAvailable: number;
  productName: string;
  cost: number;
  seller: UserInterface;
}

export class Product extends Realm.Object<ProductInterface> {
  _id!: string;
  amountAvailable!: number;
  productName!: string;
  cost!: number;
  seller!: UserInterface;
  static schema: ObjectSchema = {
    name: "Product",
    properties: {
      _id: "string",
      amountAvailable: "int",
      productName: "string",
      cost: "int",
      seller: "User"
    },
    primaryKey: "_id",
  };
}