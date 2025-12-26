import React, { useState } from 'react';
import { useRewardsData } from '../../hooks/useRewardsData';
import { RewardsHeader } from './components/RewardsHeader';
import { RewardsStats } from './components/RewardsStats';
import { EarnSection } from './components/EarnSection';
import { ReferralSection } from './components/ReferralSection';
import { RewardList } from './components/RewardList';
import './RewardsPage.scss';
import {Text} from "../../components/common/Text/Text.tsx";
import {Bell} from "lucide-react";

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
            <header className="rewards-header">
                <div className="header-top-row">
                    <div>
                        <Text variant="h4" className="mt-12">Rewards Hub</Text>
                        <Text variant="body" color="secondary" className="page-subtitle">
                            Earn points, unlock rewards, and celebrate your progress!
                        </Text>
                    </div>

                    <div className="notification-bell">
                        <Bell size={20} />
                        <div className="badge">1</div>
                    </div>
                </div>
            </header>

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
