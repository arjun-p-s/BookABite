import { Router } from "express";
import { authMiddleware, requireRestaurantAdmin } from "../middleware/authMiddleware";
import { addRestaurant, editRestaurant, deleteRestaurant, listRestaurants } from "../controllers/restaurantController";
import { uploadImage } from "../controllers/uploadController";
import upload from "../middleware/uploadMiddleware";

const router = Router();

router.get("/restaurants/list", listRestaurants);
router.post("/restaurants/add", authMiddleware, addRestaurant);
router.put("/restaurants/:id", authMiddleware, requireRestaurantAdmin, editRestaurant);
router.delete("/restaurants/:id", authMiddleware, requireRestaurantAdmin, deleteRestaurant);
router.post("/uploads", authMiddleware, upload.single("file"), uploadImage);


export { router as restaurentRoutes };