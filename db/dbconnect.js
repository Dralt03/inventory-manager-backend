import mongoose from "mongoose";
const DB_NAME = "user";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log(`\nMongoDB connected || DB Host: ${con.connection.host}`);
  } catch (err) {
    console.log("Error connecting to DB: ", err);
    throw err;
  }
};

export default connectDB;
