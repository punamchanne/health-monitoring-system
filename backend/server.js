const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const caretakerRoutes = require('./routes/caretakerRoutes');
const patientRoutes = require('./routes/patientRoutes');
const initReminderCron = require('./scheduler/reminderCron');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/caretaker', caretakerRoutes);
app.use('/api/patient', patientRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize Cron Job after DB connection
    initReminderCron();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
