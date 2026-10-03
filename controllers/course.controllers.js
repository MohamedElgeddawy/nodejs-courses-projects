const { validationResult} = require("express-validator")
const Course = require('../models/course.models');
const httpStatusText = require('../utils/httpStatusTest');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');


const getAllCourses = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
 
    const courses = await Course.find({}, {"__v": false }).limit(limit).skip(skip);
    res.json({status : httpStatusText.Success , data : {courses}});
})

const getcourse = asyncWrapper(async (req, res, next) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (course) {
      res.json({status : httpStatusText.Success , data : {course}});
    } else {
        return next(AppError.create("course not found" , 404 ,httpStatusText.Fail));
    }
})


const addCourse = asyncWrapper(async (req, res, next) => {
  const newCourse = new Course(req.body)

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json(errors.array());
  }

  await newCourse.save();
 
  return next(AppError.create("course added successfully" , 201 ,httpStatusText.Success));

})

const updateCourse = asyncWrapper(async (req, res , next) => {
  const courseId = req.params.courseId || req.params.id;
  const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedCourse) {
      return next(AppError.create("course not found" , 404 ,httpStatusText.Fail));
    }
    return next(AppError.create("course updated successfully" , 200 ,httpStatusText.Success));
});

const delteCourse = asyncWrapper(async (req, res , next) => {
  const courseId = req.params.courseId || req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return next(AppError.create("course not found" , 404 ,httpStatusText.Fail));
    }
    return next(AppError.create("course deleted successfully" , 200 ,httpStatusText.Success));
});

module.exports = {
    getAllCourses,  
    getcourse,
    addCourse,
    updateCourse,
    delteCourse
}


