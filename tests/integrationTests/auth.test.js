/* eslint-disable no-undef */
const express = require('express')
const app = express()
const request = require('supertest')
const prisma = require('../../server/models/prisma/prismaClient')
const errorHandler = require('../../server/middleware/errorHandler')
const cookieParser = require('cookie-parser')
const genKeyPair = require('../../server/config/genKeyPair')
const authRouter = require('../../server/routes/authRoutes')

app.use(cookieParser())
app.use(express.json())
app.use('/api', authRouter)
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

class PrismaClientKnownRequestError extends Error {
  constructor (message, code, clientVersion) {
    super(message)
    this.name = 'PrismaClientKnownRequestError'
    this.code = code
    this.clientVersion = clientVersion
  }
}

beforeAll(() => {
  genKeyPair()
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('requesting POST /signup with a unique email results in 200 OK', async () => {
  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }
  prisma.user.create.mockResolvedValue(mockUser)

  const res = await request(app)
    .post('/api/signup')
    .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' })

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toEqual(mockUser)
})

test('requesting POST /signup with a nonunique email results in 409 error', async () => {
  const prismaError = new PrismaClientKnownRequestError(
    'Unique constraint failed on the fields: (`email`)',
    'P2002',
    '1.0.0'
  )

  prisma.user.create.mockRejectedValue(prismaError)
  const res = await request(app)
    .post('/api/signup')
    .send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    })

  expect(res.statusCode).toBe(409)
  expect(res.body.errorMessage).toBe('A user with that email already exists.')
})

test('requesting POST /login with correct credentials results in 200 OK', async () => {
  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedpassword123' }

  prisma.user.findUnique.mockResolvedValue(mockUser)

  jest.spyOn(require('../../server/config/hashUtils'), 'compareHashes').mockResolvedValue(true)

  const res = await request(app)
    .post('/api/login')
    .send({ email: 'john.doe@example.com', password: 'password123' })

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toEqual(mockUser)
})

test('requesting POST /login with incorrect email results in 401 error', async () => {
  prisma.user.findUnique.mockResolvedValue(null)

  const res = await request(app)
    .post('/api/login')
    .send({ email: 'nonexistent@example.com', password: 'password123' })

  expect(res.statusCode).toBe(401)
  expect(res.body.errorMessage).toBe('Invalid email.')
})

test('requesting POST /login with incorrect password results in 401 error', async () => {
  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedpassword123' }

  prisma.user.findUnique.mockResolvedValue(mockUser)
  const hashUtils = require('../../server/config/hashUtils')
  jest.spyOn(hashUtils, 'compareHashes').mockResolvedValue(false)

  const res = await request(app)
    .post('/api/login')
    .send({ email: 'john.doe@example.com', password: 'wrongpassword' })

  expect(res.statusCode).toBe(401)
  expect(res.body.errorMessage).toBe('Invalid password.')
})

test('requesting GET /logout when logged in results in 200 OK', async () => {
  const res = await request(app)
    .get('/api/logout')
    .set('Cookie', 'token=someValidToken')

  expect(res.statusCode).toBe(200)
  expect(res.body.user).toBeNull()
})

test('requesting GET /logout when not logged in results in 401 error', async () => {
  const res = await request(app)
    .get('/api/logout')

  expect(res.statusCode).toBe(401)
  expect(res.body.errorMessage).toBe('You are not logged in.')
})
