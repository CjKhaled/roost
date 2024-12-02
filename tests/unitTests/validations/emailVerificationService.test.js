/* eslint-disable no-undef */
const { updateUserVerification } = require('../../../server/services/emailVerificationService')
const prisma = require('../../../server/models/prisma/prismaClient')
// const AppError = require('../../../server/config/AppError')

// Mock prisma
jest.mock('../../../server/models/prisma/prismaClient', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn()
  }
}))

describe('emailVerificationService - updateUserVerification', () => {
  it('should update the user verification details successfully', async () => {
    const email = 'user@school.edu'
    const verificationToken = 'randomtoken'
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    prisma.user.update.mockResolvedValue({ email })

    const user = await updateUserVerification(email, verificationToken, tokenExpiry)

    expect(user).toEqual({ email })
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email },
      data: { verificationToken, tokenExpiry }
    })
  })
})
