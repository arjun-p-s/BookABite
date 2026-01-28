"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const reservationRoutes_1 = require("./routes/reservationRoutes");
const publisher_1 = require("./events/publisher");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
}));
app.use("/", reservationRoutes_1.reservationRoutes);
app.get('/', (req, res) => {
    res.send('Hello World with reservation-service !');
});
const startServer = async () => {
    try {
        await (0, db_1.default)();
        await publisher_1.EventPublisher.getInstance().connect();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
    }
};
startServer();
//# sourceMappingURL=index.js.map