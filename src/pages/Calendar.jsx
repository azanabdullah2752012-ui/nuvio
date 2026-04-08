import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, 
  MapPin, Clock, Calendar as CalendarIcon,
  Search, Filter, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';
import { dataService } from '../services/dataService';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const list = dataService.list('events');
    if (list.length === 0) {
      const initial = [
        { id: '1', title: 'Calculus Exam', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00 AM', type: 'Exam' },
        { id: '2', title: 'Group Study', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '02:00 PM', type: 'Meeting' },
      ];
      initial.forEach(e => dataService.create('events', e));
      setEvents(initial);
    } else {
      setEvents(list);
    }
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      title: formData.get('title'),
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: formData.get('time'),
      type: formData.get('type')
    };
    const saved = dataService.create('events', newEvent);
    setEvents([...events, saved]);
    setShowAdd(false);
  };

  const deleteEvent = (id) => {
    dataService.delete('events', id);
    setEvents(events.filter(e => e.id !== id));
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 mb-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{format(currentMonth, 'MMMM yyyy')}</h1>
        <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Don't miss a beat. Crush your schedule.</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-4 px-2">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-black text-text-muted uppercase tracking-widest">{d}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const dayEvents = events.filter(e => e.date === format(day, 'yyyy-MM-dd'));

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDate(day)}
              className={`
                min-h-[100px] p-3 rounded-2xl border transition-all cursor-pointer relative
                ${isSelected ? 'bg-nuvio-purple-500/10 border-nuvio-purple-500' : 'bg-white/[0.02] border-white/5'}
                ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
              `}
            >
              <span className={`text-xs font-black ${isSelected ? 'text-nuvio-purple-400' : 'text-text-muted'}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 2).map(e => (
                  <div key={e.id} className="text-[8px] font-black uppercase tracking-tighter bg-nuvio-purple-500/20 text-nuvio-purple-300 px-1.5 py-0.5 rounded truncate">
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && <div className="text-[8px] font-black text-text-muted pl-1">+{dayEvents.length - 2} more</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
      <div className="lg:col-span-2">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <div className="space-y-8">
        <div className="nv-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Schedule</h2>
            <button onClick={() => setShowAdd(true)} className="p-2 bg-nuvio-purple-500 rounded-lg text-white">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5 pb-2">
              Events for {format(selectedDate, 'MMM do, yyyy')}
            </div>
            
            <AnimatePresence mode="popLayout">
              {events.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd')).length > 0 ? (
                events.filter(e => e.date === format(selectedDate, 'yyyy-MM-dd')).map(e => (
                  <motion.div 
                    key={e.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-1 h-10 rounded-full bg-nuvio-purple-500" />
                    <div className="flex-1">
                      <h4 className="font-black text-white text-sm uppercase tracking-tight">{e.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase">
                        <Clock className="w-3 h-3" /> {e.time}
                      </div>
                    </div>
                    <button onClick={() => deleteEvent(e.id)} className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-nuvio-red transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="py-10 text-center opacity-50 grayscale">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-text-muted" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No plans for this day</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-background-base/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="nv-card w-full max-w-md p-10 space-y-8 relative z-10">
              <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">Add Event</h2>
              <form onSubmit={handleAddEvent} className="space-y-6">
                <div className="space-y-2">
                  <label className="nv-label">Event Title</label>
                  <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nuvio-purple-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="nv-label">Time</label>
                    <input name="time" placeholder="09:00 AM" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nuvio-purple-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="nv-label">Type</label>
                    <select name="type" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-nuvio-purple-500">
                      <option value="Exam">Exam</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Study">Study</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 nv-btn-secondary">Cancel</button>
                  <button type="submit" className="flex-1 nv-btn-primary">Save Event</button>
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
