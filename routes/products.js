const express = require('express');
const router = express.Router();
const {
    getSingleProduct,
    getAllProducts,
    getAllProductsStatic,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');


router.route('/searchProducts').get(getAllProducts)
router.route('/postProduct').post(createProduct)
router.route('/updateProduct').patch(updateProduct)
router.route('/deleteProduct').delete(deleteProduct);
router.route('/getAllProducts').get(getAllProductsStatic);
router.route('/getSingleProduct/:id').get(getSingleProduct)

module.exports = router;