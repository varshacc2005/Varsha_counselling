import { useState, useEffect, useRef } from 'react';
import api from '../api/config';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaVideo, FaTimes, FaPaperPlane, FaCircle } from 'react-icons/fa';

const ChatComponent = ({ bookingId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [bookingId]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/chat/${bookingId}`);
            setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            await api.post(`/chat/${bookingId}`, { message: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch { toast.error('Failed to send'); }
        finally { setSending(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-lg h-[600px] flex flex-col rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#0f0f23', border: '1px solid #1e1e3a' }}>

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">💬</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">Session Chat</h3>
                            <div className="flex items-center gap-1.5">
                                <FaCircle className="text-emerald-400 text-xs animate-pulse" />
                                <span className="text-white/70 text-xs">Live session</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://meet.jit.si/varsha-session-${bookingId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                            style={{ background: 'rgba(16,185,129,0.3)', border: '1px solid rgba(16,185,129,0.5)' }}
                        >
                            <FaVideo /> Join Video
                        </a>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* ── Messages ── */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ background: '#0f0f23' }}>
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.15)' }}>
                                <span className="text-3xl">💬</span>
                            </div>
                            <p className="text-gray-400 font-medium">No messages yet</p>
                            <p className="text-gray-600 text-sm">Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg, i) => {
                        const isMe = msg.senderId === user._id;
                        return (
                            <div key={i} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {!isMe && (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
                                        {msg.senderRole?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className={`max-w-[72%] px-4 py-2.5 shadow-sm ${isMe ? 'chat-bubble-me' : 'chat-bubble-other'}`}>
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                    <p className={`text-xs mt-1 ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* ── Input ── */}
                <form onSubmit={handleSend} className="p-4 flex gap-3 items-center" style={{ background: '#0f0f23', borderTop: '1px solid #1e1e3a' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 py-3 px-4 rounded-2xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e3a' }}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                    >
                        {sending
                            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            : <FaPaperPlane className="text-white text-sm" />
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
