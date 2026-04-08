const STORAGE_KEY = 'openrouter_api_key';
const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';
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
      content: "You are Nova, the AI tutor for the Nuvio gamified learning platform. Be encouraging, use emojis occasionally ⚡, and help students master their subjects through positive reinforcement."
    };

    // Format messages: ensure they are objects
    let formattedMessages = [];
    if (typeof messages === 'string') {
      formattedMessages = [{ role: 'user', content: messages }];
    } else if (Array.isArray(messages)) {
      formattedMessages = messages.map(m => {
        if (typeof m === 'string') return { role: 'user', content: m };
        return { role: m.role, content: m.text || m.content };
      });
    }

    const payload = [systemInstruction, ...formattedMessages];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Nuvio Rebuild",
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
        // Handle specific provider errors more gracefully
        if (data.error.message?.includes('provider')) {
          return "Nova's brain provider is taking a nap. Let's try again in a few seconds! ⚡";
        }
        return `ERROR: ${data.error.message || 'Unknown AI error'}`;
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
