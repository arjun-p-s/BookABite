import express, { Express } from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with reservation-service !');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
