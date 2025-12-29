import React, { useState } from 'react';
import { Card } from './Shared';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
    isToday, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/gallery.css';

export function CalendarSection({ timelineData, manualEvents, setManualEvents }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Enhanced event state
    const [newEvent, setNewEvent] = useState({ title: '', type: 'study', time: '', description: '' });

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Aggregation
    const timelineEvents = [];
    timelineData.forEach(phase => {
        phase.tasks.forEach(task => {
            if (task.date) {
                timelineEvents.push({
                    id: task.id,
                    title: task.label || 'Task', // Use dynamic label
                    date: task.date,
                    type: 'timeline',
                    cost: task.cost,
                    time: '',
                    description: task.note
                });
            }
        });
    });

    const allEvents = [...timelineEvents, ...manualEvents];

    const getEventsForDay = (day) => {
        return allEvents.filter(event => isSameDay(parseISO(event.date), day));
    };

    const handleAddEvent = () => {
        if (!newEvent.title) return;
        const event = {
            id: `evt-${Date.now()}`,
            title: newEvent.title,
            date: format(selectedDate, 'yyyy-MM-dd'),
            type: newEvent.type,
            time: newEvent.time,
            description: newEvent.description
        };
        setManualEvents(prev => [...prev, event]);
        setNewEvent({ title: '', type: 'study', time: '', description: '' });
        // Keep modal open or close? Usually close for clear flow.
        // User might want to see it added.
    };

    const handleDeleteEvent = (id) => {
        setManualEvents(prev => prev.filter(e => e.id !== id));
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const onDateClick = (day) => {
        setSelectedDate(day);
        setIsModalOpen(true);
    };

    return (
        <Card className="section-calendar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarIcon size={20} />
                    <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Schedule</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <button onClick={prevMonth} className="btn-icon-action"><ChevronLeft size={20} /></button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '140px', textAlign: 'center' }}>
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="btn-icon-action"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="calendar-grid-header">
                {weekDays.map(day => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid">
                {calendarDays.map((day, idx) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);

                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => onDateClick(day)}
                            className={`calendar-day ${!isCurrentMonth ? 'faded' : ''} ${isSelected ? 'selected' : ''}`}
                        >
                            <div className="day-number-row">
                                <span className={`day-number ${isToday(day) ? 'today' : ''}`}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            <div className="day-events-container">
                                {dayEvents.map((evt, i) => (
                                    <div
                                        key={i}
                                        className={`event-chip ${evt.type}`}
                                        title={evt.title}
                                    >
                                        {evt.type !== 'timeline' && evt.time && <span style={{ fontSize: '0.65rem', marginRight: '2px', opacity: 0.8 }}>{evt.time}</span>}
                                        {evt.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <div className="modal-header" style={{ paddingBottom: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{format(selectedDate, 'MMM d, yyyy')}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)} style={{ position: 'static' }}><X size={16} /></button>
                        </div>

                        <div className="modal-body">
                            {/* Add New Event Form */}
                            <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add Event</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Event Title..."
                                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <Clock size={14} style={{ position: 'absolute', left: 8, top: 10, color: 'var(--text-tertiary)' }} />
                                            <input
                                                type="time"
                                                value={newEvent.time}
                                                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                                                style={{ width: '100%', padding: '8px 8px 8px 28px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddEvent}
                                            style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <textarea
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Details..."
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', minHeight: '60px', fontFamily: 'inherit' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event List */}
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Events</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                {getEventsForDay(selectedDate).length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No events.</p>}
                                {getEventsForDay(selectedDate).map(evt => (
                                    <div key={evt.id} style={{ display: 'flex', gap: '10px', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'white' }}>
                                        <div style={{ width: '4px', background: evt.type === 'timeline' ? 'var(--accent-primary)' : '#ea580c', borderRadius: '2px' }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{evt.title}</div>
                                            {evt.time && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {evt.time}</div>}
                                            {evt.description && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{evt.description}</div>}
                                            {evt.cost && <div style={{ fontSize: '0.85rem', color: 'var(--status-success)', marginTop: '2px' }}>Cost: ${evt.cost}</div>}
                                        </div>
                                        {evt.type !== 'timeline' && (
                                            <button onClick={() => handleDeleteEvent(evt.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', height: 'fit-content' }}>
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
