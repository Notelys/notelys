import mongoose from 'mongoose';

const connectDB = () => {
    mongoose.connect(process.env.DB_LOCATION, {
        autoIndex: true
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.error("Database connection error:", err.message);
    });
};

export default connectDB;
