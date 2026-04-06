const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const updateUsers = async () => {
    await connectDB();

    // Find students whose name looks like a roll number (e.g., alphanumeric, all caps, or typical roll number patterns)
    // Or just fetch all students and list their names to see
    const students = await User.find({ role: 'student' });
    let output = '';
    for (const student of students) {
        output += `Name: ${student.name}, Email: ${student.email}\n`;
    }
    fs.writeFileSync('students.txt', output);
    console.log(`Exported ${students.length} students to students.txt`);

    process.exit();
};

updateUsers();
