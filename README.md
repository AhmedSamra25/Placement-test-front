# Placement Test Full Platform

A professional, full-featured language placement testing platform designed for organizations and schools to assess students across 7 core skills: Reading, Writing, Speaking, Listening, Vocabulary, Grammar, and Pronunciation.

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![Vue](https://img.shields.io/badge/Vue-3.5-green?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)

## 🚀 Features

### 🏛️ Organization Portal
*   **Analytics Dashboard**: Real-time distribution of student CEFR levels and overall performance metrics.
*   **Student Management**: Invite students via email, track invite status, and manage target languages.
*   **Submissions Review**: In-depth review panel for raw test data, including audio playback for speaking and handwritten essay image uploads.
*   **Team Control**: Role-based access for Admins and Moderators to manage assessments.
*   **Customization**: Configure CEFR level thresholds and organizational goals.

### 📝 Placement Test
*   **7-Skill Assessment**: Comprehensive testing suite covering all aspects of language proficiency.
*   **Interactive UI**: Context-aware headers and a sidebar navigator for a seamless test-taking experience.
*   **Grading Simulation**: Mock AI-driven scoring system to provide immediate results.
*   **Auto-Persistence**: Local storage integration to save progress if the session is interrupted.

## 🛠️ Technology Stack
*   **Framework**: [Vue.js 3](https://vuejs.org/) (SFC setup)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Routing**: [Vue Router](https://router.vuejs.org/)
*   **Styling**: Vanilla CSS with custom design tokens for a premium SG aesthetic.
*   **Charts**: [Chart.js](https://www.chartjs.org/) with `vue-chartjs` for skill radar visualizations.
*   **Build Tool**: [Vite](https://vitejs.dev/)

## 🏁 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (version 20+ or 22+ recommended)
*   [Git](https://git-scm.com/)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AhmedSamra25/Placement-test-front.git
    cd Placement-test-front
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🔐 Login Credentials (Demo)
Access the organization portal at `/org/login`:
*   **Admin**: `admin@school.edu` / `admin`
*   **Moderator**: `alice@school.edu` / `mod`

## 📄 License
This project is private and intended for internal organizational use.
