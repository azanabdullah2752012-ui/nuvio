import React, { useState, useEffect, useRef } from 'react';
import {
  Send, MessageSquare, Search, ArrowLeft,
  Circle, User, Inbox, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Helpers ────────────────────────────────────────────────────────────────

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// ─── ContactRow ──────────────────────────────────────────────────────────────

const ContactRow = ({ contact, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: 2 }}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all
      ${isActive
        ? 'bg-nuvio-purple-500/20 border border-nuvio-purple-500/30'
        : 'hover:bg-white/5 border border-transparent'}`}
  >
    {/* Avatar */}
    <div className="relative shrink-0">
      <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-inner">
        {contact.avatar_emoji || '👤'}
      </div>
      {contact.isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-nuvio-green border-2 border-background-card rounded-full" />
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-black text-white uppercase tracking-tight truncate">
          {contact.full_name || 'Unknown Scholar'}
        </span>
        <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest shrink-0 ml-1">
          {timeAgo(contact.lastMsgAt)}
        </span>
      </div>
      <p className="text-[11px] text-text-secondary truncate mt-0.5 font-medium">
        {contact.lastMsg || 'Start a conversation'}
      </p>
    </div>

    {contact.unread > 0 && (
      <span className="shrink-0 w-5 h-5 bg-nuvio-purple-500 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-lg shadow-nuvio-purple-500/40">
        {contact.unread}
      </span>
    )}
  </motion.button>
);

const getLocalMockDMs = () => {
  try {
    const data = localStorage.getItem('acadevance_mock_dms');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn("Failed to parse mock DMs:", e);
  }
  // Default seed messages from mock classmates to the current user
  const seed = [
    {
      id: 'seed-msg-1',
      sender_id: 'mock-aarav',
      recipient_id: 'demo-scholar-id',
      content: "Hey! Let's team up for the science quest tonight. What do you think?",
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'seed-msg-2',
      sender_id: 'mock-diya',
      recipient_id: 'demo-scholar-id',
      content: "Acadevance has a new seasonal pass, make sure to claim your rewards!",
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ];
  localStorage.setItem('acadevance_mock_dms', JSON.stringify(seed));
  return seed;
};

// ─── ChatWindow ──────────────────────────────────────────────────────────────

const ChatWindow = ({ contact, currentUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!contact?.id) return;
    loadMessages();
    inputRef.current?.focus();

    if (contact.id.startsWith('mock-')) {
      return;
    }

    // Real-time subscription
    const channel = supabase
      .channel(`dm:${[currentUser.id, contact.id].sort().join('-')}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => {
        const msg = payload.new;
        const relevant =
          (msg.sender_id === currentUser.id && msg.recipient_id === contact.id) ||
          (msg.sender_id === contact.id && msg.recipient_id === currentUser.id);
        if (relevant && msg.sender_id !== currentUser.id) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [contact?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      if (contact.id.startsWith('mock-')) {
        const localDms = getLocalMockDMs();
        const relevant = localDms.filter(m =>
          (m.sender_id === currentUser.id && m.recipient_id === contact.id) ||
          (m.sender_id === contact.id && m.recipient_id === currentUser.id)
        );
        setMessages(relevant);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(
          `and(sender_id.eq.${currentUser.id},recipient_id.eq.${contact.id}),` +
          `and(sender_id.eq.${contact.id},recipient_id.eq.${currentUser.id})`
        )
        .order('created_at', { ascending: true });

      if (!error && data) setMessages(data);
    } catch (e) {
      console.warn('Failed to load DMs:', e);
    }
    setLoading(false);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    const optimistic = {
      id: `opt-${Date.now()}`,
      sender_id: currentUser.id,
      recipient_id: contact.id,
      content: draft.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimistic]);
    setDraft('');

    if (contact.id.startsWith('mock-')) {
      try {
        const localDms = getLocalMockDMs();
        localDms.push(optimistic);
        localStorage.setItem('acadevance_mock_dms', JSON.stringify(localDms));
        
        // Mock reply after 1.5 seconds
        setTimeout(() => {
          const replies = [
            `Haha true! Let's get back to studying.`,
            `Awesome! Have you seen the math homework page yet?`,
            `Wow, that sounds great. Let's study together soon!`,
            `I'm trying to reach level 20 this week!`,
            `Nice! By the way, check out the shop, there are cool avatars there.`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const replyMsg = {
            id: `reply-${Date.now()}`,
            sender_id: contact.id,
            recipient_id: currentUser.id,
            content: randomReply,
            created_at: new Date().toISOString()
          };
          localDms.push(replyMsg);
          localStorage.setItem('acadevance_mock_dms', JSON.stringify(localDms));
          setMessages(prev => [...prev, replyMsg]);
        }, 1500);
      } catch (err) {
        console.warn("Failed to send mock DM:", err);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([{ sender_id: currentUser.id, recipient_id: contact.id, content: optimistic.content }])
        .select()
        .single();

      if (!error && data) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
      }
    } catch (e) {
      console.warn('Send failed:', e);
    }
  };

  const isMe = (msg) => msg.sender_id === currentUser.id;

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02] shrink-0">
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl">
            {contact.avatar_emoji || '👤'}
          </div>
          {contact.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-nuvio-green border-2 border-background-card rounded-full" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-base font-black text-white uppercase tracking-tight">
            {contact.full_name}
          </h2>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            {contact.isOnline ? (
              <span className="text-nuvio-green">● Online</span>
            ) : (
              <span>Grade {contact.grade_level || '9th'} • Scholar</span>
            )}
          </p>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="text-5xl">{contact.avatar_emoji || '👤'}</div>
            <div>
              <p className="text-sm font-black text-text-primary uppercase tracking-tight">
                No messages yet
              </p>
              <p className="text-xs text-text-muted mt-1">
                Say hi to {contact.full_name?.split(' ')[0]}!
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className={`flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[72%] flex flex-col gap-1 ${isMe(msg) ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed
                    ${isMe(msg)
                      ? 'bg-nuvio-purple-500 text-white rounded-tr-sm shadow-xl shadow-nuvio-purple-500/20'
                      : 'bg-white/[0.07] text-text-primary border border-white/5 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="px-6 py-4 border-t border-white/5 bg-white/[0.02] shrink-0">
        <div className="relative flex items-center gap-3">
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={`Message ${contact.full_name?.split(' ')[0]}...`}
            className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm text-white placeholder:text-text-muted/50 outline-none focus:border-nuvio-purple-500/60 transition-all shadow-inner"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!draft.trim()}
            className="w-12 h-12 bg-nuvio-purple-500 disabled:opacity-40 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-nuvio-purple-500/30 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
    <div className="w-20 h-20 rounded-3xl bg-nuvio-purple-500/10 border border-nuvio-purple-500/20 flex items-center justify-center">
      <MessageSquare className="w-9 h-9 text-nuvio-purple-400" />
    </div>
    <div>
      <h3 className="text-lg font-black text-white uppercase tracking-tight">Pick a conversation</h3>
      <p className="text-sm text-text-secondary mt-2 max-w-xs">
        Select a classmate from the left panel or head to <strong>Classmates</strong> to start a new DM.
      </p>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState('contacts'); // 'contacts' | 'chat'
  const currentUser = authService.me();
  const location = useLocation();

  // Allow navigating directly to a DM via state: { openDm: { id, full_name, ... } }
  useEffect(() => {
    if (location.state?.openDm) {
      const target = location.state.openDm;
      setActiveContact(target);
      setMobileView('chat');
      // Merge into contacts if not already there
      setContacts(prev => {
        const exists = prev.find(c => c.id === target.id);
        return exists ? prev : [target, ...prev];
      });
    }
  }, [location.state]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    if (!currentUser?.id) { setLoading(false); return; }
    setLoading(true);

    try {
      // Fetch all DMs involving the current user to build contact list
      const { data: dbDms } = await supabase
        .from('direct_messages')
        .select('sender_id, recipient_id, content, created_at')
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      const localDms = getLocalMockDMs();
      const dms = [...(dbDms || []), ...localDms];

      // Sort all DMs by created_at desc
      dms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (dms.length === 0) {
        setLoading(false);
        return;
      }

      // Build unique contact IDs + last message metadata
      const contactMap = new Map();
      for (const dm of dms) {
        const otherId = dm.sender_id === currentUser.id ? dm.recipient_id : dm.sender_id;
        if (!contactMap.has(otherId)) {
          contactMap.set(otherId, { lastMsg: dm.content, lastMsgAt: dm.created_at });
        }
      }

      const contactIds = [...contactMap.keys()];
      if (contactIds.length === 0) { setLoading(false); return; }

      // Fetch profiles
      const realContactIds = contactIds.filter(id => !id.startsWith('mock-'));
      const mockContactIds = contactIds.filter(id => id.startsWith('mock-'));

      let realProfiles = [];
      if (realContactIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_emoji, grade_level, updated_at')
          .in('id', realContactIds);
        realProfiles = profiles || [];
      }

      const mockProfilesList = [
        { id: 'mock-aarav', full_name: 'Aarav Sharma', avatar_emoji: '🦁', grade_level: '9th', updated_at: new Date().toISOString() },
        { id: 'mock-diya', full_name: 'Diya Patel', avatar_emoji: '🦊', grade_level: '9th', updated_at: new Date().toISOString() },
        { id: 'mock-ishaan', full_name: 'Ishaan Verma', avatar_emoji: '🐼', grade_level: '9th', updated_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 'mock-ananya', full_name: 'Ananya Iyer', avatar_emoji: '🦄', grade_level: '9th', updated_at: new Date(Date.now() - 7200000).toISOString() },
        { id: 'mock-kabir', full_name: 'Kabir Mehta', avatar_emoji: '🐨', grade_level: '9th', updated_at: new Date().toISOString() }
      ];

      const mockProfiles = mockProfilesList.filter(p => mockContactIds.includes(p.id));
      const allProfiles = [...realProfiles, ...mockProfiles];

      const onlineThreshold = new Date(Date.now() - 15 * 60 * 1000).toISOString();

      const enriched = allProfiles.map(p => ({
        ...p,
        isOnline: p.updated_at > onlineThreshold,
        lastMsg: contactMap.get(p.id)?.lastMsg || '',
        lastMsgAt: contactMap.get(p.id)?.lastMsgAt || '',
        unread: 0,
      }));

      // Sort by latest message
      enriched.sort((a, b) => new Date(b.lastMsgAt) - new Date(a.lastMsgAt));
      setContacts(enriched);
    } catch (e) {
      console.warn('Failed to load contacts:', e);
    }

    setLoading(false);
  };

  const filtered = contacts.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setMobileView('chat');
    // Update last message preview after chat
    setTimeout(() => loadContacts(), 1000);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex rounded-[32px] border border-border overflow-hidden shadow-2xl bg-background-card">

      {/* ── LEFT PANEL: Contacts ─────────────────────────────────────── */}
      <div className={`
        w-full md:w-[320px] md:block border-r border-white/5 flex flex-col shrink-0
        ${mobileView === 'chat' ? 'hidden' : 'flex'}
      `}>
        {/* Panel Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-nuvio-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-nuvio-purple-500/30">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-white uppercase tracking-tight">Messages</h1>
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                {contacts.length} conversation{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-9 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-xs text-white placeholder:text-text-muted/50 outline-none focus:border-nuvio-purple-500/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-text-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-nuvio-purple-500/20 border-t-nuvio-purple-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <User className="w-10 h-10 text-text-muted/40" />
              <div>
                <p className="text-sm font-black text-text-muted uppercase tracking-tight">No conversations</p>
                <p className="text-[10px] text-text-muted/60 mt-1">
                  Go to <strong>Classmates</strong> to start chatting!
                </p>
              </div>
            </div>
          ) : (
            filtered.map(contact => (
              <ContactRow
                key={contact.id}
                contact={contact}
                isActive={activeContact?.id === contact.id}
                onClick={() => handleSelectContact(contact)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: Chat ────────────────────────────────────────── */}
      <div className={`
        flex-1 flex flex-col overflow-hidden
        ${mobileView === 'contacts' ? 'hidden md:flex' : 'flex'}
      `}>
        {activeContact ? (
          <ChatWindow
            contact={activeContact}
            currentUser={currentUser}
            onBack={() => setMobileView('contacts')}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Messages;
