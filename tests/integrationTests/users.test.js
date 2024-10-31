/* eslint-disable no-undef */
const express = require('express')
const app = express()
const request = require('supertest')
const passport = require('passport')
const prisma = require('../../server/models/prisma/prismaClient')
const errorHandler = require('../../server/middleware/errorHandler')
const userRouter = require('../../server/routes/userRoutes')

app.use(express.json())
app.use('/api/users', userRouter)
app.use(errorHandler)

jest.mock('../../server/models/prisma/prismaClient', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn()
  }
}))

jest
  .spyOn(passport, 'authenticate')
  .mockImplementation((strategy, options, callback) => {
    return (req, res, next) => {
      req.user = {
        id: 'test-user-id',
        email: 'test@example.com'
      }
      next()
    }
  })

class PrismaClientKnownRequestError extends Error {
  constructor (message, code, clientVersion) {
    super(message)
    this.name = 'PrismaClientKnownRequestError'
    this.code = code
    this.clientVersion = clientVersion
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('requesting GET /:userID with a valid userID results in 200 OK', async () => {
  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }
  prisma.user.findUnique.mockResolvedValue(mockUser)

  const res = await request(app).get('/api/users/1')

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toEqual(mockUser)
})

test('requesting GET /:userID with an invalid userID results in 404 error', async () => {
  prisma.user.findUnique.mockResolvedValue(null)

  const res = await request(app).get('/api/users/999')

  expect(res.statusCode).toBe(404)
  expect(res.body).toEqual({ errorMessage: 'User not found' })
})

test('requesting GET / results in 200 OK', async () => {
  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }
  ]
  prisma.user.findMany.mockResolvedValue(mockUsers)

  const res = await request(app).get('/api/users')

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toEqual(mockUsers)
})

test('requesting PUT /update/:userID with a valid userID results in 200 OK', async () => {
  const mockUpdatedUser = { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.doe@example.com' }
  prisma.user.update.mockResolvedValue(mockUpdatedUser)

  const res = await request(app)
    .put('/api/users/update/1')
    .send({ firstName: 'John', lastName: 'Smith' })

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toEqual(mockUpdatedUser)
})

test('requesting PUT /update/:userID with an invalid userID results in 404 error', async () => {
  const prismaError = new PrismaClientKnownRequestError('User not found', 'P2025', '1.0.0') // Simulate Prisma error
  prisma.user.update.mockRejectedValue(prismaError)

  const res = await request(app)
    .put('/api/users/update/999')
    .send({ firstName: 'John', lastName: 'Smith' })

  expect(res.statusCode).toBe(404)
  expect(res.body.errorMessage).toBe('User not found')
})

test('requesting DELETE /:userID with a valid userID results in 200 OK', async () => {
  const mockDeletedUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }
  prisma.user.delete.mockResolvedValue(mockDeletedUser)

  const res = await request(app).delete('/api/users/1')

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toEqual(mockDeletedUser)
})

test('requesting DELETE /:userID with an invalid userID results in 404 error', async () => {
  const prismaError = new PrismaClientKnownRequestError('User not found', 'P2025', '1.0.0') // Simulate Prisma error
  prisma.user.delete.mockRejectedValue(prismaError)

  const res = await request(app).delete('/api/users/999')

  expect(res.statusCode).toBe(404)
  expect(res.body.errorMessage).toBe('User not found')
})
