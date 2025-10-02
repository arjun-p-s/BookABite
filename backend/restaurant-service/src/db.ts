import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI as string;
        if (!uri) throw new Error("MONGO_URI not set");
        await mongoose.connect(uri, { dbName: "bookabite", });
        console.log("✅ MongoDB connected (restaurant-service)");
    } catch (err) {
        console.error("❌ MongoDB connection failed", err);
        process.exit(1);
    }
};

export default connectDB;
