/**
 * Real-Time AI Chatbot Intelligence Engine for SignVerse
 * Powered by Groq Cloud & Google Gemini API with fallback & thought-stripping.
 */

export const QUICK_SUGGESTIONS = [
  "How are you?",
  "Who is Albert Einstein?",
  "What is SignVerse?",
  "How to translate voice to 3D sign?",
  "Is Sign Language universal?",
  "Tell me a fun fact about Sign Language"
];

const SYSTEM_PROMPT = `You are SignBot, an expert, friendly, and ultra-intelligent AI Assistant embedded in the SignVerse 3D Sign Language Learning and Translation platform.

You can answer ANY question in real-time across all subjects:
- General Knowledge, Science, Technology, Coding, Mathematics, History, Famous People, and Daily Conversations.
- Conversational chat (Greetings, how are you, identity, jokes, motivation).
- Sign Language & Deaf Culture (ASL, ISL, BSL, gestures, fingerspelling, grammar, facial expressions).
- SignVerse Platform Details (3D Avatars: Luna, Marc, Anna, Francoise, Siggi; SiGML XML notation based on HamNoSys; JASign/CWASA WebGL engine; AI Text & Voice to Sign Translate; Flashcard Practice; Timed Quizzes; Daily Streak and ranking badges).

Formatting Rules:
- Keep answers concise, clear, and well-structured with Markdown bullet points and bolding.
- If the user asks about a feature in SignVerse (e.g. translation, alphabets, quiz, flashcards, dashboard), mention the feature and add an action route at the end in the format: [[ACTION:Label|Route]] (e.g. [[ACTION:Go to Translator|/translate]], [[ACTION:Start a Quiz|/quiz]], [[ACTION:Learn Alphabets|/alphabets]], [[ACTION:View Dashboard|/dashboard]]).
- Be polite, supportive, and accessibility-conscious.`;

/**
 * Ask AI (Supports Groq Real-Time & Google Gemini)
 */
export async function askGeminiRealtime(userQuery, conversationHistory = [], customApiKey = null) {
  const apiKey = (customApiKey || localStorage.getItem('groq_api_key') || localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    return getLocalBotResponse(userQuery);
  }

  // 1. If key is a Groq API Key (starts with "gsk_")
  if (apiKey.startsWith('gsk_')) {
    return askGroqRealtime(userQuery, conversationHistory, apiKey);
  }

  // 2. Otherwise use Google Gemini API
  try {
    const formattedHistory = conversationHistory.slice(-8).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: userQuery }]
      }
    ];

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API error, trying local fallback.');
      return getLocalBotResponse(userQuery);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again!";
    return parseActionFromResponse(rawText, 'Gemini 1.5 Flash ⚡');

  } catch (error) {
    console.error('API error, falling back to local engine:', error);
    return getLocalBotResponse(userQuery);
  }
}

/**
 * Groq Cloud Real-Time API (Ultra-fast LLM inference)
 */
async function askGroqRealtime(userQuery, conversationHistory, apiKey) {
  const modelsToTry = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'];

  for (const model of modelsToTry) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-6).map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: userQuery }
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        console.warn(`Groq model ${model} failed with ${response.status}, trying next...`);
        continue;
      }

      const data = await response.json();
      let rawText = data?.choices?.[0]?.message?.content || "";

      // Strip <think>...</think> if reasoning model outputted internal monologue
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      if (rawText) {
        return parseActionFromResponse(rawText, 'Groq AI ⚡');
      }
    } catch (err) {
      console.error(`Error querying Groq model ${model}:`, err);
    }
  }

  // If all Groq models failed, fallback to local
  return getLocalBotResponse(userQuery);
}

function parseActionFromResponse(rawText, providerTag) {
  let cleanedText = rawText;
  let action = null;
  const actionMatch = rawText.match(/\[\[ACTION:(.*?)\|(.*?)\]\]/);
  if (actionMatch) {
    action = { label: actionMatch[1].trim(), route: actionMatch[2].trim() };
    cleanedText = rawText.replace(/\[\[ACTION:.*?\|.*?\]\]/, '').trim();
  }

  return {
    text: cleanedText,
    action: action,
    isRealtimeAI: true,
    provider: providerTag
  };
}

/**
 * Strict Local Knowledge Base Fallback
 */
const LOCAL_KNOWLEDGE_BASE = [
  {
    keywords: ["how are you", "how r u", "kaise ho", "kya haal hai"],
    response: `I'm doing great, thank you! 😊✨ Ready to help you with **SignVerse**, Sign Language, or any general question.\n\nWhat would you like to explore today? 🤟`,
    action: { label: "Try 3D Translator", route: "/translate" }
  },
  {
    keywords: ["who are you", "what is your name", "who made you", "who created you"],
    response: `I am **SignBot** 🤖, the official AI Assistant for **SignVerse**!\n\nI was created to help everyone learn sign language seamlessly, bridge communication gaps between the hearing and Deaf communities, and answer any question in real time.`
  },
  {
    keywords: ["what is signverse", "about signverse", "signverse kya hai", "intro to signverse"],
    response: `**SignVerse** is an interactive, real-time **3D Sign Language Learning & Translation Platform** designed to make communication accessible for the Deaf and Hard-of-Hearing community! 🤟\n\n### 🌟 Key Features:\n- ⚡ **Real-time 3D Avatar Animation** (CWASA / JASign WebGL engine)\n- 🎙️ **Voice & Text to Sign Translation**\n- 📚 **A–Z Alphabets, Words, Flashcards & Timed Quizzes**\n- 🔥 **Daily Learning Streak & Rank System**`,
    action: { label: "Explore About Us", route: "/about" }
  },
  {
    keywords: ["how does 3d avatar work", "how avatars work", "jasign", "cwasa", "sigml", "3d engine"],
    response: `The 3D magic in **SignVerse** is powered by the **JASign / CWASA** WebGL engine developed by the *University of East Anglia (UEA)*! 🪄\n\nGestures are codified as mathematical SiGML XML notation (based on HamNoSys) and rendered in WebGL directly in your browser.`,
    action: { label: "Try 3D Translator", route: "/translate" }
  },
  {
    keywords: ["voice to sign", "speech to sign", "how to use voice", "voice translate"],
    response: `**Voice-to-Sign** allows you to speak naturally into your microphone and watch the 3D Avatar perform sign language in real time! 🎙️\n\nGo to the **Translate** page and click **🎙️ Speak (Voice to Sign)** to try it!`,
    action: { label: "Open Voice Translator", route: "/translate" }
  },
  {
    keywords: ["is sign language universal", "universal sign"],
    response: `**No, Sign Language is NOT universal!** 🌍 Different countries have their own unique sign languages (e.g. ASL in the US, ISL in India, BSL in the UK).`,
    action: { label: "Learn A-Z Alphabets", route: "/alphabets" }
  },
  {
    keywords: ["tell me a joke", "joke"],
    response: `**Why did the computer go to sign language class?**\n*Because it wanted to improve its "user-interface-to-hand" connection!* 💻🤟`
  },
  {
    keywords: ["streak", "daily streak", "streak update"],
    response: `Your **Daily Learning Streak** 🔥 increases by **+1 Day** when you log in on consecutive calendar days. Keep learning daily!`,
    action: { label: "View Dashboard", route: "/dashboard" }
  },
  {
    keywords: ["graph", "dashboard graph", "progress graph", "analytics", "progress chart"],
    response: `Your **Dashboard** includes interactive real-time **Progress Analytics Graphs**:
- 📈 **Accuracy Progression Curve**: SVG Area chart tracking your quiz scores.
- 📅 **7-Day Weekly Activity Bar Chart**: Shows daily signs practiced and streak milestones.
- 🎯 **Skill Mastery Breakdown**: Measures Fingerspelling, Vocabulary, Translation, and Recall speed.
- 🌟 **Rank Roadmap**: Visual pathway from Beginner 🌱 to Master 👑!`,
    action: { label: "View Progress Graphs", route: "/dashboard" }
  },
  {
    keywords: ["sign to text", "camera sign", "gesture recognition", "webcam sign"],
    response: `**Sign-to-Text** allows you to perform gestures in front of your camera, and our computer vision model detects words and builds spoken sentences in real time! 🤟📹`,
    action: { label: "Try Sign to Text", route: "/sign-to-text" }
  },
  {
    keywords: ["pricing", "price", "subscription", "free trial", "credits", "plans", "cost"],
    response: `**SignVerse Pricing & Plans:** 💎
- 🎁 **3-Day Free Trial**: 50 Free AI Credits + Full Core Access.
- 🚀 **Pro Monthly ($5/mo)**: Unlimited 3D translations, 500 AI credits, all 5 avatars & camera sign-to-text.
- 💰 **Pro Annual ($60/yr)**: Save 20%, unlimited everything & certificate.`,
    action: { label: "View Pricing Plans", route: "/pricing" }
  },
  {
    keywords: ["who made this", "team", "creators", "dilpreet", "dilpreet singh", "hardeep", "prabhkirat"],
    response: `**Meet the SignVerse Engineering Team:** ✨
- 👨‍💻 **Hardeep Singh**: Lead Full-Stack & 3D Avatar Architect
- ⚡ **Dilpreet Singh**: AI, Computer Vision & Gesture Recognition Lead
- 👩‍💻 **Prabhkirat Kaur**: UI/UX Design Lead & Educational Curriculum Developer`,
    action: { label: "Meet the Team", route: "/about" }
  }
];

export function getLocalBotResponse(userQuery) {
  const query = userQuery.toLowerCase().trim();

  // Only trigger local knowledge if query strongly matches phrase
  for (const entry of LOCAL_KNOWLEDGE_BASE) {
    for (const kw of entry.keywords) {
      if (query === kw || (query.length > 5 && query.startsWith(kw))) {
        return {
          text: entry.response,
          action: entry.action || null,
          isRealtimeAI: false
        };
      }
    }
  }

  return {
    text: `I'm **SignBot**, your AI companion! 🌍\n\nAsk me about **Sign Language, 3D Avatars, Coding, Science, or General Knowledge** in real time!`,
    action: { label: "Try 3D Translator", route: "/translate" },
    isRealtimeAI: false
  };
}
