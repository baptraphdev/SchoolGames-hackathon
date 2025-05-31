const Joi = require('joi');

// Validation schema for creating a student
const createStudentSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim(),
  age: Joi.number().integer().min(3).max(25).required(),
  address: Joi.string().required().min(5).max(200).trim(),
  grade: Joi.string().optional().max(20),
  parentName: Joi.string().optional().max(100),
  parentEmail: Joi.string().email().optional(),
  notes: Joi.string().optional().max(500)
});

// Validation schema for updating a student
const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  age: Joi.number().integer().min(3).max(25),
  address: Joi.string().min(5).max(200).trim(),
  grade: Joi.string().max(20),
  parentName: Joi.string().max(100),
  parentEmail: Joi.string().email(),
  notes: Joi.string().max(500)
}).min(1); // At least one field must be provided

// Validation schema for student ID parameter
const studentIdSchema = Joi.object({
  id: Joi.string().required().trim()
});

// Format Firestore document to student object
const formatStudent = (doc) => {
  if (!doc.exists) return null;
  
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    age: data.age,
    address: data.address,
    grade: data.grade || null,
    parentName: data.parentName || null,
    parentEmail: data.parentEmail || null,
    notes: data.notes || null,
    createdAt: data.createdAt ? data.createdAt.toDate() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
  };
};

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema,
  formatStudent
};