const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(express.json());

const start = async () => {
    try {
        app.listen(PORT, () => {console.log(`Server has been started on PORT: ${PORT}`);});
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
    }
}

start();