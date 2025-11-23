import UserModel from "../models/user";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const seedAdmin = async () => {
    try {
        const adminExists = await UserModel.findOne({
            email: "admin@bookabite.com",
            role: "admin"
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("Admin@123", SALT_ROUNDS);

            await UserModel.create({
                name: "Admin",
                email: "admin@bookabite.com",
                password: hashedPassword,
                role: "admin",
            });

            console.log("✅ Admin account created successfully");
            console.log("📧 Email: admin@bookabite.com");
            console.log("🔑 Password: Admin@123");
        } else {
            console.log("ℹ️  Admin account already exists");
        }
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
};