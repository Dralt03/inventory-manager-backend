import mongoose from "mongoose";
import ShopSchema from "./shops.model.js";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String || null,
  },
  shops: [ShopSchema],
});

export const User = mongoose.model("User", userSchema);
