const HealthData = require('../models/HealthData');
const Medicine = require('../models/Medicine');
const Alert = require('../models/Alert');
const Patient = require('../models/Patient');
const sendEmail = require('../services/emailService');

const submitHealthData = async (req, res) => {
  try {
    const { temperature, heartbeat, sugarLevel, bloodPressure, oxygenLevel, weight, sleepHours } = req.body;
    const patientId = req.user.id;

    const healthData = await HealthData.create({
      patientId,
      temperature,
      heartbeat,
      sugarLevel,
      bloodPressure,
      oxygenLevel,
      weight,
      sleepHours
    });

    // Check for abnormal readings
    const alerts = [];
    if (temperature < 97 || temperature > 99) {
      alerts.push({ patientId, type: 'Temperature', value: temperature, message: `Abnormal Temperature: ${temperature}°F` });
    }
    if (heartbeat < 60 || heartbeat > 100) {
      alerts.push({ patientId, type: 'Heartbeat', value: heartbeat, message: `Abnormal Heartbeat: ${heartbeat} bpm` });
    }
    if (sugarLevel < 70 || sugarLevel > 140) {
      alerts.push({ patientId, type: 'Sugar', value: sugarLevel, message: `Abnormal Sugar Level: ${sugarLevel} mg/dL` });
    }

    if (alerts.length > 0) {
      await Alert.insertMany(alerts);
      
      // Notify the Doctor via Email
      try {
        const patientRecord = await Patient.findOne({ patientId }).populate('doctorId');
        if (patientRecord && patientRecord.doctorId && patientRecord.doctorId.email) {
          const patientName = req.user.name;
          const subject = `🚨 URGENT: Health Alert for ${patientName}`;
          const message = `Dr. ${patientRecord.doctorId.name},\n\nThis is an automated alert from Smart Health Monitoring System.\n\nYour patient, ${patientName}, has submitted critical health vitals that require your immediate attention:\n\n${alerts.map(a => `- ${a.message}`).join('\n')}\n\nPlease log in to your dashboard to review the full medical history.\n\nRegards,\nClinical Care Team`;
          
          await sendEmail(patientRecord.doctorId.email, subject, message);
        }
      } catch (emailErr) {
        console.error('Failed to send emergency email to doctor:', emailErr);
      }
    }

    res.status(201).json({ healthData, alertCreated: alerts.length > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHealthHistory = async (req, res) => {
  try {
    const history = await HealthData.find({ patientId: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Medicine.find({ patientId: req.user.id, status: 'active' });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitHealthData, getHealthHistory, getPrescriptions };
