import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, 
  Clock, Calendar as CalendarIcon,
  Trash2, X, Check, BookOpen, AlertCircle
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
  { id: 'All', label: 'All Events' },
  { id: 'Study', label: 'Study Sprint' },
  { id: 'Exam', label: 'Examination' },
  { id: 'Revision', label: 'Revision Block' },
  { id: 'Assignment', label: 'Assignment Due' }
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
      event_time: formData.get('time') || '10:00',
      event_type: formData.get('type') || 'Study'
    };

    try {
      const created = await dataService.create('calendar_events', newEvent);
      setEvents(prev => [...prev, created]);
      setShowAddModal(false);
      notificationService.send("Event Scheduled", `"${newEvent.title}" logged on ${newEvent.event_date}.`, "success");
    } catch (err) {
      notificationService.send("Sync Error", "Failed to register academic event.", "error");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await dataService.delete('calendar_events', id);
      setEvents(events.filter(e => e.id !== id));
      notificationService.send("Event Cleared", "Event removed from timetable.", "info");
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
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4625]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">
              Academic Timetable / Examination Schedule
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-clash">
            Academic Calendar
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Coordinate exam timelines, assignment deadlines, and spaced revision sprints across terms.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm self-start sm:self-end"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Event</span>
        </button>
      </header>

      {/* CALENDAR & DAY SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: MONTH GRID */}
        <div className="lg:col-span-8 p-6 sm:p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
          
          {/* Month Navigation Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-clash text-2xl font-bold uppercase text-white tracking-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 bg-[#08090b] hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 bg-[#08090b] hover:bg-white/10 border border-white/10 rounded-lg font-mono text-[10px] uppercase text-zinc-300"
              >
                Current
              </button>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 bg-[#08090b] hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 pb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Day Cells Matrix */}
          <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
            {calendarDays.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = isSameDay(day, selectedDate);
              const inCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());
              const dayEventList = events.filter(e => e.event_date === dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[90px] sm:min-h-[105px] p-2.5 cursor-pointer transition-colors relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#ff4625]/10 border border-[#ff4625]'
                      : inCurrentMonth
                      ? 'bg-[#090a0d] hover:bg-white/[0.03]'
                      : 'bg-[#08090b]/40 opacity-30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-xs font-bold ${
                      isSelected ? 'text-[#ff4625]' : isToday ? 'text-white underline decoration-[#ff4625] decoration-2' : 'text-zinc-400'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayEventList.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff4625]" />
                    )}
                  </div>

                  {/* Micro event indicators */}
                  <div className="space-y-1 overflow-hidden mt-1">
                    {dayEventList.slice(0, 2).map((ev, i) => (
                      <div
                        key={i}
                        className={`text-[8px] font-mono uppercase tracking-tight px-1.5 py-0.5 rounded truncate ${
                          ev.event_type === 'Exam'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-white/5 text-zinc-300'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEventList.length > 2 && (
                      <span className="text-[7px] font-mono text-zinc-500 block">
                        +{dayEventList.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT: SELECTED DATE INSPECTION PANEL */}
        <div className="lg:col-span-4 p-6 sm:p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#ff4625] font-bold">
              Timetable Details
            </span>
            <h3 className="font-clash text-xl font-bold uppercase text-white mt-1">
              {format(selectedDate, 'eeee')}
            </h3>
            <span className="font-mono text-xs text-zinc-400 block mt-0.5">
              {format(selectedDate, 'MMMM do, yyyy')}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 flex-wrap">
            {EVENT_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveFilter(t.id)}
                className={`px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all border ${
                  activeFilter === t.id
                    ? 'border-[#ff4625] bg-[#ff4625]/10 text-white font-bold'
                    : 'border-white/5 bg-[#08090b] text-zinc-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Events List for Day */}
          <div className="space-y-3 min-h-[220px]">
            {filteredDayEvents.length === 0 ? (
              <div className="p-8 border border-white/5 bg-[#08090b] rounded-xl text-center space-y-2">
                <CalendarIcon className="w-8 h-8 text-zinc-600 mx-auto" />
                <span className="text-zinc-500 font-mono text-xs block">No events logged for this date.</span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-[#ff4625] font-mono text-[10px] uppercase tracking-wider hover:underline font-bold"
                >
                  + Add schedule entry
                </button>
              </div>
            ) : (
              filteredDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 border border-white/5 bg-[#08090b] rounded-xl flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className={`text-[8px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.2 rounded ${
                      ev.event_type === 'Exam' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-zinc-300'
                    }`}>
                      {ev.event_type}
                    </span>
                    <h4 className="text-xs font-semibold text-white mt-1">{ev.title}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{ev.event_time || '10:00 AM'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className="p-1.5 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* MODAL: ADD EVENT */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 border border-white/10 bg-[#0d0f14] rounded-2xl space-y-6 shadow-2xl font-sans"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff4625]">Academic Schedule</span>
                  <h3 className="font-clash text-xl font-bold uppercase text-white mt-0.5">Add Timetable Event</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">Event Title</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Science Chapter 4 Unit Test"
                    className="w-full px-4 py-2.5 bg-[#08090b] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff4625]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">Event Type</label>
                    <select
                      name="type"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-white/10 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:border-[#ff4625]"
                    >
                      <option value="Study">Study Sprint</option>
                      <option value="Exam">Examination</option>
                      <option value="Revision">Revision Block</option>
                      <option value="Assignment">Assignment Due</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400">Target Time</label>
                    <input
                      name="time"
                      type="time"
                      defaultValue="10:00"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-white/10 rounded-lg text-xs font-mono uppercase text-zinc-300 focus:outline-none focus:border-[#ff4625]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#08090b] border border-white/5 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase">Selected Date</span>
                  <span className="font-mono text-zinc-200 font-bold">{format(selectedDate, 'MMMM do, yyyy')}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff4625] hover:bg-[#ff5738] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-lg transition-all"
                >
                  Commit to Timetable
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