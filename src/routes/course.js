//user routes
const express = require("express");

const { createCourse, getCourseById, getAllCourses, updateCourse, deleteCourse, purchaseCourse } = require("../controller/course");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/getCourseByid/:courseId", getCourseById);
router.get("/getAllCourse", getAllCourses);
router.post("/createCourse", userAuth, createCourse);
router.post("/updateCourse/:courseId", userAuth, updateCourse);
router.post("/deleteCourse/:courseId", userAuth, deleteCourse);
router.post("/purchaseCourse", userAuth, purchaseCourse);

module.exports = router;
