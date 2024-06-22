import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";
configDotenv();
const DBNAME = "users";
const client = new MongoClient(`${process.env.MONGO_URI}`);

const connectDB = async () => {
  try {
    console.log(`${process.env.MONGO_URI}`);
    await client.connect();
    console.log("connected");
    // const con = await mongoose.connect(`${process.env.MONGO_URI}/${DBNAME}`);
    // console.log(`\nMongoDB connected || DB Host: ${con.connection.host}`);
  } catch (err) {
    console.log("Error connecting to DB: ", err);
    throw err;
  }
};

export default client;
