import { Product, User } from "../models";
import { mongodbService } from "../services/MongodbService";

const mockingoose = require("mockingoose");

const PRODUCT_LIST = [
  {
    _id: "938ba6ac-aab0-43a3-bc6d-6d8c26c5c2e0",
    productName: "Test product - 1",
    amountAvailable: 50,
    cost: 5,
    seller: "db00ec43-5040-4305-8324-ba993c331821",
    deleted: false,
  },
  {
    _id: "da2b945c-3dba-4ddd-a1aa-e253ebc56b38",
    productName: "Test product - 2",
    amountAvailable: 100,
    cost: 10,
    seller: "84ed1de2-fbaa-441f-a306-f2aec4b152db",
    deleted: false,
  },
  {
    _id: "57f8b65b-bfd1-452b-9773-8db63ab75a4e",
    productName: "Test product - 3",
    amountAvailable: 150,
    cost: 15,
    seller: "84ed1de2-fbaa-441f-a306-f2aec4b152db",
    deleted: true,
  },
];

const USER_LIST = [
  {
    _id: "db00ec43-5040-4305-8324-ba993c331821",
    userName: "Test user - 1",
    password: "$2b$10$uLThCTetGd0qvEchIKddT.YYNHjZMvHvGTP6dkCvlM5X/sgRIEHja",
    deposit: 5,
    role: "SELLER",
  },
  {
    _id: "2e97eb9d-4707-4b00-be07-896f29ea5a2e",
    userName: "Test user - 2",
    password: "$2b$10$Ub.LLrNpMnmsM0Zx/7HqReMc9Gvrk3H4utR2zQ1jMltgTkjmIJUqW",
    deposit: 5,
    role: "BUYER",
  },
];

describe("test", () => {
  it("should return the list of active products", async () => {
    const activeProducts = PRODUCT_LIST.filter((p) => p.deleted === false);
    mockingoose(Product).toReturn(activeProducts, "find");

    const results = await mongodbService.getProducts();
    expect(results).toHaveLength(2);
  });

  it("should return a product", async () => {
    const _id = "938ba6ac-aab0-43a3-bc6d-6d8c26c5c2e0";
    const filtered = PRODUCT_LIST.filter((p) => p._id === _id);
    mockingoose(Product).toReturn(filtered, "findOne");

    const results = await mongodbService.getProduct(_id);
    expect(results).toHaveLength(1);
    // @ts-ignore
    expect(results[0].productName).toBe(PRODUCT_LIST[0].productName);
  });

  it("should return the list of users", async () => {
    mockingoose(User).toReturn(USER_LIST, "find");

    const results = await mongodbService.getUsers();
    expect(results).toHaveLength(2);
  });

  it("should return a user", async () => {
    const _id = "db00ec43-5040-4305-8324-ba993c331821";
    const filtered = USER_LIST.filter((p) => p._id === _id);
    mockingoose(User).toReturn(filtered, "findOne");

    const results = await mongodbService.getUser(_id);
    expect(results).toHaveLength(1);
    // @ts-ignore
    expect(results[0].userName).toBe(USER_LIST[0].userName);
  });
});
