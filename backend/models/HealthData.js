const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temperature: { type: Number, required: true },
  heartbeat: { type: Number, required: true },
  sugarLevel: { type: Number, required: true },
  bloodPressure: { type: String }, // simple words: Blood Pressure
  oxygenLevel: { type: Number }, // simple words: Oxygen Level (SpO2)
  weight: { type: Number }, // simple words: Body Weight
  sleepHours: { type: Number }, // simple words: Sleep Hours
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('HealthData', healthDataSchema);
