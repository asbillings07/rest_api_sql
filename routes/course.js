const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;

// middleware error handler

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await (req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// Course Routes

//GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
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

//GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', async (req, res, next) => {
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
});

//POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', (req, res, next) => {});
//PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', (req, res, next) => {});
//DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', (req, res, next) => {});
module.exports = router;
