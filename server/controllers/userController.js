const { addUser, getUser, updateUser, deleteUser, getUsers } = require('../services/userService')

async function getSingleUser (req, res) {
  try {
    const { userID } = req.params
    const user = await getUser(userID)
    res.status(200).json({ user })
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getAllUsers (req, res) {
  try {
    const user = await getUsers()
    res.status(200).json({ user })
  } catch (error) {
    throw new Error(error)
  }
}

async function createANewUser (req, res) {
  try {
    const { FirstName, LastName, Email, Password } = req.body
    const user = addUser(FirstName, LastName, Email, Password)
    res.status(200).json({ user })
  } catch (error) {
    throw new Error(error)
  }
}

async function updateAnExistingUser (req, res) {
  try {
    const { userID } = req.params
    const { FirstName, LastName } = req.body
    const user = updateUser(userID, FirstName, LastName)
    res.status(200).json({ user })
  } catch (error) {
    throw new Error(error)
  }
}

async function deleteAnExistingUser (req, res) {
  try {
    const { userID } = req.params
    const user = await deleteUser(userID)
    res.status(200).json({ user })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {
  getSingleUser,
  getAllUsers,
  createANewUser,
  updateAnExistingUser,
  deleteAnExistingUser
}
