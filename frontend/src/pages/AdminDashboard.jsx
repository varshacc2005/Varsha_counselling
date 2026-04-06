import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/config';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
    FaUsers, FaUserTie, FaClipboardList, FaHourglassHalf, FaChartPie,
    FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaSort,
    FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight,
    FaAngleDoubleLeft, FaAngleDoubleRight, FaFilter, FaSync,
} from 'react-icons/fa';
import {
    CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell, XAxis, YAxis, BarChart, Bar,
} from 'recharts';

// API utility imported from ../api/config
const PAGE_SIZE = 10;
const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#6366f1'];

const STAT_CONFIGS = [
    { key: 'totalUsers', label: 'Total Students', icon: FaUsers, grad: ['#6366f1', '#818cf8'] },
    { key: 'totalCounselors', label: 'Total Counselors', icon: FaUserTie, grad: ['#8b5cf6', '#a78bfa'] },
    { key: 'totalBookings', label: 'Total Bookings', icon: FaClipboardList, grad: ['#10b981', '#34d399'] },
    { key: 'pendingBookings', label: 'Pending Approvals', icon: FaHourglassHalf, grad: ['#f59e0b', '#fbbf24'] },
];

// ── Reusable sort-header button ──────────────────────────────────────────────
const SortTh = ({ label, field, active, order, onClick }) => {
    const Icon = active ? (order === 'asc' ? FaSortUp : FaSortDown) : FaSort;
    return (
        <th
            onClick={() => onClick(field)}
            className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap group"
        >
            <span className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                {label}
                <Icon className={`text-xs transition-colors ${active ? 'text-indigo-500' : 'text-gray-300 group-hover:text-indigo-400'}`} />
            </span>
        </th>
    );
};

// ── Pagination bar ────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, total, limit, onPage }) => {
    if (totalPages <= 1) return null;
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-700">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="font-bold text-gray-700">{total}</span> records
            </p>
            <div className="flex items-center gap-1">
                <PagBtn icon={<FaAngleDoubleLeft />} disabled={page === 1} onClick={() => onPage(1)} />
                <PagBtn icon={<FaChevronLeft />} disabled={page === 1} onClick={() => onPage(page - 1)} />
                {pages[0] > 1 && <span className="px-2 text-gray-400 text-xs">…</span>}
                {pages.map(p => (
                    <button
                        key={p}
                        onClick={() => onPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === page
                            ? 'text-white shadow-md shadow-indigo-200'
                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                        style={p === page ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}
                    >
                        {p}
                    </button>
                ))}
                {pages[pages.length - 1] < totalPages && <span className="px-2 text-gray-400 text-xs">…</span>}
                <PagBtn icon={<FaChevronRight />} disabled={page === totalPages} onClick={() => onPage(page + 1)} />
                <PagBtn icon={<FaAngleDoubleRight />} disabled={page === totalPages} onClick={() => onPage(totalPages)} />
            </div>
        </div>
    );
};

const PagBtn = ({ icon, disabled, onClick }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
    >
        {icon}
    </button>
);

// ── Search + Filter toolbar ──────────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder, onRefresh, loading }) => (
    <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
            {value && (
                <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FaTimes className="text-xs" />
                </button>
            )}
        </div>
        <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-all text-sm shadow-sm"
        >
            <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
        </button>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
//  Main Component
// ────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { logout } = useAuth();

    // ── Overview state ────────────────────────────────────────────────────────
    const [stats, setStats] = useState({
        monthlyData: [], pendingBookings: 0, approvedBookings: 0,
        declinedBookings: 0, completedBookings: 0, counselorData: [],
    });

    // ── Students state ────────────────────────────────────────────────────────
    const [users, setUsers] = useState([]);
    const [userTotal, setUserTotal] = useState(0);
    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [userSearch, setUserSearch] = useState('');
    const [userSort, setUserSort] = useState({ field: 'createdAt', order: 'desc' });
    const [userLoading, setUserLoading] = useState(false);

    // ── Counselors state ──────────────────────────────────────────────────────
    const [counselors, setCounselors] = useState([]);
    const [counselorTotal, setCounselorTotal] = useState(0);
    const [counselorPage, setCounselorPage] = useState(1);
    const [counselorTotalPages, setCounselorTotalPages] = useState(1);
    const [counselorSearch, setCounselorSearch] = useState('');
    const [counselorSort, setCounselorSort] = useState({ field: 'createdAt', order: 'desc' });
    const [counselorLoading, setCounselorLoading] = useState(false);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('stats');
    const [showCounselorModal, setShowCounselorModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', domain: '', universityName: '', desc: '' });

    // ── Debounce search ───────────────────────────────────────────────────────
    const userSearchTimer = useRef(null);
    const counselorSearchTimer = useRef(null);

    // ─────────────────────────────── FETCH helpers ───────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) { console.error(err); }
    }, []);

    const fetchUsers = useCallback(async (page = 1, search = '', sort = { field: 'createdAt', order: 'desc' }) => {
        setUserLoading(true);
        try {
            const { data } = await api.get('/admin/users', {
                params: { page, limit: PAGE_SIZE, search, sortField: sort.field, sortOrder: sort.order },
            });
            setUsers(data.users);
            setUserTotal(data.totalUsers);
            setUserPage(data.page);
            setUserTotalPages(data.pages);
        } catch (err) { console.error(err); } finally { setUserLoading(false); }
    }, []);

    const fetchCounselors = useCallback(async (page = 1, search = '', sort = { field: 'createdAt', order: 'desc' }) => {
        setCounselorLoading(true);
        try {
            const { data } = await api.get('/admin/counselors', {
                params: { page, limit: PAGE_SIZE, search, sortField: sort.field, sortOrder: sort.order },
            });
            setCounselors(data.counselors);
            setCounselorTotal(data.totalCounselors);
            setCounselorPage(data.page);
            setCounselorTotalPages(data.pages);
        } catch (err) { console.error(err); } finally { setCounselorLoading(false); }
    }, []);

    // ─────────────────────────────── Effects ─────────────────────────────────
    useEffect(() => { fetchStats(); }, [fetchStats]);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers(userPage, userSearch, userSort);
    }, [activeTab, userPage, userSort]);   // search is debounced separately

    useEffect(() => {
        if (activeTab === 'counselors') fetchCounselors(counselorPage, counselorSearch, counselorSort);
    }, [activeTab, counselorPage, counselorSort]);

    // Debounce user search
    const handleUserSearchChange = (val) => {
        setUserSearch(val);
        setUserPage(1);
        clearTimeout(userSearchTimer.current);
        userSearchTimer.current = setTimeout(() => fetchUsers(1, val, userSort), 400);
    };

    // Debounce counselor search
    const handleCounselorSearchChange = (val) => {
        setCounselorSearch(val);
        setCounselorPage(1);
        clearTimeout(counselorSearchTimer.current);
        counselorSearchTimer.current = setTimeout(() => fetchCounselors(1, val, counselorSort), 400);
    };

    // ── Sort toggles ──────────────────────────────────────────────────────────
    const handleUserSort = (field) => {
        const newSort = { field, order: userSort.field === field && userSort.order === 'asc' ? 'desc' : 'asc' };
        setUserSort(newSort);
        setUserPage(1);
    };

    const handleCounselorSort = (field) => {
        const newSort = { field, order: counselorSort.field === field && counselorSort.order === 'asc' ? 'desc' : 'asc' };
        setCounselorSort(newSort);
        setCounselorPage(1);
    };

    // ── Tab switch ────────────────────────────────────────────────────────────
    const switchTab = (id) => {
        setActiveTab(id);
        if (id === 'users') fetchUsers(1, userSearch, userSort);
        if (id === 'counselors') fetchCounselors(1, counselorSearch, counselorSort);
    };

    // ─────────────────────────────── CRUD handlers ───────────────────────────
    const handleFormChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const resetForm = () => { setFormData({ name: '', email: '', password: '', domain: '', universityName: '', desc: '' }); setSelectedItem(null); setIsEditing(false); };

    const handleAddCounselor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/counselor', formData);
            toast.success('Counselor added!');
            setShowCounselorModal(false); resetForm();
            fetchCounselors(counselorPage, counselorSearch, counselorSort);
            fetchStats();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const handleUpdateCounselor = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/counselor/${selectedItem._id}`, { name: formData.name, email: formData.email, domain: formData.domain, universityName: formData.universityName, desc: formData.desc });
            toast.success('Counselor updated!');
            setShowCounselorModal(false); resetForm();
            fetchCounselors(counselorPage, counselorSearch, counselorSort);
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const handleDeleteCounselor = async (id) => {
        if (!window.confirm('Delete this counselor permanently?')) return;
        try {
            await api.delete(`/admin/counselor/${id}`);
            toast.success('Counselor deleted');
            fetchCounselors(counselorPage, counselorSearch, counselorSort);
            fetchStats();
        } catch { toast.error('Failed to delete'); }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/users/${selectedItem._id}`, { name: formData.name, email: formData.email });
            toast.success('Student updated!');
            setShowUserModal(false); resetForm();
            fetchUsers(userPage, userSearch, userSort);
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this student permanently?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('Student deleted');
            fetchUsers(userPage, userSearch, userSort);
            fetchStats();
        } catch { toast.error('Failed to delete'); }
    };

    const openEditCounselor = c => { setSelectedItem(c); setFormData({ name: c.name, email: c.email, domain: c.domain, universityName: c.universityName, desc: c.desc || '', password: '' }); setIsEditing(true); setShowCounselorModal(true); };
    const openEditUser = u => { setSelectedItem(u); setFormData({ name: u.name, email: u.email, password: '', domain: '', universityName: '', desc: '' }); setIsEditing(true); setShowUserModal(true); };

    // ── Pie data ─────────────────────────────────────────────────────────────
    const pieData = [
        { name: 'Pending', value: stats.pendingBookings },
        { name: 'Approved', value: stats.approvedBookings },
        { name: 'Declined', value: stats.declinedBookings },
        { name: 'Completed', value: stats.completedBookings },
    ].filter(d => d.value > 0);

    const TABS = [
        { id: 'stats', label: 'Overview', icon: FaChartPie },
        { id: 'users', label: 'Students', icon: FaUsers },
        { id: 'counselors', label: 'Counselors', icon: FaUserTie },
    ];

    // ─────────────────────────────── RENDER ──────────────────────────────────
    return (
        <div className="flex font-sans" style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#eef2ff,#f0e7ff,#e8f4fd)' }}>
            <Sidebar role="admin" />
            <div className="flex-1 ml-64 p-8 min-w-0">

                {/* ── Header ──────────────────────────────────────── */}
                <header className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Admin <span className="grad-text">Dashboard</span></h1>
                        <p className="text-gray-500 mt-1 text-sm">Real-time platform overview · manage students & counselors</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="px-3 py-1.5 rounded-xl bg-white border border-indigo-100 text-xs font-semibold text-indigo-600 shadow-sm">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* ── Tabs ────────────────────────────────────────── */}
                <div className="flex gap-2 mb-8">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => switchTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeTab === id
                                ? 'text-white shadow-lg shadow-indigo-200 scale-105'
                                : 'text-gray-600 bg-white hover:bg-indigo-50 border border-gray-200'
                                }`}
                            style={activeTab === id ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}
                        >
                            <Icon className="text-xs" /> {label}
                            {id === 'users' && userTotal > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {userTotal}
                                </span>
                            )}
                            {id === 'counselors' && counselorTotal > 0 && (
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                    {counselorTotal}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ═══════════════ OVERVIEW TAB ═══════════════════ */}
                {activeTab === 'stats' && (
                    <div className="space-y-8">
                        {/* Stat cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {STAT_CONFIGS.map(({ key, label, icon: Icon, grad }) => (
                                <div key={key} className="stat-card relative overflow-hidden">
                                    <div
                                        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6"
                                        style={{ background: `linear-gradient(135deg,${grad[0]},${grad[1]})` }}
                                    />
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md mb-4"
                                        style={{ background: `linear-gradient(135deg,${grad[0]},${grad[1]})` }}>
                                        <Icon className="text-white text-lg" />
                                    </div>
                                    <p className="text-3xl font-extrabold text-gray-900">{stats[key] || 0}</p>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="stat-card">
                                <h3 className="text-base font-bold text-gray-900 mb-6">📈 Monthly Bookings Trend</h3>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.monthlyData || []}>
                                            <defs>
                                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={3} fill="url(#colorBookings)" dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3 className="text-base font-bold text-gray-900 mb-6">🥧 Booking Status Distribution</h3>
                                <div className="h-56 flex items-center">
                                    <ResponsiveContainer width="55%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex-1 space-y-2.5">
                                        {pieData.map((d, i) => (
                                            <div key={d.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                    <span className="text-xs text-gray-600">{d.name}</span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-900">{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <h3 className="text-base font-bold text-gray-900 mb-6">🏆 Top Counselors by Bookings</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.counselorData || []} layout="vertical">
                                        <defs>
                                            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <YAxis dataKey="name" type="category" width={160} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="bookings" fill="url(#barGrad)" radius={[0, 8, 8, 0]} barSize={18} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════ STUDENTS TAB ═══════════════════ */}
                {activeTab === 'users' && (
                    <div className="stat-card overflow-hidden p-0">
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#f8f9ff,#f0f4ff)' }}>
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Student Management</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {userTotal} registered students · page {userPage} of {userTotalPages}
                                    </p>
                                </div>
                            </div>
                            <SearchBar
                                value={userSearch}
                                onChange={handleUserSearchChange}
                                placeholder="Search by name or email…"
                                onRefresh={() => fetchUsers(userPage, userSearch, userSort)}
                                loading={userLoading}
                            />
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
                                        <SortTh label="Student" field="name" active={userSort.field === 'name'} order={userSort.order} onClick={handleUserSort} />
                                        <SortTh label="Email" field="email" active={userSort.field === 'email'} order={userSort.order} onClick={handleUserSort} />
                                        <SortTh label="Joined" field="createdAt" active={userSort.field === 'createdAt'} order={userSort.order} onClick={handleUserSort} />
                                        <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {userLoading ? (
                                        [...Array(PAGE_SIZE)].map((_, i) => (
                                            <tr key={i}>
                                                {[...Array(5)].map((__, j) => (
                                                    <td key={j} className="px-5 py-4">
                                                        <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: j === 0 ? '20px' : j === 1 ? '140px' : j === 2 ? '200px' : j === 3 ? '80px' : '60px' }} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-16 text-gray-400">
                                                <FaUsers className="mx-auto text-4xl mb-3 opacity-30" />
                                                <p className="font-medium">{userSearch ? 'No students match your search.' : 'No students found.'}</p>
                                            </td>
                                        </tr>
                                    ) : users.map((u, idx) => (
                                        <tr key={u._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="px-5 py-4 text-xs text-gray-400 font-mono">
                                                {(userPage - 1) * PAGE_SIZE + idx + 1}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 text-sm">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">{u.email}</td>
                                            <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditUser(u)} title="Edit" className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors">
                                                        <FaEdit className="text-xs" />
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(u._id)} title="Delete" className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                                                        <FaTrash className="text-xs" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination
                            page={userPage}
                            totalPages={userTotalPages}
                            total={userTotal}
                            limit={PAGE_SIZE}
                            onPage={(p) => { setUserPage(p); fetchUsers(p, userSearch, userSort); }}
                        />
                    </div>
                )}

                {/* ═══════════════ COUNSELORS TAB ════════════════  */}
                {activeTab === 'counselors' && (
                    <div className="stat-card overflow-hidden p-0">
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#faf5ff,#f3e8ff)' }}>
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Counselor Management</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {counselorTotal} counselors · page {counselorPage} of {counselorTotalPages}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { resetForm(); setShowCounselorModal(true); }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:scale-105 shadow-md shadow-purple-200"
                                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}
                                >
                                    <FaPlus className="text-xs" /> Add Counselor
                                </button>
                            </div>
                            <SearchBar
                                value={counselorSearch}
                                onChange={handleCounselorSearchChange}
                                placeholder="Search by name, email, domain, or university…"
                                onRefresh={() => fetchCounselors(counselorPage, counselorSearch, counselorSort)}
                                loading={counselorLoading}
                            />
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-10">#</th>
                                        <SortTh label="Counselor" field="name" active={counselorSort.field === 'name'} order={counselorSort.order} onClick={handleCounselorSort} />
                                        <SortTh label="Domain" field="domain" active={counselorSort.field === 'domain'} order={counselorSort.order} onClick={handleCounselorSort} />
                                        <SortTh label="University" field="universityName" active={counselorSort.field === 'universityName'} order={counselorSort.order} onClick={handleCounselorSort} />
                                        <SortTh label="Exp (yrs)" field="experience" active={counselorSort.field === 'experience'} order={counselorSort.order} onClick={handleCounselorSort} />
                                        <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {counselorLoading ? (
                                        [...Array(PAGE_SIZE)].map((_, i) => (
                                            <tr key={i}>
                                                {[...Array(7)].map((__, j) => (
                                                    <td key={j} className="px-5 py-4">
                                                        <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: j === 0 ? '20px' : '100px' }} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : counselors.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-16 text-gray-400">
                                                <FaUserTie className="mx-auto text-4xl mb-3 opacity-30" />
                                                <p className="font-medium">{counselorSearch ? 'No counselors match your search.' : 'No counselors found.'}</p>
                                            </td>
                                        </tr>
                                    ) : counselors.map((c, idx) => (
                                        <tr key={c._id} className="hover:bg-purple-50/30 transition-colors group">
                                            <td className="px-5 py-4 text-xs text-gray-400 font-mono">
                                                {(counselorPage - 1) * PAGE_SIZE + idx + 1}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                                                        {c.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm leading-tight">{c.name}</p>
                                                        <p className="text-xs text-gray-400 truncate max-w-[160px]">{c.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full whitespace-nowrap">
                                                    {c.domain}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-500 max-w-[140px] truncate">{c.universityName}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                                                {c.experience > 0 ? `${c.experience} yrs` : '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                                    {c.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditCounselor(c)} title="Edit" className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors">
                                                        <FaEdit className="text-xs" />
                                                    </button>
                                                    <button onClick={() => handleDeleteCounselor(c._id)} title="Delete" className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                                                        <FaTrash className="text-xs" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination
                            page={counselorPage}
                            totalPages={counselorTotalPages}
                            total={counselorTotal}
                            limit={PAGE_SIZE}
                            onPage={(p) => { setCounselorPage(p); fetchCounselors(p, counselorSearch, counselorSort); }}
                        />
                    </div>
                )}
            </div>

            {/* ══════════ COUNSELOR MODAL ════════════════════════ */}
            {showCounselorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeInUp_0.2s_ease]">
                        <div className="p-5 flex justify-between items-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                            <h3 className="font-bold text-lg text-white">{isEditing ? '✏️ Edit Counselor' : '➕ Add New Counselor'}</h3>
                            <button onClick={() => { setShowCounselorModal(false); resetForm(); }} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={isEditing ? handleUpdateCounselor : handleAddCounselor} className="p-6 space-y-4">
                            {[
                                { field: 'name', label: 'Full Name', type: 'text' },
                                { field: 'email', label: 'Email Address', type: 'email' },
                                { field: 'domain', label: 'Specialization Domain', type: 'text' },
                                { field: 'universityName', label: 'University / Institution', type: 'text' },
                            ].map(({ field, label, type }) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input name={field} type={type} required value={formData[field]} onChange={handleFormChange}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                            ))}
                            {!isEditing && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                                    <input name="password" type="password" required value={formData.password} onChange={handleFormChange}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bio / Description</label>
                                <textarea name="desc" value={formData.desc} onChange={handleFormChange} rows={3}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none" />
                            </div>
                            <button type="submit" className="w-full py-3 rounded-2xl text-white font-bold shadow-lg hover:shadow-purple-300 hover:scale-[1.01] transition-all"
                                style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                                {isEditing ? 'Save Changes' : 'Create Counselor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════ USER MODAL ═════════════════════════════ */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-5 flex justify-between items-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                            <h3 className="font-bold text-lg text-white">✏️ Edit Student</h3>
                            <button onClick={() => { setShowUserModal(false); resetForm(); }} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            {[
                                { field: 'name', label: 'Full Name', type: 'text' },
                                { field: 'email', label: 'Email Address', type: 'email' },
                            ].map(({ field, label, type }) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input name={field} type={type} required value={formData[field]} onChange={handleFormChange}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                                </div>
                            ))}
                            <button type="submit" className="w-full py-3 rounded-2xl text-white font-bold shadow-lg hover:scale-[1.01] transition-all"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
