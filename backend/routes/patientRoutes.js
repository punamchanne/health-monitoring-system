const express = require('express');
const { submitHealthData, getHealthHistory, getPrescriptions, getProfile } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.post('/submit-data', submitHealthData);
router.get('/history', getHealthHistory);
router.get('/prescriptions', getPrescriptions);
router.get('/profile', getProfile);

module.exports = router;
