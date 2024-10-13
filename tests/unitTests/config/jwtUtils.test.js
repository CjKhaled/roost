/* eslint-disable no-undef */
const jsonwebtoken = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const AppError = require('../../../server/config/AppError')

jest.mock('jsonwebtoken')
jest.mock('path')
jest.mock('fs')

const mockPublicKey = 'mock-public-key'
const mockPrivateKey = 'mock-private-key'

path.join.mockImplementation((...args) => args.join('/'))

fs.readFileSync.mockImplementation((filePath) => {
  if (typeof filePath === 'string') {
    if (filePath.endsWith('public.key')) return mockPublicKey
    if (filePath.endsWith('private.key')) return mockPrivateKey
  }
  throw new Error('Unexpected file read: ' + filePath)
})

jest.mock('../../../server/config/jwtUtils', () => {
  return jest.requireActual('../../../server/config/jwtUtils')
}, { virtual: true })

const { issueJWT, verifyJWT } = require('../../../server/config/jwtUtils')

beforeEach(() => {
  jest.clearAllMocks()
})

test('issueJWT should issue a JWT with correct payload and options', () => {
  const mockUser = { id: 'user123' }
  const mockToken = 'mock-signed-token'
  const mockNow = 1234567890000

  jest.spyOn(Date, 'now').mockImplementation(() => mockNow)
  jsonwebtoken.sign.mockReturnValue(mockToken)

  const result = issueJWT(mockUser)

  expect(jsonwebtoken.sign).toHaveBeenCalledWith(
    {
      sub: mockUser.id,
      iat: mockNow
    },
    mockPrivateKey,
    {
      expiresIn: '8h',
      algorithm: 'RS256'
    }
  )

  expect(result).toEqual({
    token: mockToken,
    expiresIn: '8h'
  })

  jest.restoreAllMocks()
})

test('verifyJWT should return decoded token when valid', () => {
  const mockToken = 'valid-token'
  const mockDecodedToken = { sub: 'user123', iat: Date.now() }

  jsonwebtoken.verify.mockReturnValue(mockDecodedToken)

  const result = verifyJWT(mockToken)

  expect(jsonwebtoken.verify).toHaveBeenCalledWith(mockToken, mockPublicKey, {
    issuer: 'roost'
  })

  expect(result).toEqual(mockDecodedToken)
})

test('verifyJWT should throw AppError with "Token has expired." message for expired tokens', () => {
  const mockToken = 'expired-token'

  jsonwebtoken.verify.mockImplementation(() => {
    const error = new Error('Token expired')
    error.name = 'TokenExpiredError'
    throw error
  })

  expect(() => verifyJWT(mockToken)).toThrow(AppError)
  expect(() => verifyJWT(mockToken)).toThrow('Token has expired.')
})

test('verifyJWT should throw AppError with "Invalid token." message for invalid tokens', () => {
  const mockToken = 'invalid-token'

  jsonwebtoken.verify.mockImplementation(() => {
    const error = new Error('Invalid token')
    error.name = 'JsonWebTokenError'
    throw error
  })

  expect(() => verifyJWT(mockToken)).toThrow(AppError)
  expect(() => verifyJWT(mockToken)).toThrow('Invalid token.')
})

test('verifyJWT should throw AppError with "Token verification failed." message for unknown errors', () => {
  const mockToken = 'problematic-token'

  jsonwebtoken.verify.mockImplementation(() => {
    throw new Error('Some unexpected error')
  })

  expect(() => verifyJWT(mockToken)).toThrow(AppError)
  expect(() => verifyJWT(mockToken)).toThrow('Token verification failed.')
})
