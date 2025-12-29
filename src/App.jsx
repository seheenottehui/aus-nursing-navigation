import React, { useState } from 'react';
import './styles/dashboard.css';
import { usePersistentState } from './hooks/usePersistentState';
import { visaPhases } from './data/timeline';
import { nursingResources } from './data/resources';

// Component Imports
import { CalendarSection } from './components/CalendarSection';
import { VisaTimeline } from './components/VisaTimeline';
import { FinanceSnapshot } from './components/FinanceSnapshot';
import { NursingResources } from './components/NursingResources';
import { Layout } from 'lucide-react';

// Default data
const defaultData = {
    timelineData: visaPhases.map(p => ({ ...p, tasks: p.tasks || [] })),
    calendarEvents: [],
    resources: nursingResources,
    finance: {
        goal: 30000,
        saved: 5000
    }
};

function Dashboard() {
    const [data, setData] = usePersistentState('dashboard-data', defaultData);

    const updateSection = (sectionKey, newValue) => {
        setData(prev => ({ ...prev, [sectionKey]: newValue }));
    };

    const updateFinance = (field, value) => {
        setData(prev => ({
            ...prev,
            finance: { ...prev.finance, [field]: value }
        }));
    };

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
    return <Dashboard />;
}

export default App;
