import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import token from "../../core/utils/token.js"

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
}

// login service
async function login(payload) {

    const { email, password } = payload
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

    

    const { password: _, ...safeUser } = user;
    return safeUser,accessToken,refreshToken;
}
export default {
    signup,
    login
}