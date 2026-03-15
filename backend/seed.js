const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedDoctor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const doctorEmail = 'doctor@health.com';
        let doctor = await User.findOne({ email: doctorEmail });

        if (doctor) {
            console.log('Default doctor exists, ensuring approval status...');
            doctor.isApproved = true;
            await doctor.save();
            console.log('Default doctor approval status updated/verified.');
        } else {
            doctor = new User({
                name: 'Dr. John Smith',
                email: doctorEmail,
                password: 'password123',
                role: 'doctor',
                isApproved: true
            });
            await doctor.save();
            console.log('Default doctor created successfully');
            console.log('Email: doctor@health.com');
            console.log('Password: password123');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error seeding doctor:', error.message);
        process.exit(1);
    }
};

seedDoctor();
