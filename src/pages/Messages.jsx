import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, MoreVertical, 
  Phone, Video, Trash2, 
  Smile, Paperclip, ChevronLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageService } from '../services/messageService';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chat, setChat] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const list = messageService.listContacts();
    setContacts(list);
    if (list.length > 0 && !selectedContact) {
      handleSelectContact(list[0]);
    }
  }, []);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    const history = messageService.getChat(contact.id);
    setChat(history);
  };

  const handleSend = () => {
    if (!inputText.trim() || !selectedContact) return;
    const newMessage = messageService.sendMessage(selectedContact.id, inputText);
    setChat([...chat, newMessage]);
    setInputText('');
    
    // Simulate auto-reply from bots
    if (selectedContact.id === 'c1' || selectedContact.id === 'c2') {
      setTimeout(() => {
        const reply = messageService.sendMessage(selectedContact.id, "That sounds like a plan! Let's keep the streak going. ⚡");
        setChat(prev => [...prev, reply]);
      }, 2000);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="flex bg-background-card rounded-[32px] border border-white/5 h-[calc(100vh-140px)] overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-[350px] border-r border-white/5 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-nuvio-purple-500 outline-none"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map(c => (
            <button 
              key={c.id} 
              onClick={() => handleSelectContact(c)}
              className={`w-full p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors border-l-4 ${selectedContact?.id === c.id ? 'border-nuvio-purple-500 bg-nuvio-purple-500/5' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl relative">
                {c.avatar}
                {c.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-nuvio-purple-500 rounded-full border-2 border-background-card text-[10px] font-black flex items-center justify-center">
                    {c.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-text-primary uppercase tracking-tight truncate">{c.name}</span>
                  <span className="text-[9px] font-bold text-text-muted uppercase">{c.time}</span>
                </div>
                <p className="text-xs text-text-muted truncate">{c.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedContact(null)} className="md:hidden p-2 text-text-muted">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                  {selectedContact.avatar}
                </div>
                <div>
                  <h3 className="font-black text-text-primary uppercase tracking-widest text-sm">{selectedContact.name}</h3>
                  <p className="text-[10px] font-bold text-nuvio-green uppercase">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-text-muted hover:text-text-primary transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-3 text-text-muted hover:text-text-primary transition-all"><Video className="w-5 h-5" /></button>
                <button className="p-3 text-text-muted hover:text-text-primary transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {chat.map((m, i) => (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed
                      ${m.from === 'me' 
                        ? 'bg-nuvio-purple-500 text-white rounded-tr-none shadow-lg shadow-nuvio-purple-500/20' 
                        : 'bg-white/5 text-text-primary border border-white/5 rounded-tl-none'}
                    `}>
                      {m.text}
                      <div className={`text-[9px] mt-2 font-bold uppercase opacity-50 ${m.from === 'me' ? 'text-right' : 'text-left'}`}>
                        {m.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 focus-within:border-nuvio-purple-500/50 transition-all">
                <button className="text-text-muted hover:text-text-primary"><Smile className="w-5 h-5" /></button>
                <button className="text-text-muted hover:text-text-primary"><Paperclip className="w-5 h-5" /></button>
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="p-3 bg-nuvio-purple-500 rounded-xl text-white hover:bg-nuvio-purple-600 transition-all active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl grayscale opacity-50">💬</div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">Your Library</h3>
              <p className="text-text-secondary text-sm max-w-xs">Select a contact to start chatting or view study group updates.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
