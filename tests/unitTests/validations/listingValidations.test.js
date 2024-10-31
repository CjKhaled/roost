/* eslint-disable no-undef */
const { validateListingCreate, validateListingUpdate } = require('../../../server/validations/listingValidations')
const { validationResult } = require('express-validator')

const runValidation = async (reqBody, validationMiddleware) => {
  const req = { body: reqBody }
  const res = {}
  const next = jest.fn()

  for (const validation of validationMiddleware) {
    await validation.run(req, res, next)
  }

  return validationResult(req)
}

test('request to create a listing has an empty name', async () => {
  const reqBody = {
    name: '',
    bedCount: 2,
    bathCount: 1,
    address: '123 Main St',
    price: 1000,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Name must be between 5-100 characters.')
})

test('request to create a listing has a negative bedCount and bathCount of 0', async () => {
  const reqBody = {
    name: 'Spacious Apartment',
    bedCount: -1,
    bathCount: 0,
    address: '123 Main St',
    price: 1000,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Bed count must be a positive integer.')
  expect(errors[1].msg).toBe('Bath count must be a positive integer.')
})

test('request to create a listing has an invalid address length', async () => {
  const reqBody = {
    name: 'Spacious Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '123',
    price: 1000,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Address must be between 5-200 characters.')
})

test('request to create a listing has a negative price', async () => {
  const reqBody = {
    name: 'Affordable Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '456 Main St',
    price: -100,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Price must be a non-negative number.')
})

test('request to create a listing has invalid location latitude and longitude', async () => {
  const reqBody = {
    name: 'Ocean View Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '789 Ocean Ave',
    price: 1200,
    location: { lat: -91, lng: 190 }, // Invalid latitude and longitude
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Location must include valid latitude and longitude.')
  expect(errors[1].msg).toBe('Location must include valid latitude and longitude.')
})

test('request to create a listing has an invalid available date format', async () => {
  const reqBody = {
    name: 'Sunny Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '123 Sunshine Blvd',
    price: 1200,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-13-01', to: '2023-12-32' }, // Invalid date format
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Please provide valid dates in the format YYYY-MM-DD.')
  expect(errors[1].msg).toBe('Please provide valid dates in the format YYYY-MM-DD.')
})

test('request to create a listing meets all the constraints', async () => {
  const reqBody = {
    name: 'Perfect Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '321 Ideal Rd',
    price: 1200,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  }

  const result = await runValidation(reqBody, validateListingCreate)

  expect(result.isEmpty()).toBe(true)
})

test('request to update a listing has an empty name', async () => {
  const reqBody = {
    name: '',
    bedCount: 2,
    bathCount: 1,
    address: '123 Main St',
    price: 1000,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Name must be between 5-100 characters.')
})

test('request to update a listing has a negative bedCount and bathCount of 0', async () => {
  const reqBody = {
    name: 'Spacious Apartment',
    bedCount: -1,
    bathCount: 0,
    address: '123 Main St',
    price: 1000,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Bed count must be a positive integer.')
  expect(errors[1].msg).toBe('Bath count must be a positive integer.')
})

test('request to update a listing has an invalid address length', async () => {
  const reqBody = {
    name: 'Spacious Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '123',
    price: 1000,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Address must be between 5-200 characters.')
})

test('request to update a listing has a negative price', async () => {
  const reqBody = {
    name: 'Affordable Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '456 Main St',
    price: -100,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(false)
  expect(result.array()[0].msg).toBe('Price must be a non-negative number.')
})

test('request to update a listing has invalid location latitude and longitude', async () => {
  const reqBody = {
    name: 'Ocean View Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '789 Ocean Ave',
    price: 1200,
    location: { lat: -91, lng: 190 }, // Invalid latitude and longitude
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Location must include valid latitude and longitude.')
  expect(errors[1].msg).toBe('Location must include valid latitude and longitude.')
})

test('request to update a listing has an invalid available date format', async () => {
  const reqBody = {
    name: 'Sunny Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '123 Sunshine Blvd',
    price: 1200,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-13-01', to: '2023-12-32' }, // Invalid date format
    imageUrl: ['https://example.com/image.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(false)
  const errors = result.array()

  expect(errors.length).toBe(2)
  expect(errors[0].msg).toBe('Please provide valid dates in the format YYYY-MM-DD.')
  expect(errors[1].msg).toBe('Please provide valid dates in the format YYYY-MM-DD.')
})

test('request to update a listing meets all the constraints', async () => {
  const reqBody = {
    name: 'Perfect Apartment',
    bedCount: 2,
    bathCount: 1,
    address: '321 Ideal Rd',
    price: 1200,
    location: { lat: 34.05, lng: -118.25 },
    available: { from: '2023-01-01', to: '2023-12-31' },
    imageUrl: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  }

  const result = await runValidation(reqBody, validateListingUpdate)

  expect(result.isEmpty()).toBe(true)
})
