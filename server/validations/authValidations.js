const { body } = require('express-validator')

const firstNameLengthError = 'First name must be between 2-30 characters.'
const firstNameError = 'First name must only contain letters.'
const lastNameLengthError = 'Last name must be between 2-30 characters.'
const lastNameError = 'Last name must only contain letters.'
const emailLengthError = 'Email must be between 5-50 characters.'
const emailError = 'Must provide a valid email.'
const passwordLengthError = 'Password must be between 8-20 characters.'

const validateUserSignup = [
  body('firstName').trim().isLength({ min: 2, max: 30 }).withMessage(firstNameLengthError).isAlpha().withMessage(firstNameError),

  body('lastName').trim().isLength({ min: 2, max: 30 }).withMessage(lastNameLengthError).isAlpha().withMessage(lastNameError),

  body('email').trim().isLength({ min: 5, max: 50 }).withMessage(emailLengthError).isEmail().withMessage(emailError),

  body('password').trim().isLength({ min: 8, max: 20 }).withMessage(passwordLengthError)

]

const validateUserLogin = [
  body('email').trim().isLength({ min: 5, max: 50 }).withMessage(emailLengthError).isEmail().withMessage(emailError),

  body('password').trim().isLength({ min: 8, max: 20 }).withMessage(passwordLengthError)
]

module.exports = {
  validateUserSignup,
  validateUserLogin
}
