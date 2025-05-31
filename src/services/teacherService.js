const { getFirestore } = require('../config/firebase');
const { formatTeacher } = require('../models/Teacher');
const { ApiError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

// Reference to the Firestore collection
const teachersCollection = () => getFirestore().collection('teachers');

/**
 * Create a new teacher
 * @param {Object} teacherData - Teacher data object
 * @returns {Promise<Object>} - Created teacher object
 */
const createTeacher = async (teacherData) => {
  try {
    // Add timestamps
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const newTeacher = {
      ...teacherData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Create a new document with auto-generated ID
    const docRef = await teachersCollection().add(newTeacher);
    
    // Get the newly created document
    const teacherDoc = await docRef.get();
    
    return formatTeacher(teacherDoc);
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw new ApiError('Failed to create teacher', 500);
  }
};

/**
 * Get all teachers
 * @returns {Promise<Array>} - Array of teacher objects
 */
const getAllTeachers = async () => {
  try {
    const snapshot = await teachersCollection().get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(formatTeacher);
  } catch (error) {
    console.error('Error getting teachers:', error);
    throw new ApiError('Failed to get teachers', 500);
  }
};

/**
 * Get a teacher by ID
 * @param {string} id - Teacher ID
 * @returns {Promise<Object>} - Teacher object
 */
const getTeacherById = async (id) => {
  try {
    const teacherDoc = await teachersCollection().doc(id).get();
    
    if (!teacherDoc.exists) {
      throw new ApiError(`Teacher with ID ${id} not found`, 404);
    }
    
    return formatTeacher(teacherDoc);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error getting teacher:', error);
    throw new ApiError('Failed to get teacher', 500);
  }
};

/**
 * Update a teacher by ID
 * @param {string} id - Teacher ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated teacher object
 */
const updateTeacher = async (id, updateData) => {
  try {
    const teacherRef = teachersCollection().doc(id);
    const teacherDoc = await teacherRef.get();
    
    if (!teacherDoc.exists) {
      throw new ApiError(`Teacher with ID ${id} not found`, 404);
    }
    
    // Add timestamp
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    // Update the document
    await teacherRef.update(updateData);
    
    // Get the updated document
    const updatedTeacherDoc = await teacherRef.get();
    
    return formatTeacher(updatedTeacherDoc);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error updating teacher:', error);
    throw new ApiError('Failed to update teacher', 500);
  }
};

/**
 * Delete a teacher by ID
 * @param {string} id - Teacher ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteTeacher = async (id) => {
  try {
    const teacherRef = teachersCollection().doc(id);
    const teacherDoc = await teacherRef.get();
    
    if (!teacherDoc.exists) {
      throw new ApiError(`Teacher with ID ${id} not found`, 404);
    }
    
    // Delete the document
    await teacherRef.delete();
    
    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error deleting teacher:', error);
    throw new ApiError('Failed to delete teacher', 500);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};