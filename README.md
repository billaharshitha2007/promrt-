# ProjectMatch AI - Intelligent Team Formation Engine

ProjectMatch AI is a modern web application built with the **Synthetix Pulse** design system (dark mode, electric cyan, and neon mint accents). It empowers hackathons and startup communities to form high-velocity, high-compatibility teams through AI candidate screening, real-time activity tracking, and intelligent collaboration tools.

---

## ⚡ Features

- **Discovery Feed**:
  - Interactive swipeable project and talent card deck.
  - Conic gradient circular match score gauge (e.g. 94%, 92%, 88%).
  - Skill chip matching with gap identification and AI Insight reasoning box.
  - Instant Pass, Connect, and AI Fit Check triggers.

- **Live Board & Teams Forming**:
  - Real-time animated activity ticker marquee streaming simulated events.
  - Hackathon Alpha countdown timer clock.
  - Dynamic team cards with member avatar stacks, slot status (e.g. 3/5 slots), and AI conflict detection (*Role Overlap*, *Skill Imbalance*).
  - Filter tabs: *All Teams*, *Hackathon Alpha*, *90%+ Match*, and *Needs Engineer*.

- **AI Fit Candidate Interview**:
  - 3-step interactive interview wizard for candidate verification.
  - Bento-style selection options with real-time score adjustment.
  - Textarea for custom engineering experience inputs.

- **Team Chat & Collaboration Workspace**:
  - Real-time team messaging channel for formed teams (e.g., Team Cyber-X).
  - Embedded interactive AI Assistant cards (*Meeting Scheduler*, *Team Composition Alert*, *Conflict Detection*).
  - Quick action buttons (*Schedule Sync*, *Share File*, *View Tasks*, *Project Specs*).
  - Automated smart teammate replies.

- **Profile & Reputation Metrics**:
  - User profile with editable skills and bio (Alex Mercer - Senior Full-Stack AI Engineer).
  - Reputation metrics (*Top 1% Contributor*, *Fast Responder*, *12 Hackathons Won*, *94% Fit Accuracy*).
  - Real-time AI Match suggestions with radial meters and sent/received request tracker.

- **Quick Setup Wizard & Idea Pitcher**:
  - 3-step onboarding flow (Skill selection, Weekly commitment slider, Pitch vs Join preference).
  - Floating Action Button (FAB) to post new team ideas with instant AI validation.

- **Dual Layout Modes**:
  - **Mobile Mode**: iPhone 15 frame simulation with docked navigation.
  - **Desktop Mode**: Full widescreen command center layout.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+ Modular), Vanilla CSS.
- **Styling**: *Synthetix Pulse* Design System, Google Fonts (Inter & JetBrains Mono), Google Material Symbols.
- **State Management**: Central reactive store with LocalStorage persistence.

---

## 🚀 Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/billaharshitha2007/promrt-.git
   cd promrt-
   ```
2. Start any local static server:
   ```bash
   # Python
   python -m http.server 8080

   # Or Node.js
   npx serve .
   ```
3. Open `http://localhost:8080` in your web browser.
