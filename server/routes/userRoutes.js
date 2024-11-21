const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')
const messagesController = require('../controllers/messagesController')
const validator = require('../validations/userValidations')
const authenticateJWT = require('../middleware/authenticateJWT')

router.get('/', authenticateJWT, controller.getAllUsers)
router.get('/:userID', authenticateJWT, controller.getSingleUser)
router.put('/update/:userID', validator.validateUserUpdate, authenticateJWT, controller.updateAnExistingUser)
router.delete('/:userID', authenticateJWT, controller.deleteAnExistingUser)
router.get('/conversations/:userID', authenticateJWT, messagesController.getAllConversationsHandler)

module.exports = router
