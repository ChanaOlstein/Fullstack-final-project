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
const MONGO_STRING = process.env.MONGO_STRING;
const PORT = process.env.PORT;

mongoose
  .connect(MONGO_STRING)

  .then((result) => console.log("connected to DB"))
  .catch((error) => console.log("connection failed"));

const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ["https://fullstack-final-project-1.onrender.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
app.listen(PORT, () =>
  console.log(
    "server is running in port https://fullstack-final-project-5bku.onrender.com"
  )
);
