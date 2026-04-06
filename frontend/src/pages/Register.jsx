import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/config';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaArrowRight, FaUserMd, FaShieldAlt, FaBrain } from 'react-icons/fa';

const FEATURES = [
    { icon: FaUserMd, title: 'Expert Counselors', desc: 'Top professionals from AIIMS, IITs & more' },
    { icon: FaBrain, title: 'Evidence-Based', desc: 'Therapies backed by modern psychology' },
    { icon: FaShieldAlt, title: '100% Confidential', desc: 'Your privacy is our top priority' },
];

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            login(res.data);
            toast.success('Account created! Welcome 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* ── Right form ── */}
            <div className="flex-1 flex items-center justify-center p-8 page-bg order-2 lg:order-1">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                            ✨ Free to get started
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-gray-500">Join thousands of students finding mental wellness</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="text" required className="premium-input" placeholder="Dr. Ravi Kumar" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="email" required className="premium-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="password" required className="premium-input" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <p className="text-xs text-gray-400">By registering, you agree to our Terms of Service and Privacy Policy.</p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-sm grad-indigo shadow-lg hover:shadow-indigo-300 hover:scale-[1.01] transition-all duration-200 disabled:opacity-70"
                        >
                            {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span> : <>Create Account <FaArrowRight className="text-xs" /></>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in →</Link>
                    </p>
                </div>
            </div>

            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 order-1 lg:order-2" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 100%)' }}>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600 opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-purple-500 opacity-10 blur-3xl"></div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FaUserMd className="text-white text-lg" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">Varsha <span className="text-indigo-300 font-light">Counseling</span></span>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-white leading-tight">
                            Begin Your<br />
                            <span className="grad-text" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wellness Journey</span>
                        </h2>
                        <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                            Access expert mental health support from India's top institutions.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="space-y-4">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.3)' }}>
                                    <Icon className="text-indigo-300" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{title}</p>
                                    <p className="text-gray-400 text-xs">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom trust indicators */}
                <div className="relative z-10">
                    <p className="text-gray-500 text-xs mb-3">Trusted by students from</p>
                    <div className="flex flex-wrap gap-2">
                        {['AIIMS Delhi', 'IIT Bombay', 'IIT Delhi', 'BITS Pilani'].map(inst => (
                            <span key={inst} className="px-3 py-1 rounded-full text-xs text-gray-300" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>{inst}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
