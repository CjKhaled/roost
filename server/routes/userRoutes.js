const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')
const authenticateJWT = require('../middleware/authenticateJWT')

router.get('/favorites', authenticateJWT, controller.getFavorites)
router.post('/favorites/:listingId', authenticateJWT, controller.toggleUserFavorite)

router.get('/', authenticateJWT, controller.getAllUsers)
router.get('/:userID', controller.getSingleUser)
router.delete('/:userID', authenticateJWT, controller.deleteAnExistingUser)

module.exports = router
