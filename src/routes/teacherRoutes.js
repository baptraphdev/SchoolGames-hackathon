const express = require('express');
const { validate } = require('../middleware/validate');
const { 
  createTeacherSchema, 
  updateTeacherSchema, 
  teacherIdSchema 
} = require('../models/Teacher');
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');

const router = express.Router();

// Create a teacher
// POST /api/teachers
router.post(
  '/',
  validate({ body: createTeacherSchema }),
  createTeacher
);

// Get all teachers
// GET /api/teachers
router.get('/', getAllTeachers);

// Get a teacher by ID
// GET /api/teachers/:id
router.get(
  '/:id',
  validate({ params: teacherIdSchema }),
  getTeacherById
);

// Update a teacher
// PUT /api/teachers/:id
router.put(
  '/:id',
  validate({ 
    params: teacherIdSchema,
    body: updateTeacherSchema
  }),
  updateTeacher
);

// Delete a teacher
// DELETE /api/teachers/:id
router.delete(
  '/:id',
  validate({ params: teacherIdSchema }),
  deleteTeacher
);

module.exports = router;