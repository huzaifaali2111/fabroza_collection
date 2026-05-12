import express from "express";


function dataValidation(schema) {
    return async (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors
            return res.status(400).json({errors:errors});
        }
        req.body = result.data;
        next();
    }
}

export default dataValidation;