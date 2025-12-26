import React from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Text } from '../../../components/common/Text/Text';
import { Award, Rocket, Coins, Calendar, Zap, Monitor, Gift } from 'lucide-react';
import './RewardsStats.scss';

interface RewardsStatsProps {
    points: number;
    streak: number;
    onCheckIn: () => Promise<{ success: boolean; message?: string }>;
}

export const RewardsStats: React.FC<RewardsStatsProps> = ({ points, streak, onCheckIn }) => {
    const handleCheckIn = async () => {
        const result = await onCheckIn();
        if (result.success) {
            alert("Checked in successfully! +5 points");
        } else {
            alert(result.message || "Check-in failed");
        }
    };

    return (
        <section>
            <div className="section-title">
                <Text variant="h4" weight="medium">Your Rewards Journey</Text>
            </div>

            <div className="journey-grid">
                <Card className="points-balance-card" hoverable>
                    <div className="balance-left">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 rounded bg-purple-100 text-purple-600">
                                <Award size={16} className="text-purple-600" />
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

                    <button className="claim-btn" onClick={handleCheckIn}>
                        <div className="flex items-center justify-center">
                            <Zap size={18} fill="white" />
                            Claim Today's Points
                        </div>
                    </button>
                </Card>

                {/* Featured Tool Spotlight */}
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
    );
};
