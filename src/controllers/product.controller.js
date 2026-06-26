const Product = require('../models/product.model')
const Category = require('../models/category.model')
const uploadToCloudinary = require('../utils/cloudinaryUpload')
const cloudinary = require('../config/cloudinary')

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock } = req.body
        if (!name?.trim() || !description?.trim() || price === undefined || !category || !brand?.trim() || stock === undefined) {
            return res.status(400).json({
                message: 'all feilds are required'
            })
        }

        const existingCategory = await Category.findById(category)
        if (!existingCategory) {
            return res.status(404).json({
                message: 'category not found'
            })
        }

        let uploadedImage = null

        if (req.file) {
            uploadedImage = await uploadToCloudinary(req.file.buffer)
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price,
            category,
            brand: brand.trim(),
            stock,
            images: uploadedImage ? [{
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url
            }] : []
        })

        return res.status(201).json({
            success: true,
            message: 'product created successfully',
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword || ''
        const category = req.query.category
        const brand = req.query.brand
        const minPrice = Number(req.query.minPrice)
        const maxPrice = Number(req.query.maxPrice)
        const query = {}
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const sort = req.query.sort
        let sortOptions = {}

        if (sort === 'price_asc') {
            sortOptions.price = 1
        }
        else if (sort === 'price_desc') {
            sortOptions.price = -1
        }
        else if (sort === 'newest') {
            sortOptions.createdAt = -1
        }
        else if (sort === 'oldest') {
            sortOptions.createdAt = 1
        }

        if (keyword) {
            query.$or = [{
                name: {
                    $regex: keyword,
                    $options: 'i'
                }
            },
            {
                brand: {
                    $regex: keyword,
                    $options: 'i'
                }
            },
            {
                description: {
                    $regex: keyword,
                    $options: 'i'
                }
            }]
        }

        if (category) {
            query.category = category
        }

        if(brand){
            query.brand = brand
        }

        if(minPrice || maxPrice){
            query.price = {}

            if(minPrice){
                query.price.$gte = minPrice
            }
            if(maxPrice){
                query.price.$lte = maxPrice
            }
        }
        const totalProducts = await Product.countDocuments(query)
        const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit).populate('category', 'name')

        const totalPages = Math.ceil(totalProducts / limit)




        return res.status(200).json({
            success: true,
            message: 'prodcuts fetched successfully..',
            count: products.length,
            currentPage: page,
            totalProducts,
            totalPages,
            products: products.map(product => ({
                name: product.name,
                price: product.price
            }))

        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name')

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'prodcut fetched successfully..',
            product

        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock } = req.body
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            })
        }

        if (category) {
            const existingCategory = await Category.findById(category)
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'category not found'
                })
            }
        }

        if (req.file) {
            if (product.images.length > 0) {
                await cloudinary.uploader.destroy(
                    product.images[0].public_id
                )
            }

            const uploadedImage = await uploadToCloudinary(req.file.buffer)

            product.images = [{
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url
            }]
        }


        product.name = name || product.name
        product.description = description || product.description
        product.price = price ?? product.price
        product.category = category || product.category
        product.brand = brand || product.brand
        product.stock = stock ?? product.stock

        await product.save()

        return res.status(200).json({
            success: true,
            message: 'product updated successfully..',
            product

        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'product not found'
            })
        }

        if (product.images.length > 0) {
            await cloudinary.uploader.destroy(
                product.images[0].public_id
            )
        }

        await product.deleteOne()

        return res.status(200).json({
            success: true,
            message: 'product deleted successfully...'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct }