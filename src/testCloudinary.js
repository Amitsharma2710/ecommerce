const dotenv = require('dotenv')

dotenv.config()

const cloudinary = require('./config/cloudinary')


async function testCloudinary() {
    try {
        const result = await cloudinary.api.ping()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

testCloudinary()