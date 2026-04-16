import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, 
  MapPin, Clock, Calendar as CalendarIcon,
  Search, Filter, Trash2, X, AlertCircle,
  Trophy, Star, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, addMonths, subMonths, startOfMonth, 
  endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
  isSameMonth, isSameDay, addDays, parseISO 
} from 'date-fns';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const list = await dataService.list('calendar_events');
      setEvents(list);
    } catch (err) {
      console.error("Calendar Hub Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
        title: formData.get('title'),
        event_date: format(selectedDate, 'yyyy-MM-dd'),
        event_time: formData.get('time'),
        event_type: formData.get('type')
    };

    try {
        const created = await dataService.create('calendar_events', newEvent);
        setEvents([...events, created]);
        setShowAddModal(false);
        notificationService.send("Chronos Hub", `Event "${newEvent.title}" added to the timeline.`, "info");
    } catch (err) {
        notificationService.send("Sync Error", "Failed to preserve event in the cloud.", "error");
    }
  };

  const deleteEvent = async (id) => {
    try {
        await dataService.delete('calendar_events', id);
        setEvents(events.filter(e => e.id !== id));
        notificationService.send("Schedule Purged", "Event removed from timeline.", "info");
    } catch (err) {
        console.error("Delete failed:", err);
    }
  };

  // Helper date generators
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(monthStart), 
    end: endOfWeek(monthEnd) 
  });

  const eventTypes = ['All', 'Study', 'Exam', 'Meeting', 'Social'];
  const filteredEvents = activeFilter === 'All' ? events : events.filter(e => e.event_type === activeFilter);

  return (
    <div className="min-h-screen pb-20 nv-page-transition">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Calendar Grid */}
        <div className="lg:col-span-8 space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nuvio-purple-500/5 blur-[100px] pointer-events-none" />
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                <CalendarDays className="w-10 h-10 text-nuvio-purple-400" />
                {format(currentMonth, 'MMMM yyyy')}
              </h1>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-nuvio-green animate-pulse" />
                Chronos Core: Identity Verified
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date())}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white transition-all"
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white group"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </header>

          <div className="nv-card p-2 border-white/5 overflow-hidden">
            <div className="grid grid-cols-7 mb-4 p-6 border-b border-white/5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-white/5">
              {calendarDays.map((day, idx) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const dayEvents = events.filter(e => e.event_date === format(day, 'yyyy-MM-dd'));

                return (
                  <motion.div
                    key={idx}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[140px] p-4 cursor-pointer transition-all relative group
                      ${isCurrentMonth ? 'bg-background-dark' : 'bg-background-base/20'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`
                        text-sm font-black transition-all
                        ${isSelected ? 'text-nuvio-purple-400 scale-125' : isToday ? 'text-nuvio-blue' : 'text-text-muted'}
                        ${!isCurrentMonth && 'opacity-30'}
                      `}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex -space-x-1">
                          {dayEvents.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-nuvio-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((e, i) => (
                        <div key={i} className={`
                          text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg border truncate transition-all
                          ${e.event_type === 'Exam' ? 'bg-nuvio-red/10 border-nuvio-red/20 text-nuvio-red' : 
                            e.event_type === 'Study' ? 'bg-nuvio-purple-500/10 border-nuvio-purple-500/20 text-nuvio-purple-400' : 
                            'bg-white/5 border-white/10 text-white'}
                        `}>
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[7px] font-black text-text-muted uppercase tracking-widest pl-2">
                          + {dayEvents.length - 2} More
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Day Inspection Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="nv-card p-10 border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent h-full flex flex-col">
            <header className="space-y-6 mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-[0.3em]">Timeline Inspection</span>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-10 h-10 bg-nuvio-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">{format(selectedDate, 'eeee')}</h3>
                <p className="text-sm font-bold text-text-muted mt-1">{format(selectedDate, 'MMMM do, yyyy')}</p>
              </div>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-2 mb-6 overscroll-x-auto pb-2">
                {eventTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      activeFilter === type ? 'bg-nuvio-purple-500 border-nuvio-purple-500 text-white' : 'bg-white/5 border-white/10 text-text-muted hover:border-white/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {events.filter(e => e.event_date === format(selectedDate, 'yyyy-MM-dd'))
                  .filter(e => activeFilter === 'All' || e.event_type === activeFilter)
                  .map((e, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-nuvio-purple-500/30 transition-all flex items-start gap-4"
                    >
                      <div className={`w-1 h-12 rounded-full ${
                        e.event_type === 'Exam' ? 'bg-nuvio-red' : 
                        e.event_type === 'Study' ? 'bg-nuvio-purple-500' : 
                        e.event_type === 'Meeting' ? 'bg-nuvio-blue' : 'bg-nuvio-green'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-nuvio-purple-400 uppercase tracking-widest mb-1">{e.event_type}</span>
                          <button onClick={() => deleteEvent(e.id)} className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-nuvio-red transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">{e.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {e.event_time || 'No Time Set'}</span>
                        </div>
                      </div>
                    </motion.div>
                ))}

                {events.filter(e => e.event_date === format(selectedDate, 'yyyy-MM-dd')).length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <CalendarIcon className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Clear Skies for today</p>
                    <button onClick={() => setShowAddModal(true)} className="text-[9px] font-black text-nuvio-purple-400 uppercase tracking-widest hover:text-nuvio-purple-300">
                      + Add Transmission
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="nv-card bg-nuvio-purple-500/10 border-nuvio-purple-500/20 p-6 flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-nuvio-purple-500 flex items-center justify-center text-white shadow-lg">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-nuvio-purple-400 uppercase tracking-widest">Momentum Check</div>
                  <div className="text-sm font-black text-white uppercase mt-1">{events.length} Events Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="nv-card w-full max-w-lg p-12 space-y-8 border-nuvio-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">New Transmission</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-white transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-6">
                <div className="space-y-2">
                  <label className="nv-label">Event Label</label>
                  <input 
                    name="title" 
                    required 
                    placeholder="e.g. Quantum Chemistry Exam" 
                    className="nv-input" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="nv-label">Target Hour</label>
                    <input name="time" type="time" className="nv-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="nv-label">Mission Type</label>
                    <select name="type" className="nv-input appearance-none bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none w-full">
                      <option value="Study" className="bg-background-dark">📚 Study Session</option>
                      <option value="Exam" className="bg-background-dark">🚨 Critical Exam</option>
                      <option value="Meeting" className="bg-background-dark">🤝 Squad Meeting</option>
                      <option value="Social" className="bg-background-dark">🎉 Social Event</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Locked Date</div>
                    <div className="text-sm font-black text-white uppercase">{format(selectedDate, 'MMMM do, yyyy')}</div>
                  </div>
                </div>

                <button type="submit" className="nv-btn-primary w-full h-18 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-nuvio-purple-500/20">
                  Preserve to Chronos Hub
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
