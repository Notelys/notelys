import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (retryCount = 0) => {
    try {
        const conn = await mongoose.connect(process.env.DB_LOCATION, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection attempt ${retryCount + 1} failed: ${err.message}`);

        if (retryCount < MAX_RETRIES - 1) {
            console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
            return connectDB(retryCount + 1);
        }

        console.error(`❌ All ${MAX_RETRIES} MongoDB connection attempts failed. App running without DB.`);
    }
};

export default connectDB;
