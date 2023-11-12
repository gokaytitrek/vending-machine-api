import { ObjectSchema } from "realm";

export interface UserInterface {
  _id: string;
  userName: string;
  password: string;
  deposit: number;
  role: string;
}

export class User extends Realm.Object<UserInterface> {
  _id!: string
  userName!: string;
  password!: string;
  deposit!: number;
  role!: 'BUYER' | 'SELLER';
  static schema: ObjectSchema = {
    name: "User",
    properties: {
      _id: "string",
      userName: "string",
      password: "string",
      deposit: "int",
      role: "string"
    },
    primaryKey: "_id",
  };
}