const prisma = require('../models/prisma/prismaClient')
const AppError = require('../config/AppError')

async function updateUserVerification (email, verificationToken, tokenExpiry) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        verificationToken,
        tokenExpiry
      }
    })

    return user
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('email')) {
      throw new AppError('A user with this email already exists.', 409)
    }

    throw new AppError('Error updating user verification', 500)
  }
}

async function eduVerification (req, res) {
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
    throw new AppError('Error verifying email.', 500)
  }
}

module.exports = {
  updateUserVerification,
  eduVerification
}
