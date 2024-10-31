const AppError = require('../config/AppError')
function errorHandler (error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ errorMessage: error.message })
  }

  // console.error('Unexpected error:', error)
  // console.error('Stack trace:', error.stack)

  return res.status(500).json({ message: 'Something went wrong' })
}

module.exports = errorHandler
