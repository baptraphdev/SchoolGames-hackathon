const teacherService = require('../services/teacherService');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Create a new teacher
 * @route POST /api/teachers
 */
const createTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all teachers
 * @route GET /api/teachers
 */
const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a teacher by ID
 * @route GET /api/teachers/:id
 */
const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await teacherService.getTeacherById(id);
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a teacher by ID
 * @route PUT /api/teachers/:id
 */
const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await teacherService.updateTeacher(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a teacher by ID
 * @route DELETE /api/teachers/:id
 */
const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    await teacherService.deleteTeacher(id);
    
    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};