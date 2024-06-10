import express from "express";
import zod from "zod";
import { Account, User } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";

export const router = express.Router();

const signupSchema = zod.object({
  username: zod
    .string()
    .email({
      message: "Email is required",
    })
    .min(4, {
      message: "Minimum 4 charaters required",
    })
    .max(40),
  password: zod.string().min(8, {
    message: "Minimum 8 charaters required",
  }),
  firstName: zod.string().max(50, {
    message: "Should be less than 50 characters",
  }),
  lastName: zod.string().max(50, {
    message: "Should be less than 50 characters",
  }),
});

const signinSchema = zod.object({
  username: zod
    .string()
    .email({
      message: "Email is required",
    })
    .min(4, {
      message: "Minimum 4 charaters required",
    })
    .max(40),
  password: zod.string().min(8, {
    message: "Minimum 8 charaters required",
  }),
});

const updateUserSchema = zod.object({
  password: zod
    .string()
    .min(8, {
      message: "Minimum 8 charaters required",
    })
    .optional(),
  firstName: zod
    .string()
    .max(50, {
      message: "Should be less than 50 characters",
    })
    .optional(),
  lastName: zod
    .string()
    .max(50, {
      message: "Should be less than 50 characters",
    })
    .optional(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  await Account.create({
    userId: user._id,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    `${process.env.JWT_SECRET}`
  );

  res.status(201).json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });

  console.log(user);
  if (!user) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const userValidation = await bcrypt.compare(req.body.password, user.password);

  console.log(userValidation);

  if (!userValidation) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    `${process.env.JWT_SECRET}`
  );

  res.status(201).json({
    message: "User logged in successfully",
    token: token,
  });

  return;
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateUserSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne(
    {
      _id: req.body.userId,
    },
    req.body
  );

  res.json({
    message: "User updated successfully",
  });
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
