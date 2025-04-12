// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock modules that cause issues with Jest's CommonJS environment
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
    defaults: {
      baseURL: '',
      headers: {
        common: {},
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
});

// Mock the handleError utility - return the error with a formatted message
jest.mock('./utils/errorHandler', () => ({
  handleError: jest.fn((error) => ({ 
    message: error.message || 'An error occurred',
    status: error.status || 500
  })),
}));
