import express from "express";
import cors from "cors";
import { data } from "./seed.js";
import cookieParser from "cookie-parser";
import client from "./db/dbconnect.js";
import Shop from "./models/shops.model.js";
import { User } from "./models/user.model.js";
import findUserById from "./middleware/findUser.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.get("/api/users", async (req, res) => {
  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching users" });
  }
});

app.get("/api/users/shops", async (req, res) => {
  try {
    const users = data;
    res.status(200).send({ users });
  } catch (err) {
    res.status(500).send({ message: "Error fetching users" });
  }
});

app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();
    const current_user = users.filter((user) => user.clerkId === userId);

    if (!current_user.shop) {
      current_user.shops = [
        {
          id: "1",
          title: "Shop1",
          items: [{ id: "1", itemName: "ItemName", quantity: 5 }],
        },
      ];
    }

    await collection.updateOne(
      { clerkId: userId },
      { $set: { shops: current_user.shops } }
    );
    res.json(current_user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching users" });
  }
});

app.get("/api/users/:userId/shops", async (req, res) => {
  const { userId } = req.params;
  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();

    const current_user = users.filter((user) => user.clerkId === userId);
    console.log(current_user[0].shops);
    res.json(current_user[0].shops);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching users" });
  }
});

app.post(
  "/api/users/:userId/shops/:id/items",
  findUserById,
  async (req, res) => {
    const { id } = req.params;
    const { itemName, quantity } = req.body;

    const shop = await Shop.findById(id);
    if (shop) {
      const newItem = {
        id: Math.random().toString(),
        itemName: itemName,
        quantity: quantity,
      };
      shop.items.push(newItem);
      shop.items.save();
      res.status(201).send(newItem);
    } else {
      res.status(404).send({ message: "Shop not found " });
    }
  }
);

app.delete(
  "/api/user/:userId/shops/:shopId/items/:itemId",
  findUserById,
  async (req, res) => {
    const { shopId, itemId } = req.params;

    const shop = await Shop.findById(shopId);
    if (shop) {
      const itemIndex = shop.items.id(itemId);
      if (itemIndex) {
        itemIndex.remove();
        await shop.save();
        res.status(200).send({ message: "Item deleted successfully" });
      } else {
        res.status(404).send({ message: "Item not found" });
      }
    } else {
      res.status(404).send({ message: "Shop not found" });
    }
  }
);

app.delete("/api/user/:userId/shops/:id", findUserById, async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findByIdAndDelete(id);
  if (shop) {
    res.status(200).send({ message: "Shop deleted" });
  } else {
    res.status(404).send({ message: "Shop not found" });
  }
});

app.post("/api/user/:userId/shops", async (req, res) => {
  const { userId } = req.params;
  const { title } = req.body;
  const newShop = {
    id: Math.random().toString(),
    title: title || "NewShop",
    items: [],
  };

  try {
    const database = client.db("users");
    const collection = database.collection("user");
    const users = await collection.find().toArray();
    const current_user = users.filter((user) => user.clerkId === userId);
    if (!current_user) {
      return res.status(404).send({ message: "User not found" });
    }

    current_user[0].shops.push(newShop);
    await collection.updateOne(
      { clerkId: userId },
      { $set: { shops: current_user[0].shops } }
    );
    res.status(201).send(newShop);
  } catch (err) {
    res.status(500).send({ message: "Error adding Shop" });
  }
});

app.put("/api/user/:userId/shops/:shopId", findUserById, async (req, res) => {
  const { shopId } = req.params.shopId;
  const { newTitle } = req.body;

  const shop = req.user.shops.id(shopId);
  if (shop) {
    shop.title = newTitle;
    await req.user.save();
    res.status(200).send(shop);
  } else {
    res.status(404).send({ message: "Shop not found" });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
