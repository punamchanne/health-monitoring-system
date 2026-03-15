const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  contact: { type: String },
  address: { type: String }, // simple words: Home Address
  bloodGroup: { type: String }, // simple words: Blood Group
  height: { type: String }, // simple words: Height
  emergencyName: { type: String }, // simple words: Emergency Contact Name
  emergencyPhone: { type: String }, // simple words: Emergency Phone
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
