import connectDB from "./db/dbconnect.js";
import express from "express";
import cors from "cors";
import { shops } from "./seed.js";

const PORT = 8080;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json(shops);
});

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
