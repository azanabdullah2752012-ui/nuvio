import { dataService } from './dataService';
import { authService } from './authService';
import { BOSSES } from './gamificationService';

export const revisionService = {
  // Calculates the revision queue: chapters where the user scored < 80% on quizzes
  getRevisionQueue: async () => {
    try {
      const quizzes = await dataService.list('quiz_scores');
      if (!quizzes || quizzes.length === 0) return [];

      // Group by unique chapter keys and keep the latest attempt
      const latestQuizzes = {};
      quizzes.forEach(q => {
        const key = `${q.grade}_${q.subject}_${q.chapter_title}`;
        const currentDate = new Date(q.completed_at || q.created_at || 0);
        
        if (!latestQuizzes[key] || new Date(latestQuizzes[key].completed_at || latestQuizzes[key].created_at || 0) < currentDate) {
          latestQuizzes[key] = q;
        }
      });

      // Filter attempts with score < 80%
      const queue = [];
      Object.keys(latestQuizzes).forEach(key => {
        const attempt = latestQuizzes[key];
        const accuracy = attempt.total > 0 ? (attempt.score / attempt.total) * 100 : 0;
        
        if (accuracy < 80) {
          queue.push({
            key,
            grade: attempt.grade,
            subject: attempt.subject,
            chapterTitle: attempt.chapter_title,
            score: attempt.score,
            total: attempt.total,
            accuracy: Math.round(accuracy),
            date: new Date(attempt.completed_at || attempt.created_at || 0).toLocaleDateString()
          });
        }
      });

      // Sort by lowest accuracy first (highest priority)
      return queue.sort((a, b) => a.accuracy - b.accuracy);
    } catch (e) {
      console.warn("Could not retrieve revision queue:", e);
      return [];
    }
  },

  // Groups accuracy statistics per subject
  getSubjectStrengths: async () => {
    try {
      const quizzes = await dataService.list('quiz_scores');
      const subjects = {};

      quizzes.forEach(q => {
        const sub = q.subject;
        if (!subjects[sub]) {
          subjects[sub] = { score: 0, total: 0, count: 0 };
        }
        subjects[sub].score += q.score;
        subjects[sub].total += q.total;
        subjects[sub].count += 1;
      });

      const summary = {};
      Object.keys(subjects).forEach(sub => {
        const data = subjects[sub];
        const accuracy = data.total > 0 ? (data.score / data.total) * 100 : 0;
        
        let status = 'weak'; // 'strong' | 'developing' | 'weak'
        if (accuracy >= 80) status = 'strong';
        else if (accuracy >= 50) status = 'developing';

        summary[sub] = {
          subject: sub,
          accuracy: Math.round(accuracy),
          quizzesCount: data.count,
          status
        };
      });

      return summary;
    } catch (e) {
      console.warn("Could not calculate subject strengths:", e);
      return {};
    }
  },

  // Recommends study pathways based on user profile gaps
  getPersonalizedRecommendations: async () => {
    try {
      const queue = await revisionService.getRevisionQueue();
      const recommendations = [];

      // 1. Prioritize Revision of failed quizzes
      if (queue.length > 0) {
        const topWeak = queue[0];
        recommendations.push({
          type: 'revision',
          title: `Revisit ${topWeak.chapterTitle}`,
          desc: `You scored ${topWeak.score}/${topWeak.total} (${topWeak.accuracy}%) on this quiz. Re-study the key ideas and practice again.`,
          subject: topWeak.subject,
          grade: topWeak.grade,
          actionLabel: 'Re-Study Chapter'
        });
      }

      // 2. Recommend cards study if tricky flashcards exist
      const localDBStr = localStorage.getItem('acadevance_local_db');
      if (localDBStr) {
        const localDB = JSON.parse(localDBStr);
        const decks = localDB.decks || [];
        if (decks.length > 0) {
          const randomDeck = decks[Math.floor(Math.random() * decks.length)];
          recommendations.push({
            type: 'spaced_repetition',
            title: `Review cards: ${randomDeck.title}`,
            desc: `Keep your memory sharp! Review this flashcard deck to maintain active spaced recall.`,
            subject: randomDeck.subject || 'General',
            actionLabel: 'Start Spaced Review',
            route: '/flashcards'
          });
        }
      }

      // 3. Subject Boss Reminder if any HP remains
      const user = authService.me();
      if (user && user.boss_chapter_progress) {
        const progress = user.boss_chapter_progress;
        const activeBossId = Object.keys(progress).find(id => progress[id]?.status === 'active');
        if (activeBossId) {
          const bossMeta = BOSSES?.find?.(b => b.id === activeBossId);
          if (bossMeta) {
            recommendations.push({
              type: 'boss_battle',
              title: `Challenge ${bossMeta.name} ${bossMeta.emoji}`,
              desc: `${bossMeta.name} is active in your study path! Solve quizzes or homework in ${bossMeta.subject} to damage it.`,
              subject: bossMeta.subject,
              actionLabel: 'Enter Raid Arena',
              route: '/boss-raid'
            });
          }
        }
      }

      // Default recommendation if queue is empty
      if (recommendations.length === 0) {
        recommendations.push({
          type: 'explore',
          title: 'Conquer the Chapter World Map',
          desc: 'Select a subject, unlock biomes, and review summaries on your vertical Quest Path.',
          actionLabel: 'View Journey Map',
          route: '/journey-map'
        });
      }

      return recommendations;
    } catch (e) {
      console.warn("Could not generate recommendations:", e);
      return [];
    }
  }
};
