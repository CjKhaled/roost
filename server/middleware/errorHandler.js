/* eslint-disable no-undef */

function errorHandler (error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ errorMessage: error.message })
  }

  return res.status(500).json({ message: 'Something went wrong' })
}

modules.export = errorHandler
