# Flowva Hub Rewards Implementation

## 🚀 Overview
This repository contains the source code for the **Flowva Hub Rewards** system, a premium, gamified loyalty interface built with **React**, **SCSS**, and **Supabase**. It features a modern, responsive design with glassmorphism effects, smooth animations, and robust backend logic ensuring data integrity.

## ✨ Key Features
- **Premium UI/UX**: High-quality design with glassmorphism, gradient accents, and micro-interactions.
- **Component-Based Architecture**: Modularized codebase (`RewardsStats`, `EarnSection`, etc.) for maintainability.
- **Real-Time Data**: Live points balance, streak tracking, and transaction history powered by Supabase.
- **Gamification**:
  - **Randomized Onboarding**: New users start with random points (50-500) and streaks (1-7 days) to simulate an active account.
  - **Daily Check-in**: "Claim Today's Points" feature with a custom animated **Success Toast** (flowers & sparkles).
  - **Progress Tracking**: Visual progress bars towards reward goals.
- **Secure Transactions**: All point modifications rely on atomic **PostgreSQL RPC functions** (`claim_daily_points`, `redeem_reward`) to prevent client-side tampering.
- **Mobile Responsive**: Fully optimized layouts for mobile, tablet, and desktop screens.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: SCSS (Modules, Mixins, Variables), BEM methodology
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL, Auth, RLS)

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- A [Supabase](https://supabase.com/) account (Free tier works perfectly)

### 2. Supabase Configuration
1.  **Create a Project**: Start a new project in Supabase.
2.  **Database Setup**:
    - Navigate to the **SQL Editor** in your Supabase dashboard.
    - Open the `supabase_schema.sql` file located in the root of this project.
    - Copy the **entire content** and execute it in the SQL Editor.
    - **What this does:**
        - Creates tables: `profiles`, `rewards`, `transactions`.
        - Sets up Row Level Security (RLS) policies.
        - Deploys RPC functions: `claim_daily_points()` and `redeem_reward()`.
        - Creates a Trigger: `handle_new_user` to auto-create profiles with random initial data on signup.
        - Seeds initial Rewards data.
3.  **Authentication**:
    - Go to **Authentication** -> **Providers** and ensure **Email/Password** or **Magic Link** is enabled.

### 3. Environment Variables
Create a `.env` file in the root directory of the project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*Found in Supabase Dashboard -> Project Settings -> API*

### 4. Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── common/         # Atomic components (Text, Card, Button, Toast)
│   └── layout/         # Dashboard shell & Sidebar
├── hooks/
│   └── useRewardsData.ts # Centralized logic for Supabase data fetching & RPCs
├── pages/
│   └── Rewards/
│       ├── components/    # Sub-components (Stats, Earn, Referral, List)
│       ├── RewardsPage.tsx # Main entry point
│       └── RewardsPage.scss # Layout styles
├── styles/
│   ├── _mixins.scss    # Responsive breakpoints & flex helpers
│   ├── _utilities.scss # Common utility classes
│   └── _variables.scss # Design tokens (Colors, Spacing, Typography)
└── lib/
    └── supabase.ts     # Supabase client usage
```

## 🔒 Database Architecture & Security

This project moves critical business logic to the database layer to ensure security.

### RPC Functions (Server-Side Logic)
Instead of updating the `points` column directly from the frontend (which is insecure), the app calls these functions:

1.  **`claim_daily_points()`**:
    - Checks if the user already checked in today.
    - Atomically increments points (+5) and streak (+1).
    - Logs a transaction record.
    - Returns success/failure to the client.

2.  **`redeem_reward(reward_id)`**:
    - Checks user balance against reward cost.
    - Atomically deducts points.
    - logs a 'redeem' transaction.
    - Updates user balance.

### Triggers
- **`handle_new_user`**: Automatically generates a user profile entry in `public.profiles` whenever a new user signs up via `auth.users`, population it with realistic random "starter" data.
