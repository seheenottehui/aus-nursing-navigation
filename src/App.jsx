import React, { useState } from 'react';
import './styles/dashboard.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { useFirestoreData } from './hooks/useFirestoreData';

// Component Imports
import { CalendarSection } from './components/CalendarSection';
import { VisaTimeline } from './components/VisaTimeline';
import { FinanceSnapshot } from './components/FinanceSnapshot';
import { NursingResources } from './components/NursingResources';
import { LogOut, Layout } from 'lucide-react';

function Dashboard() {
    const { currentUser, logout } = useAuth();
    const { data, loading, error, updateSection, updateFinance } = useFirestoreData();

    if (error) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '20px' }}>
                    <h2 style={{ color: '#ef4444' }}>Starting Database Failed</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        {error.code === 'permission-denied'
                            ? "Missing Permissions. Please check your Firestore Security Rules."
                            : error.message}
                    </p>
                    <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'left' }}>
                        <strong>Troubleshooting Steps:</strong>
                        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                            <li>Go to Firebase Console -> Firestore Database</li>
                            <li>Click "Create Database" if not created yet.</li>
                            <li>Go to "Rules" tab.</li>
                            <li>Set rules to: <code>allow read, write: if request.auth != null;</code></li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    if (loading || !data) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ marginBottom: '16px' }}></div>
                    <p className="fade-in">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Layout size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>AuNursing Meta</h1>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Strategy & Timeline Dashboard</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {currentUser.email}
                    </span>
                    <button
                        onClick={logout}
                        className="btn-icon-action"
                        title="Sign Out"
                        style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* 1. CALENDAR (Left Column) */}
            <CalendarSection
                uniqueEvents={data.calendarEvents || []}
                setUniqueEvents={(newEvents) => updateSection('calendarEvents', newEvents)}
            />

            {/* 2. TIMELINE (Right Column Top) */}
            <VisaTimeline
                uniqueData={data.timelineData || []}
                setUniqueData={(newData) => updateSection('timelineData', newData)}
            />

            {/* 3. FINANCE (Right Column Middle) */}
            <FinanceSnapshot
                timelineData={data.timelineData || []}
                goal={data.finance?.goal || 30000}
                savedAmount={data.finance?.saved || 5000}
                onUpdate={updateFinance}
            />

            {/* 4. RESOURCES (Bottom Full Width) */}
            <NursingResources
                resources={data.resources || []}
                setResources={(newRes) => updateSection('resources', newRes)}
            />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { currentUser } = useAuth();
    return currentUser ? <Dashboard /> : <Login />;
}

export default App;
