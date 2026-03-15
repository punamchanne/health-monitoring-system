const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  reminderTime: { type: String, required: true }, // Format HH:mm (24h)
  duration: { type: String }, // e.g., "7 days"
  dosage: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
