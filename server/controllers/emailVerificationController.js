const { updateUserVerification } = require('../services/emailVerificationService')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

async function sendVerificationEmail (req, res, next) {
  const { email } = req.body

  // Check if email is .edu
  if (!email.endsWith('.edu')) {
    /// TODO: make sure this error message is valid
    return res.status(400).json({ message: 'Only .edu emails are allowed for verification.' })
  }

  // Generate a verification token
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

  try {
    // Update user with the verification token and expiry time
    const user = await updateUserVerification(email, verificationToken, tokenExpiry)

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-edu?token=${verificationToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your .edu email address',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`
    })

    res.status(200).json({ message: 'Verification email sent.' })
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ message: 'A user with this email already exists.' })
    }
    next(error)
  }
}

module.exports = {
  sendVerificationEmail
}
