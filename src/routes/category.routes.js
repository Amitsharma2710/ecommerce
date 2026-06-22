const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth.middleware')
const admin = require('../middleware/admin.middleware')
const { createCategory, getAllCategory, updateCategory, deleteCategory } = require('../controllers/category.controller')

router.post('/', protect, admin, createCategory)

router.get('/', getAllCategory)

router.put('/:id', protect, admin, updateCategory)

router.delete('/:id', protect, admin, deleteCategory)

module.exports = router