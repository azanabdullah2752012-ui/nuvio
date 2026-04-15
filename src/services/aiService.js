const STORAGE_KEYS = {
  openrouter: 'openrouter_api_key',
  groq: 'groq_api_key',
  gemini: 'gemini_api_key'
};

const DEFAULT_KEYS = {
  openrouter: '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',
  groq: '',
  gemini: ''
};

const MODELS = {
  reasoning: "deepseek/deepseek-r1:free",       // OpenRouter
  academic: "llama-3.3-70b-versatile",            // Groq direct
  synthesis: "google/gemini-2.0-flash-lite-preview-02-05:free" // OpenRouter
};

const NOVA_SYSTEM = "You are Nova, the AI academic companion for Nuvio — a gamified study platform. You are encouraging, sharp, and use emojis like ⚡🧠🎯. Help students understand concepts clearly, create study plans, quiz them, and explain difficult topics with simple language and real examples.";

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

    // Normalize messages to {role, content}
    let formatted = [];
    if (typeof messages === 'string') {
      formatted = [{ role: 'user', content: messages }];
    } else {
      formatted = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || m.text || ''
      }));
    }

    const lastMsg = formatted[formatted.length - 1].content.toLowerCase();
    const payload = [{ role: 'system', content: NOVA_SYSTEM }, ...formatted];

    // Route: use Groq directly if key available and academic query
    const isAcademic = lastMsg.includes('explain') || lastMsg.includes('history') || 
                       lastMsg.includes('essay') || lastMsg.includes('quiz') ||
                       lastMsg.includes('study') || lastMsg.includes('french') ||
                       lastMsg.includes('science') || lastMsg.includes('math');

    if (groqKey && isAcademic) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: MODELS.academic,
            messages: payload,
            temperature: 0.7,
            max_tokens: 1024
          })
        });
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      } catch (e) {
        console.warn('Groq failed, falling back to OpenRouter', e);
      }
    }

    // Default: OpenRouter (DeepSeek R1 for reasoning, Gemini synthesis otherwise)
    if (orKey) {
      const model = (lastMsg.includes('solve') || lastMsg.includes('calc') || 
                     lastMsg.includes('code') || lastMsg.includes('why'))
        ? MODELS.reasoning : MODELS.synthesis;
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${orKey}`,
            'HTTP-Referer': 'https://azanabdullah2752012-ui.github.io/nuvio/',
            'X-Title': 'Nuvio AI',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model, messages: payload, temperature: 0.6 })
        });
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
        console.error('OpenRouter error:', data.error);
      } catch (e) {
        console.error('OpenRouter fetch failed:', e);
      }
    }

    // Final fallback
    return aiService.localHeuristic(lastMsg);
  },

  localHeuristic: (msg) => {
    if (msg.includes('who are you') || msg.includes('what are you'))
      return "I'm Nova ⚡ — your AI study companion on Nuvio! I tutor you through subjects, quiz you, and help you level up academically. My full neural core needs API keys from the Admin Hub to unlock — but I can still help with basics right now!";
    if (msg.includes('french') || msg.includes('verb'))
      return "🇫🇷 French verbs! Let's go. Regular -ER verbs (like 'parler'): je parle, tu parles, il/elle parle, nous parlons, vous parlez, ils/elles parlent. Want me to quiz you? Try typing: 'Quiz me on irregular French verbs!'";
    if (msg.includes('photosynthesis'))
      return "🌿 Photosynthesis: Plants convert sunlight + CO₂ + water → glucose + oxygen. The equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. It happens in the chloroplasts. Want a deeper breakdown of the light vs dark reactions?";
    if (msg.includes('study') || msg.includes('schedule') || msg.includes('plan'))
      return "📅 Study plan activated! For best retention: 25-min focused sessions (Pomodoro) → 5-min break. Review new material within 24 hours. Use Nuvio's Focus Timer + Flashcards for maximum XP gains! 🎯";
    if (msg.includes('quiz'))
      return "🧠 Quiz mode! Ask me something like 'Quiz me on the French Revolution' or 'Test me on quadratic equations' and I'll fire questions at you!";
    if (msg.includes('hello') || msg.includes('hi'))
      return "Hey there! ⚡ I'm Nova, your Nuvio AI tutor. Ask me to explain a topic, quiz you, create a study plan, or help with an essay. What are we conquering today?";
    return "Nova here ⚡. My full intelligence needs API keys via the Admin Hub — but I'm ready to help with study topics, quizzes, and subject explanations in local mode. What subject are we tackling?";
  }
};
