const { addUser, getUser, updateUser, deleteUser, getUsers } = require('../services/userService')

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
    const { FirstName, LastName, Email, Password } = req.body
    const user = await addUser(FirstName, LastName, Email, Password)
    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function updateAnExistingUser (req, res, next) {
  try {
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
