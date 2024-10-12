/* eslint-disable no-undef */
const { validateUserCreate, validateUserUpdate } = require('../../../server/validations/userValidations')
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

test('request to create a user has a FirstName that is empty', async () => {
  const reqBody = { FirstName: '', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' }

  const result = await runValidation(reqBody, validateUserCreate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('First name must be between 2-30 characters.')
})

test('request to create a user has an Email that definitely is not an email, and Password with only 6 characters', async () => {
  const reqBody = { FirstName: 'John', LastName: 'Doe', Email: 'invalid-email', Password: '123456' }

  const result = await runValidation(reqBody, validateUserCreate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Must provide a valid email.')
  expect(errors[1].msg).toBe('Password must be between 8-20 characters.')
})

test('request to create a user meets all the constraints', async () => {
  const reqBody = { FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' }

  const result = await runValidation(reqBody, validateUserCreate)

  expect(result.isEmpty()).toBe(true)
})

test('request to update a user has a FirstName that contains a number', async () => {
  const reqBody = { FirstName: 'John123', LastName: 'Doe' }

  const result = await runValidation(reqBody, validateUserUpdate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('First name must only contain letters.')
})

test('request to update a user has a LastName with only 1 character', async () => {
  const reqBody = { FirstName: 'John', LastName: 'D' }

  const result = await runValidation(reqBody, validateUserUpdate)

  expect(result.isEmpty()).toBe(false) // Expect validation to fail
  expect(result.array()[0].msg).toBe('Last name must be between 2-30 characters.')
})

test('request to update a user meets all the constraints', async () => {
  const reqBody = { FirstName: 'John', LastName: 'Doe' }

  const result = await runValidation(reqBody, validateUserUpdate)

  expect(result.isEmpty()).toBe(true) // Expect validation to pass
})
