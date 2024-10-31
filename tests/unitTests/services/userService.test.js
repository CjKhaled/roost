/* eslint-disable no-undef */
const { addUser, getUser, updateUser, deleteUser, getUsers } = require('../../../server/services/userService')
const prisma = require('../../../server/models/prisma/prismaClient')
jest.mock('../../../server/models/prisma/prismaClient', () => ({
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

beforeEach(() => {
  jest.clearAllMocks()
})

test('adding a new user works', async () => {
  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' }
  prisma.user.create.mockResolvedValue(mockUser)

  const newUser = await addUser('John', 'Doe', 'john.doe@example.com', 'password123')
  expect(prisma.user.create).toHaveBeenCalledWith({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    }
  })
  expect(newUser).toEqual(mockUser)
})

test('adding a user with a duplicate email gives a 409 error', async () => {
  const prismaError = new PrismaClientKnownRequestError('Unique constraint failed on the fields: (`email`)', 'P2002', '1.0.0')
  prisma.user.create.mockRejectedValue(prismaError)

  await expect(addUser('John', 'Doe', 'existing.email@example.com', 'password123')).rejects.toThrow('A user with that email already exists.')
})

test('getting a user that exists works', async () => {
  const mockUser = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'password123' }
  prisma.user.findUnique.mockResolvedValue(mockUser)

  const fetchedUser = await getUser({ id: 1 })
  expect(prisma.user.findUnique).toHaveBeenCalledWith({
    where: {
      id: 1
    }
  })
  expect(fetchedUser).toEqual(mockUser)
})

test("getting a user that doesn't exist gives 404 error", async () => {
  prisma.user.findUnique.mockResolvedValue(null)

  await expect(getUser({ id: 999 })).rejects.toThrow('User not found')
})

test('updating a user that exists works', async () => {
  const mockUpdatedUser = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'password123' }
  prisma.user.update.mockResolvedValue(mockUpdatedUser)

  const updatedUser = await updateUser(1, 'Jane', 'Doe')
  expect(prisma.user.update).toHaveBeenCalledWith({
    where: {
      id: 1
    },
    data: {
      firstName: 'Jane',
      lastName: 'Doe'
    }
  })
  expect(updatedUser).toEqual(mockUpdatedUser)
})

test("updating a user that doesn't exist gives 404 error", async () => {
  const prismaError = new PrismaClientKnownRequestError('User not found', 'P2025', '1.0.0') // Prisma's typical error
  prisma.user.update.mockRejectedValue(prismaError)

  await expect(updateUser(999, 'Nonexistent', 'User')).rejects.toThrow('User not found')
})

test('deleting a user that exists works', async () => {
  const mockDeletedUser = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'password123' }
  prisma.user.delete.mockResolvedValue(mockDeletedUser)

  const deletedUser = await deleteUser(1)
  expect(prisma.user.delete).toHaveBeenCalledWith({
    where: {
      id: 1
    }
  })
  expect(deletedUser).toEqual(mockDeletedUser)
})

test("deleting a user that doesn't exist gives 404 error", async () => {
  const prismaError = new PrismaClientKnownRequestError('User not found', 'P2025', '1.0.0')
  prisma.user.delete.mockRejectedValue(prismaError)

  await expect(deleteUser(999)).rejects.toThrow('User not found')
})

test('getting all users works', async () => {
  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'password123' }
  ]
  prisma.user.findMany.mockResolvedValue(mockUsers)

  const users = await getUsers()
  expect(prisma.user.findMany).toHaveBeenCalled()
  expect(users).toEqual(mockUsers)
  expect(users.length).toBeGreaterThan(0)
})
