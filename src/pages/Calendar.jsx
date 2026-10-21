import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, 
  Clock, Calendar as CalendarIcon,
  Trash2, X, Check, BookOpen, AlertCircle,
  Zap, Heart, Coffee, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, addMonths, subMonths, startOfMonth, 
  endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
  isSameMonth, isSameDay
} from 'date-fns';
import { dataService } from '../services/dataService';
import { notificationService } from '../services/notificationService';

const EVENT_TYPES = [
  { id: 'All', label: 'All Cadences', icon: '🗓️' },
  { id: 'Deep Block', label: '⚡ Deep Focus Bout', icon: '⚡' },
  { id: 'Physical', label: '🏃 Movement / Body', icon: '🏃' },
  { id: 'Logistics', label: '🌿 Logistics & Admin', icon: '🌿' },
  { id: 'Personal', label: '🌙 Tribe & Restoration', icon: '🌙' }
];

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
      if (list && Array.isArray(list)) {
        setEvents(list);
      }
    } catch (err) {
      console.warn("Calendar sync delayed:", err);
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
      event_time: formData.get('time') || '09:00',
      event_type: formData.get('type') || 'Deep Block'
    };

    try {
      const created = await dataService.create('calendar_events', newEvent);
      setEvents(prev => [...prev, created]);
      setShowAddModal(false);
      notificationService.send("Cadence Blocked", `"${newEvent.title}" locked for ${newEvent.event_date}.`, "success");
    } catch (err) {
      notificationService.send("Sync Error", "Failed to schedule event.", "error");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await dataService.delete('calendar_events', id);
      setEvents(events.filter(e => e.id !== id));
      notificationService.send("Block Cleared", "Event removed from timetable.", "info");
    } catch (err) {
      console.warn("Delete failed:", err);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(monthStart), 
    end: endOfWeek(monthEnd) 
  });

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = events.filter(e => e.event_date === selectedDateStr);
  const filteredDayEvents = activeFilter === 'All' 
    ? dayEvents 
    : dayEvents.filter(e => e.event_type === activeFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans text-left">
      
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#e5e1d5] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1b3b2b]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#827f76]">
              Life Timetable // Time-Blocking Architecture
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1a1917]">
            Life Calendar & Cadence
          </h1>
          <p className="text-[#52504a] text-sm mt-1 max-w-xl">
            Proactive time-blocking (Cal Newport method). Defend uninterrupted morning Maker blocks against fragmented meetings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-[#1b3b2b] hover:bg-[#26523c] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(27,59,43,0.2)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Block Time Interval</span>
        </button>
      </header>

      {/* ── MAIN CALENDAR GRID & DAY DETAILS ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Calendar Grid View (8 Cols) */}
        <div className="lg:col-span-8 border border-[#e5e1d5] bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(27,59,43,0.03)] space-y-6">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between border-b border-[#f4f1ea] pb-4">
            <h2 className="font-serif font-bold text-xl text-[#1a1917]">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 border border-[#e5e1d5] hover:border-[#1b3b2b] rounded-lg text-[#52504a] hover:text-[#1a1917] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 border border-[#e5e1d5] hover:border-[#1b3b2b] rounded-lg text-xs font-mono font-bold text-[#52504a]"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 border border-[#e5e1d5] hover:border-[#1b3b2b] rounded-lg text-[#52504a] hover:text-[#1a1917] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center font-mono text-[10px] uppercase tracking-wider text-[#827f76] font-bold">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, idx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isSelected = isSameDay(day, selectedDate);
              const isCurrent = isSameMonth(day, currentMonth);
              const hasEvents = events.some(e => e.event_date === dayStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`h-14 sm:h-16 rounded-xl border flex flex-col items-center justify-between p-1.5 sm:p-2 transition-all relative ${
                    isSelected 
                      ? 'border-[#1b3b2b] bg-[#f4f7f4] ring-1 ring-[#1b3b2b]' 
                      : isCurrent 
                        ? 'border-[#f0ece1] bg-white hover:border-[#827f76]' 
                        : 'border-transparent bg-transparent text-[#b5b1a5] opacity-50'
                  }`}
                >
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#1b3b2b]' : 'text-[#1a1917]'}`}>
                    {format(day, 'd')}
                  </span>

                  {hasEvents && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1b3b2b]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Day Agenda (4 Cols) */}
        <div className="lg:col-span-4 border border-[#e5e1d5] bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-[#f4f1ea] pb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#827f76] font-bold block">
              Daily Schedule
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1a1917]">
              {format(selectedDate, 'EEEE, d MMMM')}
            </h3>
          </div>

          {/* Filter Types */}
          <div className="flex flex-wrap gap-1">
            {EVENT_TYPES.slice(0, 3).map(t => (
              <button
                key={t.id}
                onClick={() => setActiveFilter(t.id)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                  activeFilter === t.id ? 'bg-[#1b3b2b] text-white' : 'bg-[#f4f1ea] text-[#52504a]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Agenda Events */}
          <div className="space-y-2.5">
            {filteredDayEvents.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[#827f76] space-y-2">
                <div>No events scheduled for this day.</div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-[#1b3b2b] font-bold underline block mx-auto"
                >
                  + Block an interval
                </button>
              </div>
            ) : (
              filteredDayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 border border-[#e5e1d5] rounded-xl flex items-center justify-between gap-3 bg-[#faf9f6]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-serif font-bold text-[#1a1917] truncate">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#827f76] mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{event.event_time}</span>
                      <span>•</span>
                      <span>{event.event_type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-1 text-[#827f76] hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── MODAL: BLOCK TIME INTERVAL ──────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#e5e1d5] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f4f1ea] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#1a1917]">
                  Block Time Interval
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-[#827f76]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#827f76] font-bold">
                    Interval Title
                  </label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Deep Work: Newsletter Asset Creation"
                    className="w-full px-3 py-2 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-sans focus:outline-none focus:border-[#1b3b2b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#827f76] font-bold">
                      Start Time
                    </label>
                    <input
                      name="time"
                      type="time"
                      defaultValue="09:00"
                      className="w-full px-3 py-2 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#827f76] font-bold">
                      Block Type
                    </label>
                    <select
                      name="type"
                      defaultValue="Deep Block"
                      className="w-full px-3 py-2 bg-[#fbfbfa] border border-[#e5e1d5] rounded-xl text-xs font-mono"
                    >
                      <option value="Deep Block">⚡ Deep Block</option>
                      <option value="Physical">🏃 Physical / Body</option>
                      <option value="Logistics">🌿 Logistics</option>
                      <option value="Personal">🌙 Personal</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-[#e5e1d5] rounded-xl text-xs font-mono text-[#827f76]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1b3b2b] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl"
                  >
                    Confirm Block
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Calendar;
