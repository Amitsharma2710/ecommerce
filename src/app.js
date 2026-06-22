const express = require('express')
const healthRoutes = require('./routes/health.routes')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const categoryRoutes = require('./routes/category.routes')
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)

module.exports = app