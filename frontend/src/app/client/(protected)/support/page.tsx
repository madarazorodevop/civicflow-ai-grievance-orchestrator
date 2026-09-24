'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, User as UserIcon, Shield } from 'lucide-react';

export default function ClientSupportPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      await api.post('/support/', { message: msg });
      toast.success('Message sent to Admin!');
      setMsg('');
      fetchMessages();
    } catch {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-black/20">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><UserIcon className="w-8 h-8 text-blue-400" /> Customer Support</h1>
        <p className="text-gray-300 mt-2">Send a message directly to the administrators.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse">
        {messages.map(m => (
          <div key={m.id} className="flex flex-col gap-2 w-full animate-fade-in-up">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                <p>{m.message}</p>
                <span className="text-xs text-blue-200 mt-2 block">{new Date(m.created_at).toLocaleString()}</span>
              </div>
            </div>
            {m.admin_reply && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 text-white p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs"><Shield className="w-4 h-4"/> ADMIN REPLY</div>
                  <p>{m.admin_reply}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-black/20 border-t border-white/10">
        <form onSubmit={submit} className="flex gap-4">
          <input
            type="text"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Type your message to the admin..."
            className="flex-1 p-4 rounded-xl bg-black/40 border border-white/20 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
          />
          <button type="submit" disabled={!msg.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25">
            <Send className="w-5 h-5"/> Send
          </button>
        </form>
      </div>
    </div>
  );
}
