import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/userRouters/usersRouter.js";
import authRouter from "./routes/userRouters/authRouter.js";
import productsRouter from "./routes/productRouters/productsRouter.js";
import ordersRouter from "./routes/orderRouters/ordersRouter.js";
import cartRouter from "./routes/cartRouters/cartRouter.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(
    "mongodb+srv://ChanaOl:CO1234@cluster0.c8ocdne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => console.log("connected to DB"))
  .catch((error) => console.log("connection failed"));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("welcome to test application!");
});
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/carts", cartRouter);
app.listen(3003, () =>
  console.log("server is running in port http://localhost:3003")
);
