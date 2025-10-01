import { Router } from "express";
import { signup, login } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import UserModel from "../models/user";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await UserModel.findById(userId).select("-password");
    return res.json(user);
});

export default router;
