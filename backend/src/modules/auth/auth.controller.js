
import authService from "./auth.service.js";


// user signup
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

// user login 
async function userlogin(req, res) {
    try {
        const user = await authService.login(req)

        res.cookie("accessToken", user.accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", user.refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            user: user.user
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        })
    }

}

// user refresh token
async function refreshToken(req, res) {
    try {
        const result = await authService.refreshToken(req)
        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 15 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Access token refreshed",
            user: result.user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        })
    }
}

// logout
async function logout(req, res) {
    try {
        const result = await authService.logout(req);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
        });

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
        });

        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        });
    }
}


export default {
    userSignup,
    userlogin,
    refreshToken,
    logout
}