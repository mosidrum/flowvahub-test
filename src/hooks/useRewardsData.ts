import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Reward {
    id: string;
    title: string;
    description: string;
    cost: number;
    icon_type: 'cash' | 'paypal' | 'visa' | 'other';
    status: 'active' | 'coming_soon';
}

export interface UserProfile {
    points: number;
    streak_days: number;
    referral_code: string;
}

export const useRewardsData = () => {
    const { user } = useAuth();
    const [points, setPoints] = useState(0);
    const [streak, setStreak] = useState(0);
    const [referralCode, setReferralCode] = useState('');
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // 1. Fetch Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('points, streak_days, referral_code')
                .eq('id', user.id)
                .single();

            if (profileError) {
                // If no profile (maybe trigger didn't fire or legacy user), default to 0
                console.error('Error fetching profile:', profileError);
            } else if (profile) {
                setPoints(profile.points);
                setStreak(profile.streak_days);
                setReferralCode(profile.referral_code);
            }

            // 2. Fetch Rewards
            const { data: rewardsData, error: rewardsError } = await supabase
                .from('rewards')
                .select('*')
                .order('cost', { ascending: true });

            if (rewardsError) throw rewardsError;

            // Map DB Types to UI Types if needed
            setRewards(rewardsData as Reward[]);

        } catch (err: any) {
            console.error('Error in useRewardsData:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    // Action: Redeem
    const redeemReward = async (reward: Reward) => {
        if (!user) return;
        if (points < reward.cost) {
            alert("Not enough points!");
            return;
        }

        try {
            // Optimistic Update
            setPoints(prev => prev - reward.cost);

            // 1. Create Transaction
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    amount: -reward.cost,
                    type: 'redeem',
                    description: `Redeemed ${reward.title}`
                });

            if (txError) throw txError;

            // 2. Update Profile
            // Note: In real app, do this via RPC to ensure atomicity
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ points: points - reward.cost })
                .eq('id', user.id);

            if (updateError) throw updateError;

            alert(`Succesfully redeemed: ${reward.title}`);
            fetchData(); // Refresh to be safe

        } catch (err: any) {
            console.error('Redemption failed:', err);
            alert('Redemption failed. Please try again.');
            fetchData(); // Rollback/Refresh
        }
    };

    // Action: Earn (Mock/Demo)
    const checkIn = async () => {
        if (!user) return;
        try {
            const bonus = 5;
            setPoints(prev => prev + bonus);
            setStreak(prev => prev + 1);

            await supabase.from('transactions').insert({
                user_id: user.id,
                amount: bonus,
                type: 'earn',
                description: 'Daily Check-in'
            });

            await supabase.from('profiles').update({
                points: points + bonus,
                streak_days: streak + 1,
                last_check_in: new Date().toISOString()
            }).eq('id', user.id);

        } catch (err) {
            console.error(err);
        }
    }

    return {
        points,
        streak,
        referralCode,
        rewards,
        loading,
        error,
        redeemReward,
        checkIn
    };
};
