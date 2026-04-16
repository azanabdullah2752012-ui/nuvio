import { supabase } from '../lib/supabase';
import { authService } from './authService';

export const messageService = {
  listContacts: async () => {
    const user = authService.me();
    if (!user) return [];

    // Real world app would have a 'contacts' table or unique recipient_ids from messages
    // For this tier, we fetch the 10 most recently interacted profiles
    const { data: recentMsgs } = await supabase
      .from('messages')
      .select('sender_id, recipient_id')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(20);

    const contactIds = [...new Set(recentMsgs?.flatMap(m => [m.sender_id, m.recipient_id]) || [])]
      .filter(id => id !== user.id);

    if (contactIds.length === 0) {
      // Return a set of system/onboarding contacts if none exist
      return [
        { id: 'system', name: 'Nova Bot 🤖', avatar: '🤖', lastMsg: 'I am hardcoded for logic help.', time: 'Always', unread: 0 },
      ];
    }

    const { data: contacts } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_emoji')
      .in('id', contactIds);

    return (contacts || []).map(c => ({
      id: c.id,
      name: c.full_name,
      avatar: c.avatar_emoji,
      lastMsg: 'Open channel...',
      time: 'Recent',
      unread: 0
    }));
  },

  getChat: async (contactId) => {
    const user = authService.me();
    if (!user) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) return [];
    return data.map(m => ({
      id: m.id,
      from: m.sender_id === user.id ? 'me' : m.sender_id,
      text: m.content,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  },

  sendMessage: async (contactId, text) => {
    const user = authService.me();
    if (!user) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: user.id,
        recipient_id: contactId,
        content: text
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      from: 'me',
      text: data.content,
      time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
