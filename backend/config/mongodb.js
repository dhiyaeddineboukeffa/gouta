import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  const connectWithRetry = async () => {
    try {
      const hardcodedUri = "mongodb://boukeffadhiyaeddine_db_user:iLzhb7wsdhZPxB0b@ac-nc2ndin-shard-00-00.vx0fcge.mongodb.net:27017,ac-nc2ndin-shard-00-01.vx0fcge.mongodb.net:27017,ac-nc2ndin-shard-00-02.vx0fcge.mongodb.net:27017/e-commerce?ssl=true&replicaSet=atlas-i2uygu-shard-0&authSource=admin&retryWrites=true&w=majority";
      await mongoose.connect(hardcodedUri, { family: 4 });
    } catch (err) {
      console.log("MongoDB connection failed (DNS error?). Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    }
  };

  await connectWithRetry();
};

export default connectDB;
