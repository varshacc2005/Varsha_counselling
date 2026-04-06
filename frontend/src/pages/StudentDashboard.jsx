import { useState, useEffect } from 'react';
import api from '../api/config';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ChatComponent from '../components/ChatComponent';
import Sidebar from '../components/Sidebar';
import CounselorCard from '../components/CounselorCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaCommentDots, FaChartBar, FaVideo, FaTimesCircle } from 'react-icons/fa';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StudentDashboard = ({ defaultTab = 'find-counselors' }) => {
    const { user } = useAuth();
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [myBookings, setMyBookings] = useState([]);
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSkill, setFilterSkill] = useState('');
    const [filterLanguage, setFilterLanguage] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelBookingId, setCancelBookingId] = useState(null);

    useEffect(() => { fetchCounselors(); fetchMyBookings(); }, []);
    useEffect(() => {
        if (selectedCounselor && filterDate) handleSelectCounselor(selectedCounselor);
    }, [filterDate]);

    const fetchCounselors = async () => {
        try { const res = await api.get('/student/counselors'); setCounselors(res.data); }
        catch (err) { console.error(err); }
    };
    const fetchMyBookings = async () => {
        try { const res = await api.get('/student/bookings'); setMyBookings(res.data); }
        catch (err) { console.error(err); }
    };
    const handleSelectCounselor = async (counselor) => {
        setSelectedCounselor(counselor);
        try {
            const url = filterDate
                ? `/student/counselors/${counselor._id}/slots?date=${filterDate}`
                : `/student/counselors/${counselor._id}/slots`;
            const res = await api.get(url);
            setSlots(res.data);
        } catch (err) { console.error(err); setSlots([]); }
    };
    const initiateBooking = (slot) => { setSelectedSlot(slot); setIsModalOpen(true); };
    const confirmBooking = async () => {
        setIsModalOpen(false);
        try { await api.post('/student/bookings', { counselorId: selectedCounselor._id, slotId: selectedSlot._id }); toast.success('Booking requested!'); fetchMyBookings(); setSelectedSlot(null); }
        catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };
    const openChat = (bookingId) => { setSelectedBookingId(bookingId); setShowChat(true); };

    const initiateCancel = (bookingId) => { setCancelBookingId(bookingId); setCancelModalOpen(true); };
    const confirmCancel = async () => {
        setCancelModalOpen(false);
        try {
            await api.put(`/student/bookings/${cancelBookingId}/cancel`, {});
            toast.success('Booking cancelled successfully!');
            fetchMyBookings();
            // Refresh slots if the counselor is selected so freed slot reappears
            if (selectedCounselor) handleSelectCounselor(selectedCounselor);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelBookingId(null);
        }
    };

    const allSkills = [...new Set(counselors.flatMap(c => c.skills || []))];
    const allLanguages = [...new Set(counselors.flatMap(c => c.languages || []))];
    const filteredCounselors = counselors.filter(c => {
        const nm = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const sk = !filterSkill || c.skills?.includes(filterSkill);
        const lng = !filterLanguage || c.languages?.includes(filterLanguage);
        return nm && sk && lng;
    });

    const domainPieData = Object.entries(
        myBookings.reduce((acc, b) => { const d = b.counselorId?.domain || 'General'; acc[d] = (acc[d] || 0) + 1; return acc; }, {})
    ).map(([name, value]) => ({ name, value }));

    const STATUS_CONFIG = {
        approved: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e', label: 'Approved' },
        pending: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Pending' },
        declined: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', dot: '#ef4444', label: 'Declined' },
        cancelled: { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db', dot: '#9ca3af', label: 'Cancelled' },
        completed: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6', label: 'Completed' },
    };

    const TABS = [
        { id: 'find-counselors', label: 'Find Counselors', icon: FaSearch },
        { id: 'my-bookings', label: 'My Bookings', icon: FaCalendarAlt },
    ];

    return (
        <div className="flex font-sans" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#eef2ff,#f0e7ff,#e8f4fd)' }}>
            <Sidebar role="student" />
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Hello, <span className="grad-text">{user?.name}</span> 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Find the perfect counselor for your needs</p>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeTab === id ? 'text-white shadow-lg shadow-indigo-200 scale-105' : 'text-gray-600 bg-white hover:bg-indigo-50 border border-gray-200'}`}
                            style={activeTab === id ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
                            <Icon className="text-xs" /> {label}
                        </button>
                    ))}
                </div>

                {/* ── Find Counselors ── */}
                {activeTab === 'find-counselors' && (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* List */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Search + Filters */}
                            <div className="stat-card p-4 space-y-3">
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input type="text" placeholder="Search by name..." className="premium-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[['All Skills', allSkills, filterSkill, setFilterSkill], ['All Languages', allLanguages, filterLanguage, setFilterLanguage]].map(([placeholder, opts, val, setter]) => (
                                        <div className="relative" key={placeholder}>
                                            <select className="premium-input text-sm appearance-none" style={{ paddingLeft: '12px' }} value={val} onChange={e => setter(e.target.value)}>
                                                <option value="">{placeholder}</option>
                                                {opts.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                            <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                {filteredCounselors.map(c => (
                                    <CounselorCard key={c._id} counselor={c} onSelect={handleSelectCounselor} isSelected={selectedCounselor?._id === c._id} />
                                ))}
                                {filteredCounselors.length === 0 && (
                                    <div className="stat-card text-center py-12 text-gray-400">
                                        <div className="text-4xl mb-3">🔍</div>
                                        <p className="font-medium">No counselors found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detail */}
                        <div className="lg:col-span-7">
                            <div className="stat-card min-h-[500px] p-8">
                                {selectedCounselor ? (
                                    <>
                                        <div className="flex gap-5 mb-8">
                                            <img
                                                src={selectedCounselor.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                alt={selectedCounselor.name}
                                                className="w-24 h-24 rounded-3xl object-cover shadow-md"
                                                style={{ border: '3px solid #c7d2fe' }}
                                            />
                                            <div>
                                                <h2 className="text-2xl font-extrabold text-gray-900">{selectedCounselor.name}</h2>
                                                <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">{selectedCounselor.domain}</span>
                                                {selectedCounselor.universityName && <p className="text-sm text-gray-500 mt-2">🏛 {selectedCounselor.universityName}</p>}
                                                <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-md">{selectedCounselor.desc || 'Expert counselor ready to help.'}</p>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {selectedCounselor.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {selectedCounselor.skills.map((s, i) => (
                                                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{s}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="border-t border-gray-100 pt-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                    <FaCalendarAlt className="text-indigo-500" /> Available Slots
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 font-medium">Filter date:</span>
                                                    <input type="date" className="text-xs border border-gray-200 rounded-xl p-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                                                </div>
                                            </div>
                                            {slots.length > 0 ? (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {slots.map(slot => (
                                                        <button key={slot._id} onClick={() => initiateBooking(slot)} className="slot-pill p-3 flex flex-col items-center gap-1">
                                                            <span className="text-xs font-semibold opacity-80">
                                                                {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-sm font-bold">{slot.startTime}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                                                    <p className="text-gray-400 text-sm">No slots available</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 text-5xl float-anim">
                                            🧠
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700">Select a Counselor</h3>
                                        <p className="text-gray-400 text-sm mt-2">Choose a counselor from the list to view their availability</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── My Bookings ── */}
                {activeTab === 'my-bookings' && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: 'Total Booked', value: myBookings.length, color: 'from-indigo-500 to-purple-600', icon: '📋' },
                                { label: 'Approved', value: myBookings.filter(b => b.status === 'approved').length, color: 'from-emerald-500 to-teal-600', icon: '✅' },
                                { label: 'Pending', value: myBookings.filter(b => b.status === 'pending').length, color: 'from-amber-500 to-orange-500', icon: '⏳' },
                                { label: 'Upcoming', value: myBookings.filter(b => b.status === 'approved' && new Date(b.slot?.date) >= new Date()).length, color: 'from-blue-500 to-cyan-600', icon: '📅' },
                            ].map(({ label, value, color, icon }) => (
                                <div key={label} className={`rounded-3xl p-5 bg-gradient-to-br ${color} text-white shadow-lg`}>
                                    <div className="text-2xl mb-1">{icon}</div>
                                    <p className="text-3xl font-extrabold">{value}</p>
                                    <p className="text-white/80 text-xs mt-1">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Pie chart */}
                            <div className="stat-card">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                                    <FaChartBar className="text-indigo-500" /> Focus Areas
                                </h3>
                                {domainPieData.length > 0 ? (
                                    <>
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={domainPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
                                                        {domainPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-2 space-y-2">
                                            {domainPieData.map(({ name, value }, i) => (
                                                <div key={name} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></div><span className="text-gray-600">{name}</span></div>
                                                    <span className="font-bold text-gray-900">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Book sessions to see stats</div>
                                )}
                            </div>

                            {/* Bookings list */}
                            <div className="lg:col-span-2 stat-card p-0 overflow-hidden">
                                <div className="p-5 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900">Your Sessions</h3>
                                </div>
                                <ul className="divide-y divide-gray-50">
                                    {myBookings.length === 0 && (
                                        <li className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="text-4xl mb-3">📭</div>
                                            <p className="text-gray-500 font-medium">No bookings yet</p>
                                            <p className="text-gray-400 text-sm">Find a counselor and book a session</p>
                                        </li>
                                    )}
                                    {myBookings.map(b => {
                                        const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                                        return (
                                            <li key={b._id} className="p-5 hover:bg-gray-50/50 transition-colors">
                                                <div className="flex items-center justify-between flex-wrap gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={b.counselorId?.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                            alt="" className="w-11 h-11 rounded-2xl object-cover bg-gray-100"
                                                            style={{ border: '2px solid #e0e7ff' }}
                                                        />
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-sm">{b.counselorId?.name || 'Counselor'}</h4>
                                                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                                                                <FaClock className="text-indigo-400" />
                                                                {new Date(b.slot?.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                {' · '}{b.slot?.startTime}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                                                            style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }}></span>
                                                            {sc.label}
                                                        </span>
                                                        {b.status === 'approved' && (
                                                            <div className="flex gap-1.5">
                                                                <button onClick={() => openChat(b._id)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all">
                                                                    <FaCommentDots /> Chat
                                                                </button>
                                                                <a href={`https://meet.jit.si/varsha-session-${b._id}`} target="_blank" rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition-all hover:scale-105 shadow-sm"
                                                                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                                                                    <FaVideo /> Video
                                                                </a>
                                                                <button
                                                                    onClick={() => initiateCancel(b._id)}
                                                                    title="Cancel booking"
                                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all">
                                                                    <FaTimesCircle /> Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                        {b.status === 'pending' && (
                                                            <button
                                                                onClick={() => initiateCancel(b._id)}
                                                                title="Cancel booking"
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all">
                                                                <FaTimesCircle /> Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmBooking}
                title="Confirm Booking"
                message={`Book a session with ${selectedCounselor?.name} on ${selectedSlot ? new Date(selectedSlot.date).toLocaleDateString() : ''} at ${selectedSlot?.startTime}?`}
                confirmText="Yes, Book It"
            />
            <ConfirmationModal
                isOpen={cancelModalOpen}
                onClose={() => { setCancelModalOpen(false); setCancelBookingId(null); }}
                onConfirm={confirmCancel}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? The slot will be freed and become available again."
                confirmText="Yes, Cancel It"
                isDanger={true}
            />
            {showChat && selectedBookingId && <ChatComponent bookingId={selectedBookingId} onClose={() => setShowChat(false)} />}
        </div>
    );
};

export default StudentDashboard;
