const prisma = require('../models/prisma/prismaClient')
const AppError = require('../config/AppError')

async function addListing (name, bedCount, bathCount, address, createdById, location, price, available, imageUrl = [], amenities = [], utilities = [], policies = {}) {
  try {
    const listing = await prisma.listing.create({
      data: {
        name,
        bedCount,
        bathCount,
        address,
        locationLat: location.lat,
        locationLng: location.lng,
        price,
        availableFrom: available.from,
        availableTo: available.to,
        imageUrl,
        amenities,
        utilities,
        strictParking: policies.strictParking,
        strictNoisePolicy: policies.strictNoisePolicy,
        guestsAllowed: policies.guestsAllowed,
        petsAllowed: policies.petsAllowed,
        smokingAllowed: policies.smokingAllowed,
        createdBy: {
          connect: { id: createdById }
        }
      }
    });
    return listing;
  } catch (error) {
    throw new AppError('A listing with that name already exists.', 409)
  }
}

async function getListing (Id) {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        Id
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

async function updateListing (id, data) {
  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        name: data.name,
        bedCount: data.bedCount,
        bathCount: data.bathCount,
        address: data.address,
        locationLat: data.location.lat,
        locationLng: data.location.lng,
        price: data.price,
        availableFrom: data.available.from,
        availableTo: data.available.to,
        imageUrl: data.imageUrl || [],
        amenities: data.amenities || [],
        utilities: data.utilities || [],
        strictParking: data.policies?.strictParking,
        strictNoisePolicy: data.policies?.strictNoisePolicy,
        guestsAllowed: data.policies?.guestsAllowed,
        petsAllowed: data.policies?.petsAllowed,
        smokingAllowed: data.policies?.smokingAllowed,
      }
    });

    return listing;
  } catch (error) {
    throw new AppError('Listing not found', 404)
  }
}

async function deleteListing (Id) {
  try {
    const listing = await prisma.listing.delete({
      where: {
        Id
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
