exports.createErrorLogger = (logger) => error => {
  logger.error(error, 'Unhandled promise rejection');
  return error;
};
