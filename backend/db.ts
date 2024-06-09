import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 4,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  // account: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Account",
  // },
});

const accountSchema = new Schema({
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

userSchema.methods.createHash = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

userSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
export const Account = model("Accound", accountSchema);
