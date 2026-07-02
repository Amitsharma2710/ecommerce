const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth.middleware')
const { addToCart, getCart, updateCart, deleteItemFromCart, clearCart } = require('../controllers/cart.controller')

router.post('/', protect, addToCart)
router.get('/', protect, getCart)
router.put('/:id', protect, updateCart)
router.delete('/:id', protect, deleteItemFromCart)
router.delete('/', protect, clearCart)

module.exports = router