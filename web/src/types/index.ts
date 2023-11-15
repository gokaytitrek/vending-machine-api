export enum Role {
  Buyer = "BUYER",
  Seller = "SELLER",
}

export type User = {
  _id: string;
  userName: string;
  deposit: number;
  role: Role;
};

export type Product = {
  _id: string;
  amountAvailable: number;
  cost: number;
  productName: string;
  seller: User;
};
