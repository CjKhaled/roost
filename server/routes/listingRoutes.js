const express = require('express')
const router = express.Router()
const controller = require('../controllers/listingController')
const validator = require('../validations/listingValidations')

router.get('/:listingID', controller.getSingleListing)
router.get('/', controller.getAllListingsController)
router.post('/create', validator.validateListingCreate, controller.createANewListing)
router.put('/update/:listingID', validator.validateListingUpdate, controller.updateAnExistingListing)
router.delete('/:listingID', controller.deleteAnExistingListing)

module.exports = router
