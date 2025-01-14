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

const validateLogin = (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const customError = new Error("Please provide both email and password!");
    customError.statusCode = 400;
    throw customError;
  }
};

const validateCreateCourse = (req) => {
  const { title, description, price } = req.body;

  // Validate input
  if (!title || !description || price === undefined) {
    const customError = new Error(
      "Title, description, and price are required!"
    );
    customError.statusCode = 400;
    throw customError;
  }

  if (price < 0) {
    const customError = new Error("Price must be a positive value!");
    customError.statusCode = 400;
    throw customError;
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateCourse,
};
