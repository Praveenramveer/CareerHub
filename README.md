# CareerSphere AI 🌐💼

> **Autonomous Career Acceleration & Intelligence Platform**  
> An end-to-end career companion engineered to empower students and software engineers with AI mentorship, ATS-optimized resume building, real-time job discovery, and interactive physics-based glassmorphism UI.

---

## 🚀 Features

- **🎨 Modern Glassmorphism & Interactive Canvas**:
  - Real-time cloth membrane physics background powered by `Matter.js` and canvas rendering.
  - Specular glass card morphism design system with reactive cursor-hit border edge glowing (`--cursor-x`, `--cursor-y`).
  - Seamless Light and Dark mode theming.
  
- **🤖 1-on-1 AI Career Advisor**:
  - Context-aware career mentor powered by Google Gemini API (`@google/genai`).
  - Domain-specific roadmaps: System Design, LeetCode / DSA, Behavioral Prep, Salary Negotiation, and Tech Stack Mastery.

- **📄 ATS Resume Builder & Scanner**:
  - FAANG-grade resume builder with instant keyword density analysis and ATS scoring.
  - Export to PDF and structured formats (`.docx`).

- **🎯 Opportunity & Job Discovery Engine**:
  - Curated pipeline of corporate hackathons, internships, open-source programs, and full-time hiring challenges.
  - Filterable by tech stack, difficulty, and job domain.

- **🔐 Cloud Persistence & Authentication**:
  - Firebase Authentication (Google OAuth + Email/Password).
  - Firestore cloud database sync for user progress, saved jobs, resumes, and chat sessions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion
- **Physics Canvas**: Matter.js (Cloth moulding simulation)
- **AI Intelligence**: Google Gemini API (`@google/genai`)
- **Backend & API**: Node.js, Express, TSX
- **Authentication & Database**: Firebase Auth, Google Cloud Firestore
- **Icons & Styling**: Lucide React, Glassmorphism CSS variables

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/careersphere-ai.git

# Navigate into project directory
cd careersphere-ai

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### Run Locally

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📜 License

Distributed under the MIT License.
