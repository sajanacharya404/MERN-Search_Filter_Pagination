import express from "express";
import dotenv from "dotenv";
//dotenv configuration
dotenv.config();
import connectDB from "./config/db.js";
import movieRouter from "./routes/movieRoutes.js";

const app = express();

//middleware
app.use(express.json());
//database
connectDB();
//database connection
app.use("/api", movieRouter);
//port
const port = process.env.PORT;
//app start
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
