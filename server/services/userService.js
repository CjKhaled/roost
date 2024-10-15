const prisma = require('../models/prisma/prismaClient')
const AppError = require('../config/AppError')

async function addUser (FirstName, LastName, Email, Password) {
  try {
    const user = await prisma.user.create({
      data: {
        FirstName,
        LastName,
        Email,
        Password
      }
    })

    return user
  } catch (error) {
    throw new AppError('A user with that email already exists.', 409)
  }
}

async function getUser ({ Id, Email }) {
  try {
    const user = await prisma.user.findUnique({
      where: Id ? { Id } : { Email }
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }
    return user
  } catch (error) {
    throw new AppError('User not found', 404)
  }
}

async function updateUser (Id, FirstName, LastName) {
  try {
    const user = await prisma.user.update({
      where: {
        Id
      },
      data: {
        FirstName,
        LastName
      }
    })

    return user
  } catch (error) {
    throw new AppError('User not found', 404)
  }
}

async function deleteUser (Id) {
  try {
    const user = await prisma.user.delete({
      where: {
        Id
      }
    })

    return user
  } catch (error) {
    throw new AppError('User not found', 404)
  }
}

async function getUsers () {
  try {
    const users = await prisma.user.findMany()
    return users
  } catch (error) {
    throw new AppError('Unexpected Error', 500)
  }
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers
}
