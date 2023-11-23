import express from "express";
import { UserInterface } from "../models/user";
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate";
import buyer from "../middleware/buyer";
import bcrypt from "bcrypt";
import { mongodbService } from "../services/MongodbService";

let userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const users = await mongodbService.getUsers();

  res.status(201).send(users);
});

// create user
// /user
// params
// userName, password, role(BUYER, SELLER)
userRouter.post("/", async (req, res) => {
  try {
    const { userName, password, role } = req.body as UserInterface;
    if (!userName || !password || !role) {
      return res.status(403).send({ message: "Parameters are not correct" });
    }
    const users = await mongodbService.getUsers();
    const user = users.find(
      (t) => t.userName.toLowerCase() === userName.toLowerCase()
    );
    if (user) {
      return res.status(403).send({
        message: "Username exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await mongodbService.createUser(userName, hashedPassword, role);

    res.status(201).send({
      message: "User created",
    });
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

// login
// /user/login
// params
// userName, password
userRouter.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(403).send({
        message: "Parameters are not correct",
      });
    }

    if (userName && password) {
      const users = await mongodbService.getUsers();
      const user = users.find((user) => user.userName === userName);

      if (user) {
        const comparePassword = await bcrypt.compare(password, user?.password);
        if (comparePassword) {
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
            userName,
            role: user.role,
          });
        } else {
          res.status(404).send({
            message: "Password is wrong",
          });
        }
      } else {
        res.status(404).send({
          message: "User not found",
        });
      }
    } else {
      res.status(404).send();
    }
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

    await mongodbService.resetDeposit(_id);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

export { userRouter };
