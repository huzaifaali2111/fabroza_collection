import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

export default authMiddleware;
