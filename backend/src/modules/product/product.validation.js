import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(120, "Product name is too long"),

  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(150)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and hyphen-separated"
    ),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description is too long"),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  salePrice: z
    .number({
      invalid_type_error: "Sale price must be a number",
    })
    .positive("Sale price must be greater than 0")
    .optional(),

  stock: z
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  thumbnail: z
    .string()
    .trim()
    .url("Thumbnail must be a valid URL")
    .optional(),

  isFeatured: z.boolean().optional(),

  isActive: z.boolean().optional(),

  freeShipping: z.boolean().optional(),
})
.refine(
  (data) => {
    if (data.salePrice) {
      return data.salePrice < data.price;
    }

    return true;
  },
  {
    message: "Sale price must be less than regular price",
    path: ["salePrice"],
  }
);