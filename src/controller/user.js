const User = require("../models/user");
const { validateRegister } = require("../validation/validate");

//register uer or buyer
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

module.exports = { register };
