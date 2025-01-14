const mongoose = require("mongoose");
const validator = require("validator");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: [
        20,
        "first name length can not be greater than 20 characters",
      ],
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: (url) => validator.isURL(url),
        message: "Invalid URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid Email Address"],
      maxlength: [50, "last name length can not be greater than 50 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: {
        values: ["buyer", "seller"],
        message: (props) =>
          `mention ${props.value} value is not allowed choose buyer or seller`,
      },
      default: "buyer",
    },
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  return await jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.emailId,
    },
    process.env.jwtSecret,
    { expiresIn: "1d" }
  );
};

module.exports = mongoose.model("User", userSchema);
