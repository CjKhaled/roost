const { addUser, getUser, updateUser, deleteUser, getUsers } = require('../services/userService')
const { validationResult } = require('express-validator')
const AppError = require('../config/AppError')
const hash = require('../config/hash')

async function getSingleUser (req, res, next) {
  try {
    const { userID } = req.params
    const user = await getUser(userID)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function getAllUsers (req, res, next) {
  try {
    const user = await getUsers()
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function createANewUser (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0], 400)
    }
    const { FirstName, LastName, Email, Password } = req.body
    const hashedPassword = await hash.hashPassword(Password)
    const user = await addUser(FirstName, LastName, Email, hashedPassword)
    res.status(200).json({ user })
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
    const user = await updateUser(userID, FirstName, LastName)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function deleteAnExistingUser (req, res, next) {
  try {
    const { userID } = req.params
    const user = await deleteUser(userID)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSingleUser,
  getAllUsers,
  createANewUser,
  updateAnExistingUser,
  deleteAnExistingUser
}
