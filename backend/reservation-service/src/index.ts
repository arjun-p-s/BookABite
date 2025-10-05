import express, { Express } from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./db";
import { reservationRoutes } from './routes/reservationRoutes';


dotenv.config();
const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        credentials: true,
    })
);
app.use("/", reservationRoutes);
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World with reservation-service !');
});
connectDB()
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
