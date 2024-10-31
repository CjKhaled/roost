const prisma = require('../models/prisma/prismaClient')
const AppError = require('../config/AppError')

async function addUser (firstName, lastName, email, password) {
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password
      }
    })

    return user
  } catch (error) {
    throw new AppError('A user with that email already exists.', 409)
  }
}

async function getUser (id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  } catch (error) {
    throw new AppError('User not found', 404)
  }
}

async function getUserByEmail (email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  } catch (error) {
    throw new AppError('User not found', 404)
  }
}

async function updateUser (id, firstName, lastName) {
  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        firstName,
        lastName
      }
    })

    return user
  } catch (error) {
    throw new AppError('User not found', 404)
  }
}

async function deleteUser (id) {
  try {
    const user = await prisma.user.delete({
      where: {
        id
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
  getUsers,
  getUserByEmail
}
