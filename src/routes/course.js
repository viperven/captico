//user routes
const express = require("express");
const { createCourse } = require("../controller/course");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/createCourse", userAuth, createCourse);

module.exports = router;
