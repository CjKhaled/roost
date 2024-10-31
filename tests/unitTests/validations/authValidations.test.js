/* eslint-disable no-undef */
const { validateUserSignup, validateUserLogin } = require('../../../server/validations/authValidations')
const { validationResult } = require('express-validator')

const runValidation = async (reqBody, validationMiddleware) => {
  const req = { body: reqBody }
  const res = {}
  const next = jest.fn()

  for (const validation of validationMiddleware) {
    await validation.run(req, res, next)
  }

  return validationResult(req)
}

test('request to sign up a user has a firstName that is empty', async () => {
  const reqBody = { firstName: '', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' }
  const result = await runValidation(reqBody, validateUserSignup)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('First name must be between 2-30 characters.')
})

test('request to sign up a user has an email that definitely is not an email, and password with only 6 characters', async () => {
  const reqBody = { firstName: 'John', lastName: 'Doe', email: 'invalid-email', password: '123456' }

  const result = await runValidation(reqBody, validateUserSignup)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Must provide a valid email.')
  expect(errors[1].msg).toBe('Password must be between 8-20 characters.')
})

test('request to sign up a user meets all the constraints', async () => {
  const reqBody = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' }

  const result = await runValidation(reqBody, validateUserSignup)

  expect(result.isEmpty()).toBe(true)
})

test('request to login an existing user has an email that is over 50 characters', async () => {
  const reqBody = { email: 'averylongemailaddress123456789012345678901234567890@example.com', password: 'password1234' }

  const result = await runValidation(reqBody, validateUserLogin)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Email must be between 5-50 characters.')
})

test('request to login an existing user has a password that is over 20 characters', async () => {
  const reqBody = { email: 'john.doe@example.com', password: 'averylongpasswordthatexceedstwentycharacters' }

  const result = await runValidation(reqBody, validateUserLogin)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Password must be between 8-20 characters.')
})

test('request to login an existing user meets all the constraints', async () => {
  const reqBody = { email: 'john.doe@example.com', password: 'password1234' }

  const result = await runValidation(reqBody, validateUserLogin)

  expect(result.isEmpty()).toBe(true)
})
