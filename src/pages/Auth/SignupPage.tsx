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
    confirmPassword?: string;
}

interface PasswordRequirements {
    minLength: boolean;
    hasUpperCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

export const SignupPage: React.FC = () => {
    const { signUpWithPassword } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // UI States
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
        minLength: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const validateEmail = (email: string): string | null => {
        if (!email.trim()) return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address.';
        return null;
    };

    const checkPasswordRequirements = (pwd: string): PasswordRequirements => {
        return {
            minLength: pwd.length >= 6,
            hasUpperCase: /[A-Z]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        };
    };

    const validatePassword = (pwd: string): string | null => {
        const requirements = checkPasswordRequirements(pwd);

        if (!pwd) return 'Password is required.';
        if (!requirements.minLength) return 'Password must be at least 6 characters.';
        if (!requirements.hasUpperCase) return 'Password must contain an uppercase letter.';
        if (!requirements.hasNumber) return 'Password must contain a number.';
        if (!requirements.hasSpecialChar) return 'Password must contain a special character.';

        return null;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordRequirements(checkPasswordRequirements(newPassword));
        if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setValidationErrors({});

        // Validation
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = password !== confirmPassword ? 'Passwords do not match.' : null;

        if (emailError || passwordError || confirmPasswordError) {
            setValidationErrors({
                email: emailError || undefined,
                password: passwordError || undefined,
                confirmPassword: confirmPasswordError || undefined,
            });
            return;
        }

        setStatus('loading');
        try {
            const error = await signUpWithPassword(email, password);
            if (error) {
                setErrorMessage(error.message);
                setStatus('error');
            } else {
                setStatus('success');
            }
        } catch (error: any) {
            setErrorMessage(error.message || "An unexpected error occurred.");
            setStatus('error');
        }
    };

    return (
        <div className="auth-container">
            <Card padding="lg" className="auth-card">
                <div className="auth-header">
                    <Text variant="h3" weight="bold">Create Your Account</Text>
                    <Text variant="body" color="secondary">Sign up to manage your tools</Text>
                </div>

                {status === 'success' ? (
                    <div className="success-message">
                        <Text variant="body" weight="bold">Account Created!</Text>
                        <Text variant="small" style={{ marginTop: '0.5rem', display: 'block' }}>Please check your email to verify your account before logging in.</Text>
                        <Button
                            variant="primary"
                            className="auth-btn-primary success-btn"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className="auth-form">
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
                                placeholder="your@email.com"
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
                                    onChange={handlePasswordChange}
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

                            {/* Password Requirements Checklist */}
                            {password && (
                                <div className="password-requirements">
                                    <p>Password Requirements:</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div className={`req-item ${passwordRequirements.minLength ? 'valid' : 'invalid'}`}>
                                            <span className={`status-icon ${passwordRequirements.minLength ? 'valid' : 'invalid'}`}>
                                                {passwordRequirements.minLength ? '✓' : '○'}
                                            </span>
                                            At least 6 characters
                                        </div>
                                        <div className={`req-item ${passwordRequirements.hasUpperCase ? 'valid' : 'invalid'}`}>
                                            <span className={`status-icon ${passwordRequirements.hasUpperCase ? 'valid' : 'invalid'}`}>
                                                {passwordRequirements.hasUpperCase ? '✓' : '○'}
                                            </span>
                                            One uppercase letter (A-Z)
                                        </div>
                                        <div className={`req-item ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}>
                                            <span className={`status-icon ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}>
                                                {passwordRequirements.hasNumber ? '✓' : '○'}
                                            </span>
                                            One number (0-9)
                                        </div>
                                        <div className={`req-item ${passwordRequirements.hasSpecialChar ? 'valid' : 'invalid'}`}>
                                            <span className={`status-icon ${passwordRequirements.hasSpecialChar ? 'valid' : 'invalid'}`}>
                                                {passwordRequirements.hasSpecialChar ? '✓' : '○'}
                                            </span>
                                            One special character (!@#$%^&*)
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                                    }}
                                    className={`auth-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                                    placeholder="........"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                    style={{ top: '50%', transform: 'translateY(-50%)', right: '12px' }}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="input-error-msg">{validationErrors.confirmPassword}</p>
                            )}
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
                            {status === 'loading' ? 'Creating Account...' : 'Sign up Account'}
                        </Button>

                        {/* Google Sign In Placeholder */}
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
                                Already have an account? <Link to="/login">Log In</Link>
                            </Text>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

