# SignDum 🤟 - Next-Gen 3D Sign Language Platform

SignVerse is an interactive, accessible 3D Sign Language translation and learning platform powered by WebGL avatar synthesis, offline synonym matching, real-time gesture pipelines, and AI conversational assistance.

---

## 🌟 Key Features

- **🤖 3D Avatar Sign Synthesizer**: Smooth 3D animation of characters (Luna, Marc, Francoise, Anna, Siggi) translating English sentences into British Sign Language (BSL) / Indian Sign Language (ISL) gestures using SiGML notation and CWASA WebGL engine.
- **🎙️ Real-Time Voice & Speech Translation**: Speak directly into the microphone with instant offline fallback & $O(1)$ fast word/synonym resolution.
- **🔤 Interactive Fingerspelling Studio**: Learn and practice the complete A–Z sign language alphabet with instant animation playback and keyboard navigation.
- **📖 12,000+ Word Dictionary**: Instant search through comprehensive vocabulary categories (Family, Greetings, Numbers, Emergency, Animals, etc.).
- **🃏 Gamified Flashcards & Practice**: Self-evaluation practice cards with anti-cheating visual masks to solidify retention.
- **⚡ 60-Second Timed Quiz Arena**: Speed quizzes with live scoring, accuracy metrics, and interactive rank roadmap progression.
- **✨ SignBot LLM Assistant**: Multimodal floating AI conversational bot powered by Groq (Llama-3.3 70B) and Google Gemini 1.5 Flash with Text-to-Speech playback.
- **📱 Universal Multi-Device Responsiveness**: Adaptive layouts for mobile, tablet, and desktop screens with a hamburger drawer navbar and top-positioned 3D avatar viewport on mobile.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Vanilla CSS3 (Custom Responsive Design System)
- **3D Engine**: WebGL Avatar Synthesizer (CWASA - Coffee Web Audio & Sign Animation)
- **AI / LLM Integration**: Groq API (Llama-3.3 70B Versatile), Google Gemini 1.5 Flash
- **Web APIs**: Web Speech Recognition API, Web Speech Synthesis (TTS), Web Storage (Local Persistence)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Kirat23018/SignVerse.git
cd SignVerse

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```

---

## 👥 Authors & Team
- **Prabhkirat Kaur** - UI/UX Design Lead & Educational Curriculum Developer
- AI, Computer Vision & Gesture Recognition Lead
- Lead Full-Stack & 3D Avatar Architect

---

## 📄 License
MIT License. Created for Hackathon 2026.
