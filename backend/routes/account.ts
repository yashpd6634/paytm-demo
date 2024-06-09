import express from "express";
import { authMiddleware } from "../middleware";
import { Account } from "../db";
import mongoose from "mongoose";

export const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.body.userId;

  const account = await Account.findOne({ userId });

  res.status(200).json({
    balance: account?.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { userId, to, amount } = req.body;

  const account = await Account.findOne({ userId }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  await Account.updateOne(
    {
      userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});
