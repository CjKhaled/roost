/* eslint-disable no-unused-vars */
class AppError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}
