import React, { ReactNode } from 'react';
import {
    Home,
    Compass,
    Library,
    Layers,
    CreditCard,
    Gift,
    Settings
} from 'lucide-react';
import { Text } from '../common/Text/Text';
import './DashboardLayout.scss';

// Logo Icon Component (Simplified Flowva Logo representation)
const FlowvaLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2.5C10 2.5 5 7 5 12C5 17 9 21 9 26H23C23 21 27 17 27 12C27 7 22 2.5 16 2.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 14C11 14 13 16 16 16C19 16 21 14 21 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="22" r="3" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="23" cy="22" r="3" stroke="currentColor" strokeWidth="2.5" />
    </svg>
);

interface DashboardLayoutProps {
    children: ReactNode;
}

const SIDEBAR_ITEMS = [
    { icon: <Home size={20} />, label: 'Home', active: false },
    { icon: <Compass size={20} />, label: 'Discover', active: false },
    { icon: <Library size={20} />, label: 'Library', active: false },
    { icon: <Layers size={20} />, label: 'Tech Stack', active: false },
    { icon: <CreditCard size={20} />, label: 'Subscriptions', active: false },
    { icon: <Gift size={20} />, label: 'Rewards Hub', active: true },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar__logo">
                    <div className="logo-icon"><FlowvaLogo /></div>
                    <span className="logo-text">Flowva</span>
                </div>

                <nav className="sidebar__nav">
                    {SIDEBAR_ITEMS.map((item, index) => (
                        <button
                            key={index}
                            className={`nav-item ${item.active ? 'nav-item--active' : ''}`}
                        >
                            {item.icon}
                            <span className="nav-item__label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar__user">
                    <div className="user-avatar">
                        <img src="https://i.pravatar.cc/150?u=mosiodrum" alt="User" />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Mosidrum</span>
                        <span className="user-email">mosiokanga@gmail.com</span>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};
