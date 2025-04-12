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

// Error handler function
export const handleError = (error) => {
  console.error('Error details:', error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
    };
  }

  // Handle network errors
  if (!error.response) {
    return {
      message: ErrorMessages[ErrorTypes.NETWORK],
      type: ErrorTypes.NETWORK,
      statusCode: 0,
    };
  }

  // Handle different HTTP status codes
  switch (error.response.status) {
    case 401:
      return {
        message: ErrorMessages[ErrorTypes.AUTH],
        type: ErrorTypes.AUTH,
        statusCode: 401,
      };
    case 404:
      return {
        message: ErrorMessages[ErrorTypes.NOT_FOUND],
        type: ErrorTypes.NOT_FOUND,
        statusCode: 404,
      };
    case 422:
      return {
        message: ErrorMessages[ErrorTypes.VALIDATION],
        type: ErrorTypes.VALIDATION,
        statusCode: 422,
      };
    case 500:
      return {
        message: ErrorMessages[ErrorTypes.SERVER],
        type: ErrorTypes.SERVER,
        statusCode: 500,
      };
    default:
      return {
        message: ErrorMessages[ErrorTypes.UNKNOWN],
        type: ErrorTypes.UNKNOWN,
        statusCode: error.response?.status || 0,
      };
  }
}; 