const express = require('express')
const router = express.Router()
const upload = require('../middleware/uplaod.middleware')

const protect = require('../middleware/auth.middleware')
const admin = require('../middleware/admin.middleware')
const { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } = require('../controllers/product.controller')


router.post('/', protect, admin, upload.single('image'), createProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', protect, admin, upload.single('image'), updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

module.exports = router