const prisma = require('../models/prisma/prismaClient')

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
    throw new Error(error.message)
  }
}

async function getUser (Id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        Id
      }
    })

    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    throw new Error(error.message)
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
    throw new Error(error.message)
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
    throw new Error(error.message)
  }
}

async function getUsers () {
  try {
    const users = await prisma.user.findMany()
    return users
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers
}
