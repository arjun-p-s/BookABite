import express, { Express } from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./db";
import { restaurentRoutes } from "./routes/restaurantRoutes";

dotenv.config();
const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3002;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use("/", restaurentRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with restaurent-service !');
});
connectDB()
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
