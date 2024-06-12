import connectDB from "./db/dbconnect.js";
import express from "express";
import cors from "cors";
import { shops } from "./seed.js";
import cookieParser from "cookie-parser";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.get("/api/shops", (req, res) => {
  res.json(shops);
});

app.post("/api/shops/:id/items", (req, res) => {
  const { id } = req.params;
  const { itemName, quantity } = req.body;

  const shop = shops.find((shop) => shop.id === id);
  if (shop) {
    const newItem = {
      id: Math.random().toString(),
      itemName: itemName,
      quantity: quantity,
    };
    shop.items.push(newItem);
    res.status(201).send(newItem);
  } else {
    res.status(404).send({ message: "Shop not found " });
  }
});

app.delete("/api/shops/:shopId/items/:itemId", (req, res) => {
  const { shopId, itemId } = req.params;

  const shop = shops.find((shop) => shop.id === shopId);
  if (shop) {
    const itemIndex = shop.items.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      shop.items.splice(itemIndex, 1);
      res.status(200).send({ message: "Item deleted successfully" });
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  } else {
    res.status(404).send({ message: "Shop not found" });
  }
});

app.delete("/api/shops/:id", (req, res) => {
  const { id } = req.params;
  const index = shops.findIndex((shop) => shop.id === id);

  if (index !== -1) {
    shops.splice(index, 1);
    res.status(200).send({ message: "Shop found" });
  } else {
    res.status(404).send({ message: "Shop not found" });
  }
});

app.post("/api/shops", (req, res) => {
  const { title } = req.body;
  const newShop = {
    id: Math.random().toString(),
    title: title || "NewShop",
    items: [],
  };

  shops.push(newShop);
  res.status(201).send(newShop);
});

app.put("/api/shops/:id", (req, res) => {
  const { id } = req.params;
  const { newTitle } = req.body;

  const shop = shops.find((shop) => shop.id === id);
  if (shop) {
    shop.title = newTitle;
    res.status(200).send(shop);
  } else {
    res.status(404).send({ message: "Shop not found" });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
