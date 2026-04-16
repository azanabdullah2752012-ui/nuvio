import { supabase } from '../lib/supabase';
import { authService } from './authService';

class FocusService {
  constructor() {
    this.buffer = [];
    this.FLUSH_THRESHOLD = 5; // Batch every 5 sessions
    this.syncing = false;
  }

  async logSession(durationMinutes, subject) {
    const user = authService.me();
    if (!user) return;

    const session = {
      user_id: user.id,
      duration_minutes: durationMinutes,
      subject: subject || 'General Study',
      completed_at: new Date().toISOString()
    };

    this.buffer.push(session);

    // 🚀 BATCH LOGIC: Flush if threshold reached or if high priority
    if (this.buffer.length >= this.FLUSH_THRESHOLD) {
      await this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0 || this.syncing) return;

    this.syncing = true;
    const itemsToSync = [...this.buffer];
    this.buffer = []; // Clear buffer immediately to prevent duplicates

    try {
      const { error } = await supabase
        .from('focus_sessions')
        .insert(itemsToSync);

      if (error) {
        console.error("NEURAL ANALYTICS SYNC FAILURE:", error);
        // Put back in buffer on failure
        this.buffer = [...itemsToSync, ...this.buffer];
      }
    } catch (err) {
      console.error("NEURAL ANALYTICS CRITICAL FAILURE:", err);
    } finally {
      this.syncing = false;
    }
  }
}

export const focusService = new FocusService();

// Lifecycle: Final flush on session termination
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => focusService.flush());
}
