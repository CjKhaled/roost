const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createListing = async (data) => {
  return await prisma.listing.create({
    data
  })
}

const updateListing = async (id, data) => {
  return await prisma.listing.update({
    where: { id: Number(id) },
    data
  })
}

const deleteListing = async (id) => {
  return await prisma.listing.delete({
    where: { id: Number(id) }
  })
}

const getListingById = async (id) => {
  return await prisma.listing.findUnique({
    where: { id: Number(id) }
  })
}

module.exports = {
  createListing,
  updateListing,
  deleteListing,
  getListingById
}
