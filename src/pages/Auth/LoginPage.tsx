import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button/Button';
import { Text } from '../../components/common/Text/Text';
import { Card } from '../../components/common/Card/Card';
import '../../styles/main.scss';

export const LoginPage: React.FC = () => {
    const { signInWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await signInWithEmail(email);
            setStatus('sent');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card padding="lg" className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Text variant="h3" weight="bold" className="mb-2">Welcome to Flowva Hub</Text>
                    <Text variant="body" color="secondary">Sign in to access your rewards</Text>
                </div>

                {status === 'sent' ? (
                    <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
                        <Text variant="body" weight="bold">Magic Link Sent!</Text>
                        <Text variant="small">Check your email ({email}) for the login link.</Text>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        {status === 'error' && (
                            <div className="text-red-500 text-sm">
                                Something went wrong. Please try again.
                            </div>
                        )}

                        <Button
                            variant="primary"
                            className="w-full justify-center py-3"
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Sending Link...' : 'Sign In with Magic Link'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};
