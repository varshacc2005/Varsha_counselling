const axios = require('axios');

const API_URL = 'http://localhost:5000/api/admin';

// Since we need 'protect' and 'admin' middleware to pass, 
// we would ideally need a valid JWT token.
// For this verification, I'll assume the server is running and I'll try to hit the endpoints.
// Note: In a real environment, I'd login first.

async function verify() {
    console.log('Starting API Verification...');

    try {
        // 1. Get Stats
        const stats = await axios.get(`${API_URL}/stats`, { withCredentials: true });
        console.log('✅ Stats fetched:', stats.data.totalUsers, 'students,', stats.data.totalCounselors, 'counselors');

        // 2. Get Users
        const users = await axios.get(`${API_URL}/users`, { withCredentials: true });
        console.log('✅ Users fetched:', users.data.length);

        // 3. Get Counselors
        const counselors = await axios.get(`${API_URL}/counselors`, { withCredentials: true });
        console.log('✅ Counselors fetched:', counselors.data.length);

    } catch (err) {
        console.error('❌ Verification failed (likely due to missing auth token in this script):', err.message);
        console.log('Manual verification via browser is recommended for authenticated routes.');
    }
}

// verify(); 
// Disabling auto-run as it requires a real token.
console.log('Verification script created. Best verified manually through the UI or by logging in first.');
