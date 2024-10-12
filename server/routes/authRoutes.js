const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')

router.post('/login', controller.loginUser)
router.post('/signup', controller.signupUser)
router.get('/logout', controller.loginUser)

module.exports = router
