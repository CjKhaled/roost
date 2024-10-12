const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')
const validator = require('../validations/userValidations')

router.get('/:userID', controller.getSingleUser)
router.get('/', controller.getAllUsers)
router.put('/update/:userID', validator.validateUserUpdate, controller.updateAnExistingUser)
router.delete('/:userID', controller.deleteAnExistingUser)

module.exports = router
