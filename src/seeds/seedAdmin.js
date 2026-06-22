const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

const connectDB = require('../config/db')
const User = require('../models/user.model')

dotenv.config()

const seedAdmin = async () => {
    try {
        await connectDB()

        const adminExists = await User.findOne({
            email: process.env.ADMIN_EMAIL
        })

        if (adminExists) {
            console.log('Admin already exists')
            process.exit()
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        )

        await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin'
        })

        console.log('Admin created successfully')
        process.exit()

    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

seedAdmin()