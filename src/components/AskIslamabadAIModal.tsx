import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Compass,
  ArrowRight,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  isGrounded?: boolean;
}

interface AskIslamabadAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskIslamabadAIModal: React.FC<AskIslamabadAIModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `**اسلام علیکم! Welcome to Ask Islamabad AI Assistant.**
I am your smart local guide for Islamabad, Pakistan. I can assist you with:

• **Government & Public Services** (e.g. NADRA CNIC 24/7, Passports at DGIP G-8, CDA procedures, Vehicle registration)
• **Universities & Admissions** (NUST, QAU, FAST, COMSATS, Bahria, Air)
• **Hospitals & Emergency Numbers** (PIMS, Shifa, Maroof, Rescue 1122, Police 15)
• **Metro Bus Transit & Airport Routes** (Red Line, Orange Line to Airport)
• **Tourism & Hiking** (Faisal Mosque, Daman-e-Koh, Trail 3 & 5, Lok Virsa)
• **Shopping & Best Food Spots** (Savour Foods, Monal, Centaurus, Karachi Company)

What would you like to know about Islamabad today?`,
      time: 'Just now',
      isGrounded: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'How can I get a passport in Islamabad?',
    'Which universities offer computer science?',
    'How can I reach Blue Area from Islamabad Airport?',
    'What are the emergency numbers in Islamabad?',
    'Where is the 24/7 NADRA Mega Center located?',
    'Which hiking trail is best for families in Margalla Hills?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      const data = await res.json();
      if (data.success && data.answer) {
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isGrounded: data.grounded
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('No answer received');
      }
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting to the intelligence server right now. However, you can find verified information directly using our **Directory Search** or call the Islamabad emergency helpline **15** or CDA helpline **1819**.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full h-[88vh] max-h-[800px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Ask Islamabad AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700/80 text-[10px] uppercase font-bold text-emerald-200 border border-emerald-500/40">
                  Grounded in Verified Data
                </span>
              </div>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-0.5">
                <span>Direct answers for city services, metro, universities & hospitals</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggested Prompts Pill Strip */}
        <div className="bg-emerald-50/60 border-b border-emerald-100 p-2.5 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-emerald-900 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Try asking:
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/50 text-slate-700 font-medium whitespace-nowrap transition-all cursor-pointer shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isAsst = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isAsst ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                    isAsst 
                      ? 'bg-gradient-to-tr from-emerald-800 to-emerald-600' 
                      : 'bg-slate-800'
                  }`}
                >
                  {isAsst ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 shadow-xs relative group ${
                    isAsst
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap space-y-2">
                    {m.content}
                  </div>

                  <div className={`flex items-center justify-between gap-4 mt-2 pt-1 border-t text-[10px] ${
                    isAsst ? 'border-slate-100 text-slate-400' : 'border-emerald-600/50 text-emerald-200'
                  }`}>
                    <span>{m.time}</span>
                    {isAsst && (
                      <button
                        onClick={() => copyToClipboard(m.id, m.content)}
                        className="hover:text-slate-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-2xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Searching verified Islamabad directory and synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about Islamabad (e.g. 'How to reach Monal from F-7?')..."
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified local database with Gemini 3.8 Flash intelligence
            </span>
            <button
              onClick={() => setMessages([messages[0]])}
              className="hover:text-slate-600 underline"
            >
              Clear chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
