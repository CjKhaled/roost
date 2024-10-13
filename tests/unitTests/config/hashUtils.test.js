/* eslint-disable no-undef */
const bcrypt = require('bcryptjs')
const { hashPassword, compareHashes } = require('../../../server/config/hashUtils')
const AppError = require('../../../server/config/AppError')

jest.mock('bcryptjs')

test('hashes the password correctly', async () => {
  const password = 'mysecretpassword'
  const hashedPasswordMock = 'hashedpassword123'

  bcrypt.hash.mockResolvedValue(hashedPasswordMock)

  const hashedPassword = await hashPassword(password)

  expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
  expect(hashedPassword).toBe(hashedPasswordMock)
})

test('throws an AppError if hashing fails', async () => {
  const password = 'mysecretpassword'
  bcrypt.hash.mockRejectedValue(new Error('Hashing failed'))

  await expect(hashPassword(password)).rejects.toThrow(AppError)
  await expect(hashPassword(password)).rejects.toThrow('Error hashing password')
})

test('returns true if passwords match', async () => {
  const givenPassword = 'mysecretpassword'
  const storedPassword = 'hashedpassword123'

  bcrypt.compare.mockResolvedValue(true)

  const result = await compareHashes(givenPassword, storedPassword)

  expect(bcrypt.compare).toHaveBeenCalledWith(givenPassword, storedPassword)
  expect(result).toBe(true)
})

test('returns false if passwords do not match', async () => {
  const givenPassword = 'mysecretpassword'
  const storedPassword = 'hashedpassword123'

  bcrypt.compare.mockResolvedValue(false)

  const result = await compareHashes(givenPassword, storedPassword)

  expect(bcrypt.compare).toHaveBeenCalledWith(givenPassword, storedPassword)
  expect(result).toBe(false)
})

test('throws an AppError if comparison fails', async () => {
  const givenPassword = 'mysecretpassword'
  const storedPassword = 'hashedpassword123'

  bcrypt.compare.mockRejectedValue(new Error('Comparison failed'))

  await expect(compareHashes(givenPassword, storedPassword)).rejects.toThrow(AppError)
  await expect(compareHashes(givenPassword, storedPassword)).rejects.toThrow('Error comparing hashes')
})
