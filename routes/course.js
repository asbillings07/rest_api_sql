const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const { authenticateUser } = require('./authenticateUser');
const { check, validationResult } = require('express-validator');

// middleware error handler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      console.log(err);
    }
  };
}
// validate course information
const courseValidationChain = [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a Course Title'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a Course Description'),
];

// Course Routes

//GET /courses 200 - Returns a list of courses (including the user that owns each course)
router.get(
  '/courses',
  asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    res.status(200).json(courses);
  })
);

//GET /courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get(
  '/courses/:id',
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findAll({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    res.status(200).json(course);
  })
);

//POST /courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post(
  '/courses',
  authenticateUser,
  courseValidationChain,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = req.currentUser;
    const course = req.body;

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const courses = await Course.create({
        userId: user.id,
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        materialsNeeded: course.materialsNeeded,
      });
      res
        .location(`/courses/:${courses.id}`)
        .status(201)
        .end();
    }
  })
);
//PUT /courses/:id 204 - Updates a course and returns no content
router.put(
  '/courses/:id',
  authenticateUser,
  courseValidationChain,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = req.currentUser;
    const course = req.body;
    const id = req.params.id;

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const courses = await Course.findByPk(id);
      courses.update({
        userId: user.id,
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        materialsNeeded: course.materialsNeeded,
      });
      res.status(204).end();
    }
  })
);
//DELETE - courses/:id 204 - deletes a course. Careful, this can not be undone. Deletes a course and returns no content
router.delete(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    course.destroy();
    res.status(204).end();
  })
);
module.exports = router;
