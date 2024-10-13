const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Add a new listing
const addListing = async (name, bedCount, bathCount, address) => {
  return await prisma.listing.create({
    data: {
      name,
      bedCount,
      bathCount,
      address
    }
  })
}

// Get a specific listing by ID
const getListing = async (id) => {
  return await prisma.listing.findUnique({
    where: { id: Number(id) }
  })
}

// Get all listings
const getListings = async () => {
  return await prisma.listing.findMany()
}

// Update a listing by ID
const updateListing = async (id, name, bedCount, bathCount, address) => {
  return await prisma.listing.update({
    where: { id: Number(id) },
    data: { name, bedCount, bathCount, address }
  })
}

// Delete a listing by ID
const deleteListing = async (id) => {
  return await prisma.listing.delete({
    where: { id: Number(id) }
  })
}

module.exports = {
  addListing,
  getListing,
  getListings,
  updateListing,
  deleteListing
}
