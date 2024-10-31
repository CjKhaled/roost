/* eslint-disable no-undef */
const { validateUserUpdate } = require('../../../server/validations/userValidations')
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

test('request to update a user has a firstName that contains a number', async () => {
  const reqBody = { firstName: 'John123', lastName: 'Doe' }

  const result = await runValidation(reqBody, validateUserUpdate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('First name must only contain letters.')
})

test('request to update a user has a lastName with only 1 character', async () => {
  const reqBody = { firstName: 'John', lastName: 'D' }

  const result = await runValidation(reqBody, validateUserUpdate)

  expect(result.isEmpty()).toBe(false) // Expect validation to fail
  expect(result.array()[0].msg).toBe('Last name must be between 2-30 characters.')
})

test('request to update a user meets all the constraints', async () => {
  const reqBody = { firstName: 'John', lastName: 'Doe' }

  const result = await runValidation(reqBody, validateUserUpdate)

  expect(result.isEmpty()).toBe(true) // Expect validation to pass
})
