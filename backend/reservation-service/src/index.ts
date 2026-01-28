import express, { Express } from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./db";
import { reservationRoutes } from './routes/reservationRoutes';


import { EventPublisher } from './events/publisher';
import { CacheService } from './cache/redis.service';

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

const startServer = async () => {
    try {
        await connectDB();
        await EventPublisher.getInstance().connect();

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
