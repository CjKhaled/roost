/* eslint-disable no-undef */
const { addListing, getListing, updateListing, deleteListing, getListings } = require('../../../server/services/listingService')
const prisma = require('../../../server/models/prisma/prismaClient')
jest.mock('../../../server/models/prisma/prismaClient', () => ({
  listing: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn()
  }
}))

class PrismaClientKnownRequestError extends Error {
  constructor (message, code, clientVersion) {
    super(message)
    this.name = 'PrismaClientKnownRequestError'
    this.code = code
    this.clientVersion = clientVersion
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('adding a new listing works', async () => {
  const mockListing = { id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' }
  prisma.listing.create.mockResolvedValue(mockListing)

  const newListing = await addListing('Luxury Apartment', 2, 1, '123 Main St')
  expect(prisma.listing.create).toHaveBeenCalledWith({
    data: {
      name: 'Luxury Apartment',
      bedCount: 2,
      bathCount: 1,
      address: '123 Main St'
    }
  })
  expect(newListing).toEqual(mockListing)
})

test('adding a listing with a duplicate name gives a 409 error', async () => {
  const prismaError = new PrismaClientKnownRequestError('Unique constraint failed on the fields: (`name`)', 'P2002', '1.0.0')
  prisma.listing.create.mockRejectedValue(prismaError)

  await expect(addListing('Luxury Apartment', 2, 1, '123 Main St')).rejects.toThrow('A listing with that name already exists.')
})

test('getting a listing that exists works', async () => {
  const mockListing = { id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' }
  prisma.listing.findUnique.mockResolvedValue(mockListing)

  const fetchedListing = await getListing(1)
  expect(prisma.listing.findUnique).toHaveBeenCalledWith({
    where: {
      id: 1
    }
  })
  expect(fetchedListing).toEqual(mockListing)
})

test("getting a listing that doesn't exist gives 404 error", async () => {
  prisma.listing.findUnique.mockResolvedValue(null)

  await expect(getListing(999)).rejects.toThrow('Listing not found')
})

test('updating a listing that exists works', async () => {
  const mockUpdatedListing = { id: 1, name: 'Updated Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' }
  prisma.listing.update.mockResolvedValue(mockUpdatedListing)

  const updatedListing = await updateListing(1, 'Updated Apartment', 2, 1, '123 Main St')
  expect(prisma.listing.update).toHaveBeenCalledWith({
    where: {
      id: 1
    },
    data: {
      name: 'Updated Apartment',
      bedCount: 2,
      bathCount: 1,
      address: '123 Main St'
    }
  })
  expect(updatedListing).toEqual(mockUpdatedListing)
})

test("updating a listing that doesn't exist gives 404 error", async () => {
  const prismaError = new PrismaClientKnownRequestError('Listing not found', 'P2025', '1.0.0')
  prisma.listing.update.mockRejectedValue(prismaError)

  await expect(updateListing(999, 'Nonexistent Apartment', 2, 1, '123 Main St')).rejects.toThrow('Listing not found')
})

test('deleting a listing that exists works', async () => {
  const mockDeletedListing = { id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' }
  prisma.listing.delete.mockResolvedValue(mockDeletedListing)

  const deletedListing = await deleteListing(1)
  expect(prisma.listing.delete).toHaveBeenCalledWith({
    where: {
      id: 1
    }
  })
  expect(deletedListing).toEqual(mockDeletedListing)
})

test("deleting a listing that doesn't exist gives 404 error", async () => {
  const prismaError = new PrismaClientKnownRequestError('Listing not found', 'P2025', '1.0.0')
  prisma.listing.delete.mockRejectedValue(prismaError)

  await expect(deleteListing(999)).rejects.toThrow('Listing not found')
})

test('getting all listings works', async () => {
  const mockListings = [
    { id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' },
    { id: 2, name: 'Cozy Cottage', bedCount: 3, bathCount: 2, address: '456 Elm St' }
  ]
  prisma.listing.findMany.mockResolvedValue(mockListings)

  const listings = await getListings()
  expect(prisma.listing.findMany).toHaveBeenCalled()
  expect(listings).toEqual(mockListings)
  expect(listings.length).toBeGreaterThan(0)
})