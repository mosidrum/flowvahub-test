import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button/Button';
import { Text } from '../../components/common/Text/Text';
import { Card } from '../../components/common/Card/Card';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.scss';

interface ValidationErrors {
    email?: string;
    password?: string;
}

export const LoginPage: React.FC = () => {
    const { signInWithPassword } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const validateEmail = (email: string): string | null => {
        if (!email.trim()) return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address.';
        return null;
    };

    const validatePassword = (password: string): string | null => {
        if (!password) return 'Password is required.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setValidationErrors({});

        // Validate inputs
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setValidationErrors({
                email: emailError || undefined,
                password: passwordError || undefined,
            });
            return;
        }

        setStatus('loading');
        try {
            const error = await signInWithPassword(email, password);
            if (error) {
                setErrorMessage(error.message);
                setStatus('error');
            } else {
                setStatus('success');
                navigate('/dashboard/earn-rewards');
            }
        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.message || "Something went wrong.");
            setStatus('error');
        }
    };

    return (
        <div className="auth-container">
            <Card padding="lg" className="auth-card">
                <div className="auth-header">
                    <Text variant="h3" weight="bold">Log in to flowva</Text>
                    <Text variant="body" color="secondary">Log in to receive personalized recommendations</Text>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                            }}
                            className={`auth-input ${validationErrors.email ? 'error' : ''}`}
                            placeholder="user@example.com"
                        />
                        {validationErrors.email && (
                            <p className="input-error-msg">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                                }}
                                className={`auth-input ${validationErrors.password ? 'error' : ''}`}
                                placeholder="........"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                style={{ top: '50%', transform: 'translateY(-50%)', right: '12px' }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p className="input-error-msg">{validationErrors.password}</p>
                        )}
                    </div>

                    <div className="forgot-password-container">
                        <button type="button" className="forgot-password-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                            Forgot Password?
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="auth-error-banner">
                            {errorMessage}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        className="auth-btn-primary"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Signing In...' : 'Sign in'}
                    </Button>

                    <div className="divider">
                        <div className="divider-line">
                            <span />
                        </div>
                        <div className="divider-text-container">
                            <span>or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="auth-btn-google"
                    >
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="login-signup-link">
                        <Text variant="small" color="secondary">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </Text>
                    </div>
                </form>
            </Card>
        </div>
    );
};

