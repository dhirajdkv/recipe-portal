// Custom error class for application-specific errors
export class AppError extends Error {
  constructor(message, type, statusCode) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

// Error types
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error messages
export const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
  [ErrorTypes.AUTH]: 'You are not authorized to perform this action.',
  [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
  [ErrorTypes.SERVER]: 'Something went wrong on our end. Please try again later.',
  [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred.',
};

/**
 * Handles and normalizes errors for consistent display in the UI
 * @param {Error} error - The error object to handle
 * @returns {Object} A normalized error object with message property
 */
export const handleError = (error) => {
  // Extract message from API errors if available
  if (error?.response?.data?.message) {
    return {
      message: error.response.data.message,
      status: error.response.status
    };
  }

  // Extract message from standard error
  if (error?.message) {
    return {
      message: error.message,
      status: error?.status || 500
    };
  }

  // Default error
  return {
    message: 'An unexpected error occurred. Please try again.',
    status: 500
  };
}; 