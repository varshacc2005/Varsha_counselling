import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/config';
import { toast } from 'react-toastify';
import { FaLock, FaEnvelope, FaUserGraduate, FaUserMd, FaArrowRight } from 'react-icons/fa';

const ROLES = [
    { id: 'student', label: 'Student', icon: FaUserGraduate, desc: 'Book sessions' },
    { id: 'counselor', label: 'Counselor', icon: FaUserMd, desc: 'Host sessions' },
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password, role });
            login(res.data);
            toast.success('Welcome back! 👋');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* ── Left Panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden grad-indigo flex-col justify-between p-12">
                {/* Abstract blobs */}
                <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-white opacity-5 blur-3xl"></div>
                <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-pink-300 opacity-10 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white opacity-10"></div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <FaUserMd className="text-indigo-600 text-lg" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">Varsha <span className="font-light opacity-80">Counseling</span></span>
                </div>

                {/* Hero content */}
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white/80 text-sm border border-white/20">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        500+ sessions completed
                    </div>
                    <h1 className="text-5xl font-extrabold text-white leading-tight">
                        Your Mind<br />
                        <span className="text-indigo-200">Deserves Care.</span>
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-sm leading-relaxed">
                        Connect with top-rated counselors from leading universities — anytime, anywhere.
                    </p>
                    {/* Testimonial card */}
                    <div className="glass-card p-5 rounded-2xl max-w-sm" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <p className="text-white/90 text-sm italic leading-relaxed">"The platform changed how I manage academic stress. Highly recommend to all students!"</p>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                            <div>
                                <p className="text-white text-xs font-semibold">Ananya S.</p>
                                <p className="text-indigo-200 text-xs">Student, IIT Delhi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 flex gap-8">
                    {[['50+', 'Counselors'], ['1200+', 'Students'], ['4.9★', 'Rating']].map(([val, lbl]) => (
                        <div key={lbl}>
                            <p className="text-2xl font-bold text-white">{val}</p>
                            <p className="text-indigo-200 text-xs">{lbl}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="flex-1 flex items-center justify-center p-8 page-bg">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Welcome back 👋</h2>
                        <p className="mt-2 text-gray-500">Sign in to your account to continue</p>
                    </div>

                    {/* Role selector */}
                    <div className="grid grid-cols-2 gap-4">
                        {ROLES.map(({ id, label, icon: Icon, desc }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setRole(id)}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${role === id
                                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                                    }`}
                            >
                                {role === id && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === id ? 'grad-indigo' : 'bg-gray-100'}`}>
                                    <Icon className={role === id ? 'text-white' : 'text-gray-500'} />
                                </div>
                                <span className={`text-xs font-bold ${role === id ? 'text-indigo-700' : 'text-gray-600'}`}>{label}</span>
                                <span className={`text-[10px] ${role === id ? 'text-indigo-400' : 'text-gray-400'}`}>{desc}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="email" required className="premium-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
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
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-sm grad-indigo shadow-lg hover:shadow-indigo-300 hover:scale-[1.01] transition-all duration-200 disabled:opacity-70"
                        >
                            {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span> : <>Sign In <FaArrowRight className="text-xs" /></>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">Create one →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
