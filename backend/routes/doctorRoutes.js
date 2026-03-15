const express = require('express');
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorize('doctor'));

router.get('/dashboard-stats', doctorController.getDashboardStats);
router.get('/patients', doctorController.getPatients);
router.post('/add-patient', doctorController.addPatient);
router.get('/patient-data/:patientId', doctorController.getPatientHealthData);
router.get('/patient-prescriptions/:patientId', doctorController.getPatientPrescriptions);
router.post('/prescribe', doctorController.prescribeMedicine);
router.get('/alerts', doctorController.getAlerts);
router.get('/pending-approvals', doctorController.getPendingApprovals);
router.post('/approve-user/:userId', doctorController.approveUser);

module.exports = router;
