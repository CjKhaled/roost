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

beforeEach(() => {
  jest.clearAllMocks()
})

test('adding a new user works', async () => {
  const mockUser = { Id: 1, FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' }
  prisma.user.create.mockResolvedValue(mockUser)

  const newUser = await addUser('John', 'Doe', 'john.doe@example.com', 'password123')
  expect(prisma.user.create).toHaveBeenCalledWith({
    data: {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      Password: 'password123'
    }
  })
  expect(newUser).toEqual(mockUser)
})

test('getting a user that exists works', async () => {
  const mockUser = { Id: 1, FirstName: 'Jane', LastName: 'Doe', Email: 'jane.doe@example.com', Password: 'password123' }
  prisma.user.findUnique.mockResolvedValue(mockUser)

  const fetchedUser = await getUser(1)
  expect(prisma.user.findUnique).toHaveBeenCalledWith({
    where: {
      Id: 1
    }
  })
  expect(fetchedUser).toEqual(mockUser)
})

test("getting a user that doesn't exist gives descriptive error", async () => {
  prisma.user.findUnique.mockResolvedValue(null)

  await expect(getUser(999)).rejects.toThrow('User not found')
})

test('updating a user that exists works', async () => {
  const mockUpdatedUser = { Id: 1, FirstName: 'Jane', LastName: 'Doe', Email: 'jane.doe@example.com', Password: 'password123' }
  prisma.user.update.mockResolvedValue(mockUpdatedUser)

  const updatedUser = await updateUser(1, 'Jane', 'Doe')
  expect(prisma.user.update).toHaveBeenCalledWith({
    where: {
      Id: 1
    },
    data: {
      FirstName: 'Jane',
      LastName: 'Doe'
    }
  })
  expect(updatedUser).toEqual(mockUpdatedUser)
})

test("updating a user that doesn't exist gives descriptive error", async () => {
  prisma.user.update.mockRejectedValue(new Error('User not found'))

  await expect(updateUser(999, 'Nonexistent', 'User')).rejects.toThrow('User not found')
})

test('deleting a user that exists works', async () => {
  const mockDeletedUser = { Id: 1, FirstName: 'Jane', LastName: 'Doe', Email: 'jane.doe@example.com', Password: 'password123' }
  prisma.user.delete.mockResolvedValue(mockDeletedUser)

  const deletedUser = await deleteUser(1)
  expect(prisma.user.delete).toHaveBeenCalledWith({
    where: {
      Id: 1
    }
  })
  expect(deletedUser).toEqual(mockDeletedUser)
})

test("deleting a user that doesn't exist gives descriptive error", async () => {
  prisma.user.delete.mockRejectedValue(new Error('User not found'))

  await expect(deleteUser(999)).rejects.toThrow('User not found')
})

test('getting all users works', async () => {
  const mockUsers = [
    { Id: 1, FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' },
    { Id: 2, FirstName: 'Jane', LastName: 'Doe', Email: 'jane.doe@example.com', Password: 'password123' }
  ]
  prisma.user.findMany.mockResolvedValue(mockUsers)

  const users = await getUsers()
  expect(prisma.user.findMany).toHaveBeenCalled()
  expect(users).toEqual(mockUsers)
  expect(users.length).toBeGreaterThan(0)
})
