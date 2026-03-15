const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedCaretaker = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const caretakerEmail = 'caretaker@health.com';
        let caretaker = await User.findOne({ email: caretakerEmail });

        if (caretaker) {
            console.log('Default caretaker exists, ensuring approval status...');
            caretaker.isApproved = true;
            await caretaker.save();
            console.log('Default caretaker approval status updated/verified.');
        } else {
            caretaker = new User({
                name: 'Samuel Hart',
                email: caretakerEmail,
                password: 'password123',
                role: 'caretaker',
                isApproved: true
            });
            await caretaker.save();
            console.log('Default caretaker created successfully');
            console.log('Email: caretaker@health.com');
            console.log('Password: password123');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error seeding caretaker:', error.message);
        process.exit(1);
    }
};

seedCaretaker();
