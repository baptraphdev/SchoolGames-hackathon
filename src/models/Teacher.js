const Joi = require('joi');

// Validation schema for creating a teacher
const createTeacherSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim(),
  age: Joi.number().integer().min(21).max(80).required(),
  address: Joi.string().required().min(5).max(200).trim(),
  subject: Joi.string().optional().max(50),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().max(20),
  qualification: Joi.string().optional().max(100),
  yearsOfExperience: Joi.number().integer().min(0).max(60).optional(),
  notes: Joi.string().optional().max(500)
});

// Validation schema for updating a teacher
const updateTeacherSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim(),
  age: Joi.number().integer().min(21).max(80),
  address: Joi.string().min(5).max(200).trim(),
  subject: Joi.string().max(50),
  email: Joi.string().email(),
  phone: Joi.string().max(20),
  qualification: Joi.string().max(100),
  yearsOfExperience: Joi.number().integer().min(0).max(60),
  notes: Joi.string().max(500)
}).min(1); // At least one field must be provided

// Validation schema for teacher ID parameter
const teacherIdSchema = Joi.object({
  id: Joi.string().required().trim()
});

// Format Firestore document to teacher object
const formatTeacher = (doc) => {
  if (!doc.exists) return null;
  
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    age: data.age,
    address: data.address,
    subject: data.subject || null,
    email: data.email || null,
    phone: data.phone || null,
    qualification: data.qualification || null,
    yearsOfExperience: data.yearsOfExperience || null,
    notes: data.notes || null,
    createdAt: data.createdAt ? data.createdAt.toDate() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
  };
};

module.exports = {
  createTeacherSchema,
  updateTeacherSchema,
  teacherIdSchema,
  formatTeacher
};