const express = require('express');
const caretakerController = require('../controllers/caretakerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorize('caretaker'));

router.get('/dashboard-stats', caretakerController.getDashboardStats);
router.get('/patients', caretakerController.getPatients);
router.post('/add-patient', caretakerController.addPatient);
router.get('/patient-data/:patientId', caretakerController.getPatientHealthData);
router.get('/patient-prescriptions/:patientId', caretakerController.getPatientPrescriptions);
router.post('/prescribe', caretakerController.prescribeMedicine);
router.get('/alerts', caretakerController.getAlerts);
router.get('/pending-approvals', caretakerController.getPendingApprovals);
router.post('/approve-user/:userId', caretakerController.approveUser);

module.exports = router;
