/* eslint-disable no-undef */
const { validateListingCreate, validateListingUpdate } = require('../../../server/validations/listingValidations');
const { validationResult } = require('express-validator');

const runValidation = async (reqBody, validationMiddleware) => {
  const req = { body: reqBody };
  const res = {};
  const next = jest.fn();

  for (const validation of validationMiddleware) {
    await validation.run(req, res, next);
  }

  return validationResult(req);
};

test('request to create a listing has an empty name', async () => {
  const reqBody = { name: '', bedCount: 2, bathCount: 1, address: '123 Main St' };

  const result = await runValidation(reqBody, validateListingCreate);

  expect(result.isEmpty()).toBe(false);
  expect(result.array()[0].msg).toBe('Name must be between 5-100 characters.');
});

test('request to create a listing has a negative bedCount and bathCount of 0', async () => {
  const reqBody = { name: 'Spacious Apartment', bedCount: -1, bathCount: 0, address: '123 Main St' };

  const result = await runValidation(reqBody, validateListingCreate);

  expect(result.isEmpty()).toBe(false);
  const errors = result.array();

  expect(errors.length).toBe(2);
  expect(errors[0].msg).toBe('Bed count must be a positive integer.');
  expect(errors[1].msg).toBe('Bath count must be a positive integer.');
});

test('request to create a listing has an invalid address length', async () => {
  const reqBody = { name: 'Spacious Apartment', bedCount: 2, bathCount: 1, address: '123' }; // Address too short

  const result = await runValidation(reqBody, validateListingCreate);

  expect(result.isEmpty()).toBe(false);
  expect(result.array()[0].msg).toBe('Address must be between 5-200 characters.');
});

test('request to create a listing meets all the constraints', async () => {
  const reqBody = { name: 'Spacious Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' };

  const result = await runValidation(reqBody, validateListingCreate);

  expect(result.isEmpty()).toBe(true);
});

test('request to update a listing has a name with less than 5 characters', async () => {
  const reqBody = { name: 'Apt', bedCount: 2, bathCount: 1, address: '123 Main St' }; // Name too short

  const result = await runValidation(reqBody, validateListingUpdate);

  expect(result.isEmpty()).toBe(false);
  expect(result.array()[0].msg).toBe('Name must be between 5-100 characters.');
});

test('request to update a listing has a negative bedCount', async () => {
  const reqBody = { name: 'Updated Apartment', bedCount: -1, bathCount: 1, address: '123 Main St' }; // Invalid bedCount

  const result = await runValidation(reqBody, validateListingUpdate);

  expect(result.isEmpty()).toBe(false);
  expect(result.array()[0].msg).toBe('Bed count must be a positive integer.');
});

test('request to update a listing meets all the constraints', async () => {
  const reqBody = { name: 'Updated Apartment', bedCount: 2, bathCount: 1, address: '123 Main St' };

  const result = await runValidation(reqBody, validateListingUpdate);

  expect(result.isEmpty()).toBe(true);
});
