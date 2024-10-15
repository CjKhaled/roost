const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function genKeyPair () {
  const keysDir = path.join(__dirname, 'keys')

  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir)
  }
  const publicKeyPath = path.join(keysDir, 'public.key')
  const privateKeyPath = path.join(keysDir, 'private.key')

  if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
    return
  }
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  })

  fs.writeFileSync(publicKeyPath, keyPair.publicKey)
  fs.writeFileSync(privateKeyPath, keyPair.privateKey)
}

genKeyPair()

module.exports = genKeyPair
