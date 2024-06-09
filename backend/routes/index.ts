import express from "express";
import { router as userRouter } from "./user";
import { router as accountRouter } from "./account";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);
