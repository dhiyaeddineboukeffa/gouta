import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "./models/productModel.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
  const products = await productModel.find({});
  
  for (let p of products) {
    if (p.name.includes("0.5L")) p.image = ["/images/0.5.jfif"];
    else if (p.name.includes("1.5L")) p.image = ["/images/1.5L.jfif"];
    else if (p.name.includes("1L")) p.image = ["/images/1L.jfif"];
    else if (p.name.includes("5L")) p.image = ["/images/5L.jfif"];
    await p.save();
  }
  console.log("Images updated");
  process.exit(0);
};
run();
