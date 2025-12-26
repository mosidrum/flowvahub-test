import React from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Text } from '../../../components/common/Text/Text';
import { Star, Share2 } from 'lucide-react';
import './EarnSection.scss';

export const EarnSection: React.FC = () => {
    return (
        <section className="mt-12">
            <div className="section-title">
                <Text variant="h4" weight="medium">Earn More Points</Text>
            </div>

            <div className="earn-more-grid">
                <Card padding="lg" className="flex flex-col h-full p-4" hoverable>
                    <div className="flex items-start gap-3">
                        <div className="icon-circle-purple-outline">
                            <Star size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <Text variant="body" weight="bold" className="mb-4">Refer and win 10,000 points!</Text>
                            <Text variant="caption" color="secondary" className="leading-relaxed">
                                Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of <span className="text-purple-600">10,000 points.</span> Friends must complete onboarding to qualify.                            </Text>
                        </div>
                    </div>
                </Card>

                <Card padding="lg" className="flex flex-col h-full p-4" hoverable>
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
                        <Text variant="caption" weight="medium">Share your tool stack</Text>
                        <div className="flex items-center btn">
                            <Share2 size={16} className="mr-2" />
                            <Text>Share</Text>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};
