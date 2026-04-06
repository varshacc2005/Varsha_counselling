import { FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: 'fadeInScale 0.2s ease' }}>
                {/* Icon header */}
                <div className={`p-8 flex flex-col items-center text-center`} style={{ background: isDanger ? 'linear-gradient(135deg,#fef2f2,#fff7f7)' : 'linear-gradient(135deg,#eef2ff,#f5f3ff)' }}>
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 text-2xl shadow-md`}
                        style={{ background: isDanger ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        {isDanger
                            ? <FaExclamationTriangle className="text-white text-xl" />
                            : <FaCalendarCheck className="text-white text-xl" />
                        }
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="p-5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
                        style={{ background: isDanger ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
