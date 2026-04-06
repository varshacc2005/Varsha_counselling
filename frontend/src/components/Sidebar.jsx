import { Link, useLocation } from 'react-router-dom';
import { FaUserMd, FaUserGraduate, FaUserShield, FaSignOutAlt, FaChartPie, FaCalendarAlt, FaUser, FaSearch, FaChartLine, FaCalendarPlus, FaUsers, FaUserTie } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const links = {
        student: [
            { path: '/dashboard', label: 'Find Counselors', icon: FaSearch },
            { path: '/my-bookings', label: 'My Bookings', icon: FaCalendarAlt },
        ],
        counselor: [
            { path: '/counselor', label: 'Dashboard', icon: FaChartPie },
            { path: '/counselor/profile', label: 'My Profile', icon: FaUser },
            { path: '/counselor/analytics', label: 'Analytics', icon: FaChartLine },
            { path: '/counselor/slots', label: 'Set Availability', icon: FaCalendarPlus },
        ],
        admin: [
            { path: '/admin', label: 'Overview', icon: FaChartPie },
            { path: '/admin/students', label: 'Students', icon: FaUsers },
            { path: '/admin/counselors', label: 'Counselors', icon: FaUserTie },
        ]
    };

    const currentLinks = links[role] || [];

    const RoleIcon = role === 'admin' ? FaUserShield : role === 'counselor' ? FaUserMd : FaUserGraduate;

    const roleColors = {
        student: 'from-indigo-500 to-purple-600',
        counselor: 'from-emerald-500 to-teal-600',
        admin: 'from-orange-500 to-red-500',
    };

    return (
        <div className="sidebar-dark w-64 min-h-screen flex flex-col fixed left-0 top-0 z-40">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: '#1e1e3a' }}>
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-lg`}>
                        <RoleIcon className="text-white text-sm" />
                    </div>
                    <span className="text-white font-bold text-base tracking-tight">
                        Varsha <span className="text-indigo-400 font-normal">Platform</span>
                    </span>
                </div>
            </div>

            {/* User card */}
            <div className="p-4">
                <div className="p-3 rounded-2xl mb-6" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                <p className="text-indigo-300 text-xs capitalize">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#4a4a7a' }}>Navigation</p>
                    {currentLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`sidebar-link flex items-center gap-3 px-4 py-3 text-sm font-medium ${active ? 'active' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                                    <Icon className={`text-sm ${active ? 'text-white' : 'text-indigo-400'}`} />
                                </div>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom */}
            <div className="mt-auto p-4">
                {/* Upgrade hint for students */}
                {role === 'student' && (
                    <div className="p-4 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <HiSparkles className="text-yellow-400" />
                            <span className="text-white text-xs font-bold">Book a Session</span>
                        </div>
                        <p className="text-indigo-200 text-xs">Find your counselor and book a session today.</p>
                    </div>
                )}

                <div className="border-t pt-4" style={{ borderColor: '#1e1e3a' }}>
                    <button
                        onClick={logout}
                        className="sidebar-link flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        style={{ borderRadius: '10px' }}
                    >
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <FaSignOutAlt className="text-sm text-red-400" />
                        </div>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
