const STORAGE_KEYS = {
  openrouter: 'openrouter_api_key',
  groq: 'groq_api_key',
  gemini: 'gemini_api_key'
};

const DEFAULT_KEYS = {
  openrouter: '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',
  groq: '', // User will need to provide this in Admin
  gemini: '' // User will need to provide this in Admin
};

const MODELS = {
  reasoning: "deepseek/deepseek-r1:free",
  academic: "meta-llama/llama-3.3-70b-instruct",
  synthesis: "google/gemini-2.0-flash-lite-preview-02-05:free"
};

export const aiService = {
  setKey: (provider, key) => {
    localStorage.setItem(STORAGE_KEYS[provider], key);
  },

  getKey: (provider) => {
    return localStorage.getItem(STORAGE_KEYS[provider]) || DEFAULT_KEYS[provider];
  },

  chat: async (messages) => {
    const orKey = aiService.getKey('openrouter');
    const groqKey = aiService.getKey('groq');
    
    // Format messages
    let formattedMessages = [];
    if (typeof messages === 'string') {
      formattedMessages = [{ role: 'user', content: messages }];
    } else {
      formattedMessages = messages.map(m => ({
        role: m.role || 'user',
        content: m.content || m.text || ''
      }));
    }

    const lastMsg = formattedMessages[formattedMessages.length - 1].content.toLowerCase();
    
    // NEURAL ROUTER
    let selectedModel = MODELS.synthesis;
    let provider = 'openrouter';

    if (lastMsg.includes('solve') || lastMsg.includes('math') || lastMsg.includes('calc') || lastMsg.includes('code') || lastMsg.includes('why')) {
      selectedModel = MODELS.reasoning;
    } else if ((lastMsg.includes('explain') || lastMsg.includes('history') || lastMsg.includes('essay')) && groqKey) {
      selectedModel = MODELS.academic;
      // If we have a groq key, we could use Groq directly, but for now we'll route through OpenRouter 
      // as it's the unified bridge in this architecture unless the user asks for direct Groq calls.
    }

    const systemInstruction = {
      role: 'system',
      content: "You are Nova, the Triple-Core AI tutor for Nuvio. You combine the speed of Llama 3.3, the reasoning of DeepSeek R1, and the stability of Gemini. Be encouraging, use emojis ⚡, and help students master their subjects through high-precision feedback."
    };

    const payload = [systemInstruction, ...formattedMessages];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${orKey}`,
          "HTTP-Referer": "https://nuvio.edu",
          "X-Title": "Nuvio Project",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": selectedModel,
          "messages": payload,
          "temperature": 0.6,
        })
      });

      const data = await response.json();
      
      if (data.error || !data.choices || data.choices.length === 0) {
        console.error("Neural Core Error:", data.error);
        return aiService.localHeuristic(lastMsg);
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Fetch Error:", error);
      return aiService.localHeuristic(lastMsg);
    }
  },

  localHeuristic: (msg) => {
    if (msg.includes('who are you') || msg.includes('what are you')) {
      return "I am Nova, your Triple-Core academic companion. Currently operating on 'Local Heuristics' while my neural links refresh ⚡. I combine Llama, DeepSeek, and Gemini protocols for your study success!";
    }
    if (msg.includes('ww2') || msg.includes('history')) {
      return "History protocols active! 🏛️ Remember: World War II (1939-1945) was the most widespread war in history. Check your History Memory Cubes for the full data set!";
    }
    return "Nova's neural link is currently refreshing ⚡. The study environment is still active! I'm in 'Heuristic Mode'—what are we conquering today?";
  }
};
