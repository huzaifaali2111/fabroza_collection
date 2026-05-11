import express from "express";
import * as z from "zod";


async function userSignup(req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body

    return res.status(201).json({
        message: "signup",
    });


}


export default {
    userSignup
}