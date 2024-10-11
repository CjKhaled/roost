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
    throw new Error(error)
  }
}

async function getUser (Id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        Id
      }
    })

    return user
  } catch (error) {
    throw new Error(error)
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
    throw new Error(error)
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
    throw new Error(error)
  }
}

async function getUsers () {
  try {
    const users = await prisma.user.findMany()
    return users
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers
}
