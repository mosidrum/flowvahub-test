import { useEffect, useState, useCallback } from 'react';
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

    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setError(null);

            const [profileResult, rewardsResult] = await Promise.all([
                supabase
                    .from('profiles')
                    .select('points, streak_days, referral_code')
                    .eq('id', user.id)
                    .single(),
                supabase
                    .from('rewards')
                    .select('*')
                    .order('cost', { ascending: true })
            ]);

            if (profileResult.error) {
                console.error('Error fetching profile:', profileResult.error);
            } else if (profileResult.data) {
                setPoints(profileResult.data.points);
                setStreak(profileResult.data.streak_days);
                setReferralCode(profileResult.data.referral_code);
            }

            if (rewardsResult.error) throw rewardsResult.error;
            setRewards(rewardsResult.data as Reward[]);

        } catch (err: any) {
            console.error('Error in useRewardsData:', err);
            setError(err.message || 'Failed to load rewards data');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const redeemReward = async (reward: Reward): Promise<{ success: boolean; message?: string }> => {
        if (!user) return { success: false, message: 'Not authenticated' };

        try {
            const { data, error } = await supabase.rpc('redeem_reward', {
                reward_id: reward.id
            });

            if (error) throw error;

            if (data && data.success) {
                setPoints(data.remaining_points);
                return { success: true };
            } else {
                return { success: false, message: data?.error || 'Redemption failed' };
            }
        } catch (err: any) {
            console.error('Redemption failed:', err);
            return { success: false, message: err.message || 'An unexpected error occurred' };
        }
    };

    const checkIn = async (): Promise<{ success: boolean; message?: string }> => {
        if (!user) return { success: false, message: 'Not authenticated' };

        try {
            const { data, error } = await supabase.rpc('daily_check_in');

            if (error) throw error;

            if (data && data.success) {
                setPoints(prev => prev + 5);
                setStreak(prev => prev + 1);
                return { success: true };
            } else {
                return { success: false, message: data?.error || 'Check-in failed' };
            }
        } catch (err: any) {
            console.error('Check-in failed:', err);
            return { success: false, message: err.message };
        }
    };

    return {
        points,
        streak,
        referralCode,
        rewards,
        loading,
        error,
        redeemReward,
        checkIn,
        refresh: fetchData
    };
};
