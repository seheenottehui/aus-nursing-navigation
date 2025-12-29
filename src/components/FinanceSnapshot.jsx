import React from 'react';
import { Card, Input } from './Shared';
import { TrendingUp, RefreshCcw } from 'lucide-react';

export function FinanceSnapshot({ timelineData, goal, savedAmount, onUpdate }) {
    // Exchange Rate Assumption
    const KRW_TO_AUD = 1 / 900;

    // Calculate Timeline Total (Converted to AUD)
    const timelineTotalAUD = timelineData.reduce((acc, phase) => {
        return acc + phase.tasks.reduce((pAcc, task) => {
            let cost = task.cost || 0;
            if (task.currency === 'KRW') {
                cost = cost * KRW_TO_AUD;
            }
            return pAcc + cost;
        }, 0);
    }, 0);

    const safeGoal = Number(goal) || 1; // Prevent div by zero
    const safeSaved = Number(savedAmount) || 0;
    const percentSaved = Math.min(100, Math.round((safeSaved / safeGoal) * 100));

    return (
        <Card className="section-finance">
            <div style={{ marginBottom: 'var(--space-md)' }}>
                <h2 style={{ border: 'none', padding: 0, margin: 0, fontSize: '1rem' }}>Financial Snapshot</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Savings vs Goal */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Savings Goal</span>
                        <span style={{ fontWeight: 600 }}>${safeGoal.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentSaved}%`, background: 'var(--status-success)', height: '100%' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--status-success)' }}>
                            ${safeSaved.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{percentSaved}%</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                        <Input
                            type="number"
                            value={safeSaved}
                            onChange={(e) => onUpdate('saved', Number(e.target.value))}
                            prefix="$"
                            style={{ padding: '6px' }}
                        />
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingUp size={14} /> Est. Total Spent (AUD)
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>${Math.round(timelineTotalAUD).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCcw size={10} /> Includes converted KRW expenses (~900:1)
                    </div>
                </div>

            </div>
        </Card>
    );
}
