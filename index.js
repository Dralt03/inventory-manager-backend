import express from "express";
import cors from "cors";
import { data } from "./seed.js";
import cookieParser from "cookie-parser";
import client from "./db/dbconnect.js";
const PORT = 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.get("/api/users/", async (req, res) => {
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

// app.get("/api/users/:userId/shops", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const database = client.db("users");
//     const collection = database.collection("users");
//     const users = await collection.find().toArray();
//     const current_user = users.filter((user) => user.clerkId === userId);
//     console.log(users);

//     await collection.updateOne(
//       { clerkId: userId },
//       { $set: { shops: current_user.shops } }
//     );
//     res.json(current_user[0].shops);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ message: "Error fetching users" });
//   }
// });

app.get("/api/users/:userId/shops", async (req, res) => {
  const { userId } = req.params;
  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();

    const current_user = users.filter((user) => user.clerkId === userId);

    if (!current_user[0].shops || current_user[0].shop === null) {
      await collection.updateOne({ clerkId: userId }, { $set: { shops: [] } });
    }
    res.json(current_user[0].shops);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching users" });
  }
});

app.get("/api/users/:userId/shops/:shopId", async (req, res) => {
  const userId = req.params.userId;
  const shopId = req.params.shopId;

  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();
    const current_user = users.filter((user) => user.clerkId === userId);
    const shopIndex = current_user[0].shops.findIndex(
      (shop) => shop.id === shopId
    );

    res.status(200).send(current_user[0].shops[shopIndex]);
  } catch (err) {
    res.status(500).send({ message: "Could not update shop" });
  }
});

app.post("/api/users/:userId/shops/:shopId/items", async (req, res) => {
  const { userId, shopId } = req.params;
  const { itemName, quantity } = req.body;
  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();

    const current_user = users.filter((user) => user.clerkId === userId);
    const shopIndex = current_user[0].shops.findIndex(
      (shop) => shop.id === shopId
    );
    console.log(shopIndex);
    let shop = current_user[0].shops[shopIndex];

    if (shopIndex === -1) {
      shop = current_user[0].shops[0];
    }

    console.log(shop);
    const newItem = {
      id: Math.random().toString(),
      itemName: itemName,
      quantity: quantity,
    };
    console.log(shop);
    shop.items.push(newItem);
    await collection.updateOne(
      { clerkId: userId },
      { $set: { shops: current_user[0].shops } }
    );
    res.status(201).send(newItem);
  } catch (err) {
    res.status(500).send({ message: "Could not Add Item" });
  }
});

app.delete(
  "/api/users/:userId/shops/:shopId/items/:itemId",
  async (req, res) => {
    const { userId, shopId, itemId } = req.params;

    try {
      const database = client.db("users");
      const collection = database.collection("users");
      const users = await collection.find().toArray();

      const current_user = users.filter((user) => user.clerkId === userId);
      let shopIndex = current_user[0].shops.findIndex(
        (shop) => shop.id === shopId
      );
      if (shopIndex === -1) {
        shopIndex = 0;
      }
      const shop = current_user[0].shops[shopIndex];

      current_user[0].shops[shopIndex].items = shop.items.filter(
        (item) => item.id !== itemId
      );
      console.log(itemId);
      await collection.updateOne(
        { clerkId: userId },
        { $set: { shops: current_user[0].shops } }
      );
      res.status(200).send({ message: "Item Deleted Sucessfully" });
    } catch (err) {
      res.status(500).send({ message: "Could not delete Item" });
    }
  }
);

app.delete("/api/users/:userId/shops/:shopId", async (req, res) => {
  const { userId, shopId } = req.params;
  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();
    const current_user = users.filter((user) => user.clerkId === userId);

    const updatedShops = current_user[0].shops.filter(
      (shop) => shop.id !== shopId
    );

    await collection.updateOne(
      { clerkId: userId },
      { $set: { shops: updatedShops } }
    );
    res.json({ message: "Done successfully" });
  } catch (err) {
    console.error("Error deleting shop: ", err);
    res.status(500).send({ message: "Error deleting shop" });
  }
});

app.post("/api/users/:userId/shops", async (req, res) => {
  const { userId } = req.params;
  const { title } = req.body;
  const newShop = {
    id: Math.random().toString(),
    title: title || "NewShop",
    items: [],
  };

  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();
    const current_user = users.filter((user) => user.clerkId === userId);
    if (!current_user) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log(current_user);
    current_user[0].shops.push(newShop);
    await collection.updateOne(
      { clerkId: userId },
      { $set: { shops: current_user[0].shops } }
    );
    res.status(200).send(current_user[0].shops);
  } catch (err) {
    res.status(500).send({ message: "Error adding Shop" });
  }
});

app.put("/api/users/:userId/shops/:shopId", async (req, res) => {
  const { userId, shopId } = req.params;
  const { newTitle } = req.body;

  try {
    const database = client.db("users");
    const collection = database.collection("users");
    const users = await collection.find().toArray();
    const current_user = users.filter((user) => user.clerkId === userId);

    const shopIndex = current_user[0].shops.findIndex(
      (shop) => shop.id === shopId
    );

    let shop = current_user[0].shops[0];

    if (shopIndex !== -1) {
      shop = current_user[0].shops[shopIndex];
    }

    shop.title = newTitle;
    await collection.updateOne(
      { clerkId: userId },
      {
        $set: { shops: current_user[0].shops },
      }
    );

    res.json(shop);
  } catch (err) {
    console.error("Error updating Shop: ", err);
    res.status(500).send({ message: "Could not update shop" });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
