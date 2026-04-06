/**
 * MIGRATION SCRIPT — fixSeedData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE:
 *   • Update the 520 students added by seedData.js
 *     OLD email: firstname.lastnameNNNN@student.edu
 *     NEW email: rollNNNN@aiims.com
 *
 *   • Update the 22 counselors added by seedData.js (@counseling.edu)
 *     — All changed to: AIIMS New Delhi, Psychology Department only
 *
 *   • ALL original/old data (other emails) is LEFT UNCHANGED.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Counselor = require('./models/Counselor');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// ──────────────────────────────────────────────────────────────────────────────
//  CORRECTED COUNSELOR DATA — All AIIMS New Delhi, Psychology dept only
// ──────────────────────────────────────────────────────────────────────────────
const correctedCounselors = [
    {
        email: 'swati.kedia@counseling.edu',
        name: 'Dr. Swati Kedia Gupta',
        domain: 'Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Assistant Professor at AIIMS New Delhi, Department of Psychiatry & Clinical Psychology. Specialist in Student stress counseling, Addiction counseling, and Psychological assessments with 15+ years of clinical experience.',
        experience: 15,
        skills: ['Clinical Psychology', 'Student Stress Counseling', 'Addiction Counseling', 'CBT', 'Psychological Assessment'],
        services: ['Individual Therapy', 'Group Therapy', 'Crisis Intervention'],
        languages: ['English', 'Hindi'],
        price: 1500,
        isActive: true,
    },
    {
        email: 'barre.prasad@counseling.edu',
        name: 'Dr. Barre V. Prasad',
        domain: 'Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Associate Professor at AIIMS New Delhi, Department of Clinical Psychology. Specializes in patient counseling, psychological rehabilitation, and mental health therapy for students.',
        experience: 12,
        skills: ['Clinical Psychology', 'Rehabilitation Psychology', 'Grief Counseling', 'Motivational Therapy'],
        services: ['Individual Therapy', 'Family Counseling', 'Psychological Rehabilitation'],
        languages: ['English', 'Telugu', 'Hindi'],
        price: 1200,
        isActive: true,
    },
    {
        email: 'sangita.sharma@counseling.edu',
        name: 'Dr. Sangita Sharma',
        domain: 'Cognitive Behavioural Therapy (CBT)',
        universityName: 'AIIMS New Delhi',
        desc: 'Senior Psychologist at AIIMS New Delhi, Department of Psychiatry. Specialized in Cognitive Behaviour Therapy (CBT), Neuropsychological Assessment, and Stress & Anxiety Therapy with 16+ years of experience.',
        experience: 16,
        skills: ['Cognitive Behaviour Therapy (CBT)', 'Neuropsychological Assessment', 'Stress & Anxiety Therapy', 'ADHD Management'],
        services: ['CBT Sessions', 'Neuropsychological Assessment', 'Anxiety Management Workshops'],
        languages: ['English', 'Hindi', 'Marathi'],
        price: 1800,
        isActive: true,
    },
    {
        email: 'priya.meenakshi@counseling.edu',
        name: 'Dr. Priya Meenakshisundaram',
        domain: 'Child & Adolescent Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Psychologist at AIIMS New Delhi, Department of Child & Adolescent Psychiatry. Specialist in adolescent mental health, learning disabilities, developmental disorders, and student counseling programs.',
        experience: 11,
        skills: ['Child Psychology', 'Adolescent Counseling', 'Learning Disabilities', 'Play Therapy', 'ADHD'],
        services: ['Child Therapy', 'Parent Coaching', 'Adolescent Counseling'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 1100,
        isActive: true,
    },
    {
        email: 'rajeev.krishna@counseling.edu',
        name: 'Dr. Rajeev Krishnamurthy',
        domain: 'Counseling Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Counseling Psychologist at AIIMS New Delhi, Department of Psychiatry. Expert in student mental health, academic stress, career counseling, and burnout prevention.',
        experience: 18,
        skills: ['Counseling Psychology', 'Career Counseling', 'Academic Stress Management', 'Burnout Prevention'],
        services: ['Career Counseling', 'Academic Stress Workshops', 'Individual Counseling'],
        languages: ['English', 'Hindi', 'Kannada'],
        price: 1400,
        isActive: true,
    },
    {
        email: 'ananya.bhatta@counseling.edu',
        name: 'Dr. Ananya Bhattacharya',
        domain: 'Trauma & PTSD Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Clinical Psychologist at AIIMS New Delhi, Department of Psychiatry. Certified trauma therapist trained in EMDR and somatic therapies for PTSD, abuse survivors, and crisis counseling.',
        experience: 13,
        skills: ['Trauma Therapy', 'EMDR', 'PTSD Treatment', 'Somatic Therapy', 'Crisis Counseling'],
        services: ['Trauma Therapy', 'EMDR Sessions', 'Crisis Support'],
        languages: ['English', 'Bengali', 'Hindi'],
        price: 2000,
        isActive: true,
    },
    {
        email: 'vikram.sundaram@counseling.edu',
        name: 'Dr. Vikram Sundaram',
        domain: 'Addiction & Rehabilitation Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Addiction Psychology Specialist at AIIMS New Delhi, Department of Psychiatry. Expert in student de-addiction programs, motivational interviewing, and relapse prevention strategies.',
        experience: 14,
        skills: ['Addiction Counseling', 'Motivational Interviewing', 'Relapse Prevention', 'Rehabilitation Psychology'],
        services: ['De-addiction Counseling', 'Rehabilitation Support', 'Student Support Groups'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 1300,
        isActive: true,
    },
    {
        email: 'nandini.verma@counseling.edu',
        name: 'Dr. Nandini Verma',
        domain: 'Counseling Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Psychologist at AIIMS New Delhi, Department of Psychiatry. Specializes in individual counseling, relationship issues, family conflict resolution, and student wellness.',
        experience: 9,
        skills: ['Counseling Psychology', 'Family Counseling', 'Interpersonal Therapy', 'Student Wellness'],
        services: ['Individual Counseling', 'Family Counseling', 'Student Wellness Sessions'],
        languages: ['English', 'Hindi'],
        price: 1400,
        isActive: true,
    },
    {
        email: 'aditya.rama@counseling.edu',
        name: 'Dr. Aditya Ramachandran',
        domain: 'Depression & Mood Disorders',
        universityName: 'AIIMS New Delhi',
        desc: 'Senior Psychiatrist & Psychotherapist at AIIMS New Delhi, Department of Psychiatry. Specializes in Major Depressive Disorder, Bipolar Disorder, and integrated treatment approaches.',
        experience: 20,
        skills: ['Depression Treatment', 'Bipolar Disorder', 'Mood Disorders', 'Psychopharmacology', 'Integrative Therapy'],
        services: ['Psychiatric Evaluation', 'Medication Management', 'Psychotherapy'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 2500,
        isActive: true,
    },
    {
        email: 'kavitha.subra@counseling.edu',
        name: 'Dr. Kavitha Subramaniam',
        domain: 'Anxiety & Stress Management',
        universityName: 'AIIMS New Delhi',
        desc: 'Clinical Psychologist at AIIMS New Delhi, Department of Psychiatry. Expert in treating anxiety disorders, exam stress, panic attacks, and OCD using evidence-based methods.',
        experience: 8,
        skills: ['Anxiety Disorders', 'Exam Stress Management', 'OCD Management', 'Exposure Therapy', 'ACT'],
        services: ['Anxiety Therapy', 'OCD Treatment', 'Exam Stress Workshops'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 1600,
        isActive: true,
    },
    {
        email: 'suresh.patel@counseling.edu',
        name: 'Dr. Suresh Patel',
        domain: 'Positive Psychology & Wellbeing',
        universityName: 'AIIMS New Delhi',
        desc: 'Psychologist at AIIMS New Delhi, Department of Psychiatry. Specialist in student wellbeing, performance enhancement, mental resilience, and positive psychology interventions.',
        experience: 10,
        skills: ['Positive Psychology', 'Student Wellbeing', 'Resilience Building', 'Visualization Techniques', 'Mindfulness'],
        services: ['Wellbeing Counseling', 'Performance Coaching', 'Group Wellbeing Workshops'],
        languages: ['English', 'Hindi', 'Gujarati'],
        price: 1200,
        isActive: true,
    },
    {
        email: 'meera.joshi@counseling.edu',
        name: 'Dr. Meera Joshi',
        domain: 'Clinical Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Senior Clinical Psychologist at AIIMS New Delhi, Department of Psychiatry. Over 22 years of experience in clinical assessment, psychotherapy, and student mental health services.',
        experience: 22,
        skills: ['Clinical Psychology', 'Psychotherapy', 'Clinical Assessment', 'Student Counseling', 'Crisis Management'],
        services: ['Clinical Psychology Consultation', 'Psychotherapy', 'Crisis Counseling'],
        languages: ['English', 'Marathi', 'Hindi'],
        price: 1700,
        isActive: true,
    },
    {
        email: 'arjun.pillai@counseling.edu',
        name: 'Dr. Arjun Pillai',
        domain: 'Mindfulness & Stress Reduction',
        universityName: 'AIIMS New Delhi',
        desc: 'Psychologist at AIIMS New Delhi, Department of Psychiatry. Certified Mindfulness-Based Stress Reduction (MBSR) instructor helping students with stress, burnout, and emotional regulation.',
        experience: 7,
        skills: ['Mindfulness', 'MBSR', 'Stress Reduction', 'Emotional Regulation', 'Meditation Therapy'],
        services: ['Mindfulness Sessions', 'Stress Reduction Workshops', 'Emotional Wellbeing Coaching'],
        languages: ['English', 'Malayalam', 'Hindi'],
        price: 1000,
        isActive: true,
    },
    {
        email: 'lakshmi.narayan@counseling.edu',
        name: 'Dr. Lakshmi Narayan',
        domain: 'Educational & Student Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Educational Psychologist at AIIMS New Delhi, Department of Psychiatry. Extensive experience in learning assessments, academic counseling, and student support programs.',
        experience: 17,
        skills: ['Educational Psychology', 'Special Needs Assessment', 'Academic Counseling', 'Learning Difficulties', 'Psychoeducation'],
        services: ['Learning Assessment', 'Academic Counseling', 'Special Needs Consultation'],
        languages: ['English', 'Kannada', 'Tamil', 'Hindi'],
        price: 1350,
        isActive: true,
    },
    {
        email: 'rohit.agarwal@counseling.edu',
        name: 'Dr. Rohit Agarwal',
        domain: 'Behavioral Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Behavioral Psychologist at AIIMS New Delhi, Department of Psychiatry. Specialist in behavioral interventions, anger management, impulse control, and student behavior counseling.',
        experience: 12,
        skills: ['Behavioral Psychology', 'Anger Management', 'Impulse Control', 'Behavioral Interventions', 'Student Behavior Counseling'],
        services: ['Behavior Counseling', 'Anger Management Therapy', 'Student Behavior Support'],
        languages: ['English', 'Hindi'],
        price: 1500,
        isActive: true,
    },
    {
        email: 'divya.menon@counseling.edu',
        name: 'Dr. Divya Menon',
        domain: 'Health & Psychosomatic Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Health Psychologist at AIIMS New Delhi, Department of Psychiatry. Specializes in psychosomatic disorders, health anxiety, chronic illness counseling, and student health psychology.',
        experience: 11,
        skills: ['Health Psychology', 'Psychosomatic Disorders', 'Health Anxiety', 'Chronic Illness Counseling'],
        services: ['Health Counseling', 'Psychosomatic Assessment', 'Health Anxiety Therapy'],
        languages: ['English', 'Malayalam', 'Hindi'],
        price: 1600,
        isActive: true,
    },
    {
        email: 'sanjay.kulkarni@counseling.edu',
        name: 'Dr. Sanjay Kulkarni',
        domain: 'Grief & Loss Counseling',
        universityName: 'AIIMS New Delhi',
        desc: 'Psychologist at AIIMS New Delhi, Department of Psychiatry. Bereavement counselor specializing in grief therapy, loss processing, and supporting students through major life transitions.',
        experience: 15,
        skills: ['Grief Therapy', 'Bereavement Counseling', 'Loss Processing', 'Existential Therapy', 'Life Transitions'],
        services: ['Grief Counseling', 'Bereavement Support Groups', 'Life Transition Coaching'],
        languages: ['English', 'Marathi', 'Hindi'],
        price: 1250,
        isActive: true,
    },
    {
        email: 'tara.krishnan@counseling.edu',
        name: 'Dr. Tara Krishnan',
        domain: 'Counseling Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Counseling Psychologist at AIIMS New Delhi, Department of Psychiatry. Provides inclusive, culturally sensitive mental health support for students with diverse identities and backgrounds.',
        experience: 8,
        skills: ['Counseling Psychology', 'Inclusive Therapy', 'Identity Counseling', 'Cultural Sensitivity', 'Student Support'],
        services: ['Individual Counseling', 'Identity Support', 'Student Peer Support Programs'],
        languages: ['English', 'Tamil', 'Hindi'],
        price: 1400,
        isActive: true,
    },
    {
        email: 'harsh.bhatia@counseling.edu',
        name: 'Dr. Harsh Bhatia',
        domain: 'Neuropsychology & Sleep Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Neuropsychologist at AIIMS New Delhi, Department of Neurology & Psychiatry. Specializes in sleep-related psychological disorders, cognitive assessment, and student neuropsychological problems.',
        experience: 19,
        skills: ['Neuropsychology', 'Sleep Disorders', 'Insomnia Treatment', 'Cognitive Assessment', 'Neuropsychological Evaluation'],
        services: ['Sleep Psychology Consultation', 'Neuropsychological Assessment', 'Cognitive Rehabilitation'],
        languages: ['English', 'Hindi', 'Punjabi'],
        price: 2000,
        isActive: true,
    },
    {
        email: 'shweta.iyer@counseling.edu',
        name: 'Dr. Shweta Iyer',
        domain: 'Eating Disorders & Body Image Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Psychologist at AIIMS New Delhi, Department of Psychiatry. Certified eating disorder specialist treating Anorexia, Bulimia, and negative body image in students using DBT and FBT approaches.',
        experience: 10,
        skills: ['Eating Disorders', 'Body Image Therapy', 'DBT', 'FBT', 'Nutrition Psychology'],
        services: ['Eating Disorder Therapy', 'Body Image Counseling', 'DBT Skills Training'],
        languages: ['English', 'Hindi', 'Tamil'],
        price: 1700,
        isActive: true,
    },
    {
        email: 'prashanth.nair@counseling.edu',
        name: 'Dr. Prashanth Nair',
        domain: 'Cross-Cultural Counseling Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Counseling Psychologist at AIIMS New Delhi, Department of Psychiatry. Helps students navigate cultural identity, acculturation stress, language barriers, and relocation-related mental health challenges.',
        experience: 9,
        skills: ['Cross-Cultural Psychology', 'Acculturation Counseling', 'Identity Counseling', 'Multicultural Therapy'],
        services: ['Cultural Adjustment Counseling', 'Identity Therapy', 'Student Acculturation Support'],
        languages: ['English', 'Malayalam', 'Telugu', 'Hindi'],
        price: 1300,
        isActive: true,
    },
    {
        email: 'amrita.desai@counseling.edu',
        name: 'Dr. Amrita Desai',
        domain: 'Psychodynamic & Depth Psychology',
        universityName: 'AIIMS New Delhi',
        desc: 'Senior Psychologist at AIIMS New Delhi, Department of Psychiatry. Over 24 years of experience in psychodynamic therapy, attachment theory, and treating deep-seated personality and relational issues in students.',
        experience: 24,
        skills: ['Psychodynamic Therapy', 'Attachment Theory', 'Object Relations', 'Personality Disorders', 'Long-term Psychotherapy'],
        services: ['Long-term Psychotherapy', 'Personality Disorder Treatment', 'Psychodynamic Analysis'],
        languages: ['English', 'Gujarati', 'Hindi'],
        price: 2200,
        isActive: true,
    },
];

// ──────────────────────────────────────────────────────────────────────────────
//  MAIN MIGRATION
// ──────────────────────────────────────────────────────────────────────────────
const migrate = async () => {
    try {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🔧  RUNNING DATA FIX MIGRATION...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // ─────────────────────────────────────────────────────────────
        //  1. FIX STUDENTS — @student.edu → rollNNNN@aiims.com
        // ─────────────────────────────────────────────────────────────
        console.log('🎓  Step 1: Fix student emails (@student.edu → rollNNNN@aiims.com)...');

        // Fetch all seeded students (those with @student.edu emails)
        const seededStudents = await User.find({
            role: 'student',
            email: { $regex: /@student\.edu$/ }
        }).select('_id name email');

        console.log(`   Found ${seededStudents.length} students with @student.edu to fix.`);

        let studentFixed = 0;
        let studentErrors = 0;

        for (const student of seededStudents) {
            try {
                // Extract the 4-digit roll number from email (e.g. "aarav.sharma0001@student.edu" → "0001")
                const match = student.email.match(/(\d{4})@student\.edu$/);
                const rollNum = match ? match[1] : String(studentFixed + 1).padStart(4, '0');
                const newEmail = `roll${rollNum}@aiims.com`;

                // Check if the new email already exists (avoid duplicates on re-run)
                const alreadyExists = await User.findOne({ email: newEmail });
                if (alreadyExists && alreadyExists._id.toString() !== student._id.toString()) {
                    // If another user has this email, skip
                    studentErrors++;
                    continue;
                }

                await User.updateOne(
                    { _id: student._id },
                    { $set: { email: newEmail } }
                );
                studentFixed++;

                if (studentFixed <= 5 || studentFixed % 100 === 0) {
                    console.log(`   ✏️  [${studentFixed}] ${student.name}: ${student.email} → ${newEmail}`);
                }
            } catch (err) {
                studentErrors++;
            }
        }

        console.log(`\n   ✅  Students fixed: ${studentFixed}  |  Errors/skipped: ${studentErrors}`);

        // ─────────────────────────────────────────────────────────────
        //  2. FIX COUNSELORS — Update @counseling.edu to AIIMS + Psychology
        // ─────────────────────────────────────────────────────────────
        console.log('\n🧑‍🏫  Step 2: Fix counselors (all to AIIMS New Delhi, Psychology dept)...');

        let counselorFixed = 0;
        let counselorNotFound = 0;

        for (const updated of correctedCounselors) {
            const existing = await Counselor.findOne({ email: updated.email });
            if (!existing) {
                counselorNotFound++;
                console.log(`   ⚠️  Not found: ${updated.email} — skipped`);
                continue;
            }

            await Counselor.updateOne(
                { email: updated.email },
                {
                    $set: {
                        name: updated.name,
                        domain: updated.domain,
                        universityName: updated.universityName,
                        desc: updated.desc,
                        experience: updated.experience,
                        skills: updated.skills,
                        services: updated.services,
                        languages: updated.languages,
                        price: updated.price,
                        isActive: updated.isActive,
                    }
                }
            );

            counselorFixed++;
            console.log(`   ✅  Fixed: ${updated.name} → ${updated.domain} | AIIMS New Delhi`);
        }

        console.log(`\n   ✅  Counselors fixed: ${counselorFixed}  |  Not found: ${counselorNotFound}`);

        // ─────────────────────────────────────────────────────────────
        //  3. VERIFY — Show final counts
        // ─────────────────────────────────────────────────────────────
        console.log('\n📊  Step 3: Verifying final state...');

        const totalStudents = await User.countDocuments({ role: 'student' });
        const aimsStudents = await User.countDocuments({ role: 'student', email: { $regex: /@aiims\.com$/ } });
        const oldStudents = await User.countDocuments({ role: 'student', email: { $not: /@aiims\.com$/ } });
        const totalCounselors = await Counselor.countDocuments({});
        const aiimsCounselors = await Counselor.countDocuments({ universityName: 'AIIMS New Delhi' });

        console.log(`
   ┌─────────────────────────────────────────────┐
   │  STUDENTS                                    │
   │  Total students          : ${String(totalStudents).padEnd(6)} students  │
   │  → New (rollNNNN@aiims.com): ${String(aimsStudents).padEnd(6)} students  │
   │  → Old (preserved)       : ${String(oldStudents).padEnd(6)} students  │
   │                                              │
   │  COUNSELORS                                  │
   │  Total counselors        : ${String(totalCounselors).padEnd(6)} counselors│
   │  → AIIMS New Delhi       : ${String(aiimsCounselors).padEnd(6)} counselors│
   └─────────────────────────────────────────────┘`);

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ✅  MIGRATION COMPLETE!');
        console.log('\n  Login credentials unchanged:');
        console.log('  • Admin       → admin@example.com    / Admin@123');
        console.log('  • Counselors  → (their email)        / Counselor@123');
        console.log('  • Students    → rollNNNN@aiims.com   / Student@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌  Migration failed:', error);
        process.exit(1);
    }
};

migrate();
