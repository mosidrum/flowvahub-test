import React from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Text } from '../../../components/common/Text/Text';
import { Button } from '../../../components/common/Button/Button';
import { Star, Share2 } from 'lucide-react';

export const EarnSection: React.FC = () => {
    return (
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
    );
};
