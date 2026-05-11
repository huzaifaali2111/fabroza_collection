import express from "express";
import * as z from "zod";
import userValidation from "./auth.validation.js";

async function userSignup(req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body



    const result = userValidation.safeParse(req.body);

    const errors = {};

    result.error.issues.forEach((issue) => {
        const key = issue.path.join(".");

        if (!errors[key]) {
            errors[key] = [];
        }

        errors[key].push(issue.message);
    });

    return res.status(400).json({
        errors,
    });

    return res.status(201).json({
        message: "signup",
    });


}


export default {
    userSignup
}