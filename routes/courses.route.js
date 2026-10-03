

const express = require('express');
const router = express.Router();
const coursesController = require("../controllers/course.controllers")
const {body} = require('express-validator');
const validationScheme = require("../middlewares/validationScheme");
const verifyToken = require('../middlewares/verifyToken');
const userRole = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');


// get all courses
router.route('/')
  .get(coursesController.getAllCourses)
  .post(validationScheme(), verifyToken, coursesController.addCourse); 

// get single course
router.route('/:id')
.get(coursesController.getcourse)
.patch(coursesController.updateCourse)
 .delete(verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), coursesController.delteCourse);  

module.exports = router;