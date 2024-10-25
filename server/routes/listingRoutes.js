const express = require('express')
const router = express.Router()
const controller = require('../controllers/listingController')
const validator = require('../validations/listingValidations')
const authenticateJWT = require('../middleware/authenticateJWT')

router.get('/:listingID', authenticateJWT, controller.getSingleListing)
router.get('/', authenticateJWT, controller.getAllListingsController)
router.post('/create', authenticateJWT, validator.validateListingCreate, controller.createANewListing)
router.put('/update/:listingID', authenticateJWT, validator.validateListingUpdate, controller.updateAnExistingListing)
router.delete('/:listingID', authenticateJWT, controller.deleteAnExistingListing)

module.exports = router
