const express = require('express');
const router = express.Router();
const Course = require('../models').Course;

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
router.get('/courses', (req, res, next) => {});

//GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', (req, res, next) => {});

//POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', (req, res, next) => {});
//PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', (req, res, next) => {});
//DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', (req, res, next) => {});
module.exports = router;
