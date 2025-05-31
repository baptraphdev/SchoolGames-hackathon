const express = require('express');
const { validate } = require('../middleware/validate');
const { 
  createStudentSchema, 
  updateStudentSchema, 
  studentIdSchema 
} = require('../models/Student');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

const router = express.Router();

// Create a student
// POST /api/students
router.post(
  '/',
  validate({ body: createStudentSchema }),
  createStudent
);

// Get all students
// GET /api/students
router.get('/', getAllStudents);

// Get a student by ID
// GET /api/students/:id
router.get(
  '/:id',
  validate({ params: studentIdSchema }),
  getStudentById
);

// Update a student
// PUT /api/students/:id
router.put(
  '/:id',
  validate({ 
    params: studentIdSchema,
    body: updateStudentSchema
  }),
  updateStudent
);

// Delete a student
// DELETE /api/students/:id
router.delete(
  '/:id',
  validate({ params: studentIdSchema }),
  deleteStudent
);

module.exports = router;