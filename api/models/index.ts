import { ConfigurationWithoutSync } from "realm";
import { Product } from "./product";
import { User } from "./user";

const realmConfig = {
    path: './realm/vending.realm',
    schema: [Product, User]
} as ConfigurationWithoutSync;

export {
    realmConfig,
    Product,
    User
}