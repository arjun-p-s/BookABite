import express, { Express } from "express";
import type { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db";
import authRoutes from "./routes/authRoutes";


dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use("/auth", authRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Auth-service is running');
});
connectDB()
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
