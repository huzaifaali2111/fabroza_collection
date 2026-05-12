import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";


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

export default {
    signup
}