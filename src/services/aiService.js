const STORAGE_KEYS = {
  openrouter: 'openrouter_api_key',
  groq: 'groq_api_key',
  gemini: 'gemini_api_key'
};

const DEFAULT_KEYS = {
  openrouter: '',
  groq: '',
  gemini: ''
};

// Free OpenRouter models
const MODELS = {
  reasoning: 'nvidia/nemotron-super-49b-v1:free',   // Best for complex reasoning & math
  academic:  'qwen/qwen3-235b-a22b:free',            // Best for explanations & essays
  synthesis: 'google/gemma-3-27b-it:free'            // General purpose & summaries
};

const NOVA_SYSTEM = `You are Nova, the AI academic companion for Nuvio — a gamified study platform. 
You are encouraging, sharp, and use emojis ⚡🧠🎯. 
Help students understand concepts clearly, create study plans, quiz them, and explain difficult topics with simple language and real examples.
Keep answers concise but complete. Use bullet points for lists.`;

export const aiService = {
  setKey: (provider, key) => {
    localStorage.setItem(STORAGE_KEYS[provider], key);
  },

  getKey: (provider) => {
    return localStorage.getItem(STORAGE_KEYS[provider]) || DEFAULT_KEYS[provider];
  },

  hasAnyKey: () => {
    return !!(aiService.getKey('gemini') || aiService.getKey('groq') || aiService.getKey('openrouter'));
  },

  chat: async (messages) => {
    // Normalize messages
    let formatted = [];
    if (typeof messages === 'string') {
      formatted = [{ role: 'user', content: messages }];
    } else {
      formatted = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || m.text || '' }]
        }));
    }

    const lastMsg = (formatted[formatted.length - 1]?.parts?.[0]?.text || '').toLowerCase();

    // 1. Try Gemini Direct API (fastest, user likely has key)
    const geminiKey = aiService.getKey('gemini');
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: NOVA_SYSTEM }] },
              contents: formatted,
              generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
          }
        );
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
        console.warn('Gemini response empty:', data);
      } catch (e) {
        console.warn('Gemini failed:', e);
      }
    }

    // 2. Try Groq (Llama 3.3)
    const groqKey = aiService.getKey('groq');
    if (groqKey) {
      try {
        const openAiMessages = messages.map ? messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content || m.text || ''
        })) : [{ role: 'user', content: String(messages) }];

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'system', content: NOVA_SYSTEM }, ...openAiMessages],
            temperature: 0.7,
            max_tokens: 1024
          })
        });
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
      } catch (e) {
        console.warn('Groq failed:', e);
      }
    }

    // 3. Try OpenRouter (free models)
    const orKey = aiService.getKey('openrouter');
    if (orKey) {
      try {
        const openAiMessages = messages.map ? messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content || m.text || ''
        })) : [{ role: 'user', content: String(messages) }];

        // Neural Router — pick best model for the query type
        const lastText = lastMsg;
        let model = MODELS.synthesis; // default
        if (lastText.includes('solve') || lastText.includes('calc') || 
            lastText.includes('code') || lastText.includes('why') ||
            lastText.includes('proof') || lastText.includes('derive')) {
          model = MODELS.reasoning;  // Nemotron 120B — heavy reasoning
        } else if (lastText.includes('explain') || lastText.includes('essay') ||
                   lastText.includes('history') || lastText.includes('quiz') ||
                   lastText.includes('french') || lastText.includes('science')) {
          model = MODELS.academic;   // Qwen 80B — academic depth
        }

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${orKey}`,
            'HTTP-Referer': 'https://azanabdullah2752012-ui.github.io/nuvio/',
            'X-Title': 'Nuvio AI',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: NOVA_SYSTEM }, ...openAiMessages],
            temperature: 0.7
          })
        });
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
        console.error('OpenRouter error:', data.error?.message || data.error);
      } catch (e) {
        console.error('OpenRouter fetch failed:', e);
      }
    }

    // 4. Smart local fallback
    return aiService.localHeuristic(lastMsg);
  },

  localHeuristic: (msg) => {
    const m = msg.toLowerCase();
    if (m.includes('what can you do') || m.includes('help') || m.includes('capabilities'))
      return `I'm Nova ⚡ — your AI study companion! Here's what I can do:\n\n• 📚 **Explain** any subject (history, science, math, literature)\n• 🧠 **Quiz** you on any topic\n• 📅 **Create study plans** and schedules\n• ✍️ **Help with essays** and writing\n• 🔢 **Solve math** problems step by step\n• 🌍 **Teach languages** (French, Spanish, etc.)\n\nTo unlock my full AI brain, add your **Gemini API key** in the Admin Hub. It's free at aistudio.google.com! 🎯`;
    if (m.includes('french') || m.includes('verb'))
      return `🇫🇷 **French Verbs** — Let's go!\n\n**Regular -ER verbs** (parler = to speak):\n• je parle • tu parles • il/elle parle\n• nous parlons • vous parlez • ils parlent\n\n**Key irregulars:**\n• être (to be): je suis, tu es, il est\n• avoir (to have): j'ai, tu as, il a\n• aller (to go): je vais, tu vas, il va\n\nWant me to quiz you? Just say "Quiz me on French verbs!" 🎯`;
    if (m.includes('photosynthesis'))
      return `🌿 **Photosynthesis**\n\nPlants convert: **sunlight + CO₂ + water → glucose + oxygen**\n\nEquation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\n**Two stages:**\n1. 🌞 Light reactions (in thylakoids) — capture energy\n2. 🔄 Calvin cycle (in stroma) — build sugar\n\nWant me to quiz you on this? 🎯`;
    if (m.includes('history') || m.includes('summarize'))
      return `🏛️ **History Mode Active!**\n\nI can summarize and explain any historical period or event! Tell me specifically what you need:\n• "Explain WW2"\n• "Summarize the French Revolution"\n• "What caused the Cold War?"\n\nOnce you add a Gemini API key in Admin Hub, I can answer anything in full detail! ⚡`;
    if (m.includes('math') || m.includes('solve') || m.includes('calc'))
      return `🔢 **Math Mode!**\n\nI can help with:\n• Algebra & equations\n• Calculus (derivatives, integrals)\n• Statistics & probability\n• Geometry & trigonometry\n\nTell me the specific problem — like "Solve: 2x + 5 = 13" — and I'll walk you through it step by step! Add your Gemini key for full problem-solving power. ⚡`;
    if (m.includes('quiz'))
      return `🧠 **Quiz Mode!**\n\nLet's test your knowledge! Tell me the subject:\n• "Quiz me on the Solar System"\n• "Test me on quadratic equations"\n• "Quiz me on French verbs"\n\nI'll fire 5 questions at you with answers! ⚡`;
    if (m.includes('essay') || m.includes('write') || m.includes('plan'))
      return `✍️ **Essay & Writing Mode!**\n\nI can help you:\n• Structure your essay (intro → body → conclusion)\n• Create a thesis statement\n• Build a study schedule\n• Outline complex topics\n\nTell me what you're writing about and I'll get you started! 📝`;
    if (m.includes('hi') || m.includes('hello') || m.includes('hey'))
      return `Hey there! ⚡ I'm Nova, your Nuvio AI tutor.\n\nAsk me to:\n• Explain a topic\n• Quiz you on a subject  \n• Create a study plan\n• Help with math or essays\n\nWhat are we conquering today? 🎯`;
    // Generic response for anything else
    return `Nova ⚡ here! I'm running in local mode right now — add your **free Gemini API key** in the Admin Hub to unlock my full intelligence.\n\nIn local mode I can help with: French verbs, photosynthesis, history summaries, math steps, essay planning, and quiz prep.\n\nWhat subject are you studying? Tell me the topic and I'll do my best! 🧠`;
  }
};

