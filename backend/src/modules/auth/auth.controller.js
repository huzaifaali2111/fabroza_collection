import authService from "./auth.service.js";


async function userSignup(req, res) {
    try {
        const user = await authService.signup(req.body)
        return res.status(201).json({
            message: "Signup successful",
            data: user
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        });
    }
}


export default {
    userSignup
}