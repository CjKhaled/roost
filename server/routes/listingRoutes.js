const express = require('express')
const router = express.Router()
const controller = require('../controllers/listingController')
const validator = require('../validations/listingValidations')
const authenticateJWT = require('../middleware/authenticateJWT')
const { loadIntoMemory, uploadToFirebase } = require('../services/firebase')

// images
router.post('/upload', authenticateJWT, loadIntoMemory, uploadToFirebase, async (req, res) => {
    res.json({ urls: req.fileUpload.urls })
})

router.get('/', controller.getAllListingsController)
router.get('/:listingID', controller.getSingleListing)
router.post('/create', authenticateJWT, validator.validateListingCreate, controller.createANewListing)
router.put('/update/:listingID', authenticateJWT, validator.validateListingUpdate, controller.updateAnExistingListing)
router.delete('/:listingID', authenticateJWT, controller.deleteAnExistingListing)

module.exports = router
