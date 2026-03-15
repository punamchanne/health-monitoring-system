const User = require('../models/User');
const Patient = require('../models/Patient');
const HealthData = require('../models/HealthData');
const Medicine = require('../models/Medicine');
const Alert = require('../models/Alert');

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ doctorId: req.user.id }).populate('patientId', 'name email');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPatient = async (req, res) => {
  try {
    const { patientEmail, age, gender, contact } = req.body;
    const patientUser = await User.findOne({ email: patientEmail, role: 'patient' });
    if (!patientUser) return res.status(404).json({ message: 'Patient user not found' });

    const existingPatient = await Patient.findOne({ doctorId: req.user.id, patientId: patientUser._id });
    if (existingPatient) return res.status(400).json({ message: 'Patient already added' });

    const patient = await Patient.create({
      doctorId: req.user.id,
      patientId: patientUser._id,
      age,
      gender,
      contact
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientHealthData = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await HealthData.find({ patientId }).sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const prescribeMedicine = async (req, res) => {
  try {
    const { patientId, medicineName, reminderTime, duration, dosage } = req.body;
    const medicine = await Medicine.create({
      patientId,
      medicineName,
      reminderTime,
      duration,
      dosage
    });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    // Get alerts for all patients managed by this doctor
    const patients = await Patient.find({ doctorId: req.user.id });
    const patientIds = patients.map(p => p.patientId);
    const alerts = await Alert.find({ patientId: { $in: patientIds } }).populate('patientId', 'name').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingApprovals = async (req, res) => {
  try {
    // Only show pending PATIENTS to the doctor
    const pendingUsers = await User.find({ isApproved: false, role: 'patient' }).select('-password');
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient', isApproved: true });
    const pendingApprovals = await User.countDocuments({ role: 'patient', isApproved: false });
    const criticalAlerts = await Alert.countDocuments(); // Simplified for stats

    res.json({
      totalPatients,
      pendingApprovals,
      criticalAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medicines = await Medicine.find({ patientId }).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getPatients, 
  addPatient, 
  getPatientHealthData, 
  prescribeMedicine, 
  getAlerts,
  getPendingApprovals,
  approveUser,
  getDashboardStats,
  getPatientPrescriptions
};
