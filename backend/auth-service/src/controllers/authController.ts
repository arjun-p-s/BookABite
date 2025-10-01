import { Request, Response } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, restaurantId } = req.body || {};
        if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

        const exists = await UserModel.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await UserModel.create({
            name,
            email,
            password: hashed,
            role: role === "admin" ? "admin" : "user",
            restaurantId: role === "admin" ? restaurantId : undefined
        });

        const token = createToken(user.id, user.role);
        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, restaurantId: user.restaurantId };

        return res.status(201).json({ user: safeUser, token });
    } catch (err: any) {

        if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: "Missing fields" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = createToken(user.id, user.role);
        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, restaurantId: user.restaurantId };

        return res.status(200).json({ user: safeUser, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};