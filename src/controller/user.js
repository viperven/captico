const User = require("../models/user");
const { validateRegister, validateLogin } = require("../validation/validate");

//register user or buyer
const register = async (req, res) => {
  try {
    validateRegister(req);
    const { name, photoUrl, email, password, role } = req.body;

    const isUserAlreadyExists = await User.findOne({ email: email });

    if (isUserAlreadyExists) {
      const customError = new Error("user already exists !");
      customError.statusCode = 400;
      throw customError;
    }

    const user = new User({
      name: name,
      photoUrl: photoUrl,
      email: email,
      password: password,
      role: role,
    });

    const newUser = await user.save();
    const returnUserInfo = {
      id: newUser._id,
      name: newUser.name,
      email: email.email,
    };

    const token = await newUser.generateAuthToken();

    return res.status(200).json({
      isSuccess: true,
      message: "user created successfully",
      apiData: returnUserInfo,
      token: token,
    });
  } catch (err) {
    console.log(err?.message);

    if (err.statusCode === 400) {
      return res.status(err.statusCode).json({
        isSuccess: false,
        message: err.message,
      });
    }

    res.status(500).json({
      isSuccess: false,
      message: "Server error. Please try again later.",
    });
  }
};

//login
const login = async (req, res) => {
  try {
    validateLogin(req);
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      const customError = new Error("user nost exists !");
      customError.statusCode = 400;
      throw customError;
    }

    const isPasswordMatched = await isUserExists.validatePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        isSuccess: false,
        message: `${password} is incorrect password `,
      });
    }

    const token = await isUserExists.generateAuthToken();

    const safeData = {
      name: isUserExists.name,
      photoUrl: isUserExists.photoUrl,
      email: isUserExists.email,
      role: isUserExists.role,
      purchasedCourses: isUserExists.purchasedCourses,
      createdCourses: isUserExists.createdCourses,
    };

    res.status(200).json({
      isSuccess: true,
      message: "logged in sucessfulyy",
      apiData: safeData,
      token: token,
    });
  } catch (err) {
    console.log(err?.message);

    if (err.statusCode === 400) {
      return res.status(err.statusCode).json({
        isSuccess: false,
        message: err.message,
      });
    }

    res.status(500).json({
      isSuccess: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = { register, login };
