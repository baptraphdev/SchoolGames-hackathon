const studentService = require('../services/studentService');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Create a new student
 * @route POST /api/students
 */
const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all students
 * @route GET /api/students
 */
const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a student by ID
 * @route GET /api/students/:id
 */
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a student by ID
 * @route PUT /api/students/:id
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.updateStudent(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a student by ID
 * @route DELETE /api/students/:id
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};