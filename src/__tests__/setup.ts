// src/__tests__/setup.ts
// This file is used to set up any global test configuration

// Console spy to suppress console logs during tests
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});
