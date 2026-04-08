import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, MinusCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/aiService';

const NovaFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi there! I'm Nova. Ready to crush your study goals today? ⚡" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMsg = { role: 'user', text: message };
    setMessages([...messages, userMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await aiService.chat([...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
       setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having a connection issue. Try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-[320px] md:w-[380px] bg-background-surface border border-border rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-nuvio-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight">Nova AI</div>
                  <div className="text-[10px] text-white/70 font-black uppercase tracking-widest">Online Assistant</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <MinusCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-[350px] p-4 overflow-y-auto space-y-4 bg-background-base/50 custom-scrollbar" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role !== 'user' && (
                    <div className="w-6 h-6 rounded-full bg-nuvio-purple-500 flex items-center justify-center text-[10px] flex-shrink-0">🤖</div>
                  )}
                  <div className={`
                    rounded-[14px] p-3 text-xs leading-relaxed max-w-[80%] whitespace-pre-wrap
                    ${msg.role === 'user' 
                      ? 'bg-nuvio-blue text-white rounded-tr-none' 
                      : 'bg-background-surface border border-border text-text-primary rounded-tl-none'}
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-nuvio-purple-500 flex items-center justify-center text-[10px]">🤖</div>
                  <div className="bg-background-surface border border-border rounded-[14px] p-3">
                    <Loader2 className="w-3 h-3 text-nuvio-purple-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-background-surface">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ask Nova anything..."
                  className="w-full bg-white/5 border border-border rounded-full py-3 px-4 pr-12 text-xs focus:outline-none focus:border-nuvio-purple-500 transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isTyping}
                  className="absolute right-2 top-2 p-2 bg-nuvio-purple-500 rounded-full text-white hover:bg-nuvio-purple-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors group relative ${
          isOpen ? 'bg-background-surface' : 'bg-gradient-to-br from-nuvio-purple-500 to-nuvio-purple-700'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-secondary" />
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-nuvio-orange rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background-base">
              !
            </div>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default NovaFAB;
