const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();

// connectDB(); // Removed to avoid duplicate call

const app = express();

app.set('trust proxy', 1); // Trust the first proxy (Render) for secure cookies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://varsha-counselling.vercel.app'
];
if (process.env.FRONTEND_URL) {
    origins.push(...process.env.FRONTEND_URL.split(',').map(u => u.trim()));
}

app.use(cors({
    origin: origins,
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/chat', chatRoutes);


const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
};

startServer();
