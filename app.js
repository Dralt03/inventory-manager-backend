import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { shops } from "./seed";

const app = express();
app.on("Error", (err) => {
  console.log(err);
  throw err;
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

export { app };
