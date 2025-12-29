import React, { useState } from 'react';
import { Card, Checkbox } from './Shared';
import { visaPhases as staticPhases } from '../data/timeline';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Calendar as CalIcon, DollarSign, Copy, Settings, Plus, Trash2, Check } from 'lucide-react';

function TaskDetailModal({ task, phaseTitle, onClose, onSave }) {
    const [data, setData] = useState({
        label: task.label,
        date: task.date || '',
        cost: task.cost || 0,
        currency: task.currency || 'AUD', // Default AUD
        note: task.note || ''
    });

    const handleSave = () => {
        onSave({ ...task, ...data });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0 }}>Edit Task</h3>
                </div>
                <div className="modal-body">
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Task Name</label>
                        <input
                            type="text"
                            value={data.label}
                            onChange={(e) => setData(prev => ({ ...prev, label: e.target.value }))}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Cost</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <select
                                value={data.currency}
                                onChange={(e) => setData(prev => ({ ...prev, currency: e.target.value }))}
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)' }}
                            >
                                <option value="AUD">AUD ($)</option>
                                <option value="KRW">KRW (₩)</option>
                            </select>
                            <input
                                type="number"
                                value={data.cost}
                                onChange={(e) => setData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Date</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData(prev => ({ ...prev, date: e.target.value }))}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Note</label>
                        <textarea
                            value={data.note}
                            onChange={(e) => setData(prev => ({ ...prev, note: e.target.value }))}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', minHeight: '80px' }}
                            placeholder="Memo..."
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        style={{ width: '100%', padding: '10px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export function VisaTimeline({ uniqueData, setUniqueData }) {
    const [expandedPhase, setExpandedPhase] = useState('phase-1');
    const [editingTask, setEditingTask] = useState(null); // { task, phaseTitle, phaseId }
    const [copyStatus, setCopyStatus] = useState('Copy');
    // Track which phases are in "Structure Mode" (Add/Delete tasks)
    const [structureModes, setStructureModes] = useState({});

    const togglePhase = (id) => {
        // If clicking header, just toggle expand. Structure mode persists inside if open? 
        // Usually cleaner to auto-expand if structure mode is clicked.
        setExpandedPhase(expandedPhase === id ? null : id);
    };

    const toggleStructureMode = (e, id) => {
        e.stopPropagation();
        setStructureModes(prev => ({ ...prev, [id]: !prev[id] }));
        if (expandedPhase !== id) setExpandedPhase(id); // Auto-expand
    };

    const getPhaseData = (phaseId) => uniqueData.find(p => p.id === phaseId) || { tasks: [] };

    const updatePhaseData = (phaseId, newTasks) => {
        setUniqueData(prev => prev.map(p =>
            p.id === phaseId ? { ...p, tasks: newTasks } : p
        ));
    };

    // --- Task CRUD ---
    const toggleTask = (phaseId, taskId) => {
        const phase = getPhaseData(phaseId);
        const updatedTasks = phase.tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        updatePhaseData(phaseId, updatedTasks);
    };

    const addTask = (phaseId) => {
        const phase = getPhaseData(phaseId);
        const newTask = {
            id: `task-${Date.now()}`,
            label: 'New Task',
            completed: false,
            date: '',
            cost: 0,
            currency: 'AUD'
        };
        updatePhaseData(phaseId, [...phase.tasks, newTask]);
    };

    const deleteTask = (phaseId, taskId) => {
        const phase = getPhaseData(phaseId);
        const updatedTasks = phase.tasks.filter(t => t.id !== taskId);
        updatePhaseData(phaseId, updatedTasks);
    };

    const saveTaskDetails = (updatedTask) => {
        const phaseId = editingTask.phaseId;
        const phase = getPhaseData(phaseId);
        const updatedTasks = phase.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        updatePhaseData(phaseId, updatedTasks);
    };

    const handleCopyText = () => {
        let text = "My AuNursing Timeline:\n\n";
        uniqueData.forEach(p => {
            const staticPhase = staticPhases.find(sp => sp.id === p.id);
            const title = staticPhase ? staticPhase.title : (p.title || 'Phase'); // Fallback if we allow custom phases later

            const completedTasks = p.tasks.filter(t => t.completed);
            if (completedTasks.length > 0) {
                text += `[${title}]\n`;
                completedTasks.forEach(t => {
                    text += `- ${t.label}`;
                    if (t.date) text += ` (${t.date})`;
                    if (t.cost > 0) text += ` [${t.currency === 'KRW' ? '₩' : '$'}${t.cost.toLocaleString()}]`;
                    text += "\n";
                });
                text += "\n";
            }
        });

        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        });
    };

    return (
        <Card className="section-timeline">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h2>Time Line</h2>
                <button onClick={handleCopyText} className="btn-icon-action" style={{ background: 'white', border: '1px solid var(--border-color)', width: 'auto', padding: '6px 12px', gap: '6px' }}>
                    {copyStatus === 'Copied!' ? <Check size={16} color="var(--status-success)" /> : <Copy size={16} />}
                    <span style={{ fontSize: '0.8rem' }}>{copyStatus}</span>
                </button>
            </div>

            <div className="timeline-container">
                {staticPhases.map((phase) => {
                    const storedPhase = getPhaseData(phase.id);
                    // If storedPhase is missing (e.g. new phase added to static), we should handle gracefully or init it.
                    // For now assuming init happened in App.js.

                    // Merge logic: Our storedPhase.tasks IS the source of truth now (since we allow add/delete).
                    // We DO NOT map staticTasks anymore for the list rendering, because user might have deleted them.
                    // However, on first load, we need to ensure they exist. (This logic belongs in App.js init, assuming done).
                    const tasksToRender = storedPhase.tasks || [];

                    const completedCount = tasksToRender.filter(t => t.completed).length;
                    const totalCount = tasksToRender.length;
                    const isDone = completedCount === totalCount && totalCount > 0;
                    const isActive = expandedPhase === phase.id;
                    const isStructureMode = structureModes[phase.id];

                    const IconComponent = phase.icon;

                    return (
                        <div key={phase.id} className={`timeline-phase ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}`}>

                            <div className="phase-header" onClick={() => togglePhase(phase.id)}>
                                <div className="phase-icon">
                                    <IconComponent size={20} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="phase-title-text">{phase.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                            {isDone ? 'Completed' : `${completedCount}/${totalCount}`}
                                        </div>
                                    </div>
                                    {/* Settings Icon to toggle Structure Mode */}
                                    <div
                                        onClick={(e) => toggleStructureMode(e, phase.id)}
                                        className={`btn-icon-action ${isStructureMode ? 'active-mode' : ''}`}
                                        style={{ marginRight: '8px', padding: '6px', color: isStructureMode ? 'var(--accent-primary)' : 'var(--text-quarter)' }}
                                        title="Manage Tasks"
                                    >
                                        <Settings size={14} />
                                    </div>
                                </div>
                            </div>

                            {isActive && (
                                <div className="phase-content">
                                    <div className="phase-tasks">
                                        {tasksToRender.map((task) => (
                                            <div key={task.id} className="task-row">
                                                {/* Checkbox Section */}
                                                <Checkbox
                                                    id={task.id}
                                                    label="" // Empty label, we render custom text
                                                    checked={!!task.completed}
                                                    onChange={() => toggleTask(phase.id, task.id)}
                                                />

                                                {/* Content Section (Click to Edit) */}
                                                <div
                                                    className="task-content-clickable"
                                                    onClick={() => setEditingTask({ phaseId: phase.id, title: phase.title, task })}
                                                >
                                                    <div className={`task-label ${task.completed ? 'completed-text' : ''}`}>
                                                        {task.label}
                                                    </div>
                                                    {(task.date || task.cost > 0) && (
                                                        <div className="task-meta">
                                                            {task.date && (
                                                                <span className="meta-tag">
                                                                    <CalIcon size={10} /> {task.date}
                                                                </span>
                                                            )}
                                                            {task.cost > 0 && (
                                                                <span className="meta-tag cost">
                                                                    {task.currency === 'KRW' ? '₩' : '$'} {task.cost.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delete Button (Only in Structure Mode) */}
                                                {isStructureMode && (
                                                    <button
                                                        onClick={() => deleteTask(phase.id, task.id)}
                                                        className="btn-icon-delete"
                                                        title="Delete Task"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add Task Button (Structure Mode) */}
                                        {isStructureMode && (
                                            <button
                                                onClick={() => addTask(phase.id)}
                                                className="btn-add-task"
                                            >
                                                <Plus size={14} /> Add Item
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {editingTask && (
                <TaskDetailModal
                    task={editingTask.task}
                    phaseTitle={editingTask.title}
                    onClose={() => setEditingTask(null)}
                    onSave={saveTaskDetails}
                />
            )}
        </Card>
    );
}
