import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Trash2, History, 
  Lightbulb, BrainCircuit, MessageCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import { xpService } from '../services/xpService';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm Nova, your personal study assistant. How can I help you excel today? ⚡" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedKey, setDetectedKey] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideInput) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setDetectedKey(null); // Reset detection on new message

    // Proactively check for keys in the user's message
    const keyMatch = aiService.detectAndOfferKey(textToSend);
    if (keyMatch) {
      setDetectedKey(keyMatch);
    }

    try {
      // Pass the whole message history to the AI for context
      const history = [...messages, userMsg];
      const response = await aiService.chat(history);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      xpService.awardXp(5, 'AI Consultation');
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having a bit of a brain fog. Can you try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Summarize my history notes",
    "Explain photosynthesis simply",
    "Create a study schedule for finals",
    "Quiz me on French verbs"
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col max-w-4xl mx-auto nv-page-transition">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-2 uppercase tracking-tighter">
            <Sparkles className="w-8 h-8 text-nuvio-purple-400" />
            Nova AI
          </h1>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mt-1 opacity-70">Hyper-intelligent study companion</p>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-3 bg-white/5 border border-white/10 hover:bg-nuvio-red/10 text-text-muted hover:text-nuvio-red rounded-2xl transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm shadow-lg ${
                  msg.role === 'user' ? 'bg-nuvio-blue' : 'bg-nuvio-purple-600'
                }`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className={`p-5 rounded-[24px] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-nuvio-blue text-white rounded-tr-none' 
                    : 'bg-background-surface border border-border text-text-primary rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-nuvio-purple-600 flex items-center justify-center text-sm">🤖</div>
                <div className="bg-background-surface border border-border rounded-[24px] rounded-tl-none p-5 flex items-center gap-2">
                   <Loader2 className="w-4 h-4 text-nuvio-purple-400 animate-spin" />
                   <span className="text-xs text-text-muted font-bold uppercase tracking-widest">Nova is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        {/* Smart Key Detection Invitation */}
        <AnimatePresence>
          {detectedKey && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="nv-card !bg-nuvio-purple-600 border-none p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">Intelligence Pattern Detected</h4>
                  <p className="text-[10px] text-nuvio-purple-100 font-bold uppercase tracking-widest leading-relaxed">I found a {detectedKey.provider} key in your message. Commit it now to unlock my full brain?</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => {
                    aiService.setKey(detectedKey.provider, detectedKey.key);
                    setDetectedKey(null);
                    setMessages(prev => [...prev, { role: 'assistant', text: "Neural link established! 🧠⚡ I can now access my full intelligence core. What's our next objective?" }]);
                  }}
                  className="flex-1 md:flex-initial px-6 py-3 bg-white text-nuvio-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-nuvio-cyan hover:text-black transition-all shadow-lg"
                >
                  Commit to Neural Path
                </button>
                <button onClick={() => setDetectedKey(null)} className="px-4 py-3 bg-black/20 text-white rounded-xl text-[10px] uppercase font-black">Later</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-[10px] font-black uppercase tracking-widest text-nuvio-purple-400 bg-nuvio-purple-400/5 border border-nuvio-purple-400/10 px-4 py-2 rounded-xl hover:bg-nuvio-purple-400/20 transition-all flex items-center gap-2"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <textarea
            rows="1"
            placeholder="Ask Nova to explain something, create a plan, or quiz you..."
            className="w-full bg-background-card border border-border rounded-[24px] py-5 pl-8 pr-16 text-sm focus:outline-none focus:border-nuvio-purple-500 transition-colors resize-none shadow-2xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-4 bottom-3 p-3 bg-nuvio-purple-500 rounded-2xl text-white hover:bg-nuvio-purple-600 disabled:opacity-50 disabled:hover:bg-nuvio-purple-500 transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-text-muted font-black uppercase tracking-[0.2em] opacity-50">
          Powered by DeepSeek R1 · Llama 3.3 · Gemini Flash · Triple Neural Core
        </p>
      </div>
    </div>
  );
};

export default AIChat;
