import React from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Text } from '../../../components/common/Text/Text';
import { Award, Rocket, Calendar, Zap, Monitor, Gift } from 'lucide-react';
import coin from '../../../assets/14563581.png'
import './RewardsStats.scss';

interface RewardsStatsProps {
    points: number;
    streak: number;
    onCheckIn: () => Promise<{ success: boolean; message?: string }>;
}

export const RewardsStats: React.FC<RewardsStatsProps> = ({ points, streak, onCheckIn }) => {
    const todayIndex = (new Date().getDay() + 6) % 7;

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
                <Card  hoverable>
                    <div className="points-balance-card">
                        <div className="flex items-center gap-2 mb-2 top">
                            <div className="p-1 rounded text-purple-600">
                                <Award size={26} />
                            </div>
                            <Text variant="body" weight="medium">Points Balance</Text>
                        </div>

                       <div className="p-6">
                           <div className="flex items-center justify-between mb-2">
                               <div className="balance-large">{points.toLocaleString()}</div>
                               <img src={coin} alt="gold coin" width="44" height="44" />
                           </div>

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
                    </div>
                </Card>

                <Card className="daily-streak-card" hoverable>
                        <div className="flex items-center gap-2 mb-2 top">
                            <div className="p-1 rounded text-blue-400">
                                <Calendar size={26}  />
                            </div>
                            <Text variant="body" weight="medium">Daily Streak</Text>
                        </div>

                    <div className="p-6">
                        <div className="streak-count">
                            {streak} <span className="unit">days</span>
                        </div>

                        <div className="week-row">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                              <div
                                key={i}
                                className={[
                                    'day-circle',
                                    i < (streak % 7) ? 'active' : '',
                                    i === todayIndex ? 'today' : '',
                                ].join(' ')}
                              >
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
                    </div>
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
