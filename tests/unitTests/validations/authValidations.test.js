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

test('request to sign up a user has a FirstName that is empty', async () => {
  const reqBody = { FirstName: '', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' }
  const result = await runValidation(reqBody, validateUserSignup)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('First name must be between 2-30 characters.')
})

test('request to sign up a user has an Email that definitely is not an email, and Password with only 6 characters', async () => {
  const reqBody = { FirstName: 'John', LastName: 'Doe', Email: 'invalid-email', Password: '123456' }

  const result = await runValidation(reqBody, validateUserSignup)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Must provide a valid email.')
  expect(errors[1].msg).toBe('Password must be between 8-20 characters.')
})

test('request to sign up a user meets all the constraints', async () => {
  const reqBody = { FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' }

  const result = await runValidation(reqBody, validateUserSignup)

  expect(result.isEmpty()).toBe(true)
})

test('request to login an existing user has an Email that is over 50 characters', async () => {
  const reqBody = { Email: 'averylongemailaddress123456789012345678901234567890@example.com', Password: 'password123' }

  const result = await runValidation(reqBody, validateUserLogin)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Email must be between 5-50 characters.')
})

test('request to login an existing user has a Password that is over 20 characters', async () => {
  const reqBody = { Email: 'john.doe@example.com', Password: 'averylongpasswordthatexceedstwentycharacters' }

  const result = await runValidation(reqBody, validateUserLogin)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Password must be between 8-20 characters.')
})

test('request to login an existing user meets all the constraints', async () => {
  const reqBody = { Email: 'john.doe@example.com', Password: 'password123' }

  const result = await runValidation(reqBody, validateUserLogin)

  expect(result.isEmpty()).toBe(true)
})
