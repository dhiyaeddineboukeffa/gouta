import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
      const db = mongoose.connection.db;
      const collection = db.collection('users');
      await collection.dropIndex('email_1');
      console.log("Successfully dropped email_1 index!");
      process.exit(0);
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log("Index already dropped or not found.");
        process.exit(0);
      } else {
        console.error("Connection/drop error, retrying...", error.message);
        retries--;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  process.exit(1);
};
run();
