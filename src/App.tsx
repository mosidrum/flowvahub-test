import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { RewardsPage } from './pages/Rewards/RewardsPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
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

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={!user ? <LoginPage /> : <Navigate to="/dashboard/earn-rewards" replace />}
                />
                <Route
                    path="/signup"
                    element={!user ? <SignupPage /> : <Navigate to="/dashboard/earn-rewards" replace />}
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard/*"
                    element={
                        user ? (
                            <DashboardLayout>
                                <Routes>
                                    <Route path="earn-rewards" element={<RewardsPage />} />
                                    <Route path="*" element={<Navigate to="earn-rewards" replace />} />
                                </Routes>
                            </DashboardLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Root Redirect */}
                <Route
                    path="/"
                    element={<Navigate to={user ? "/dashboard/earn-rewards" : "/login"} replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
