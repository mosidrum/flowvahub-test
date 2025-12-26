import React, { useState } from 'react';
import { useRewardsData } from '../../hooks/useRewardsData';
import { RewardsHeader } from './components/RewardsHeader';
import { RewardsStats } from './components/RewardsStats';
import { EarnSection } from './components/EarnSection';
import { ReferralSection } from './components/ReferralSection';
import { RewardList } from './components/RewardList';
import './RewardsPage.scss';

export const RewardsPage: React.FC = () => {
    const {
        points,
        streak,
        rewards,
        referralCode,
        loading,
        redeemReward,
        checkIn
    } = useRewardsData();

    const [activeTab, setActiveTab] = useState<'earn' | 'redeem'>('earn');

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="rewards-page">
            <RewardsHeader />

            <div className="header-tabs">
                <button
                    className={`tab-btn ${activeTab === 'earn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('earn')}
                >
                    Earn Points
                </button>
                <button
                    className={`tab-btn ${activeTab === 'redeem' ? 'active' : ''}`}
                    onClick={() => setActiveTab('redeem')}
                >
                    Redeem Rewards
                </button>
            </div>

            {activeTab === 'earn' ? (
                <>
                    <RewardsStats
                        points={points}
                        streak={streak}
                        onCheckIn={checkIn}
                    />
                    <EarnSection />
                    <ReferralSection referralCode={referralCode} />
                </>
            ) : (
                <RewardList
                    rewards={rewards}
                    userPoints={points}
                    onRedeem={redeemReward}
                />
            )}
        </div>
    );
};
