import prisma from "../../config/prisma.js";


async function addProduct(payload) {
    const { name, slug, description, price, salePrice, stock, thumbnail, isFeatured, isActive, freeShipping } = payload
    try {
        const product = await prisma.product.create({
            data: {
                name, slug, description, price, salePrice, stock, thumbnail, isFeatured, isActive, freeShipping
            },
        });
        return {
            message: "Product uploaded !"
        }
    } catch (error) {
        error.statusCode = 409;
        error.message = `unique constrains failed ${error.meta.target}`
        throw error
    }

}


export default {
    addProduct
}