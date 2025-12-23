-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  points integer default 0,
  streak_days integer default 0,
  last_check_in timestamptz,
  referral_code text,
  created_at timestamptz default now()
);

-- REWARDS TABLE
create table public.rewards (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  cost integer not null,
  icon_type text default 'other', -- 'cash', 'paypal', 'visa', 'other'
  status text default 'active',   -- 'active', 'coming_soon'
  created_at timestamptz default now()
);

-- TRANSACTIONS TABLE (History)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  amount integer not null, -- positive for earn, negative for redeem
  description text not null,
  type text not null, -- 'earn', 'redeem'
  created_at timestamptz default now()
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.rewards enable row level security;
alter table public.transactions enable row level security;

-- Profiles: Users can read own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Profiles: Users can update own profile (for check-ins etc, though ideally via RPC)
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Rewards: Everyone can read active rewards
create policy "Any authenticated user can view rewards" on public.rewards
  for select to authenticated using (true);

-- Transactions: Users can view own transactions
create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- Transactions: Users can insert (for now, ideally controlled by backend/functions)
create policy "Users can insert own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);


-- TRIGGER: Create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, points, streak_days, referral_code)
  values (
    new.id, 
    new.email, 
    0, 
    0, 
    lower(substring(md5(random()::text), 1, 8)) -- basic random referral code
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SEED DATA
insert into public.rewards (title, description, cost, icon_type, status) values
  ('$5 Bank Transfer', 'The $5 equivalent will be transferred to your bank account.', 5000, 'cash', 'active'),
  ('$5 PayPal International', 'Receive a $5 PayPal balance transfer.', 5000, 'paypal', 'active'),
  ('$5 Virtual Visa Card', 'Use your $5 prepaid card to shop anywhere Visa is accepted online.', 5000, 'visa', 'active'),
  ('$10 Amazon Gift Card', 'Shop for millions of items on Amazon.', 10000, 'other', 'active'),
  ('$20 Steam Wallet', 'Add funds to your Steam Wallet.', 20000, 'other', 'active'),
  ('$50 Airbnb Voucher', 'Put towards your next stay or experience.', 50000, 'other', 'active'),
  ('Flowva Pro - 1 Month', 'Unlock premium features on Flowva.', 4000, 'other', 'active'),
  ('Exclusive Merch Pack', 'T-shirt, sticker pack, and more.', 15000, 'other', 'coming_soon');
