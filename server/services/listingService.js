const prisma = require('../models/prisma/prismaClient')
const AppError = require('../config/AppError')

async function addListing (name, bedCount, bathCount, address) {
  try {
    const listing = await prisma.listing.create({
      data: {
        name,
        bedCount,
        bathCount,
        address
      }
    })
    return listing
  } catch (error) {
    throw new AppError('A listing with that name already exists.', 409) // Handle unique constraint error (P2002)
  }
}

async function getListing (id) {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id
      }
    })

    if (!listing) {
      throw new AppError('Listing not found', 404)
    }
    return listing
  } catch (error) {
    throw new AppError('Listing not found', 404)
  }
}

async function updateListing (id, name, bedCount, bathCount, address) {
  try {
    const listing = await prisma.listing.update({
      where: {
        id
      },
      data: {
        name,
        bedCount,
        bathCount,
        address
      }
    })

    return listing
  } catch (error) {
    throw new AppError('Listing not found', 404)
  }
}

async function deleteListing (id) {
  try {
    const listing = await prisma.listing.delete({
      where: {
        id
      }
    })

    return listing
  } catch (error) {
    throw new AppError('Listing not found', 404)
  }
}

async function getListings () {
  try {
    const listings = await prisma.listing.findMany()
    return listings
  } catch (error) {
    throw new AppError('Unexpected Error', 500)
  }
}

module.exports = {
  addListing,
  getListing,
  updateListing,
  deleteListing,
  getListings
}
