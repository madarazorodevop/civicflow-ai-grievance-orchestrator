'use client';
import { useState, useRef, useEffect } from 'react';
import { useLangStore } from '@/lib/store';
import api from '@/lib/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function AiChatPage() {
  const lang = useLangStore(s => s.lang);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting = lang === 'ta' 
    ? "வணக்கம்! நான் உங்கள் சிவிக்ஃப்ளோ ஏஐ உதவியாளர். உங்கள் பகுதியின் பொது பிரச்சினைகள், மாநகராட்சி திட்டங்கள் அல்லது குறைகள் குறித்து நீங்கள் என்னிடம் கேட்கலாம்." 
    : "Hello! I am your CivicFlow AI Assistant. You can ask me questions about public problems, municipal corporations, grievances, and civic duties in Tamil Nadu.";

  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'system', 
      content: 'You are CivicBot, an intelligent and highly helpful AI assistant for citizens in Tamil Nadu, India. Your expertise covers public infrastructure, municipal corporations (like Chennai, Madurai, Coimbatore, etc.), grievance redressal procedures, public health, and civil duties. You must be concise, extremely accurate, polite, and helpful. Answer in the language the user speaks to you.' 
    },
    { role: 'assistant', content: initialGreeting }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post('/chat/', {
        messages: newMessages
      });

      const data = res.data;
      
      if (data && data.content) {
        setMessages([...newMessages, data]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (e) {
      console.error(e);
      setMessages([...newMessages, { role: 'assistant', content: lang === 'ta' ? 'மன்னிக்கவும், ஏதோ பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.' : 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 border-b border-white/10 flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-full shadow-lg">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{lang === 'ta' ? 'ஏஐ குடிமக்கள் உதவியாளர்' : 'AI Citizen Assistant'}</h1>
          <p className="text-blue-200 text-sm font-light">Powered by Free Open Source AI</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.filter(m => m.role !== 'system').map((m, idx) => (
          <div key={idx} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 p-2 rounded-full shadow-md ${m.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
              {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg overflow-x-auto ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/10 text-gray-100 border border-white/10 rounded-tl-none'
            }`}>
              <div className={`prose prose-sm md:prose-base max-w-none ${m.role === 'user' ? 'prose-invert text-white' : 'prose-invert text-gray-100'}`}>
                {m.role === 'user' ? (
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-2 rounded-full shadow-md bg-indigo-600">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-300 animate-spin" />
              <span className="text-gray-300 text-sm font-medium">Generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={lang === 'ta' ? 'உங்கள் கேள்வியைத் தட்டச்சு செய்க...' : 'Type your civic question here...'}
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
