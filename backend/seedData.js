const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Counselor = require('./models/Counselor');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

// ──────────────────────────────────────────────
//  20+ PROPER COUNSELOR / INSTRUCTOR SEED DATA
// ──────────────────────────────────────────────
const counselorsData = [
    {
        name: 'Dr. Swati Kedia Gupta',
        email: 'swati.kedia@counseling.edu',
        password: 'Counselor@123',
        domain: 'Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Assistant Professor at AIIMS New Delhi, Psychiatry Department. Specialist in Student stress counseling, Addiction counseling, and Psychological assessments with 15+ years of hands-on clinical experience.',
        experience: 15,
        skills: ['Clinical Psychology', 'Substance Use Disorders', 'Behavioral Therapy', 'CBT', 'Psychological Assessment'],
        services: ['Individual Therapy', 'Group Therapy', 'Crisis Intervention'],
        languages: ['English', 'Hindi'],
        price: 1500,
        isActive: true,
    },
    {
        name: 'Dr. Barre V. Prasad',
        email: 'barre.prasad@counseling.edu',
        password: 'Counselor@123',
        domain: 'Psycho-oncology & Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Associate Professor specializing in Cancer patient counseling, Psychological rehabilitation, and Mental health therapy for chronic illness patients.',
        experience: 12,
        skills: ['Psycho-oncology', 'Clinical Psychology', 'Rehabilitation Psychology', 'Grief Counseling'],
        services: ['Individual Therapy', 'Family Counseling', 'Palliative Support'],
        languages: ['English', 'Telugu', 'Hindi'],
        price: 1200,
        isActive: true,
    },
    {
        name: 'Dr. Sangita Sharma',
        email: 'sangita.sharma@counseling.edu',
        password: 'Counselor@123',
        domain: 'CBT & Neuropsychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Former Clinical Psychologist with 16+ years experience in Neurology and Psychiatry. Specialized in Cognitive Behaviour Therapy (CBT), Neuropsychological Assessment, and Stress & Anxiety Therapy.',
        experience: 16,
        skills: ['Cognitive Behaviour Therapy (CBT)', 'Neuropsychological Assessment', 'Stress & Anxiety Therapy', 'ADHD Management'],
        services: ['CBT Sessions', 'Neuro Assessment', 'Anxiety Management Workshops'],
        languages: ['English', 'Hindi', 'Marathi'],
        price: 1800,
        isActive: true,
    },
    {
        name: 'Dr. Priya Meenakshisundaram',
        email: 'priya.meenakshi@counseling.edu',
        password: 'Counselor@123',
        domain: 'Child & Adolescent Psychology',
        universityName: 'Madras Medical College',
        desc: 'Specialist in Child and Adolescent Mental Health with a focus on learning disabilities, developmental disorders, and school-based counseling programs.',
        experience: 11,
        skills: ['Child Psychology', 'Adolescent Counseling', 'Learning Disabilities', 'Play Therapy', 'ADHD'],
        services: ['Child Therapy', 'Parent Coaching', 'School Counseling Consultation'],
        languages: ['English', 'Tamil'],
        price: 1100,
        isActive: true,
    },
    {
        name: 'Dr. Rajeev Krishnamurthy',
        email: 'rajeev.krishna@counseling.edu',
        password: 'Counselor@123',
        domain: 'Organizational & Industrial Psychology',
        universityName: 'IIT Bombay',
        desc: 'Expert in workplace mental health, burnout prevention, and career counseling. Consults for Fortune 500 companies on employee wellness programs.',
        experience: 18,
        skills: ['Organizational Psychology', 'Career Counseling', 'Leadership Coaching', 'Burnout Prevention', 'Team Dynamics'],
        services: ['Career Counseling', 'Corporate Workshops', 'Leadership Coaching'],
        languages: ['English', 'Hindi', 'Kannada'],
        price: 2500,
        isActive: true,
    },
    {
        name: 'Dr. Ananya Bhattacharya',
        email: 'ananya.bhatta@counseling.edu',
        password: 'Counselor@123',
        domain: 'Trauma & PTSD Therapy',
        universityName: 'NIMHANS Bangalore',
        desc: 'Certified trauma therapist trained in EMDR and somatic therapies. Works primarily with survivors of abuse, accidents, and disaster-related PTSD.',
        experience: 13,
        skills: ['Trauma Therapy', 'EMDR', 'PTSD Treatment', 'Somatic Therapy', 'Crisis Counseling'],
        services: ['Trauma Therapy', 'EMDR Sessions', 'Crisis Support'],
        languages: ['English', 'Bengali', 'Hindi'],
        price: 2000,
        isActive: true,
    },
    {
        name: 'Dr. Vikram Sundaram',
        email: 'vikram.sundaram@counseling.edu',
        password: 'Counselor@123',
        domain: 'Addiction & Rehabilitation Psychology',
        universityName: 'JIPMER Puducherry',
        desc: 'Addiction specialist with expertise in de-addiction programs, motivational interviewing, and relapse prevention strategies for substance abuse.',
        experience: 14,
        skills: ['Addiction Counseling', 'Motivational Interviewing', 'Relapse Prevention', 'Rehabilitation', 'Group Therapy'],
        services: ['De-addiction Counseling', 'Rehabilitation Support', 'Family Therapy'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 1300,
        isActive: true,
    },
    {
        name: 'Dr. Nandini Verma',
        email: 'nandini.verma@counseling.edu',
        password: 'Counselor@123',
        domain: 'Relationship & Family Counseling',
        universityName: 'Delhi University',
        desc: 'Licensed family therapist specializing in marital counseling, divorce mediation, parent-child conflict resolution, and family systems therapy.',
        experience: 9,
        skills: ['Family Therapy', 'Marital Counseling', 'Divorce Mediation', 'Parenting Support', 'Systemic Therapy'],
        services: ['Couples Therapy', 'Family Counseling', 'Parenting Workshops'],
        languages: ['English', 'Hindi'],
        price: 1400,
        isActive: true,
    },
    {
        name: 'Dr. Aditya Ramachandran',
        email: 'aditya.rama@counseling.edu',
        password: 'Counselor@123',
        domain: 'Depression & Mood Disorders',
        universityName: 'Kasturba Medical College',
        desc: 'Psychiatrist and psychotherapist specializing in Major Depressive Disorder, Bipolar Disorder, and mood stabilization through integrated treatment approaches.',
        experience: 20,
        skills: ['Depression Treatment', 'Bipolar Disorder', 'Mood Disorders', 'Psychopharmacology', 'Integrative Therapy'],
        services: ['Psychiatric Evaluation', 'Medication Management', 'Psychotherapy'],
        languages: ['English', 'Tamil', 'Malayalam'],
        price: 3000,
        isActive: true,
    },
    {
        name: 'Dr. Kavitha Subramaniam',
        email: 'kavitha.subra@counseling.edu',
        password: 'Counselor@123',
        domain: 'Anxiety & Phobia Management',
        universityName: 'Sri Ramachandra University',
        desc: 'Expert in treating anxiety disorders, phobias, panic attacks, and OCD using evidence-based methods including Exposure Therapy and ACT.',
        experience: 8,
        skills: ['Anxiety Disorders', 'Phobia Treatment', 'OCD Management', 'Exposure Therapy', 'ACT'],
        services: ['Anxiety Therapy', 'OCD Treatment', 'Panic Attack Management'],
        languages: ['English', 'Tamil'],
        price: 1600,
        isActive: true,
    },
    {
        name: 'Dr. Suresh Patel',
        email: 'suresh.patel@counseling.edu',
        password: 'Counselor@123',
        domain: 'Sports & Performance Psychology',
        universityName: 'Gujarat University',
        desc: 'Sports psychologist working with national-level athletes, coaches, and teams to enhance mental performance, focus, resilience, and competitive mindset.',
        experience: 10,
        skills: ['Sports Psychology', 'Performance Enhancement', 'Mental Toughness', 'Team Dynamics', 'Visualization Techniques'],
        services: ['Sports Counseling', 'Performance Coaching', 'Team Development Workshops'],
        languages: ['English', 'Hindi', 'Gujarati'],
        price: 2200,
        isActive: true,
    },
    {
        name: 'Dr. Meera Joshi',
        email: 'meera.joshi@counseling.edu',
        password: 'Counselor@123',
        domain: 'Geriatric Psychology',
        universityName: 'Pune University',
        desc: 'Specialist in mental health care for elderly individuals, including dementia support, end-of-life counseling, caregiver support, and age-related depression.',
        experience: 22,
        skills: ['Geriatric Psychology', 'Dementia Care', 'End-of-Life Counseling', 'Caregiver Support', 'Reminiscence Therapy'],
        services: ['Elderly Counseling', 'Caregiver Workshops', 'Dementia Support'],
        languages: ['English', 'Marathi', 'Hindi'],
        price: 1700,
        isActive: true,
    },
    {
        name: 'Dr. Arjun Pillai',
        email: 'arjun.pillai@counseling.edu',
        password: 'Counselor@123',
        domain: 'Mindfulness & Positive Psychology',
        universityName: 'Amrita University Kerala',
        desc: 'Certified Mindfulness-Based Stress Reduction (MBSR) instructor and Positive Psychology practitioner helping individuals build resilience, gratitude, and well-being.',
        experience: 7,
        skills: ['Mindfulness', 'MBSR', 'Positive Psychology', 'Well-being Coaching', 'Meditation'],
        services: ['Mindfulness Sessions', 'Wellness Workshops', 'Well-being Coaching'],
        languages: ['English', 'Malayalam', 'Hindi'],
        price: 1000,
        isActive: true,
    },
    {
        name: 'Dr. Lakshmi Narayan',
        email: 'lakshmi.narayan@counseling.edu',
        password: 'Counselor@123',
        domain: 'Educational & School Psychology',
        universityName: 'Bangalore University',
        desc: 'School psychologist with extensive experience in learning assessments, educational interventions, special needs support, and academic counseling.',
        experience: 17,
        skills: ['Educational Assessment', 'Special Needs', 'Academic Counseling', 'IEP Development', 'Psychoeducation'],
        services: ['Learning Assessment', 'Academic Planning', 'Special Needs Consultation'],
        languages: ['English', 'Kannada', 'Tamil'],
        price: 1350,
        isActive: true,
    },
    {
        name: 'Dr. Rohit Agarwal',
        email: 'rohit.agarwal@counseling.edu',
        password: 'Counselor@123',
        domain: 'Forensic & Criminal Psychology',
        universityName: 'Lucknow University',
        desc: 'Forensic psychologist providing psychological evaluation, criminal behavior analysis, and rehabilitation counseling for correctional facilities.',
        experience: 12,
        skills: ['Forensic Psychology', 'Criminal Behavior Analysis', 'Risk Assessment', 'Rehabilitation Counseling', 'Court Expert Testimony'],
        services: ['Forensic Evaluation', 'Rehabilitation Counseling', 'Expert Consultation'],
        languages: ['English', 'Hindi'],
        price: 2800,
        isActive: true,
    },
    {
        name: 'Dr. Divya Menon',
        email: 'divya.menon@counseling.edu',
        password: 'Counselor@123',
        domain: 'Health Psychology & Chronic Illness',
        universityName: 'Manipal Academy of Higher Education',
        desc: 'Health psychologist assisting patients with chronic conditions like diabetes, cardiovascular disease, and cancer in managing psychological impact and lifestyle changes.',
        experience: 11,
        skills: ['Health Psychology', 'Chronic Disease Management', 'Behavioral Medicine', 'Health Coaching', 'Pain Management'],
        services: ['Health Counseling', 'Chronic Illness Support', 'Lifestyle Modification Coaching'],
        languages: ['English', 'Malayalam'],
        price: 1900,
        isActive: true,
    },
    {
        name: 'Dr. Sanjay Kulkarni',
        email: 'sanjay.kulkarni@counseling.edu',
        password: 'Counselor@123',
        domain: 'Grief & Loss Counseling',
        universityName: 'Symbiosis International University',
        desc: 'Bereavement counselor specializing in grief therapy, loss processing, and supporting individuals and families through death, divorce, and major life transitions.',
        experience: 15,
        skills: ['Grief Therapy', 'Bereavement Counseling', 'Loss Processing', 'Existential Therapy', 'Life Transitions'],
        services: ['Grief Counseling', 'Bereavement Support Groups', 'Life Transition Coaching'],
        languages: ['English', 'Marathi', 'Hindi'],
        price: 1250,
        isActive: true,
    },
    {
        name: 'Dr. Tara Krishnan',
        email: 'tara.krishnan@counseling.edu',
        password: 'Counselor@123',
        domain: 'LGBTQ+ Affirming Therapy',
        universityName: 'TISS Mumbai',
        desc: 'LGBTQ+ affirming therapist providing inclusive, culturally sensitive mental health support for gender and sexual minority individuals and their families.',
        experience: 8,
        skills: ['LGBTQ+ Affirming Therapy', 'Gender Identity', 'Sexual Orientation Counseling', 'Intersectionality', 'Inclusive Practice'],
        services: ['Affirming Therapy', 'Coming Out Support', 'Family Mediation'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 1400,
        isActive: true,
    },
    {
        name: 'Dr. Harsh Bhatia',
        email: 'harsh.bhatia@counseling.edu',
        password: 'Counselor@123',
        domain: 'Neuropsychiatry & Sleep Disorders',
        universityName: 'PGI Chandigarh',
        desc: 'Neuropsychiatrist specializing in sleep-related mental health conditions including insomnia, sleep apnea management, and circadian rhythm disorders.',
        experience: 19,
        skills: ['Neuropsychiatry', 'Sleep Disorders', 'Insomnia Treatment', 'Cognitive Decline', 'EEG Interpretation'],
        services: ['Sleep Assessment', 'Neuropsychiatric Evaluation', 'Cognitive Rehabilitation'],
        languages: ['English', 'Hindi', 'Punjabi'],
        price: 3500,
        isActive: true,
    },
    {
        name: 'Dr. Shweta Iyer',
        email: 'shweta.iyer@counseling.edu',
        password: 'Counselor@123',
        domain: 'Eating Disorders & Body Image',
        universityName: 'Mumbai University',
        desc: 'Certified eating disorder specialist treating Anorexia, Bulimia, Binge Eating Disorder, and negative body image using FBT and DBT approaches.',
        experience: 10,
        skills: ['Eating Disorders', 'Body Image Therapy', 'DBT', 'FBT', 'Nutrition Psychology'],
        services: ['Eating Disorder Therapy', 'Body Image Counseling', 'DBT Skills Training'],
        languages: ['English', 'Hindi', 'Tamil'],
        price: 2100,
        isActive: true,
    },
    {
        name: 'Dr. Prashanth Nair',
        email: 'prashanth.nair@counseling.edu',
        password: 'Counselor@123',
        domain: 'Cross-Cultural & Migration Psychology',
        universityName: 'Hyderabad Central University',
        desc: 'Cultural psychologist helping individuals navigate acculturation stress, cultural identity conflicts, and mental health challenges arising from migration and relocation.',
        experience: 9,
        skills: ['Cross-Cultural Psychology', 'Acculturation', 'Migration Stress', 'Identity Counseling', 'Multicultural Therapy'],
        services: ['Cultural Adjustment Counseling', 'Identity Therapy', 'Migration Stress Support'],
        languages: ['English', 'Malayalam', 'Telugu', 'Hindi'],
        price: 1600,
        isActive: true,
    },
    {
        name: 'Dr. Amrita Desai',
        email: 'amrita.desai@counseling.edu',
        password: 'Counselor@123',
        domain: 'Psychodynamic & Psychoanalytic Therapy',
        universityName: 'Tata Institute of Social Sciences',
        desc: 'Psychoanalytic therapist with advanced training in object relations, attachment theory, and the unconscious mind. Works with deep-seated personality and relational issues.',
        experience: 24,
        skills: ['Psychoanalysis', 'Psychodynamic Therapy', 'Attachment Theory', 'Object Relations', 'Personality Disorders'],
        services: ['Long-term Psychotherapy', 'Personality Disorder Treatment', 'Deep Psychoanalysis'],
        languages: ['English', 'Gujarati', 'Hindi'],
        price: 4000,
        isActive: true,
    },
];

// ──────────────────────────────────────────────
//  HELPER: Generate 500+ student records
// ──────────────────────────────────────────────
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

const universities = [
    'IIT Madras', 'IIT Delhi', 'IIT Bombay', 'IIT Kharagpur', 'NIT Trichy', 'NIT Warangal',
    'Anna University', 'VIT Vellore', 'SRM University', 'Amrita University',
    'BITS Pilani Goa', 'Manipal University', 'Pune University', 'Mumbai University', 'Delhi University',
    'JIPMER Puducherry', 'Amrita University Coimbatore', 'PSG College of Technology', 'Kongu Engineering College', 'SSN College of Engineering',
];

const departments = [
    'Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering',
    'Civil Engineering', 'Electrical Engineering', 'Biotechnology', 'Chemical Engineering',
    'Data Science', 'Artificial Intelligence', 'Business Administration', 'Psychology', 'Medicine',
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate Year 1', 'Postgraduate Year 2'];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateStudents(count) {
    const students = [];
    const usedEmails = new Set();

    for (let i = 0; i < count; i++) {
        const firstName = getRandom(firstNames);
        const lastName = getRandom(lastNames);
        const fullName = `${firstName} ${lastName}`;

        const rollSuffix = String(i + 1).padStart(4, '0');
        const emailBase = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rollSuffix}`;
        const email = `${emailBase}@student.edu`;

        // Guarantee uniqueness
        if (usedEmails.has(email)) continue;
        usedEmails.add(email);

        students.push({
            name: fullName,
            email,
            password: 'Student@123',
            role: 'student',
            photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=0d47a1,1565c0,1976d2,1e88e5,42a5f5,64b5f6,90caf9&fontFamily=Helvetica`,
        });
    }

    return students;
}

// ──────────────────────────────────────────────
//  SEED FUNCTION
// ──────────────────────────────────────────────
const importData = async () => {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🌱  SEEDING DATABASE...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // ── 1. Admin ──────────────────────────────────────
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'Admin@123',
                role: 'admin',
            });
            console.log('✅  Admin created: admin@example.com / Admin@123');
        } else {
            console.log('ℹ️   Admin already exists — skipped.');
        }

        // ── 2. Counselors / Instructors ───────────────────
        console.log('\n📚  Seeding Counselors / Instructors...');
        let counselorCreated = 0;
        let counselorSkipped = 0;

        for (const c of counselorsData) {
            const exists = await Counselor.findOne({ email: c.email });
            if (!exists) {
                await Counselor.create(c);
                counselorCreated++;
                console.log(`   ✅ Created: ${c.name}  (${c.domain})`);
            } else {
                // Keep data fresh — update existing
                Object.assign(exists, {
                    domain: c.domain,
                    universityName: c.universityName,
                    desc: c.desc,
                    experience: c.experience,
                    skills: c.skills,
                    services: c.services,
                    languages: c.languages,
                    price: c.price,
                    isActive: c.isActive,
                });
                await exists.save();
                counselorSkipped++;
                console.log(`   ♻️  Updated: ${c.name}`);
            }
        }

        console.log(`\n   📊  Counselors — Created: ${counselorCreated}, Updated: ${counselorSkipped}`);

        // ── 3. Students ───────────────────────────────────
        console.log('\n🎓  Seeding Students (500+)...');
        const studentsData = generateStudents(520);

        let studentCreated = 0;
        let studentSkipped = 0;

        // Batch insert for performance
        const BATCH_SIZE = 50;
        for (let i = 0; i < studentsData.length; i += BATCH_SIZE) {
            const batch = studentsData.slice(i, i + BATCH_SIZE);
            for (const s of batch) {
                const exists = await User.findOne({ email: s.email });
                if (!exists) {
                    await User.create(s);
                    studentCreated++;
                } else {
                    studentSkipped++;
                }
            }
            const done = Math.min(i + BATCH_SIZE, studentsData.length);
            console.log(`   ⏳  Processed ${done} / ${studentsData.length} students...`);
        }

        console.log(`\n   📊  Students — Created: ${studentCreated}, Skipped (duplicate): ${studentSkipped}`);

        // ── Summary ───────────────────────────────────────
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ✅  SEEDING COMPLETE!');
        console.log(`  👤  Admin:       1`);
        console.log(`  🧑‍🏫  Counselors:  ${counselorCreated + counselorSkipped} (${counselorsData.length} defined)`);
        console.log(`  🎓  Students:    ${studentCreated} new`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n  Default Passwords:');
        console.log('  • Admin       → Admin@123');
        console.log('  • Counselors  → Counselor@123');
        console.log('  • Students    → Student@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌  Seeding failed:', error);
        process.exit(1);
    }
};

importData();
