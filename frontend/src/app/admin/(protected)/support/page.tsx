'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, Shield, User as UserIcon } from 'lucide-react';

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/support/');
      setMessages(res.data);
    } catch {
      toast.error('Failed to load support messages');
    }
  };

  const submitReply = async (id: number) => {
    const reply = replyInput[id];
    if (!reply?.trim()) return;
    try {
      await api.post(`/support/${id}/reply`, { admin_reply: reply });
      toast.success('Reply sent!');
      setReplyInput(prev => ({...prev, [id]: ''}));
      fetchMessages();
    } catch {
      toast.error('Failed to send reply');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-black/20">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><Shield className="w-8 h-8 text-indigo-400" /> Support Inbox</h1>
        <p className="text-gray-300 mt-2">Manage and respond to client support requests.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(m => (
          <div key={m.id} className="bg-black/30 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <UserIcon className="w-5 h-5"/>
              </div>
              <div>
                <p className="text-white font-bold">User #{m.user_id}</p>
                <p className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            <p className="text-gray-200 text-lg bg-white/5 p-4 rounded-xl border border-white/5 mb-6">{m.message}</p>
            
            {m.admin_reply ? (
              <div className="bg-indigo-900/40 border border-indigo-500/30 p-4 rounded-xl mt-4">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-2"><Shield className="w-4 h-4"/> You replied:</div>
                <p className="text-indigo-100">{m.admin_reply}</p>
              </div>
            ) : (
              <div className="flex gap-4 mt-4">
                <input
                  type="text"
                  value={replyInput[m.id] || ''}
                  onChange={e => setReplyInput(prev => ({...prev, [m.id]: e.target.value}))}
                  placeholder="Type your reply to the user..."
                  className="flex-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button 
                  onClick={() => submitReply(m.id)}
                  disabled={!replyInput[m.id]?.trim()} 
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4"/> Send Reply
                </button>
              </div>
            )}
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Shield className="w-12 h-12 mb-4 opacity-50"/>
            <p>No support messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
