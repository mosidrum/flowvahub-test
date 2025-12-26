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
   - **Important**: Create the `redeem_reward` and `daily_check_in` Database Functions (RPCs) required for secure data handling.
   - Create a trigger to automatically create a profile for newly signed-up users.
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

## Database Schema & Architecture
The SQL migration sets up the following structure:

**Tables:**
- **`profiles`**: Linked to `auth.users`. Stores `points` (default 0), `streak_days`, `referral_code`.
- **`rewards`**: Catalog of items. Contains `cost`, `status`, `icon_type`.
- **`transactions`**: Immutable ledger of all points earned and redeemed.

**Security & Logic (RPCs):**
This project treats the database as the source of truth for logic to ensure data integrity.
- **`daily_check_in()`**: Atomically handles checking if a user has already checked in today, increments streak/points, and logs the transaction.
- **`redeem_reward(reward_id)`**: Atomically verifies balance, deducts points, and logs the redemption transaction to prevent race conditions or balance tampering.

## Authentication
This project uses Supabase Magic Links for passwordless authentication.
- When you first run the app, you will be redirected to the Login page.
- Enter your email to receive a Magic Link.
- Once clicked, you will be logged in and redirected to the Rewards Dashboard.
- A user profile is automatically created upon first sign-up via a Postgres Trigger.

## Features
- **Real-time Data**: Fetches point balance, streak, and rewards status directly from Supabase.
- **Dynamic Lock/Unlock**: Rewards automatically unlock when your points balance exceeds their cost.
- **Atomic Redemptions**: Uses Postgres transactions to ensure points are never lost or double-spent.
- **Responsive Design**: Mobile-friendly layout using modern SCSS grids and flexbox.

## Senior Developer Review Notes
This codebase has been refactored to meet production standards:
- **Separation of Concerns**: The monolithic `RewardsPage` has been decomposed into focused sub-components (`RewardsStats`, `RewardList`, etc.).
- **Data Integrity**: Logic for points and redemptions has been moved from the client-side to the database (RPCs) to prevent client-side manipulation.
- **Performance**: `useRewardsData` now uses `Promise.all` for parallel data fetching.
- **Error Handling**: Improved error states and return types for hook actions.
