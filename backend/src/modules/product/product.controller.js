import productService from "./product.service.js";


async function addProduct(req, res) {
    try {
        const result = await productService.addProduct(req.body)
        return res.status(200).json({
            message: result.message
        })
    } catch (error) {
        return res.status( error.statusCode || 500 ).json({
            message: error.message || 'Internal Server error' 
        })
    }
}


export default {
    addProduct
}



