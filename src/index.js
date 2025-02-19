import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
   path: './env'
})

connectDB();



//Nice Approach for connecting Database but it make our index.js file bigger and messy
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();

(async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    app.on("error", (error) => {
      console.error("SERVER ERROR", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR", error);
  }
})();
*/