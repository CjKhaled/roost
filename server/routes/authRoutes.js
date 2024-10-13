const express = require('express')
const router = express.Router()
const controller = require('../controllers/authController')
const validator = require('../validations/authValidations')

router.post('/login', validator.validateUserLogin, controller.loginUser)
router.post('/signup', validator.validateUserSignup, controller.signupUser)
router.get('/logout', controller.logoutUser)

module.exports = router
