// anything involving prisma should go in the service file (emailVerificationService)
// any logic should go in the controller file (emailVerificationController)
/* eslint-disable no-undef */

const express = require('express')
const router = express.Router()
const controller = require('../controllers/emailVerificationController')
const authenticateJWT = require('../middleware/authenticateJWT')

// should look like this
router.post('/verify-edu-email', authenticateJWT, controller.sendVerificationEmail)

router.get('/verify-edu', async (req, res) => {
  const { token } = req.query

  try {
    // Find user with matching token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiry: { gt: new Date() } // Check token has not expired
      }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' })
    }

    // Update user to mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        eduVerified: true,
        verificationToken: null, // Clear token after successful verification
        tokenExpiry: null
      }
    })

    res.status(200).json({ message: 'Email successfully verified.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error verifying email.' })
  }
}
)

router.get('/verification-status', async (req, res) => {
  const { email } = req.query

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.status(200).json({ eduVerified: user.eduVerified })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching verification status.' })
  }
})

module.exports = router
