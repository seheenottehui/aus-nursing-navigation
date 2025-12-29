import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './Shared';
import { LogIn, AlertCircle } from 'lucide-react';

export function Login() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setError('');
            setLoading(true);

            // Check if config is still placeholder
            const isConfigured = !document.body.innerText.includes("YOUR_API_KEY");

            await login();
        } catch (err) {
            console.error("Login Error:", err);
            if (err.code === 'auth/invalid-api-key' || err.code === 'auth/configuration-not-found') {
                setError("Firebase is not configured. Please add your API Keys to src/firebase.js");
            } else {
                setError("Failed to sign in: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-app)'
        }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '8px' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Sign in to access your Nursing Dashboard
                </p>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '24px',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <LogIn size={20} />
                    {loading ? 'Connecting...' : 'Sign in with Google'}
                </button>

                <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    Secure, cloud-synced storage for your journey.
                </div>
            </Card>
        </div>
    );
}
