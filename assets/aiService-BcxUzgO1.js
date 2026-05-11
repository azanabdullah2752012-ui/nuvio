var e={openrouter:`openrouter_api_key`,groq:`groq_api_key`,gemini:`gemini_api_key`},t={openrouter:`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`,groq:``,gemini:``},n={reasoning:`nvidia/nemotron-3-super-120b-a12b:free`,academic:`qwen/qwen-turbo`,synthesis:`google/gemma-2-9b-it:free`},r=`You are Nova, the AI academic companion for Nuvio — a gamified study platform. 
You are encouraging, sharp, and use emojis ⚡🧠🎯. 
Help students understand concepts clearly, create study plans, quiz them, and explain difficult topics with simple language and real examples.
Keep answers concise but complete. Use bullet points for lists.`,i={setKey:(t,n)=>{if(!e[t]){console.error(`Invalid provider: ${t}`);return}localStorage.setItem(e[t],n),window.dispatchEvent(new CustomEvent(`nuvio_ai_key_updated`,{detail:{provider:t}}))},getKey:n=>localStorage.getItem(e[n])||t[n]||``,hasAnyKey:()=>!!(localStorage.getItem(e.gemini)||localStorage.getItem(e.groq)||localStorage.getItem(e.openrouter)),chat:async e=>{let t=[];t=typeof e==`string`?[{role:`user`,content:e}]:e.filter(e=>e.role!==`system`).map(e=>({role:e.role===`assistant`?`model`:`user`,parts:[{text:e.content||e.text||``}]}));let a=(t[t.length-1]?.parts?.[0]?.text||``).toLowerCase(),o=i.getKey(`gemini`);if(o&&o.startsWith(`AIza`))try{let e=await(await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${o}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({system_instruction:{parts:[{text:r}]},contents:t,generationConfig:{temperature:.7,maxOutputTokens:2048}})})).json(),n=e?.candidates?.[0]?.content?.parts?.[0]?.text;if(n)return n;if(e.error&&(console.error(`Gemini API Error:`,e.error.message),e.error.status===`UNAUTHENTICATED`))return`ERROR: The Gemini API key provided is invalid or expired. Please check your Admin Hub settings. 🔌`}catch(e){console.warn(`Gemini fetch failed:`,e)}let s=i.getKey(`groq`);if(s)try{let t=e.map?e.map(e=>({role:e.role===`assistant`?`assistant`:`user`,content:e.content||e.text||``})):[{role:`user`,content:String(e)}],n=await(await fetch(`https://api.groq.com/openai/v1/chat/completions`,{method:`POST`,headers:{Authorization:`Bearer ${s}`,"Content-Type":`application/json`},body:JSON.stringify({model:`llama-3.3-70b-versatile`,messages:[{role:`system`,content:r},...t],temperature:.7,max_tokens:1024})})).json();if(n.choices?.[0]?.message?.content)return n.choices[0].message.content}catch(e){console.warn(`Groq failed:`,e)}let c=i.getKey(`openrouter`);if(c)try{let t=e.map?e.map(e=>({role:e.role===`assistant`?`assistant`:`user`,content:e.content||e.text||``})):[{role:`user`,content:String(e)}],i=a,o=n.synthesis;i.includes(`solve`)||i.includes(`calc`)||i.includes(`code`)||i.includes(`why`)||i.includes(`proof`)||i.includes(`derive`)?o=n.reasoning:(i.includes(`explain`)||i.includes(`essay`)||i.includes(`history`)||i.includes(`quiz`)||i.includes(`french`)||i.includes(`science`))&&(o=n.academic);let s=await(await fetch(`https://openrouter.ai/api/v1/chat/completions`,{method:`POST`,headers:{Authorization:`Bearer ${c}`,"HTTP-Referer":`https://azanabdullah2752012-ui.github.io/nuvio/`,"X-Title":`Nuvio AI`,"Content-Type":`application/json`},body:JSON.stringify({model:o,messages:[{role:`system`,content:r},...t],temperature:.7})})).json();if(s.choices?.[0]?.message?.content)return s.choices[0].message.content;console.error(`OpenRouter error:`,s.error?.message||s.error)}catch(e){console.error(`OpenRouter fetch failed:`,e)}return i.localHeuristic(a)},localHeuristic:e=>{let t=e.toLowerCase();return t.includes(`what can you do`)||t.includes(`help`)||t.includes(`capabilities`)?`I'm Nova ⚡ — your AI study companion! Here's how I can help you excel:

• 📚 **Explain** any subject (history, science, math, literature)
• 🧠 **Quiz** you on any topic
• 📅 **Create study plans** and schedules
• ✍️ **Help with essays** and writing
• 🔢 **Solve math** problems step by step
• 🌍 **Teach languages** (French, Spanish, etc.)

I'm currently at **Full Intelligence** capacity! 🎯`:t.includes(`french`)||t.includes(`verb`)?`🇫🇷 **French Verbs** — Let's go!

**Regular -ER verbs** (parler = to speak):
• je parle • tu parles • il/elle parle
• nous parlons • vous parlez • ils parlent

**Key irregulars:**
• être (to be): je suis, tu es, il est
• avoir (to have): j'ai, tu as, il a
• aller (to go): je vais, tu vas, il va

Want me to quiz you? Just say "Quiz me on French verbs!" 🎯`:t.includes(`photosynthesis`)?`🌿 **Photosynthesis**

Plants convert: **sunlight + CO₂ + water → glucose + oxygen**

Equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂

**Two stages:**
1. 🌞 Light reactions (in thylakoids) — capture energy
2. 🔄 Calvin cycle (in stroma) — build sugar

Want me to quiz you on this? 🎯`:t.includes(`history`)||t.includes(`summarize`)?`🏛️ **History Mode Active!**

I can summarize and explain any historical period or event! Tell me specifically what you need:
• "Explain WW2"
• "Summarize the French Revolution"
• "What caused the Cold War?"

Once you add a Gemini API key in Admin Hub, I can answer anything in full detail! ⚡`:t.includes(`math`)||t.includes(`solve`)||t.includes(`calc`)?`🔢 **Math Mode!**

I can help with:
• Algebra & equations
• Calculus (derivatives, integrals)
• Statistics & probability
• Geometry & trigonometry

Tell me the specific problem — like "Solve: 2x + 5 = 13" — and I'll walk you through it step by step! Add your Gemini key for full problem-solving power. ⚡`:t.includes(`quiz`)?`🧠 **Quiz Mode!**

Let's test your knowledge! Tell me the subject:
• "Quiz me on the Solar System"
• "Test me on quadratic equations"
• "Quiz me on French verbs"

I'll fire 5 questions at you with answers! ⚡`:t.includes(`essay`)||t.includes(`write`)||t.includes(`plan`)?`✍️ **Essay & Writing Mode!**

I can help you:
• Structure your essay (intro → body → conclusion)
• Create a thesis statement
• Build a study schedule
• Outline complex topics

Tell me what you're writing about and I'll get you started! 📝`:t.includes(`hi`)||t.includes(`hello`)||t.includes(`hey`)?`Hey there! ⚡ I'm Nova, your Nuvio AI tutor.

Ask me to:
• Explain a topic
• Quiz you on a subject  
• Create a study plan
• Help with math or essays

What are we conquering today? 🎯`:`Nova ⚡ here! I'm fully synchronized and ready to crush your study goals. 
    
I can help with: French verbs, photosynthesis, history summaries, math steps, essay planning, and quiz prep.

What subject are you studying? Tell me the topic and I'll use my full intelligence core to guide you! 🧠`},detectAndOfferKey:e=>{let t=e.trim();return t.startsWith(`AIza`)&&t.length>30?{provider:`gemini`,key:t}:t.startsWith(`sk-or-v1-`)&&t.length>50?{provider:`openrouter`,key:t}:t.startsWith(`gsk_`)&&t.length>40?{provider:`groq`,key:t}:null}};export{i as t};