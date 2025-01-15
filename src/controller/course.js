
const User = require("../models/user");
const Purchase = require("../models/purchase");
const Course = require("../models/course");
const { validateCreateCourse } = require("../validation/validate");

//create new course
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

//get course by id
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      const customError = new Error("course id is mandatory!");
      customError.statusCode = 400;
      throw customError;
    }

    // Get a single course by ID
    const course = await Course.findById(courseId).populate('createdBy', 'name email');
    if (!course) {
      const customError = new Error("Course not found!");
      customError.statusCode = 400;
      throw customError;
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Course retrieved successfully!",
      apiData: course,
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

//get all courses
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    };


    const courses = await Course.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email");


    const totalCourses = await Course.countDocuments(query);

    res.status(200).json({
      isSuccess: true,
      message: "Courses retrieved successfully!",
      apiData: courses,
      pagination: {
        totalCourses,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCourses / limit),
      },
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

//update course by id
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    if (!courseId) {
      const customError = new Error("course id is mandatory!");
      customError.statusCode = 400;
      throw customError;
    }


    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      const customError = new Error("cour se not found!");
      customError.statusCode = 400;
      throw customError;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Course updated successfully!",
      apiData: updatedCourse,
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

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      const customError = new Error("Course not found!");
      customError.statusCode = 400;
      throw customError;
    };

    res.status(200).json({
      isSuccess: true,
      message: "Course deleted successfully!",
      apiData: deletedCourse,
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

const purchaseCourse = async (req, res) => {
  try {
    const { courseId, priceAtPurchase } = req.body;
    const { id } = req.user;
    console.log(req.user);

    if (!courseId || !priceAtPurchase) {
      const customError = new Error("courseId and priceAtPurchase is mandatory !");
      customError.statusCode = 400;
      throw customError;
    }


    // Find the user and course
    const user = await User.findById(id);
    if (!user) {
      const customError = new Error("user not found !");
      customError.statusCode = 400;
      throw customError;
    };

    const course = await Course.findById(courseId);
    if (!course) {
      const customError = new Error("Course not found !");
      customError.statusCode = 400;
      throw customError;
    };

    // Prevent users from buying their own courses
    if (String(course.createdBy) === String(user._id)) {
      return res.status(400).json({
        isSuccess: false,
        message: "You cannot purchase your own course.",
      });
    }

    // Record the purchase
    const purchase = new Purchase({
      course:courseId,
      buyer: user._id,
      priceAtPurchase
    });
    await purchase.save();

    // Update user's purchasedCourses
    user.purchasedCourses.push(courseId);
    await user.save();

    res.status(200).json({
      isSuccess: true,
      message: "Course purchased successfully!",
      apiData: {
        purchaseId: purchase._id,
        courseId: courseId,
        userId: user._id,
      },
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
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
  purchaseCourse
};
