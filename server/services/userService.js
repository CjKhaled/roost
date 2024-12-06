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
    if (error.code === 'P2002' /* && error.meta.target.includes('email') */) {
      throw new AppError('A user with that email already exists.', 409)
    }
    throw new AppError(error, 409)
  }
}

async function getUser (id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        createdListings: {
          select: {
            id: true
          }
        }
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
        email
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

async function updateUser (id, firstName, lastName, email) {
  try {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        firstName,
        lastName,
        email
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

async function getUserFavorites(userId) {
  try {
    const favorites = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true }
    })
  
    return favorites
  } catch (error) {
    throw new AppError(error)
  }
}

async function toggleFavorite(userId, listingId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { favorites: true }
  })

  const isFavorited = user.favorites.some(f => f.id === listingId)

  if (isFavorited) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          disconnect: { id: listingId }
        }
      }
    })
  } else {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          connect: { id: listingId }
        }
      }
    })
  }
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserByEmail,
  getUserFavorites,
  toggleFavorite
}
