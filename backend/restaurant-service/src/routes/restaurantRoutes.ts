import { Router } from "express";
import { authMiddleware, requireRestaurantAdmin } from "../middleware/authMiddleware";
import { addRestaurant, editRestaurant, deleteRestaurant, listRestaurants } from "../controllers/restaurantController";

const router = Router();

router.get("/restaurants/list", listRestaurants);
router.post("/restaurants/add", authMiddleware, addRestaurant);
router.put("/restaurants/:id", authMiddleware, requireRestaurantAdmin, editRestaurant);
router.delete("/restaurants/:id", authMiddleware, requireRestaurantAdmin, deleteRestaurant);


export { router as restaurentRoutes };