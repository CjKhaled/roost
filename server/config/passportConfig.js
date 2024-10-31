const fs = require('fs')
const path = require('path')
const userService = require('../services/userService')
const JwtStrategy = require('passport-jwt').Strategy
const keysDir = path.join(__dirname, 'keys')
const publicKeyPath = path.join(keysDir, 'public.key')
const publicKey = fs.readFileSync(publicKeyPath, 'utf-8')

function cookieExtractor (req) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.token
  }

  return token
}

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: publicKey,
  algorithms: ['RS256']
}

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await userService.getUser(payload.sub)
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (error) {
    return done(error, null)
  }
})

module.exports = (passport) => {
  passport.use(strategy)
}
