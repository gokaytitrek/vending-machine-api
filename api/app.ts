import express, { Express, Request, Response } from "express";
import path from "path";
import { buyRouter, depositRouter, productRouter, userRouter } from "./routes";


const app: Express = express();

// consuming and producing “application/json”
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/buy", buyRouter);
app.use("/deposit", depositRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Vending machine api");
});

app.post("/register", function (req, res) {
  res.sendStatus(201);
});


export { app };
