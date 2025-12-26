import React from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Text } from '../../../components/common/Text/Text';
import { Award, Rocket, Calendar, Zap, UserPlus, Gift } from 'lucide-react';
import coin from '../../../assets/14563581.png'
import logo from '../../../assets/reclaim-logo.png'
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

                <div className="card spotlight-card rounded-2xl card--hoverable">
                    <div className="bg flex justify-between p-6">
                       <div>
                           <div className="spotlight-badge">Featured</div>
                           <Text variant="h4" weight="bold" color="white">Top Tool Spotlight</Text>
                           <Text variant="body" color="white" weight="bold" className="mt-1 mb-4">Reclaim</Text>
                       </div>
                        <img src={logo} alt="Reclaim.ai logo" width="76" height="76" />

                    </div>

                        <div className="flex items-start gap-2 p-4">
                            <Calendar size={90} className="text-purple-600 calendar" />
                            <div>
                                <Text variant="caption" weight="bold">Automate and Optimize Your Schedule
                                </Text>
                                <Text variant="caption">Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks, meetings, and breaks to boost productivity.<br />
                                    Free to try — earn Flowva Points when you sign up!</Text>
                            </div>
                        </div>

                    <div className="spotlight-actions p-6 mt-auto">
                        <button className="bg">
                            <span className="flex items-center gap-2">
                                <UserPlus size={16} color="white" /> <Text variant="caption" color="white">Sign up</Text>
                            </span>
                        </button>
                        <button className="bg">
                            <span className="flex items-center gap-2">
                                <Gift size={16} color="white" /> <Text variant="caption" color="white">Claim 50 pts</Text>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
