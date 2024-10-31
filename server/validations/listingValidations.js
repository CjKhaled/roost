const { body } = require('express-validator')

// Error messages
const nameLengthError = 'Name must be between 5-100 characters.'
const bedCountError = 'Bed count must be a positive integer.'
const bathCountError = 'Bath count must be a positive integer.'
const addressLengthError = 'Address must be between 5-200 characters.'
const priceError = 'Price must be a non-negative number.'
const locationError = 'Location must include valid latitude and longitude.'
const dateError = 'Please provide valid dates in the format YYYY-MM-DD.'
const imageUrlError = 'Image URLs should be an array of valid URLs.'

const validateListingCreate = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage(nameLengthError),

  body('bedCount')
    .isInt({ min: 1 })
    .withMessage(bedCountError),

  body('bathCount')
    .isInt({ min: 1 })
    .withMessage(bathCountError),

  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage(addressLengthError),

  body('price')
    .isFloat({ min: 0 })
    .withMessage(priceError),

  body('location.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage(locationError),

  body('location.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage(locationError),

  body('available.from')
    .isISO8601()
    .withMessage(dateError),

  body('available.to')
    .isISO8601()
    .withMessage(dateError),

  body('imageUrl')
    .isArray()
    .withMessage(imageUrlError)
]

const validateListingUpdate = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage(nameLengthError),

  body('bedCount')
    .isInt({ min: 1 })
    .withMessage(bedCountError),

  body('bathCount')
    .isInt({ min: 1 })
    .withMessage(bathCountError),

  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage(addressLengthError),

  body('price')
    .isFloat({ min: 0 })
    .withMessage(priceError),

  body('location.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage(locationError),

  body('location.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage(locationError),

  body('available.from')
    .isISO8601()
    .withMessage(dateError),

  body('available.to')
    .isISO8601()
    .withMessage(dateError),

  body('imageUrl')
    .isArray()
    .withMessage(imageUrlError)
]

module.exports = {
  validateListingCreate,
  validateListingUpdate
}
