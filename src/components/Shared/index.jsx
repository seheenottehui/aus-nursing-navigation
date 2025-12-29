import React from 'react';

// Card Component - Pass through props mainly, style handled in CSS
export function Card({ children, className = '' }) {
    return (
        <div className={`dashboard-card ${className}`}>
            {children}
        </div>
    );
}

// Checkbox Component (Custom styled Premium)
export function Checkbox({ id, label, checked, onChange, disabled = false }) {
    return (
        <div className="flex items-center" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ position: 'relative', paddingTop: '2px' }}>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    style={{
                        appearance: 'none',
                        width: '20px',
                        height: '20px',
                        border: `2px solid ${checked ? 'var(--status-success)' : 'var(--border-color)'}`,
                        borderRadius: '6px',
                        backgroundColor: checked ? 'var(--status-success)' : 'white',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'grid',
                        placeContent: 'center'
                    }}
                />
                {/* Check Icon Overlay */}
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                        position: 'absolute',
                        top: '6px',
                        left: '4px',
                        opacity: checked ? 1 : 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s',
                        stroke: 'white',
                        strokeWidth: 3,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                    }}
                >
                    <polyline points="1 6 4 9 11 1"></polyline>
                </svg>
            </div>

            <label
                htmlFor={id}
                style={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    color: checked ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    textDecoration: checked ? 'line-through' : 'none',
                    opacity: disabled ? 0.7 : 1,
                    fontSize: '0.95rem',
                    lineHeight: '1.4',
                    transition: 'color 0.2s'
                }}
            >
                {label}
            </label>
        </div>
    );
}

// Input Component (Premium styled)
export function Input({ type = "text", value, onChange, placeholder, prefix, suffix }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2px 12px',
            transition: 'box-shadow 0.2s, border-color 0.2s',
            focusWithin: '0 0 0 2px var(--bg-accent-subtle)' // This logic needs JS or CSS :focus-within on parent
        }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
            {prefix && <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{prefix}</span>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '10px 0',
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    outline: 'none'
                }}
            />
            {suffix && <span style={{ color: 'var(--text-tertiary)' }}>{suffix}</span>}
        </div>
    );
}
