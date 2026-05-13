import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import token from "../../core/utils/token.js"
import { UAParser } from "ua-parser-js";
import crypto from "crypto";



function hashToken(refreshToken) {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
};

// signup service
async function signup(payload) {

    const { firstName, lastName, email, password } = payload

    // if already exists 
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // creating record
    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            role: true,
        }
    });
    return user;
};

// login service
async function login(payload) {

    const { email, password } = payload.body
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        const error = new Error("Invalid email or password")
        error.statusCode = 401;
        throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const accessToken = token.generateAccessToken(user);
    const refreshToken = token.generateRefreshToken(user);

    // request header 
    const parser = new UAParser(payload.headers['user-agent']);
    const uaResult = await parser.getResult();

    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const deviceName = `${uaResult.browser.name || "Unknown Browser"} on ${uaResult.os.name || "Unknown OS"}`;

    await prisma.session.create({
        data: {
            userId: user.id,
            tokenHash,
            userAgent: payload.headers["user-agent"],
            ipAddress: payload.ip.replace(/^.*:/, ''),
            deviceName,
            expiresAt,
        },
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
    }

};

export default {
    signup,
    login
}