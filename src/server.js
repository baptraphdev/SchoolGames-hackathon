const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { initializeFirebase } = require('./config/firebase');

// Load environment variables
dotenv.config();

// Initialize Firebase
initializeFirebase();

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Educational Games API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      teachers: '/api/teachers'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;