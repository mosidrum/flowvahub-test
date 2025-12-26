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

