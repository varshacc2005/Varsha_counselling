const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Counselor = require('./models/Counselor');
const connectDB = require('./config/db');

dotenv.config();

const migrateAvatars = async () => {
    try {
        await connectDB();

        const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Generic user icon

        // Update Users
        const users = await User.find({});
        for (const user of users) {
            if (!user.photo || user.photo.includes('placeholder.com')) {
                user.photo = defaultAvatar;
                await user.save();
                console.log(`Updated user: ${user.email}`);
            }
        }

        // Update Counselors
        const counselors = await Counselor.find({});
        for (const counselor of counselors) {
            if (!counselor.photo || counselor.photo.includes('placeholder.com')) {
                counselor.photo = defaultAvatar;
                await counselor.save();
                console.log(`Updated counselor: ${counselor.email}`);
            }
        }

        console.log('Migration complete');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateAvatars();
