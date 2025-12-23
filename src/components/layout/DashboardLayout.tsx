import React, { ReactNode, useState, useRef, useEffect } from 'react';
import {
    Home,
    Compass,
    Library,
    Layers,
    CreditCard,
    Gift,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Extract user name from email or use default
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || 'user@example.com';

    // Handle window resize to detect mobile
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 640;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            {/* Mobile Menu Toggle */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && isMobile && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
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

                <div className="sidebar__user" ref={profileMenuRef}>
                    <button
                        className="user-profile-btn"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div className="user-avatar">
                            <img src={`https://i.pravatar.cc/150?u=${userEmail}`} alt={userName} />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{userName}</span>
                            <span className="user-email">{userEmail}</span>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="profile-menu">
                            <button className="profile-menu__item profile-menu__logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
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
