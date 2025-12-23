# Flowva Hub Rewards Page Implementation

## Overview
This project recreates the Flowva Hub Rewards page using a modern React + SCSS architecture.
It features a "Premium" dark-themed UI, reusable components, and a Supabase-ready backend integration.

## Architecture
- **Tech Stack**: React (Vite), SCSS (Sass), Supabase Client, Lucide React (Icons).
- **Structure**:
  - `src/styles/`: Global SCSS variables, mixins, and reset.
  - `src/components/common/`: Atomic components (Button, Text, Card).
  - `src/components/layout/`: Dashboard layout shell.
  - `src/pages/Rewards/`: The Rewards page logic and specific styles.
  - `src/lib/`: Support utilities (Supabase client).

## Features
- **Design System**: A scalable SCSS variable system for colors, typography, and spacing.
- **Components**: 
  - `Text`: Polymorphic text component with variants.
  - `Button`: Interactive buttons with loading states and variants.
  - `Card`: Container component with glassmorphism support.
- **Rewards Logic**:
  - Fetches user points and history from Supabase (mocked for demo if no credentials).
  - "Daily Streak" visualization.
  - Transaction history view.

## Setup
1. **Supabase**:
   - Create a `.env` file in the root:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```
   - If not provided, the app runs in "Demo Mode" with simulated data.

2. **Run**:
   ```bash
   npm run dev
   ```

## Database Schema (Expected)
For the real data fetching to work, ensure these tables exist in Supabase:
- `profiles` (`id` uuid PK, `points_balance` int)
- `user_tasks` (`id`, `user_id`, `title`, `points`, `completed` boolean)
