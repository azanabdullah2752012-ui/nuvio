const STORAGE_KEY = 'nuvio_messages';

export const messageService = {
  listContacts: () => {
    return [
      { id: 'c1', name: 'Nova Bot 🤖', avatar: '🤖', lastMsg: 'Ready for a quick quiz?', time: '2m ago', unread: 1 },
      { id: 'c2', name: 'Alex Johnson', avatar: '🦊', lastMsg: 'Check out the new Study Monopoly board!', time: '1h ago', unread: 2 },
      { id: 'c3', name: 'Professor Oak', avatar: '👨‍🏫', lastMsg: 'Your essay was impressive.', time: 'Yesterday', unread: 0 },
    ];
  },

  getChat: (contactId) => {
    const data = localStorage.getItem(`${STORAGE_KEY}_${contactId}`);
    return data ? JSON.parse(data) : [
      { id: 'm1', from: contactId, text: 'Hey! Ready to crush today\'s goals?', time: '9:00 AM' },
      { id: 'm2', from: 'me', text: 'Absolutely! Just finished the Math assignment.', time: '9:05 AM' },
    ];
  },

  sendMessage: (contactId, text) => {
    const chat = messageService.getChat(contactId);
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      from: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...chat, newMessage];
    localStorage.setItem(`${STORAGE_KEY}_${contactId}`, JSON.stringify(updated));
    return newMessage;
  }
};
