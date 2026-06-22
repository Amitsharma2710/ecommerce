const Category = require('../models/category.model')

const createCategory = async (req, res) => {
    try {
        const name = req.body.name?.trim()

        if (!name) {
            return res.status(400).json({
                message: 'category name is required'
            })
        }

        const existing = await Category.findOne({ name })
        if (existing) {
            return res.status(400).json({
                message: 'already exist'
            })
        }
        const category = await Category.create({
            name
        })

        return res.status(201).json({
            success: true,
            message: 'category created',
            category
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find()

        return res.status(200).json({
            success: true,
            message: 'categories found',
            categories
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}
const updateCategory = async (req, res) => {
    try {

        const name = req.body.name?.trim()
        const category = await Category.findById(req.params.id)
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'not found'
            })
        }
        if (!name) {
            return res.status(400).json({
                message: 'category name is required'
            })
        }

        const existing = await Category.findOne({ name })

        if (existing && existing._id.toString() !== category._id.toString()) {
            return res.status(400).json({
                message: 'category already exists'
            })
        }

        category.name = name
        await category.save()

        return res.status(200).json({
            success: true,
            message: 'category updated successfully',
            category
        })



    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {

        const category = await Category.findByIdAndDelete(req.params.id)

        if (!category) {
            return res.status(404).json({
                message: 'category not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'category deleted successfully...'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { createCategory, getAllCategory, updateCategory, deleteCategory }