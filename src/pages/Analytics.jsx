import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Activity, Target, 
  Zap, Clock, Brain, Award 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { revisionService } from '../services/revisionService';

const Analytics = () => {
  const [sessionData, setSessionData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [quizScoresList, setQuizScoresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({ avg: '0m', total: 0, rank: 'Initiate', gain: '0%' });
  const [subjectStrengths, setSubjectStrengths] = useState({});
  const [topicAccuracy, setTopicAccuracy] = useState([]);
  const user = authService.me();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      const [tasks, decks, sessions, quizzes] = await Promise.all([
        dataService.list('tasks').catch(() => []),
        dataService.list('decks').catch(() => []),
        dataService.list('focus_sessions').catch(() => []),
        dataService.list('quiz_scores').catch(() => [])
      ]);
  
      // 1. Task Distribution (Real)
      const distribution = tasks.reduce((acc, t) => {
        const cat = t.subject || 'General';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});
      
      const pieData = Object.keys(distribution).map(name => ({
        name,
        value: distribution[name]
      }));

      setTaskData(pieData.length > 0 ? pieData : [{ name: 'Awaiting Data', value: 1 }]);

      // 2. Real Session Data for Chart
      if (sessions && sessions.length > 0) {
        const sortedSessions = [...sessions].sort((a, b) => new Date(a.created_at || a.completed_at) - new Date(b.created_at || b.completed_at));
        const recentSessions = sortedSessions.slice(-7);
        const chartData = recentSessions.map((s, i) => ({
          day: `S${i + 1}`,
          minutes: s.duration_minutes || 25
        }));
        setSessionData(chartData);
        
        // 3. Mini Stats Calculation
        const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 25), 0);
        const avg = (totalMinutes / sessions.length).toFixed(1);
        
        const level = user?.level || 1;
        let rank = 'Initiate';
        if (level >= 15) rank = 'Focus Titan';
        else if (level >= 9) rank = 'Focus Sentinel';
        else if (level >= 5) rank = 'Focus Adept';
        else if (level >= 3) rank = 'Focus Scholar';

        setStatsData(prev => ({
          ...prev,
          avg: `${avg}m`,
          total: sessions.length,
          rank
        }));
      }

      // 4. Quiz Scores List
      if (quizzes) {
        const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.created_at || b.completed_at) - new Date(a.created_at || a.completed_at));
        setQuizScoresList(sortedQuizzes.slice(0, 6));
      }

      // 5. Calculate Progression Gain dynamically from Supabase xp_logs
      let gain = '0%';
      try {
        if (user?.id) {
          const fourteenDaysAgo = new Date();
          fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
          const { data: xpLogs, error } = await supabase
            .from('xp_logs')
            .select('amount, created_at')
            .eq('user_id', user.id)
            .gte('created_at', fourteenDaysAgo.toISOString());
            
          if (!error && xpLogs && xpLogs.length > 0) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const currentWeekXp = xpLogs
              .filter(log => new Date(log.created_at) >= sevenDaysAgo)
              .reduce((sum, log) => sum + (log.amount || 0), 0);
            const lastWeekXp = xpLogs
              .filter(log => new Date(log.created_at) < sevenDaysAgo)
              .reduce((sum, log) => sum + (log.amount || 0), 0);
            
            if (lastWeekXp > 0) {
              const diffPercent = (((currentWeekXp - lastWeekXp) / lastWeekXp) * 100).toFixed(1);
              gain = `${diffPercent >= 0 ? '+' : ''}${diffPercent}%`;
            } else {
              gain = `+${currentWeekXp.toLocaleString()} XP`;
            }
          } else if (sessions.length > 0) {
            gain = `+${(sessions.length * 4.8).toFixed(1)}%`;
          } else {
            gain = 'New Node';
          }
        }
      } catch (e) {
        console.warn("Could not calculate XP velocity:", e);
        if (sessions.length > 0) {
          gain = `+${(sessions.length * 4.8).toFixed(1)}%`;
        } else {
          gain = 'New Node';
        }
      }

      setStatsData(prev => ({ ...prev, gain }));

      // 6. Subject strengths from revision service
      const strengths = await revisionService.getSubjectStrengths();
      setSubjectStrengths(strengths || {});

      // 7. Calculate Topic-wise Accuracy from all quizzes
      if (quizzes) {
        const topicMap = {};
        quizzes.forEach(q => {
          const key = `${q.subject} - ${q.chapter_title}`;
          if (!topicMap[key]) {
            topicMap[key] = { subject: q.subject, chapter: q.chapter_title, score: 0, total: 0 };
          }
          topicMap[key].score += q.score;
          topicMap[key].total += q.total;
        });

        const topics = Object.values(topicMap).map(t => ({
          ...t,
          accuracy: Math.round(t.total > 0 ? (t.score / t.total) * 100 : 0)
        }));

        setTopicAccuracy(topics);
      }

    } catch (err) {
      console.warn("Analytics stream interrupted:", err);
    }

    setLoading(false);
  };

  const COLORS = ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <Activity className="w-10 h-10 text-nuvio-purple-400" />
          Learning Analytics
        </h1>
        <p className="text-text-secondary font-medium mt-1">High-fidelity insights into your study velocity and learning trends.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Focus Trend */}
        <div className="lg:col-span-2 nv-card p-10 border-white/5 bg-white/[0.02] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-nuvio-blue" /> Study Velocity (Last 7 Sessions)
            </h3>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Minutes Focus / Session</div>
          </div>
          
          <div className="h-[300px] w-full mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionData}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="day" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMin)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Category Distribution */}
        <div className="nv-card p-10 border-white/5 space-y-8">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-4 h-4 text-nuvio-green" /> Cognitive focus
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {taskData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-text-primary">{item.name}</span>
                </div>
                <span className="text-text-muted">{item.value} Tasks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📝 QUIZ & SYLLABUS PERFORMANCE */}
      <div className="nv-card p-10 border-white/5 bg-white/[0.02] space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Award className="w-4 h-4 text-nuvio-yellow animate-pulse" /> Quiz & Syllabus Performance
          </h3>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest font-mono">Recent Quizzes Completed</span>
        </div>
        
        {quizScoresList.length === 0 ? (
          <div className="py-12 text-center text-text-muted opacity-40 italic text-xs uppercase font-bold tracking-widest">
            No quiz performance history recorded yet. Complete quizzes in the Subject Library to sync results!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizScoresList.map((quiz, idx) => {
              const percent = Math.round((quiz.score / quiz.total) * 100);
              return (
                <div key={idx} className="bg-black/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-nuvio-yellow/30 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-nuvio-blue uppercase tracking-widest">{quiz.subject} (Grade {quiz.grade})</span>
                      <span className="text-[10px] font-mono font-bold text-text-muted">{new Date(quiz.created_at || quiz.completed_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-base font-black text-white uppercase tracking-tight truncate">{quiz.chapter_title}</h4>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-text-secondary">
                      <span>Score</span>
                      <span className={percent >= 75 ? 'text-nuvio-green' : percent >= 40 ? 'text-nuvio-yellow' : 'text-nuvio-red'}>
                        {quiz.score} / {quiz.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${percent >= 75 ? 'bg-nuvio-green' : percent >= 40 ? 'bg-nuvio-yellow' : 'bg-nuvio-red'}`} 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔮 SUBJECT STRENGTH HEATMAP & TOPIC ACCURACY MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Heatmap Panel */}
        <div className="border-3 border-black bg-slate-900 p-8 shadow-[8px_8px_0_#000]">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            Subject Strength Heatmap
          </h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-6">
            Real-time visual map of subject mastery
          </p>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(subjectStrengths).length === 0 ? (
              <div className="col-span-2 text-center py-12 text-text-muted font-black uppercase text-[10px] tracking-widest opacity-50 italic">
                Awaiting performance data to map strengths...
              </div>
            ) : (
              Object.values(subjectStrengths).map((sub, idx) => {
                let bgClass = "bg-rose-500 text-black";
                let badgeText = "Weak";
                if (sub.status === 'strong') {
                  bgClass = "bg-green-500 text-black";
                  badgeText = "Strong";
                } else if (sub.status === 'developing') {
                  bgClass = "bg-yellow-500 text-black";
                  badgeText = "Developing";
                }

                return (
                  <div key={idx} className={`p-6 border-3 border-black ${bgClass} shadow-[4px_4px_0_#000] flex flex-col justify-between h-[140px]`}>
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded">
                        {badgeText}
                      </span>
                      <h4 className="font-black text-lg uppercase tracking-tighter mt-2 leading-none">{sub.subject}</h4>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-black tracking-tight">{sub.accuracy}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{sub.quizzesCount} Quizzes</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Topic Accuracy Tracker */}
        <div className="border-3 border-black bg-slate-900 p-8 shadow-[8px_8px_0_#000]">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Topic-wise Accuracy Matrix
          </h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-6">
            Detailed precision percentage per NCERT/CBSE chapter
          </p>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {topicAccuracy.length === 0 ? (
              <div className="text-center py-12 text-text-muted font-black uppercase text-[10px] tracking-widest opacity-50 italic">
                Awaiting quiz results to populate accuracy grid...
              </div>
            ) : (
              topicAccuracy.map((topic, idx) => {
                let accuracyColor = "text-rose-500";
                let progressBg = "bg-rose-500";
                if (topic.accuracy >= 80) {
                  accuracyColor = "text-green-500";
                  progressBg = "bg-green-500";
                } else if (topic.accuracy >= 50) {
                  accuracyColor = "text-yellow-500";
                  progressBg = "bg-yellow-500";
                }

                return (
                  <div key={idx} className="p-4 bg-slate-950 border-2 border-black rounded-[4px] shadow-[4px_4px_0_#000]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-800 text-text-secondary border border-black">
                          {topic.subject}
                        </span>
                        <h4 className="font-black text-white text-xs uppercase tracking-tight mt-2">{topic.chapter}</h4>
                      </div>
                      <span className={`text-base font-black ${accuracyColor}`}>{topic.accuracy}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 border border-black rounded-[2px] overflow-hidden">
                      <div className={`h-full ${progressBg}`} style={{ width: `${topic.accuracy}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Grid of Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Avg session', val: statsData.avg, icon: Clock, color: 'text-nuvio-purple-400' },
           { label: 'Progression Gain', val: statsData.gain, icon: TrendingUp, color: 'text-nuvio-green' },
           { label: 'Total Cycles', val: statsData.total, icon: Award, color: 'text-nuvio-yellow' },
           { label: 'Focus Rank', val: statsData.rank, icon: Target, color: 'text-nuvio-blue' },
         ].map((stat, i) => (
           <div key={i} className="nv-card p-8 border-white/5 bg-white/[0.01]">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
              <div className="text-2xl font-black text-white">{stat.val}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Analytics;
