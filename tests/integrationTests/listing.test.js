/* eslint-disable no-undef */
const express = require('express')
const app = express()
const request = require('supertest')
const passport = require('passport')
const prisma = require('../../server/models/prisma/prismaClient')
const errorHandler = require('../../server/middleware/errorHandler')
const listingRouter = require('../../server/routes/listingRoutes')

app.use(express.json())
app.use('/api/listings', listingRouter)
app.use(errorHandler)

jest.mock('../../server/models/prisma/prismaClient', () => ({
  listing: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn()
  }
}))

jest
  .spyOn(passport, 'authenticate')
  .mockImplementation((strategy, options, callback) => {
    return (req, res, next) => {
      req.user = {
        id: 'test-user-id',
        email: 'test@example.com'
      }
      next()
    }
  })

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

test('requesting GET /:listingID with a valid listingID results in 200 OK', async () => {
  const mockListing = { Id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' }
  prisma.listing.findUnique.mockResolvedValue(mockListing)

  const res = await request(app).get('/api/listings/1')

  expect(res.statusCode).toBe(200)
  expect(res.body.listing).toEqual(mockListing)
})

test('requesting GET /:listingID with an invalid listingID results in 404 error', async () => {
  prisma.listing.findUnique.mockResolvedValue(null)

  const res = await request(app).get('/api/listings/999')

  expect(res.statusCode).toBe(404)
  expect(res.body).toEqual({ errorMessage: 'Listing not found' })
})

test('requesting GET / results in 200 OK', async () => {
  const mockListings = [
    { Id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' },
    { Id: 2, name: 'Cozy House', bedCount: 3, bathCount: 2, address: '456 Elm St' }
  ]
  prisma.listing.findMany.mockResolvedValue(mockListings)

  const res = await request(app).get('/api/listings')

  expect(res.statusCode).toBe(200)
  expect(res.body.listings).toEqual(mockListings)
})

test('requesting POST /create with valid data results in 200 Created', async () => {
  const mockListing = {
    id: 1,
    name: 'Luxury Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '123 Main St',
    createdById: 'test-user-id',
    locationLat: 34.05,
    locationLng: -118.25,
    price: 1500,
    availableFrom: '2023-01-01',
    availableTo: '2023-12-31',
    imageUrl: ['https://example.com/image.jpg'],
    amenities: ['WiFi', 'Parking'],
    utilities: ['Electricity', 'Water'],
    strictParking: true,
    strictNoisePolicy: false,
    guestsAllowed: true,
    petsAllowed: false,
    smokingAllowed: false
  };
  prisma.listing.create.mockResolvedValue(mockListing);

  const res = await request(app)
    .post('/api/listings/create')
    .send({
      name: 'Luxury Apartment',
      bedCount: 2,
      bathCount: 1,
      address: '123 Main St',
      location: { lat: 34.05, lng: -118.25 },
      price: 1500,
      available: { from: '2023-01-01', to: '2023-12-31' },
      imageUrl: ['https://example.com/image.jpg'],
      amenities: ['WiFi', 'Parking'],
      utilities: ['Electricity', 'Water'],
      policies: {
        strictParking: true,
        strictNoisePolicy: false,
        guestsAllowed: true,
        petsAllowed: false,
        smokingAllowed: false
      }
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.listing).toEqual(mockListing);
  expect(prisma.listing.create).toHaveBeenCalledWith({
    data: {
      name: 'Luxury Apartment',
      bedCount: 2,
      bathCount: 1,
      address: '123 Main St',
      locationLat: 34.05,
      locationLng: -118.25,
      price: 1500,
      availableFrom: '2023-01-01',
      availableTo: '2023-12-31',
      imageUrl: ['https://example.com/image.jpg'],
      amenities: ['WiFi', 'Parking'],
      utilities: ['Electricity', 'Water'],
      strictParking: true,
      strictNoisePolicy: false,
      guestsAllowed: true,
      petsAllowed: false,
      smokingAllowed: false,
      createdBy: {
        connect: { id: 'test-user-id' }
      }
    }
  });
});

test('requesting POST /create with invalid data results in 400 Bad Request', async () => {
  const res = await request(app)
    .post('/api/listings/create')
    .send({
      name: 'Apt',
      bedCount: 1,
      bathCount: 1,
      address: '123 Main St',
      location: { lat: 34.05, lng: -118.25 },
      price: 100, 
      available: { from: '2023-13-01', to: '2023-12-32' }, 
      imageUrl: ['a-url'],
      amenities: ['WiFi'],
      utilities: ['Electricity'],
      policies: {
        strictParking: true,
        strictNoisePolicy: false,
        guestsAllowed: true,
        petsAllowed: false,
        smokingAllowed: false
      }
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.errorMessage).toContain('Name must be between 5-100 characters');
});

test('requesting PUT /update/:listingID with a valid listingID results in 200 OK', async () => {
  const mockUpdatedListing = {
    id: 1,
    name: 'Updated Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '123 Main St',
    locationLat: 34.05,
    locationLng: -118.25,
    price: 1600,
    availableFrom: '2023-02-01',
    availableTo: '2023-12-15',
    imageUrl: ['https://example.com/image2.jpg'],
    amenities: ['WiFi', 'Gym'],
    utilities: ['Electricity'],
    strictParking: false,
    strictNoisePolicy: true,
    guestsAllowed: true,
    petsAllowed: true,
    smokingAllowed: false
  };
  prisma.listing.update.mockResolvedValue(mockUpdatedListing);

  const res = await request(app)
    .put('/api/listings/update/1')
    .send({
      name: 'Updated Apartment',
      bedCount: 2,
      bathCount: 1,
      address: '123 Main St',
      location: { lat: 34.05, lng: -118.25 },
      price: 1600,
      available: { from: '2023-02-01', to: '2023-12-15' },
      imageUrl: ['https://example.com/image2.jpg'],
      amenities: ['WiFi', 'Gym'],
      utilities: ['Electricity'],
      policies: {
        strictParking: false,
        strictNoisePolicy: true,
        guestsAllowed: true,
        petsAllowed: true,
        smokingAllowed: false
      }
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.listing).toEqual(mockUpdatedListing);
});

test('requesting PUT /update/:listingID with an invalid listingID results in 404 error', async () => {
  const prismaError = new PrismaClientKnownRequestError('Listing not found', 'P2025', '1.0.0');
  prisma.listing.update.mockRejectedValue(prismaError);

  const res = await request(app)
    .put('/api/listings/update/999')
    .send({
      name: 'Updated Apartment',
      bedCount: 2,
      bathCount: 1,
      address: '123 Main St',
      location: { lat: 34.05, lng: -118.25 },
      price: 1600,
      available: { from: '2023-02-01', to: '2023-12-15' },
      imageUrl: ['https://example.com/image2.jpg'],
      amenities: ['WiFi', 'Gym'],
      utilities: ['Electricity'],
      policies: {
        strictParking: false,
        strictNoisePolicy: true,
        guestsAllowed: true,
        petsAllowed: true,
        smokingAllowed: false
      }
    });

  expect(res.statusCode).toBe(404);
  expect(res.body.errorMessage).toBe('Listing not found');
})

test('requesting DELETE /:listingID with a valid listingID results in 200 OK', async () => {
  const mockDeletedListing = { Id: 1, name: 'Luxury Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' }
  prisma.listing.delete.mockResolvedValue(mockDeletedListing)

  const res = await request(app).delete('/api/listings/1')

  expect(res.statusCode).toBe(200)
  expect(res.body.listing).toEqual(mockDeletedListing)
})

test('requesting DELETE /:listingID with an invalid listingID results in 404 error', async () => {
  const prismaError = new PrismaClientKnownRequestError('Listing not found', 'P2025', '1.0.0') 
  prisma.listing.delete.mockRejectedValue(prismaError)

  const res = await request(app).delete('/api/listings/999')

  expect(res.statusCode).toBe(404)
  expect(res.body.errorMessage).toBe('Listing not found')
})
