const jsonwebtoken = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const AppError = require('./AppError')
const keysDir = path.join(__dirname, 'keys')
const publicKeyPath = path.join(keysDir, 'public.key')
const privateKeyPath = path.join(keysDir, 'private.key')
const publicKey = fs.readFileSync(publicKeyPath, 'utf-8')
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8')

function issueJWT (user) {
  const id = user.id
  const expiresIn = '8h'
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn,
    algorithm: 'RS256'
  })

  return {
    token: signedToken,
    expiresIn
  }
}

function verifyJWT (token) {
  try {
    const decodedToken = jsonwebtoken.verify(token, publicKey, {
      issuer: 'roost'
    })

    return decodedToken
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired.', 401)
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token.', 401)
    } else {
      throw new AppError('Token verification failed.', 401)
    }
  }
}

module.exports = {
  issueJWT,
  verifyJWT
}
