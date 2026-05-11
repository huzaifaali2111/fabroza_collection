import * as z from "zod";

const userValidation = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "First name can only contain letters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[0-9]/, "Password must contain one number"),
});

export default userValidation;