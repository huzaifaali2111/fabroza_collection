// product.controller.js

async function createProduct(req, res) {
    try {
        const thumbnailPath = req.file
            ? `/uploads/products/${req.file.filename}`
            : null;

        const product = await productService.createProduct({
            ...req.body,
            thumbnail: thumbnailPath,
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        });
    }
}

// product.admin.routes.js
import express from "express";
import multer from "multer";
import path from "path";

import authMiddleware from "../../core/middleware/auth.middleware.js";
import adminMiddleware from "../../core/middleware/admin.middleware.js";
import productController from "./product.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/products");
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `product-${Date.now()}${ext}`;
        cb(null, fileName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
        }

        cb(null, true);
    },
});

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.single("thumbnail"),
    productController.createProduct
);

export default router;