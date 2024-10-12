/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')
const genKeyPair = require('../../../server/config/genKeyPair')

jest.mock('fs')
jest.mock('path')

const keysDir = path.resolve(__dirname, '../../../server/config/keys')
const publicKeyPath = path.resolve(keysDir, 'public.key')
const privateKeyPath = path.resolve(keysDir, 'private.key')

beforeEach(() => {
  jest.clearAllMocks()

  path.join.mockImplementation((...args) => path.resolve(...args))
  fs.existsSync.mockReturnValue(false)
  fs.writeFileSync.mockImplementation(() => {})
  fs.mkdirSync.mockImplementation(() => {})
})

test('creates the directory if it does not exist', () => {
  fs.existsSync.mockReturnValue(false)

  genKeyPair()

  expect(fs.existsSync).toHaveBeenCalledWith(keysDir)
  expect(fs.mkdirSync).toHaveBeenCalledWith(keysDir)
})

test('does not create the directory if it already exists', () => {
  fs.existsSync.mockReturnValue(true)

  genKeyPair()

  expect(fs.existsSync).toHaveBeenCalledWith(keysDir)
  expect(fs.mkdirSync).not.toHaveBeenCalled()
})

test('writes the keys to the correct paths', () => {
  genKeyPair()

  expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
  expect(fs.writeFileSync).toHaveBeenCalledWith(publicKeyPath, expect.any(String))
  expect(fs.writeFileSync).toHaveBeenCalledWith(privateKeyPath, expect.any(String))
})

test('does not regenerate keys if they already exist', () => {
  fs.existsSync.mockReturnValue(true)

  genKeyPair()

  expect(fs.writeFileSync).not.toHaveBeenCalled()
  expect(fs.mkdirSync).not.toHaveBeenCalled()
})
