const { getFirestoreInstance } = require('../config/firebase');
const { 
  collection, 
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} = require('firebase/firestore');
const { formatStudent } = require('../models/Student');
const { ApiError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

// Reference to the Firestore collection
const studentsCollection = async () => {
  const db = await getFirestoreInstance();
  return collection(db, 'students');
};

/**
 * Create a new student
 * @param {Object} studentData - Student data object
 * @returns {Promise<Object>} - Created student object
 */
const createStudent = async (studentData) => {
  try {
    // Add timestamps
    const timestamp = serverTimestamp();
    const newStudent = {
      ...studentData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Create a new document with auto-generated ID
    const collectionRef = await studentsCollection();
    const docRef = await addDoc(collectionRef, newStudent);
    
    // Get the newly created document
    const studentDoc = await getDoc(docRef);
    
    return formatStudent(studentDoc);
  } catch (error) {
    console.error('Error creating student:', error);
    throw new ApiError('Failed to create student', 500);
  }
};

/**
 * Get all students
 * @returns {Promise<Array>} - Array of student objects
 */
const getAllStudents = async () => {
  try {
    const collectionRef = await studentsCollection();
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(formatStudent);
  } catch (error) {
    console.error('Error getting students:', error);
    throw new ApiError('Failed to get students', 500);
  }
};

/**
 * Get a student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} - Student object
 */
const getStudentById = async (id) => {
  try {
    const collectionRef = await studentsCollection();
    const studentRef = doc(collectionRef, id);
    const studentDoc = await getDoc(studentRef);
    
    if (!studentDoc.exists()) {
      throw new ApiError(`Student with ID ${id} not found`, 404);
    }
    
    return formatStudent(studentDoc);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error getting student:', error);
    throw new ApiError('Failed to get student', 500);
  }
};

/**
 * Update a student by ID
 * @param {string} id - Student ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated student object
 */
const updateStudent = async (id, updateData) => {
  try {
    const collectionRef = await studentsCollection();
    const studentRef = doc(collectionRef, id);
    const studentDoc = await getDoc(studentRef);
    
    if (!studentDoc.exists()) {
      throw new ApiError(`Student with ID ${id} not found`, 404);
    }
    
    // Add timestamp
    updateData.updatedAt = serverTimestamp();
    
    // Update the document
    await updateDoc(studentRef, updateData);
    
    // Get the updated document
    const updatedStudentDoc = await getDoc(studentRef);
    
    return formatStudent(updatedStudentDoc);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error updating student:', error);
    throw new ApiError('Failed to update student', 500);
  }
};

/**
 * Delete a student by ID
 * @param {string} id - Student ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteStudent = async (id) => {
  try {
    const collectionRef = await studentsCollection();
    const studentRef = doc(collectionRef, id);
    const studentDoc = await getDoc(studentRef);
    
    if (!studentDoc.exists()) {
      throw new ApiError(`Student with ID ${id} not found`, 404);
    }
    
    // Delete the document
    await deleteDoc(studentRef);
    
    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error deleting student:', error);
    throw new ApiError('Failed to delete student', 500);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};