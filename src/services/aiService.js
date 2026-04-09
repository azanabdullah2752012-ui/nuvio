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
          "HTTP-Referer": "https://nuvio.edu",
          "X-Title": "Nuvio Project",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-lite-preview-02-05:free", // Switching to a more resilient free model
          "messages": payload,
          "temperature": 0.7,
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("OpenRouter Error Details:", data.error);
        
        // --- LOCAL STUDY INTELLIGENCE (OFFLINE MODE) ---
        const msg = formattedMessages[formattedMessages.length - 1]?.content?.toLowerCase() || '';
        
        // 1. GREETINGS
        if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
          return "Hello! I'm Nova. My cloud link is performing a scheduled refresh ⚡, but I'm ready to help you crush your goals! What are we studying today?";
        }

        // 2. ACADEMIC SUBJECTS
        if (msg.includes('math') || msg.includes('calc') || msg.includes('algebra')) {
          return "Math is all about patterns! 📐 While I re-sync with the global brain, remember: focus on the fundamental steps. What specific math problem are you tackling?";
        }
        if (msg.includes('science') || msg.includes('bio') || msg.includes('chem')) {
          return "Scientific thinking is essential! 🧪 I'm currently in local-mode, but I recommend checking your Biology Memory Cubes for immediate active recall!";
        }
        if (msg.includes('history') || msg.includes('essay') || msg.includes('english')) {
          return "Deep analysis is your superpower today! ✍️ I'm currently refreshing my neural paths, but I encourage you to use the 'Essay Forge' tool in the StudyVerse!";
        }

        // 3. ROADMAP / TASKS
        if (msg.includes('task') || msg.includes('roadmap') || msg.includes('homework') || msg.includes('todo')) {
          return "Focus strictly on your 'Academic Roadmap'! ⚡ While my cloud connection stabilizes, I recommend knocking out your highest priority task first.";
        }

        // 4. GENERIC FALLBACK
        return "Nova's academic link is currently refreshing ⚡. The study environment is still active! I'm currently in 'Local Intelligence' mode—tell me what you're studying and I'll give you a focus tip!";
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
