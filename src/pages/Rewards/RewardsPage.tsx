import React, { useState } from 'react';
import { Card } from '../../components/common/Card/Card';
import { Text } from '../../components/common/Text/Text';
import { Button } from '../../components/common/Button/Button';
import {
    Bell,
    Coins,
    Rocket,
    Zap,
    Calendar,
    Gift,
    Star,
    Monitor,
    Share2,
    Users,
    Copy,
} from 'lucide-react';
import './RewardsPage.scss';
import { useRewardsData, Reward } from '../../hooks/useRewardsData';

export const RewardsPage: React.FC = () => {
    const {
        points,
        streak,
        rewards,
        loading,
        redeemReward,
        checkIn
    } = useRewardsData();

    const [activeTab, setActiveTab] = useState<'earn' | 'redeem'>('earn');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // Process rewards state based on current user points
    const processedRewards = rewards.map(r => ({
        ...r,
        displayStatus: r.status === 'coming_soon' ? 'coming-soon' : (points >= r.cost ? 'unlocked' : 'locked')
    }));

    const filteredRewards = processedRewards.filter(reward => {
        if (activeFilter === 'all') return true;
        return reward.displayStatus === activeFilter;
    });

    const rewardsCounts = {
        all: processedRewards.length,
        unlocked: processedRewards.filter(r => r.displayStatus === 'unlocked').length,
        locked: processedRewards.filter(r => r.displayStatus === 'locked').length,
        comingSoon: processedRewards.filter(r => r.displayStatus === 'coming-soon').length
    };

    return (
        <div className="rewards-page">
            {/* Header */}
            <header className="rewards-header">
                <div className="header-top-row">
                    <div>
                        <Text variant="h2" weight="bold">Rewards Hub</Text>
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
                    {/* Section 1: Journey */}
                    <section>
                        <div className="section-title">
                            <Text variant="h4" weight="bold">Your Rewards Journey</Text>
                        </div>

                        <div className="journey-grid">
                            {/* Points Balance Card */}
                            <Card className="points-balance-card" padding="lg" hoverable>
                                <div className="balance-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1 rounded bg-purple-100 text-purple-600">
                                            {/* Custom Badge Icon if needed */}
                                            <Star size={16} className="text-purple-600" />
                                        </div>
                                        <Text variant="body" weight="medium" color="secondary">Points Balance</Text>
                                    </div>

                                    <div className="balance-large">{points.toLocaleString()}</div>

                                    <div className="w-full mt-4">
                                        <div className="flex justify-between mb-1">
                                            <Text variant="small" color="secondary">Progress to next reward ($5)</Text>
                                            <Text variant="small" weight="bold">{Math.min(points, 5000)}/5000</Text>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="fill" style={{ width: `${Math.min((points / 5000) * 100, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                                        <Rocket size={14} className="text-red-400" />
                                        <span>Keep earning to unlock more rewards!</span>
                                    </div>
                                </div>

                                <div className="coin-icon-wrapper">
                                    <Coins size={48} fill="#facc15" />
                                </div>
                            </Card>

                            {/* Daily Streak Card */}
                            <Card className="daily-streak-card" padding="lg" hoverable>
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={18} className="text-blue-400" />
                                    <Text variant="body" weight="medium" color="secondary">Daily Streak</Text>
                                </div>

                                <div className="streak-count">
                                    {streak} <span className="unit">days</span>
                                </div>

                                <div className="week-row">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                        <div key={i} className={`day-circle ${i < (streak % 7) ? 'active' : ''}`}>
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                <Text variant="small" color="secondary" className="text-center mb-4">
                                    Check in daily to to earn +5 points
                                </Text>

                                <button className="claim-btn" onClick={checkIn}>
                                    <div className="flex items-center justify-center">
                                        <Zap size={18} fill="white" />
                                        Claim Today's Points
                                    </div>
                                </button>
                            </Card>

                            {/* Featured Tool Spotlight - Static for Demo */}
                            <div className="card spotlight-card p-6 rounded-2xl card--hoverable">
                                <div className="spotlight-badge">Featured</div>
                                <Text variant="h4" weight="bold" className="text-white mt-2">Top Tool Spotlight</Text>
                                <Text variant="body" className="text-white/90 font-bold text-xl mt-1 mb-4">Reclaim</Text>

                                <div className="bg-white/20 p-4 rounded-lg mb-4 text-xs text-white/90 leading-relaxed">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} />
                                        <span className="font-bold">Automate and Optimize Your Schedule</span>
                                    </div>
                                    Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks.
                                </div>

                                <div className="spotlight-actions mt-auto">
                                    <button className="btn-signup text-purple-600 bg-white">
                                        <span className="flex items-center gap-1 font-bold">
                                            <Monitor size={14} /> Sign up
                                        </span>
                                    </button>
                                    <button className="btn-claim bg-white/20 text-white">
                                        <span className="flex items-center gap-1 font-medium">
                                            <Gift size={14} /> Claim 50 pts
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Earn More */}
                    <section className="mt-12">
                        <div className="section-title">
                            <Text variant="h4" weight="bold">Earn More Points</Text>
                        </div>

                        <div className="earn-more-grid">
                            {/* Refer Win Card */}
                            <Card padding="lg" className="flex flex-col h-full" hoverable>
                                <div className="flex items-start gap-3">
                                    <div className="icon-circle-purple-outline">
                                        <Star size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <Text variant="body" weight="bold" className="mb-4">Refer and win 10,000 points!</Text>
                                        <Text variant="small" color="secondary" className="leading-relaxed">
                                            Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners.
                                        </Text>
                                    </div>
                                </div>
                            </Card>

                            {/* Share Stack Card */}
                            <Card padding="lg" className="flex flex-col h-full" hoverable>
                                <div className="flex items-start gap-3 mb-6">
                                    <div className="icon-circle-purple-filled">
                                        <Share2 size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <Text variant="body" weight="bold">Share Your Stack</Text>
                                        <Text variant="small" color="secondary">Earn +25 pts</Text>
                                    </div>
                                </div>

                                <div className="mt-auto flex justify-between items-center">
                                    <Text variant="small" weight="medium">Share your tool stack</Text>
                                    <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
                                        <Share2 size={16} className="mr-2" /> Share
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </section>

                    {/* Section 3: Refer & Earn */}
                    <section className="mt-12 mb-12">
                        <div className="section-title">
                            <Text variant="h4" weight="bold">Refer & Earn</Text>
                        </div>

                        <div className="refer-banner">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users size={24} className="text-purple-600" />
                                    <Text variant="h4" weight="bold">Share Your Link</Text>
                                </div>
                                <Text variant="body" color="secondary">
                                    Invite friends and earn 25 points when they join!
                                </Text>
                            </div>

                            <div className="refer-stats-row">
                                <div className="stat-item">
                                    <div className="stat-value">0</div>
                                    <div className="stat-label">Referrals</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">0</div>
                                    <div className="stat-label">Points Earned</div>
                                </div>
                            </div>

                            {/* Referral Link Section */}
                            <div className="referral-link-section">
                                <Text variant="small" color="secondary" className="mb-2 block">Your personal referral link:</Text>
                                <div className="referral-input-group">
                                    <input
                                        type="text"
                                        readOnly
                                        value="https://app.flowvahub.com/signup/?ref=mosid9149"
                                        className="referral-input"
                                    />
                                    <button className="copy-btn" title="Copy link">
                                        <Copy size={18} className="text-purple-600" />
                                    </button>
                                </div>

                                <div className="social-share-row">
                                    <button className="social-btn facebook">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                        </svg>
                                    </button>
                                    <button className="social-btn x-twitter">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </button>
                                    <button className="social-btn linkedin">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
                                        </svg>
                                    </button>
                                    <button className="social-btn whatsapp">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* Redeem Section */}
                    <section>
                        <div className="section-title">
                            <Text variant="h4" weight="bold">Redeem Your Points</Text>
                        </div>

                        <div className="reward-filters">
                            {[
                                { id: 'all', label: 'All Rewards', count: rewardsCounts.all },
                                { id: 'unlocked', label: 'Unlocked', count: rewardsCounts.unlocked },
                                { id: 'locked', label: 'Locked', count: rewardsCounts.locked },
                                { id: 'coming-soon', label: 'Coming Soon', count: rewardsCounts.comingSoon }
                            ].map((filter) => (
                                <div
                                    key={filter.id}
                                    className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter.id)}
                                >
                                    {filter.label} <span className="count-badge">{filter.count}</span>
                                </div>
                            ))}
                        </div>

                        <div className="rewards-grid">
                            {filteredRewards.length > 0 ? (
                                filteredRewards.map((reward) => (
                                    <Card key={reward.id} className="reward-card" hoverable>
                                        <div className="reward-icon">
                                            {reward.icon_type === 'cash' ? <Gift size={24} /> :
                                                reward.icon_type === 'paypal' ? <Gift size={24} /> :
                                                    <Gift size={24} />}
                                        </div>

                                        <Text variant="body" weight="bold" className="mb-2">{reward.title}</Text>
                                        <Text variant="small" color="secondary" className="mb-2 px-4">{reward.description}</Text>

                                        <div className="reward-cost">
                                            <Star size={14} fill="#facc15" /> {reward.cost.toLocaleString()} pts
                                        </div>

                                        <button
                                            className={`reward-btn ${(reward.displayStatus === 'locked' || reward.displayStatus === 'coming-soon') ? 'locked' : ''}`}
                                            onClick={() => {
                                                if (reward.displayStatus === 'unlocked') {
                                                    redeemReward(reward);
                                                }
                                            }}
                                            disabled={reward.displayStatus !== 'unlocked'}
                                        >
                                            {reward.displayStatus === 'coming-soon' ? 'Coming Soon' : reward.displayStatus === 'locked' ? 'Locked' : 'Redeem'}
                                        </button>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    <Text variant="body">No rewards found in this category.</Text>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};
