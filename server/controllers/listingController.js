const { addListing, getListing, updateListing, deleteListing, getListings } = require('../services/listingService')
const { validationResult } = require('express-validator')
const AppError = require('../config/AppError')

async function getSingleListing (req, res, next) {
  try {
    const { listingID } = req.params
    const listing = await getListing(listingID)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }
    res.status(200).json({ listing })
  } catch (error) {
    next(error)
  }
}

async function getAllListingsController (req, res, next) {
  try {
    const listings = await getListings()
    res.status(200).json({ listings })
  } catch (error) {
    next(error)
  }
}

async function createANewListing (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400)
    }
    const {
      name,
      bedCount,
      bathCount,
      address,
      location,
      price,
      available,
      imageUrl,
      amenities,
      utilities,
      policies
    } = req.body;

    const listing = await addListing(
      name,
      bedCount,
      bathCount,
      address,
      req.user.id,
      location,
      price,
      available,
      imageUrl || [],
      amenities || [],
      utilities || [],
      policies || {}
    );

    res.status(200).json({ listing })
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
    
    const { listingID } = req.params;
    const {
      name,
      bedCount,
      bathCount,
      address,
      location,
      price,
      available,
      imageUrl,
      amenities,
      utilities,
      policies
    } = req.body;

    const listing = await updateListing(listingID, {
      name,
      bedCount,
      bathCount,
      address,
      location,
      price,
      available,
      imageUrl: imageUrl || [],
      amenities: amenities || [],
      utilities: utilities || [],
      policies: policies || {}
    });

    res.status(200).json({ listing })
  } catch (error) {
    next(error)
  }
}

async function deleteAnExistingListing (req, res, next) {
  try {
    const { listingID } = req.params
    const listing = await deleteListing(listingID)
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }
    res.status(200).json({ listing })
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
