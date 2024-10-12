const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function genKeyPair () {
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

  const keysDir = path.join(__dirname, 'keys')

  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir)
  }

  const publicKeyPath = path.join(keysDir, 'public.key')
  const privateKeyPath = path.join(keysDir, 'private.key')

  fs.writeFileSync(publicKeyPath, keyPair.publicKey)
  fs.writeFileSync(privateKeyPath, keyPair.privateKey)
}

genKeyPair()

module.exports = genKeyPair
