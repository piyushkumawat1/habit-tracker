# Habitly — Smart Habit Tracker

A modern, full-stack, serverless habit tracking application designed to help you build consistency, visualize your progress, and conquer your goals.

## 🌟 Features

- **Smart Dashboard:** Track your daily habits, view overall completion rates, and manage your daily streaks.
- **Custom Challenges:** Create personal habit challenges (e.g., "Complete 50 Workouts") and track your progress with dynamic progress bars.
- **Visual Analytics & Insights:** View your habit history with beautiful GitHub-style contribution heatmaps, donut charts, and streak counters.
- **Responsive Design:** A stunning, glassmorphism-inspired UI that seamlessly scales from desktop monitors down to mobile phones.
- **Dynamic Themes:** Instantly toggle between professional Dark and Light modes.
- **Secure Authentication:** Passwordless login with Google OAuth, or traditional email/password sign-in, powered by Supabase Auth.
- **Infographic Export:** Export your personal habit journey timeline as a high-quality shareable image.
- **Cloud Storage:** Upload and manage your custom profile avatar.

## 🛠 Tech Stack

The application uses a modern, fully serverless architecture.

- **Frontend:** React 19 + Vite
- **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid, Responsive Media Queries)
- **Backend & Database:** Supabase (PostgreSQL Backend-as-a-Service)
- **Authentication:** Supabase Auth (OAuth & Email)
- **Storage:** Supabase Storage (Avatars)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (the free tier works perfectly)

### 1. Supabase Configuration
1. Create a new project in Supabase.
2. Navigate to **Authentication -> Providers** and enable **Email** and **Google** auth.
3. Under **Authentication -> URL Configuration**, add your local and production URLs to the Redirect URLs list.
4. Set up your database tables (`habits`, `logs`, `custom_challenges`, `users`) via the Supabase SQL Editor.
5. Create a public storage bucket named `avatars`.

### 2. Local Setup

Navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder and add your Supabase API keys (found in your Supabase Project Settings):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the App

Start the Vite development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to register, log in, and start tracking your habits!
