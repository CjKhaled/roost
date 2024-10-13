const { addListing, getListing, updateListing, deleteListing, getAllListings } = require('../services/listingService')
const { validationResult } = require('express-validator')
const AppError = require('../config/AppError')

async function getSingleListing (req, res, next) {
  try {
    const { listingID } = req.params
    const listing = await getListing(listingID)
    res.status(200).json({ listing })
  } catch (error) {
    next(error)
  }
}

async function getAllListingsController (req, res, next) {
  try {
    const listings = await getAllListings()
    res.status(200).json({ listings })
  } catch (error) {
    next(error)
  }
}

async function createANewListing (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0], 400)
    }

    const { name, bedCount, bathCount, address } = req.body
    const listing = await addListing(name, bedCount, bathCount, address)
    res.status(201).json({ listing })
  } catch (error) {
    next(error)
  }
}

async function updateAnExistingListing (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0], 400)
    }

    const { listingID } = req.params
    const { name, bedCount, bathCount, address } = req.body
    const listing = await updateListing(listingID, name, bedCount, bathCount, address)
    res.status(200).json({ listing })
  } catch (error) {
    next(error)
  }
}

async function deleteAnExistingListing (req, res, next) {
  try {
    const { listingID } = req.params
    await deleteListing(listingID)
    res.status(200).json({ message: 'Listing deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSingleListing,
  getAllListingsController,
  createANewListing,
  updateAnExistingListing,
  deleteAnExistingListing
}
