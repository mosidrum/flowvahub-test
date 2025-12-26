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

