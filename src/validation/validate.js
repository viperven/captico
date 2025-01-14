const validator = require("validator");

const validateRegister = (req) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    const customError = new Error("Please provide both email and password!");
    customError.statusCode = 400;
    throw customError;
  }

  if (!validator.isEmail(email)) {
    const customError = new Error("Invalid email address !");
    customError.statusCode = 400;
    throw customError;
  }

  if (password.length < 6) {
    const customError = new Error("password length should be minimum 6 !");
    customError.statusCode = 400;
    throw customError;
  }

  if (!name || !role) {
    const customError = new Error("name and role is mandatory !");
    customError.statusCode = 400;
    throw customError;
  }
};

module.exports = {
  validateRegister,
};
