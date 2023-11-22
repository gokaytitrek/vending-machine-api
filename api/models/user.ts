import mongoose from "mongoose";

export interface UserInterface {
  _id: string;
  userName: string;
  password: string;
  deposit: number;
  role: string;
}

const UserSchema = new mongoose.Schema<UserInterface>({
  _id: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["BUYER", "SELLER"],
    default: 'BUYER',
    required: true,
  },
});

export const User = mongoose.model("User", UserSchema);
