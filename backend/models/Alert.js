const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Temperature', 'Heartbeat', 'Sugar', 'General'], required: true },
  value: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
