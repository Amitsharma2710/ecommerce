const express = require('express')
const { registerUser, login, logout, getMe, updateProfile, changePassword } = require('../controllers/auth.controller')
const router = express.Router()
const protect = require('../middleware/auth.middleware')

router.post('/register', registerUser)
router.post('/login', login)

router.post('/logout', protect, logout)

router.get('/me', protect, getMe)

router.put('/update-profile', protect, updateProfile)

router.put('/change-password', protect, changePassword)

module.exports = router