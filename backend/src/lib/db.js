import mongoose from "mongoose";

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected:", connection.connection.host);
  } catch (error) {
    console.log("MongoDB error", error);

    process.exit(1);
  }
}

export { connectDB };
