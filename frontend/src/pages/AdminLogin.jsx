import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/config';
import { toast } from 'react-toastify';
import { FaLock, FaEnvelope, FaUserShield, FaArrowRight } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = 'admin';
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();

    // If already logged in as admin, redirect to dashboard
    if (user?.role === 'admin') {
        return <Navigate to="/admin" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password, role });
            login(res.data);
            toast.success('Welcome back, Admin! 👋');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* ── Left Panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 flex-col justify-between p-12">
                {/* Abstract blobs */}
                <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-white opacity-5 blur-3xl"></div>
                <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaUserShield className="text-white text-lg" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">System <span className="font-light opacity-80">Administration</span></span>
                </div>

                {/* Hero content */}
                <div className="relative z-10 space-y-6">
                    <h1 className="text-5xl font-extrabold text-white leading-tight">
                        Platform<br />
                        <span className="text-indigo-400">Control Center.</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-sm leading-relaxed">
                        Manage users, monitor sessions, and oversee platform activity securely.
                    </p>
                </div>

                {/* Stats */}
                <div className="relative z-10 flex gap-8">
                    <p className="text-gray-400 text-sm">Authorized Personnel Only</p>
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="flex-1 flex items-center justify-center p-8 page-bg">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
                        <p className="mt-2 text-gray-500">Sign in to access the control center</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="email" required className="premium-input" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="password" required className="premium-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-sm bg-gray-900 shadow-lg hover:shadow-gray-500 hover:scale-[1.01] transition-all duration-200 disabled:opacity-70 mt-6"
                        >
                            {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span> : <>Sign In <FaArrowRight className="text-xs" /></>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">← Back to Main Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
