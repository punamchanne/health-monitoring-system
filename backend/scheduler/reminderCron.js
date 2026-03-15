const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const sendEmail = require('../services/emailService');

const initReminderCron = () => {
  cron.schedule('* * * * *', async () => {
    // We check for medicines scheduled 5 minutes from NOW
    // This gives the patient a "heads up" 5 minutes before the time.
    const targetDate = new Date(new Date().getTime() + 5 * 60000); // Current time + 5 mins
    const targetTime = `${String(targetDate.getHours()).padStart(2, '0')}:${String(targetDate.getMinutes()).padStart(2, '0')}`;

    try {
      const medicines = await Medicine.find({ reminderTime: targetTime, status: 'active' }).populate('patientId');
      
      for (const medicine of medicines) {
        if (medicine.patientId && medicine.patientId.email) {
          const subject = '🔔 Upcoming Medicine Reminder (In 5 Minutes)';
          const message = `Hello ${medicine.patientId.name},\n\nThis is a friendly reminder to take your medicine in 5 minutes.\n\nMedicine: ${medicine.medicineName}\nDosage: ${medicine.dosage}\nTime: ${medicine.reminderTime}\n\nPlease be ready.\n\nRegards,\nHealth Monitoring System`;
          
          await sendEmail(medicine.patientId.email, subject, message);
          console.log(`Sent 5-minute advance reminder to ${medicine.patientId.email}`);
        }
      }
    } catch (error) {
      console.error('Cron error:', error);
    }
  });
};

module.exports = initReminderCron;
