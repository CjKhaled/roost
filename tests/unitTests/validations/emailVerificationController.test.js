/* eslint-disable no-undef */
const request = require('supertest')
const express = require('express')
const nodemailer = require('nodemailer')
const controller = require('../../../server/controllers/emailVerificationController')
const { updateUserVerification } = require('../../../server/services/emailVerificationService')

// Mock dependencies
jest.mock('nodemailer')
jest.mock('../../../server/services/emailVerificationService')

describe('emailVerificationController - sendVerificationEmail', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.post('/verify-edu-email', controller.sendVerificationEmail)
  })

  it('should return 400 if email is not .edu', async () => {
    const response = await request(app)
      .post('/verify-edu-email')
      .send({ email: 'user@example.com' })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Only .edu emails are allowed for verification.')
  })

  it('should send a verification email if email is valid', async () => {
    // Mock service function to return a dummy user
    updateUserVerification.mockResolvedValue({ email: 'user@school.edu' })

    // Mock nodemailer transport to ensure email is "sent"
    const sendMailMock = jest.fn().mockResolvedValue(true)
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

    const response = await request(app)
      .post('/verify-edu-email')
      .send({ email: 'user@school.edu' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Verification email sent.')
    expect(sendMailMock).toHaveBeenCalled()
  })
})
