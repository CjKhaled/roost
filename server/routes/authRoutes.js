const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')
const validator = require('../validations/authValidations')

// anyone going through app needs to go thru these
router.post('/login', validator.validateUserLogin, controller.loginUser) // uses these validations
router.post('/signup', validator.validateUserSignup, controller.signupUser)
router.get('/logout', controller.logoutUser)

module.exports = router
