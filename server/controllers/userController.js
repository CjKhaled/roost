const { getUser, updateUser, deleteUser, getUsers, getUserFavorites, toggleFavorite } = require('../services/userService')
const { validationResult } = require('express-validator')
const AppError = require('../config/AppError')

async function getSingleUser (req, res, next) {
  try {
    const { userID } = req.params
    const { password, ...user } = await getUser(userID)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function getAllUsers (req, res, next) {
  try {
    const usersWithPass = await getUsers()
    const users = usersWithPass.map(({ password, ...user }) => user)
    const user = req.user
    res.status(200).json({ users, user })
  } catch (error) {
    next(error)
  }
}

async function updateAnExistingUser (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0], 400)
    }
    const { userID } = req.params
    const { FirstName, LastName } = req.body
    const { password, ...user } = await updateUser(userID, FirstName, LastName)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function deleteAnExistingUser (req, res, next) {
  try {
    const { userID } = req.params
    const { password, ...user } = await deleteUser(userID)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function getFavorites(req, res, next) {
  try {
    const userId = req.user.id
    const { favorites } = await getUserFavorites(userId)
    res.status(200).json({ listings: favorites })
  } catch (error) {
    next(error)
  }
}

async function toggleUserFavorite(req, res, next) {
  try {
    const userId = req.user.id
    const { listingId } = req.params
    await toggleFavorite(userId, listingId)
    res.status(200).json({ message: 'Favorite toggled successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSingleUser,
  getAllUsers,
  updateAnExistingUser,
  deleteAnExistingUser,
  getFavorites,
  toggleUserFavorite
}
