import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_LOCATION, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000, // Fail fast if DB unreachable
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
