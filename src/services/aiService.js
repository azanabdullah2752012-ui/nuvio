const STORAGE_KEY = 'openrouter_api_key';
const DEFAULT_MODEL = 'google/gemma-2-9b-it:free';
const DEFAULT_KEY = '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';

export const aiService = {
  setKey: (key) => {
    localStorage.setItem(STORAGE_KEY, key);
  },

  getKey: () => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_KEY;
  },

  chat: async (messages) => {
    const key = aiService.getKey();
    
    // System instruction for Nuvio
    const systemInstruction = {
      role: 'system',
      content: "You are Nova, the AI tutor for the Nuvio gamified learning platform. Be encouraging, use emojis occasionally ⚡, and help students master their subjects through positive reinforcement. Current logic: GEMMA-2 ACADEMIC CORE."
    };

    // Format messages: ensure they are objects
    let formattedMessages = [];
    if (typeof messages === 'string') {
      formattedMessages = [{ role: 'user', content: messages }];
    } else if (Array.isArray(messages)) {
      formattedMessages = messages.map(m => {
        if (typeof m === 'string') return { role: 'user', content: m };
        return { role: m.role, content: (m.text || m.content || '').toString() };
      });
    }

    const payload = [systemInstruction, ...formattedMessages];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": "https://nuvio.edu", // Fixed referer for OpenRouter stability
          "X-Title": "Nuvio Project",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": DEFAULT_MODEL, 
          "messages": payload,
          "temperature": 0.7,
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("OpenRouter Error Details:", data.error);
        
        // Handle identity or credits errors with a friendly educational fallback
        if (data.error.message?.includes('User not found') || data.error.code === 401 || data.error.code === 402) {
          return "Nova's academic link is currently refreshing ⚡. The study environment is still active, but full AI tutoring will resume in a moment! (Check your API balance or re-paste the key in Admin).";
        }
        
        return `ERROR: ${data.error.message || 'System pause'}`;
      }

      if (!data.choices || data.choices.length === 0) {
        return "Nova is thinking deeply, but couldn't find the words just yet. Try asking in a different way! ⚡";
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Fetch Error:", error);
      return "Nova is currently experiencing a connection hiccup. Please try again in a moment! ⚡";
    }
  }
};
