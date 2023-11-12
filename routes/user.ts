import express from "express";
import { User, realmConfig } from "../models";
import { v4 as uuidv4 } from "uuid";
import { UserInterface } from "../models/user";
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate";
import buyer from "../middleware/buyer";
import bcrypt from "bcrypt";

let userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const realm = await Realm.open(realmConfig);
  const users = realm.objects<UserInterface>("User");

  res.status(201).send(users);

  realm.close();
});

// create user
// /user
// params
// userName, password, role(BUYER, SELLER)
userRouter.post("/", async (req, res) => {
  try {
    const realm = await Realm.open(realmConfig);

    const { userName, password, role } = req.body as User;

    if (!userName || !password || !role) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    const users = realm.objects<UserInterface>("User");
    const user = users.find((t) => t.userName.toLowerCase() === userName.toLowerCase());
    if (user) {
      return res.status(403).send({
        message: "Username is exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    realm.write(() => {
      realm.create(User, {
        _id: uuidv4(),
        userName,
        password: hashedPassword,
        deposit: 0,
        role,
      } as User);
    });

    res.status(201).send({
      message: "User created",
    });
    realm.close();
  } catch {
    res.status(500).send();
  }
});

// login
// /user/login
// params
// userName, password
userRouter.post("/login", async (req, res) => {
  try {
    const realm = await Realm.open(realmConfig);

    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    if (userName && password) {
      const users = realm.objects<UserInterface>("User");
      const user = users.find((user) => user.userName === userName);

      // @ts-ignore
      const comparePassword = await bcrypt.compare(password, user?.password);

      if (user && comparePassword) {
        const accessToken = jwt.sign(
          {
            _id: user._id,
            userName: user.userName,
            role: user.role,
          },
          process.env.ACCESS_TOKEN_SECRET as string
        );

        res.status(201).send({
          message: "User successfully logged in",
          accessToken,
        });
      } else {
        res.status(404).send({
          message: "User not found",
        });
      }
    } else {
      res.status(404).send();
    }
    realm.close();
  } catch {
    res.status(500).send();
  }
});

// login
// /user/login
// get signed user info
userRouter.get("/login", authenticate, async (req, res) => {
  try {
    // @ts-ignore
    const { userName, _id } = req.user;
    res.send({
      // @ts-ignore
      user: req.user,
    });
    // @ts-ignore
    if (userName && _id) {
      res.status(201).send({
        message: "User successfully logged in",
      });
    } else {
      res.status(404).send({
        message: "Please log in",
      });
    }
  } catch {
    res.status(500).send();
  }
});

// reset
// /user/rest
// reset user deposit
userRouter.post("/reset", [authenticate, buyer], async (req: any, res: any) => {
  try {
    // @ts-ignore
    const { _id } = req.user;

    const realm = await Realm.open(realmConfig);
    const users = realm.objects<UserInterface>("User");
    const user = users.find((user) => user._id === _id);

    if (user) {
      // update deposit
      realm.write(() => {
        user.deposit = 0;
      });
    } else {
      return res.status(404).send({
        message: "User is not found",
      });
    }
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

export { userRouter };
