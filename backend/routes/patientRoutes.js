const express = require('express');
const { submitHealthData, getHealthHistory, getPrescriptions } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.post('/submit-data', submitHealthData);
router.get('/history', getHealthHistory);
router.get('/prescriptions', getPrescriptions);

module.exports = router;
