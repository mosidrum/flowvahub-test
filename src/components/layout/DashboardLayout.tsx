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
import logo from '../../assets/logo.png';

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

    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || 'user@example.com';

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 640;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {sidebarOpen && isMobile && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar__logo">
                    <img src={logo} className="logo-icon" alt="Flowva Logo" />
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
