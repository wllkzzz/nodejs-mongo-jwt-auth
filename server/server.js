const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
const router = require("./router/index");
const ErrorMiddleware = require("./middleware/ErrorMiddleware");
dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", router)
app.use(ErrorMiddleware)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL)
        console.log("MongoDB connected!");
    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
}   

const start = async () => {
    try {
        connectDB();
        app.listen(PORT, () => {console.log(`Server has been started on PORT: ${PORT}`);});
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
    }
}

start();