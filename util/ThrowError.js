module.exports = (errorMessage, statusCode) => {
    const error = new Error(errorMessage || 'something went wrong, please try again!');
    error.statusCode = statusCode || 500;
    throw error;
}