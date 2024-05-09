// imports
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

// import routes
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";

// config dot env
dotenv.config();

// mongoDb connection
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cors()); // for frontend access

// routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);


// validation middleware
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Yahhhh!!! I am running on port no. ${PORT}.`);
})