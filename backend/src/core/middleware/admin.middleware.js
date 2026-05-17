import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";


async function adminMiddleware(req, res, next) {
    if (req.user.role !== "ADMIN") {
        res.status(403).json({
            message: "Forbidden"
        })
    }
    next();
}


export default adminMiddleware;