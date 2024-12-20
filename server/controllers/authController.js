const { addUser, getUserByEmail } = require('../services/userService')
const { validationResult } = require('express-validator')
const AppError = require('../config/AppError')
const hash = require('../config/hashUtils')
const jwt = require('../config/jwtUtils')

async function signupUser (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0], 400)
    }

    const { firstName, lastName, email, password } = req.body
    const hashedPassword = await hash.hashPassword(password)
    const user = await addUser(firstName, lastName, email, hashedPassword)

    const jwtToken = jwt.issueJWT(user)
    res.cookie('token', jwtToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    })

    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

async function loginUser (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400)
    }

    const { email, password } = req.body

    let user
    try {
      user = await getUserByEmail(email)
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        throw new AppError('Invalid email.', 401)
      }
      throw error
    }

    const result = await hash.compareHashes(password, user.password)
    if (result) {
      const jwtToken = jwt.issueJWT(user)
      res.cookie('token', jwtToken.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      })
      res.status(200).json({ user })
    } else {
      throw new AppError('Invalid password.', 401)
    }
  } catch (error) {
    next(error)
  }
}

function logoutUser (req, res, next) {
  try {
    if (req.cookies.token) {
      res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', secure: true })
      res.status(200).json({ user: null })
    } else {
      throw new AppError('You are not logged in.', 401)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signupUser,
  loginUser,
  logoutUser
}
