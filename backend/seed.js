const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Counselor = require('./models/Counselor');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const counselorsData = [
    {
        name: 'Dr. Swati Kedia Gupta',
        email: 'psychiatry@aiims.edu',
        password: 'password123',
        domain: 'Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Assistant Professor at AIIMS New Delhi, Psychiatry Department. Specialist in Student stress counseling, Addiction counseling, and Psychological assessments.',
        experience: 15,
        skills: ['Clinical Psychology', 'Substance Use Disorders', 'Behavioral Therapy'],
    },
    {
        name: 'Dr. Barre V. Prasad',
        email: 'prasad.psychology@aiims.edu',
        password: 'password123',
        domain: 'Psycho-oncology & Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Associate Professor at AIIMS New Delhi, Psychiatry Department. Focuses on Cancer patient counseling, Psychological rehabilitation, and Mental health therapy.',
        experience: 12,
        skills: ['Psycho-oncology', 'Clinical Psychology', 'Rehabilitation Psychology'],
    },
    {
        name: 'Dr. Sangita Sharma',
        email: 'sangita.psychology@aiims.edu',
        password: 'password123',
        domain: 'CBT & Neuropsychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Former Clinical Psychologist at AIIMS New Delhi with 16+ years experience in Neurology and Psychiatry. Specialized in Cognitive Behaviour Therapy (CBT), Neuropsychological Assessment, and Stress & Anxiety Therapy.',
        experience: 16,
        skills: ['Cognitive Behaviour Therapy (CBT)', 'Neuropsychological Assessment', 'Stress & Anxiety Therapy'],
    }
];

const importData = async () => {
    try {
        // Seed Admin
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
            });
            console.log('Admin User Created');
        } else {
            console.log('Admin User already exists');
        }

        // Seed Counselors
        for (const c of counselorsData) {
            const counselorExists = await Counselor.findOne({ email: c.email });
            if (!counselorExists) {
                await Counselor.create(c);
                console.log(`Counselor ${c.name} Created`);
            } else {
                // Update existing to match new schema if needed
                counselorExists.domain = c.domain;
                counselorExists.universityName = c.universityName;
                counselorExists.desc = c.desc;
                counselorExists.experience = c.experience;
                counselorExists.skills = c.skills;
                await counselorExists.save();
                console.log(`Counselor ${c.name} Updated`);
            }
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
