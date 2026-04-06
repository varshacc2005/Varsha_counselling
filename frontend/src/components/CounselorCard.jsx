import { FaStar, FaLanguage, FaBriefcase, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

const DOMAIN_COLORS = {
    'Clinical Psychology': 'bg-purple-100 text-purple-700',
    'Substance Use': 'bg-orange-100 text-orange-700',
    'Psycho-oncology': 'bg-rose-100 text-rose-700',
    'Rehabilitation': 'bg-teal-100 text-teal-700',
    default: 'bg-indigo-100 text-indigo-700',
};

const CounselorCard = ({ counselor, onSelect, isSelected }) => {
    const domainClass = DOMAIN_COLORS[counselor.domain] || DOMAIN_COLORS.default;

    return (
        <div
            onClick={() => onSelect(counselor)}
            className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${isSelected
                    ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-100'
                    : 'hover:shadow-lg hover:-translate-y-1 shadow-sm'
                }`}
            style={{
                background: isSelected
                    ? 'linear-gradient(135deg, #eef2ff, #f5f3ff)'
                    : '#fff',
                border: isSelected ? '2px solid #6366f1' : '1.5px solid #f1f5f9',
            }}
        >
            <div className="p-4">
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={counselor.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt={counselor.name}
                            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                            style={{ border: isSelected ? '2px solid #a5b4fc' : '2px solid #f1f5f9' }}
                        />
                        {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-white text-xs" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{counselor.name}</h3>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${domainClass}`}>
                                    {counselor.domain || 'General'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
                                <FaStar className="text-amber-400 text-xs" />
                                <span className="text-xs font-bold text-amber-700">4.9</span>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                            {counselor.experience > 0 && (
                                <span className="flex items-center gap-1">
                                    <FaBriefcase className="text-gray-400" />
                                    {counselor.experience}y exp
                                </span>
                            )}
                            {counselor.languages?.length > 0 && (
                                <span className="flex items-center gap-1">
                                    <FaLanguage className="text-gray-400" />
                                    {counselor.languages[0]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                {counselor.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {counselor.skills.slice(0, 2).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                                {skill}
                            </span>
                        ))}
                        {counselor.skills.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
                                +{counselor.skills.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* University */}
                {counselor.universityName && (
                    <p className="mt-2 text-xs text-gray-400 truncate">🏛 {counselor.universityName}</p>
                )}
            </div>

            {/* Select bar at bottom */}
            <div className={`h-1 w-full transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-transparent'}`}></div>
        </div>
    );
};

export default CounselorCard;
