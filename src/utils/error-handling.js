module.exports.handleError = (err) => {
  const errors = { firstName: '', lastName: '', password: '', email: '' };

  // Checking duplicate error
  if (err.code === 11000) {

  };

  // Checking the validation error
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  };

  return errors;
};