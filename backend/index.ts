import express from "express";
import { router as rootRouter } from "./routes";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

console.log(process.env.DB_URL);

mongoose
  .connect(`${process.env.DB_URL}` || "mongodb://localhost:27017/paytm")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log(`now backend server is running on port ${port}`);
});
