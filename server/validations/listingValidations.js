const { body } = require('express-validator');

// Error messages
const nameLengthError = 'Name must be between 5-100 characters.';
const bedCountError = 'Bed count must be a positive integer.';
const bathCountError = 'Bath count must be a positive integer.';
const addressLengthError = 'Address must be between 5-200 characters.';

// Validation for creating a listing
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
    .withMessage(addressLengthError)
];

// Validation for updating a listing
const validateListingUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage(nameLengthError),

  body('bedCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage(bedCountError),

  body('bathCount')
    .optional()
    .isInt({ min: 1 })
    .withMessage(bathCountError),

  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage(addressLengthError)
];

module.exports = {
  validateListingCreate,
  validateListingUpdate
};
