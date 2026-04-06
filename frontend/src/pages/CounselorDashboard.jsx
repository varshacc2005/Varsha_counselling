import { useState, useEffect } from 'react';
import api from '../api/config';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ChatComponent from '../components/ChatComponent';
import Sidebar from '../components/Sidebar';
import { FaCalendarPlus, FaCheck, FaTimes, FaCommentDots, FaUserEdit, FaSave, FaListAlt, FaChartLine, FaClock, FaVideo } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const STATUS_COLORS = { approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }, pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' }, declined: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400' } };

const CounselorDashboard = ({ defaultTab = 'bookings' }) => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState(30);
    const [profile, setProfile] = useState({ name: '', desc: '', domain: '', universityName: '', experience: 0, price: 0, skills: '', services: '', languages: '', photo: '' });
    const [showChat, setShowChat] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        fetchBookings();
        if (user) {
            setProfile({
                name: user.name || '', desc: user.desc || '', domain: user.domain || '', universityName: user.universityName || '',
                experience: user.experience || 0, price: user.price || 0,
                skills: user.skills?.join(', ') || '', services: user.services?.join(', ') || '',
                languages: user.languages?.join(', ') || '', photo: user.photo || ''
            });
        }
    }, [user]);

    const fetchBookings = async () => {
        try { const res = await api.get('/counselor/bookings'); setBookings(res.data); }
        catch (err) { console.error(err); }
    };
    const handleStatusUpdate = async (id, status) => {
        try { await api.put(`/counselor/bookings/${id}`, { status }); toast.success(`Booking ${status}!`); fetchBookings(); }
        catch { toast.error('Failed'); }
    };
    const handleAddSlot = async (e) => {
        e.preventDefault();
        try { await api.post('/counselor/slots', { startDate, endDate, startTime, endTime, duration }); toast.success('Slots generated!'); setStartDate(''); setEndDate(''); setStartTime(''); setEndTime(''); }
        catch { toast.error('Failed to add slots'); }
    };
    const handleProfileUpdate = async (e) => {
        e.preventDefault(); setSavingProfile(true);
        try {
            const updated = { ...profile, skills: profile.skills.split(',').map(s => s.trim()), services: profile.services.split(',').map(s => s.trim()), languages: profile.languages.split(',').map(s => s.trim()) };
            await api.put('/counselor/profile', updated);
            toast.success('Profile saved!');
        } catch { toast.error('Failed'); }
        finally { setSavingProfile(false); }
    };

    const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, i) => ({
        name, sessions: bookings.filter(b => new Date(b.slot?.date).getDay() === (i + 1) % 7).length
    }));
    const statusPie = [
        { name: 'Approved', value: bookings.filter(b => b.status === 'approved').length, color: '#10b981' },
        { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
        { name: 'Declined', value: bookings.filter(b => b.status === 'declined').length, color: '#ef4444' },
    ].filter(d => d.value > 0);

    const TABS = [
        { id: 'bookings', label: 'Bookings', icon: FaListAlt },
        { id: 'analytics', label: 'Analytics', icon: FaChartLine },
        { id: 'slots', label: 'Availability', icon: FaCalendarPlus },
        { id: 'profile', label: 'Profile', icon: FaUserEdit },
    ];

    return (
        <div className="flex font-sans" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#eef2ff,#f0e7ff,#e8f4fd)' }}>
            <Sidebar role="counselor" />
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Hello, <span className="grad-text">{user?.name}</span> 👋</h1>
                    <p className="text-gray-500 mt-1">Manage your sessions and track your impact</p>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeTab === id ? 'text-white shadow-lg shadow-indigo-200 scale-105' : 'text-gray-600 bg-white hover:bg-indigo-50 border border-gray-200'}`}
                            style={activeTab === id ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
                            <Icon className="text-xs" /> {label}
                        </button>
                    ))}
                </div>

                {/* ── Bookings ── */}
                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        {bookings.length === 0 && (
                            <div className="stat-card flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-4 text-4xl">📅</div>
                                <p className="text-gray-500 font-medium">No bookings yet</p>
                                <p className="text-gray-400 text-sm">Students will appear here when they book sessions</p>
                            </div>
                        )}
                        {bookings.map(b => {
                            const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                            return (
                                <div key={b._id} className="stat-card p-5">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {b.studentId?.name?.charAt(0) || 'S'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{b.studentId?.name}</h4>
                                                <p className="text-sm text-gray-500">{b.studentId?.email}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <FaClock className="text-indigo-400" />
                                                    {new Date(b.slot?.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    {' · '}
                                                    {b.slot?.startTime} – {b.slot?.endTime}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                                {b.status}
                                            </span>
                                            {b.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStatusUpdate(b._id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all hover:scale-105 shadow-sm shadow-emerald-200">
                                                        <FaCheck /> Approve
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(b._id, 'declined')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all">
                                                        <FaTimes /> Decline
                                                    </button>
                                                </div>
                                            )}
                                            {b.status === 'approved' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setSelectedBookingId(b._id); setShowChat(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all">
                                                        <FaCommentDots /> Chat
                                                    </button>
                                                    <a href={`https://meet.jit.si/varsha-session-${b._id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:scale-105 shadow-sm" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                                                        <FaVideo /> Join Video
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Analytics ── */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Total Sessions', value: bookings.length, icon: '📋', color: 'from-indigo-500 to-purple-600' },
                                { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length, icon: '✅', color: 'from-emerald-500 to-teal-600' },
                                { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: '⏳', color: 'from-amber-500 to-orange-500' },
                            ].map(({ label, value, icon, color }) => (
                                <div key={label} className={`rounded-3xl p-6 bg-gradient-to-br ${color} text-white shadow-lg`}>
                                    <div className="text-3xl mb-2">{icon}</div>
                                    <p className="text-4xl font-extrabold">{value}</p>
                                    <p className="text-white/80 text-sm mt-1">{label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="stat-card">
                                <h3 className="font-bold text-gray-900 mb-6">📅 Weekly Session Activity</h3>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyData}>
                                            <defs>
                                                <linearGradient id="wkGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="sessions" fill="url(#wkGrad)" radius={[6, 6, 0, 0]} barSize={28} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="stat-card">
                                <h3 className="font-bold text-gray-900 mb-6">🥧 Session Status Breakdown</h3>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={statusPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                                {statusPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                            <Legend formatter={v => <span style={{ fontSize: 12, color: '#6b7280' }}>{v}</span>} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Availability ── */}
                {activeTab === 'slots' && (
                    <div className="max-w-lg">
                        <div className="stat-card">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                    <FaCalendarPlus className="text-white text-xs" />
                                </div>
                                Set Availability
                            </h3>
                            <form onSubmit={handleAddSlot} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {[['Start Date', startDate, setStartDate], ['End Date', endDate, setEndDate]].map(([label, val, setter]) => (
                                        <div key={label}>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                            <input type="date" required value={val} onChange={e => setter(e.target.value)} className="premium-input" style={{ paddingLeft: '16px' }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[['Start Time', startTime, setStartTime], ['End Time', endTime, setEndTime]].map(([label, val, setter]) => (
                                        <div key={label}>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                            <input type="time" required value={val} onChange={e => setter(e.target.value)} className="premium-input" style={{ paddingLeft: '16px' }} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Session Duration</label>
                                    <select value={duration} onChange={e => setDuration(e.target.value)} className="premium-input" style={{ paddingLeft: '16px' }}>
                                        {[['15 Minutes', 15], ['30 Minutes', 30], ['45 Minutes', 45], ['1 Hour', 60]].map(([l, v]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.01] transition-all" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                    <FaCalendarPlus /> Generate Slots
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Profile ── */}
                {activeTab === 'profile' && (
                    <div className="max-w-3xl">
                        <div className="stat-card">
                            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                    <FaUserEdit className="text-white" />
                                </div>
                                Edit Your Profile
                            </h3>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {[
                                        { label: 'Full Name', key: 'name', type: 'text' },
                                        { label: 'Domain', key: 'domain', type: 'text' },
                                        { label: 'University Name', key: 'universityName', type: 'text' },
                                        { label: 'Experience (yrs)', key: 'experience', type: 'number' },
                                        { label: 'Session Price (₹)', key: 'price', type: 'number' },
                                        { label: 'Photo URL', key: 'photo', type: 'text' },
                                    ].map(({ label, key, type }) => (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                            <input type={type} className="premium-input" style={{ paddingLeft: '16px' }} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea rows={4} className="premium-input" style={{ paddingLeft: '16px', resize: 'none' }} value={profile.desc} onChange={e => setProfile({ ...profile, desc: e.target.value })} />
                                </div>
                                {[['Skills (comma separated)', 'skills'], ['Services Offered (comma separated)', 'services'], ['Languages (comma separated)', 'languages']].map(([label, key]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                        <input type="text" className="premium-input" style={{ paddingLeft: '16px' }} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} />
                                    </div>
                                ))}
                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button type="submit" disabled={savingProfile} className="flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                        {savingProfile ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <FaSave />}
                                        Save Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            {showChat && selectedBookingId && <ChatComponent bookingId={selectedBookingId} onClose={() => setShowChat(false)} />}
        </div>
    );
};

export default CounselorDashboard;
