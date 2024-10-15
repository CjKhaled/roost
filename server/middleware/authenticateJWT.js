const passport = require('passport')
const AppError = require('../config/AppError')

function authenticateJWT (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    try {
      if (err) {
        return next(err)
      }

      if (!user) {
        throw new AppError('You are not authorized.', 403)
      }

      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  })(req, res, next)
}

module.exports = authenticateJWT
