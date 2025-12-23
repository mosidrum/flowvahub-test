import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { RewardsPage } from './pages/Rewards/RewardsPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { useAuth } from './contexts/AuthContext';
import './styles/main.scss';

const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard/earn-rewards" replace />} />
                <Route
                    path="/dashboard/earn-rewards"
                    element={
                        <DashboardLayout>
                            <RewardsPage />
                        </DashboardLayout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
