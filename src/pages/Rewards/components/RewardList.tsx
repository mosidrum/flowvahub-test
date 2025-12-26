import React, { useState } from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Text } from '../../../components/common/Text/Text';
import { Gift, Star } from 'lucide-react';
import { Reward } from '../../../hooks/useRewardsData';

interface RewardListProps {
    rewards: Reward[];
    userPoints: number;
    onRedeem: (reward: Reward) => Promise<{ success: boolean; message?: string }>;
}

export const RewardList: React.FC<RewardListProps> = ({ rewards, userPoints, onRedeem }) => {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Process rewards state based on current user points
    const processedRewards = rewards.map(r => ({
        ...r,
        displayStatus: r.status === 'coming_soon' ? 'coming-soon' : (userPoints >= r.cost ? 'unlocked' : 'locked')
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

    const handleRedeem = async (reward: any) => {
        if (reward.displayStatus !== 'unlocked') return;

        const confirm = window.confirm(`Redeem ${reward.title} for ${reward.cost} points?`);
        if (!confirm) return;

        const result = await onRedeem(reward);
        if (result.success) {
            alert(`Success! Redeemed: ${reward.title}`);
        } else {
            alert(result.message || 'Redemption failed');
        }
    }

    return (
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
                                onClick={() => handleRedeem(reward)}
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
    );
};
