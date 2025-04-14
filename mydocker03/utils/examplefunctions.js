const formatDate = (date) => {
  if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
  }
  return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  });
};

// Function 2: Generate a standardized API response
const createResponse = (status, message, data = null) => {
  return {
      status,
      message,
      data,
  };
};

// Export the functions
//module.exports = {formatDate,createResponse,};

export default {formatDate,createResponse};
