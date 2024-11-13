const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/verify-edu-email', async (req, res) => {
  const { email } = req.body;

  // Check if email is .edu
  if (!email.endsWith('.edu')) {
    /// TODO: make sure this error message is valid
    return res.status(400).json({ message: 'Only .edu emails are allowed for verification.' });
  }

  // Generate a verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  try {
    // Update user with the verification token and expiry time
    const user = await prisma.user.update({
      where: { email },
      data: {
        verificationToken,
        tokenExpiry,
      },
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-edu?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your .edu email address',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    });

    res.status(200).json({ message: 'Verification email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending verification email.' });
  }
});

router.get('/verify-edu', async (req, res) => {
  const { token } = req.query;

  try {
    // Find user with matching token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiry: { gt: new Date() }, // Check token has not expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // Update user to mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        eduVerified: true,
        verificationToken: null, // Clear token after successful verification
        tokenExpiry: null,
      },
    });

    res.status(200).json({ message: 'Email successfully verified.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying email.' });
  }
})

router.get('/verification-status', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ eduVerified: user.eduVerified });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching verification status.' });
  }
});

module.exports = router;
