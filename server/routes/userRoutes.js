const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')

router.get('/:userID', controller.getSingleUser)
router.get('/', controller.getAllUsers)
router.post('/create', controller.createANewUser)
router.put('/update/:userID', controller.updateAnExistingUser)
router.delete('/:userID', controller.deleteAnExistingUser)

module.exports = router
