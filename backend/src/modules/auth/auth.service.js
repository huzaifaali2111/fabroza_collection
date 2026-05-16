import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import token from "../../core/utils/token.js"
import { UAParser } from "ua-parser-js";
import crypto from "crypto";
import jwt from "jsonwebtoken";



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

// refresh service
async function refreshToken(payload) {
    const refreshToken = payload.cookies.refreshToken;
    if (!refreshToken) {
        const error = new Error("Refresh token missing");
        error.statusCode = 401;
        throw error;
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (error) {
        error.statusCode = 401;
        error.message = "Invalid or expired refresh token";
        throw error;
    }

    const tokenHash = hashToken(refreshToken);
    const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: {
            user: true,
        },
    });
    if (!session) {
        const error = new Error("Invalid refresh session")
        error.statusCode = 401;
        throw error
    }
    if (session.revokedAt) {
        const error = new Error("Session has been revoked");
        error.statusCode = 401;
        throw error;
    }

    if (session.expiresAt < new Date()) {
        const error = new Error("Refresh token expired");
        error.statusCode = 401;
        throw error;
    }
    if (session.userId !== decoded.userId) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
    }
    const accessToken = token.generateAccessToken(session.user);

    return {
        accessToken,
        user: {
            id: session.user.id,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            email: session.user.email,
            role: session.user.role,
        },
    };
}

// logout 
async function logout(payload) {
    const refreshToken = payload.cookies.refreshToken;
    if (!refreshToken) {
        const error = new Error("No Refresh Token Found");
        error.statusCode = 401;
        throw error
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (error) {
        error.statusCode = 401;
        error.message = "Invalid or expired refresh token";
        throw error;
    }

    const tokenHash = hashToken(refreshToken);

    const session = await prisma.session.updateMany({
        where: {
            tokenHash,
            userId: decoded.userId,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });

    // if (session.count === 0) {
    //     const error = new Error("Refresh session not found or already revoked");
    //     error.statusCode = 401;
    //     throw error;
    // }

    return {
        message: "logout successful"
    }
}

export default {
    signup,
    login,
    refreshToken,
    logout
}