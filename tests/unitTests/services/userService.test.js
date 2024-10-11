const { addUser, getUser, updateUser, deleteUser, getUsers } = require('../../../server/services/userService')
const prisma = require('../../../server/models/prisma/prismaClient')
jest.mock('../../../server/models/prisma/prismaClient')

beforeEach(() => {
    jest.clearAllMocks()
})

test("adding a new user works", async () => {
    const mockUser = { Id: 1, FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Password: 'password123' }
    prisma.user.create.mockResolvedValue(mockUser)

    const newUser = await addUser('John', 'Doe', 'john.doe@example.com', 'password123');
  expect(prisma.user.create).toHaveBeenCalledWith({
    data: {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      Password: 'password123'
    }
  });
  expect(newUser).toEqual(mockUser);
})

test("getting a user that exists works", () => {
    
})

test("getting a user that doesn't exist gives descriptive error", () => {
    
})

test("updating a user that exists works", () => {
    
})

test("updating a user that doesn't exist gives descriptive error", () => {
    
})

test("deleting a user that exists works", () => {
    
})

test("deleting a user that doesn't exist gives descriptive error", () => {
    
})

test("getting all users works", () => {

})