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

### 1. Supabase Configuration
1. Create a new Supabase project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open the `supabase_schema.sql` file provided in this repository.
4. Copy the entire content and run it in the SQL Editor. This will:
   - Create `profiles`, `rewards`, and `transactions` tables.
   - Set up Row Level Security (RLS) policies.
   - Create a trigger to automatically create a profile for new users.
   - Insert default rewards into the catalog.
5. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Run Locally
```bash
npm install
npm run dev
```

## Database Schema
The SQL migration sets up the following structure:
- **`profiles`**: Linked to `auth.users`. Stores `points` (default 0), `streak_days`, `referral_code`.
- **`rewards`**: Catalog of items. Contains `cost`, `status`, `icon_type`.
- **`transactions`**: Ledger of points earned and redeemed.

## Authentication
This project uses Supabase Magic Links for passwordless authentication.
- When you first run the app, you will be redirected to the Login page.
- Enter your email to receive a Magic Link.
- Once clicked, you will be logged in and redirected to the Rewards Dashboard.
- A user profile is automatically created upon first sign-up.

## Features
- **Real-time Data**: Fetches point balance, streak, and rewards status directly from Supabase.
- **Dynamic Lock/Unlock**: Rewards automatically unlock when your points balance exceeds their cost.
- **Redemption**: securely decrements points and records a transaction in the database.
- **Responsive Design**: Mobile-friendly layout using modern SCSS grids and flexbox.
