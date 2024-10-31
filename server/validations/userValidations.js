const { body } = require('express-validator')

const firstNameLengthError = 'First name must be between 2-30 characters.'
const firstNameError = 'First name must only contain letters.'
const lastNameLengthError = 'Last name must be between 2-30 characters.'
const lastNameError = 'Last name must only contain letters.'

const validateUserUpdate = [
  body('firstName').trim().isLength({ min: 2, max: 30 }).withMessage(firstNameLengthError).isAlpha().withMessage(firstNameError),

  body('lastName').trim().isLength({ min: 2, max: 30 }).withMessage(lastNameLengthError).isAlpha().withMessage(lastNameError)
]

module.exports = {
  validateUserUpdate
}
