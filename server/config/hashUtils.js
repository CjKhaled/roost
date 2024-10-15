const bcrypt = require('bcryptjs')
const AppError = require('./AppError')

async function hashPassword (password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  } catch (error) {
    throw new AppError('Error hashing password', 500)
  }
}

async function compareHashes (givenPassword, storedPassword) {
  try {
    const result = await bcrypt.compare(givenPassword, storedPassword)
    return result
  } catch {
    throw new AppError('Error comparing hashes', 500)
  }
}

module.exports = {
  hashPassword,
  compareHashes
}
