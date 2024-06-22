import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

export const ShopSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  items: [ItemSchema],
});

export default ShopSchema;
