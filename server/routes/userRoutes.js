const express = require('express')
const router = express.Router()

router.get('/:userID')
router.get('/')
router.post('/create')
router.put('/update/:userID')
router.delete('/:userID')

module.exports = router
