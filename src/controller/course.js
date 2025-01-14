const Course = require("../models/course");
const { validateCreateCourse } = require("../validation/validate");

const createCourse = async (req, res) => {
  try {
    validateCreateCourse(req);
    const { title, description, price } = req.body;
    console.log(req.user);
    const userId = req.user._id;

    // Create the course
    const newCourse = new Course({
      title,
      description,
      price,
      createdBy: userId,
    });

    const savedCourse = await newCourse.save();

    res.status(200).json({
      isSuccess: true,
      message: "Course created successfully!",
      apiData: savedCourse,
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

module.exports = {
  createCourse,
};
