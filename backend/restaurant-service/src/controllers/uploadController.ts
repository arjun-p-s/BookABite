import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../utils/cloudinary";

const uploadToCloudinary = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "restaurants" },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("No result returned from Cloudinary"));
                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const file = req.file as Express.Multer.File | undefined;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const result = await uploadToCloudinary(file.buffer);
        return res.status(201).json({ url: result.secure_url });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error?.message || "Upload failed" });
    }
};

