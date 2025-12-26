import React from 'react';
import { Bell } from 'lucide-react';
import { Text } from '../../../components/common/Text/Text';

export const RewardsHeader: React.FC = () => {
    return (
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
    );
};
