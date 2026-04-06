const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const firstNames = [
    'Aarav', 'Aditi', 'Akash', 'Amara', 'Ananya', 'Arjun', 'Arun', 'Ayaan', 'Bhavna', 'Chandu',
    'Darshan', 'Deepa', 'Divya', 'Esha', 'Farhan', 'Geetha', 'Harish', 'Ishaan', 'Isha', 'Jaya',
    'Kabir', 'Karan', 'Keerthi', 'Kishore', 'Kriti', 'Kumar', 'Lakshmi', 'Madhav', 'Mahesh', 'Meera',
    'Mohan', 'Nandita', 'Naveen', 'Neha', 'Nikhil', 'Nisha', 'Pallavi', 'Pavan', 'Pooja', 'Pranav',
    'Preethi', 'Priya', 'Rahul', 'Rajesh', 'Ramya', 'Rohit', 'Ruchika', 'Sanjay', 'Sara', 'Sathvik',
    'Savitha', 'Shreya', 'Siddharth', 'Sneha', 'Soumya', 'Sowmya', 'Suresh', 'Swati', 'Tanvi', 'Tarun',
    'Uday', 'Uma', 'Vaibhav', 'Varsha', 'Vijay', 'Vikram', 'Vinay', 'Vishal', 'Yamini', 'Yash',
    'Zara', 'Aishwarya', 'Ajay', 'Alok', 'Amritha', 'Anjali', 'Ankita', 'Apoorva', 'Archana', 'Aswin',
    'Balaji', 'Bharat', 'Chaitra', 'Chirag', 'Dhanush', 'Dhruv', 'Dipesh', 'Gayatri', 'Gaurav', 'Geeta',
    'Hemant', 'Indira', 'Jai', 'Jatin', 'Kavitha', 'Kedar', 'Komal', 'Lalit', 'Lavanya', 'Lokesh',
    'Manish', 'Mansi', 'Manoj', 'Maya', 'Milan', 'Mira', 'Mohit', 'Mukesh', 'Nalini', 'Naresh',
    'Nitin', 'Niyati', 'Om', 'Omkar', 'Pankaj', 'Paresh', 'Parth', 'Piyush', 'Pradeep', 'Pramod',
    'Preeti', 'Puneet', 'Radha', 'Raghu', 'Raj', 'Rajan', 'Rajni', 'Ravi', 'Rekha', 'Ritesh',
    'Riya', 'Romil', 'Ronak', 'Rupal', 'Sachin', 'Sadhana', 'Sahana', 'Sahil', 'Sakshi', 'Sameer',
    'Sandeep', 'Sandesh', 'Sandip', 'Sangeetha', 'Sanjeev', 'Santosh', 'Sapna', 'Saurabh', 'Seema', 'Shailesh',
];

const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Mehta', 'Joshi', 'Nair',
    'Pillai', 'Menon', 'Iyer', 'Rao', 'Reddy', 'Naidu', 'Das', 'Mishra', 'Tiwari', 'Pandey',
    'Yadav', 'Chauhan', 'Jain', 'Agarwal', 'Srivastava', 'Bhat', 'Kulkarni', 'Desai', 'Patil', 'Shinde',
    'Gaikwad', 'Pawar', 'More', 'Jadhav', 'Deshpande', 'Kadam', 'Salunkhe', 'Bhatt', 'Thakur', 'Trivedi',
    'Dubey', 'Chaturvedi', 'Bose', 'Ghosh', 'Chatterjee', 'Mukherjee', 'Banerjee', 'Roy', 'Saha', 'Sen',
    'Pillai', 'Krishnan', 'Subramaniam', 'Balakrishnan', 'Ramachandran', 'Venkataraman', 'Sundaram', 'Natarajan', 'Rajan', 'Mohan',
    'Khanna', 'Malhotra', 'Kapoor', 'Arora', 'Batra', 'Anand', 'Bajaj', 'Sachdev', 'Sethi', 'Chopra',
    'Choudhary', 'Soni', 'Goyal', 'Bansal', 'Garg', 'Saxena', 'Shukla', 'Tripathi', 'Bajpai', 'Awasthi',
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const updateDummyStudents = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const students = await User.find({ role: 'student' });
        let updatedCount = 0;

        for (const student of students) {
            // Check if name is like "Student 7" or just numbers/alphanumeric with a number
            const name = student.name.trim();
            const isStudentNumber = /^student\s*\d+$/i.test(name);
            const isRollNumberOnly = /^[A-Z0-9]*\d+[A-Z0-9]*$/i.test(name) && !name.includes(' ');

            if (isStudentNumber || isRollNumberOnly) {
                const newFirstName = getRandom(firstNames);
                const newLastName = getRandom(lastNames);
                const fullName = `${newFirstName} ${newLastName}`;

                student.name = fullName;
                student.photo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=0d47a1,1565c0,1976d2,1e88e5,42a5f5,64b5f6,90caf9&fontFamily=Helvetica`;

                await student.save();
                updatedCount++;
                console.log(`Updated original name "${name}" -> ${fullName}`);
            }
        }

        console.log(`Total students updated: ${updatedCount}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateDummyStudents();
