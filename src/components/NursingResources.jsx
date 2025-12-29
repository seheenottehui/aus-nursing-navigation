import React, { useState, useEffect } from 'react';
import { Card } from './Shared';
import { nursingResources as initialData } from '../data/resources';
import { usePersistentState } from '../hooks/usePersistentState';
import { BookOpen, ExternalLink, FileText, X, MonitorPlay, Plus, MoreVertical, Trash2, Edit2, Check } from 'lucide-react';
import '../styles/gallery.css';

// --- Components ---

function ResourceLinkEditor({ link, onSave, onDelete, onCancel }) {
    const [data, setData] = useState({ ...link });

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', padding: '8px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <input
                    value={data.title}
                    onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Resource Title"
                    style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
                <input
                    value={data.url}
                    onChange={(e) => setData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="URL (https://...)"
                    style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button onClick={() => onSave(data)} style={{ padding: '4px', background: 'var(--status-success)', border: 'none', borderRadius: '4px', color: 'white' }}><Check size={14} /></button>
                <button onClick={onDelete} style={{ padding: '4px', background: 'var(--status-warning)', border: 'none', borderRadius: '4px', color: 'white' }}><Trash2 size={14} /></button>
            </div>
        </div>
    );
}

function ResourceModal({ itemId, allResources, setAllResources, onClose, categoryId }) {
    // Find item from fresh state to ensure sync
    const category = allResources.find(c => c.id === categoryId);
    const item = category?.items.find(i => i.id === itemId);

    // If item deleted or not found
    if (!item) return null;

    const [notes, setNotes] = usePersistentState(`notes-${item.id}`, '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleEdit, setTitleEdit] = useState(item.label);
    const [editingLinkId, setEditingLinkId] = useState(null); // 'vid-index' or 'read-index' or 'new-vid'

    const updateItem = (newItemData) => {
        const updatedCategory = {
            ...category,
            items: category.items.map(i => i.id === itemId ? { ...i, ...newItemData } : i)
        };
        setAllResources(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
    };

    const handleTitleSave = () => {
        updateItem({ label: titleEdit });
        setIsEditingTitle(false);
    };

    const handleLinkSave = (type, index, newData) => {
        const list = type === 'video' ? [...item.videos] : [...item.reads];
        if (index === -1) {
            list.push(newData);
        } else {
            list[index] = newData;
        }
        updateItem(type === 'video' ? { videos: list } : { reads: list });
        setEditingLinkId(null);
    };

    const handleLinkDelete = (type, index) => {
        const list = type === 'video' ? [...item.videos] : [...item.reads];
        list.splice(index, 1);
        updateItem(type === 'video' ? { videos: list } : { reads: list });
        setEditingLinkId(null);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className={`modal-cover ${categoryId}`}>
                    <div style={{ padding: 'var(--space-md)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="modal-close" onClick={onClose}><X size={18} /></button>
                    </div>
                </div>

                <div className="modal-body">
                    {/* Header Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-lg)' }}>
                        <div className="card-icon" style={{ position: 'static', transform: 'none', boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                            {item.label[0]}
                        </div>
                        {isEditingTitle ? (
                            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                                <input
                                    value={titleEdit}
                                    onChange={(e) => setTitleEdit(e.target.value)}
                                    style={{ fontSize: '1.5rem', fontWeight: 600, width: '100%', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)' }}
                                />
                                <button onClick={handleTitleSave} className="btn-icon-action" style={{ background: 'var(--status-success)', color: 'white' }}><Check size={18} /></button>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{item.label}</h2>
                                <button onClick={() => setIsEditingTitle(true)} className="btn-icon-action" style={{ opacity: 0.5 }}><Edit2 size={16} /></button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                        {/* Videos Column */}
                        <div className="link-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0 }}>Watch</h4>
                                <button
                                    onClick={() => setEditingLinkId('new-video')}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', padding: '4px', cursor: 'pointer' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {editingLinkId === 'new-video' && (
                                <ResourceLinkEditor
                                    link={{ title: '', url: '' }}
                                    onSave={(d) => handleLinkSave('video', -1, d)}
                                    onDelete={() => setEditingLinkId(null)}
                                    onCancel={() => setEditingLinkId(null)}
                                />
                            )}

                            {item.videos.map((vid, i) => (
                                <div key={i}>
                                    {editingLinkId === `vid-${i}` ? (
                                        <ResourceLinkEditor
                                            link={vid}
                                            onSave={(d) => handleLinkSave('video', i, d)}
                                            onDelete={() => handleLinkDelete('video', i)}
                                        />
                                    ) : (
                                        <div className="resource-link-row">
                                            <a href={vid.url} target="_blank" rel="noopener noreferrer" className="resource-link" style={{ marginBottom: 0, flex: 1 }}>
                                                <MonitorPlay size={16} />
                                                <span style={{ fontSize: '0.9rem' }}>{vid.title}</span>
                                            </a>
                                            <button onClick={() => setEditingLinkId(`vid-${i}`)} className="btn-icon-action"><Edit2 size={14} /></button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {item.videos.length === 0 && editingLinkId !== 'new-video' && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No videos listed.</p>}
                        </div>

                        {/* Reads Column */}
                        <div className="link-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0 }}>Read</h4>
                                <button
                                    onClick={() => setEditingLinkId('new-read')}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', padding: '4px', cursor: 'pointer' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {editingLinkId === 'new-read' && (
                                <ResourceLinkEditor
                                    link={{ title: '', url: '' }}
                                    onSave={(d) => handleLinkSave('read', -1, d)}
                                    onDelete={() => setEditingLinkId(null)}
                                    onCancel={() => setEditingLinkId(null)}
                                />
                            )}

                            {item.reads.map((read, i) => (
                                <div key={i}>
                                    {editingLinkId === `read-${i}` ? (
                                        <ResourceLinkEditor
                                            link={read}
                                            onSave={(d) => handleLinkSave('read', i, d)}
                                            onDelete={() => handleLinkDelete('read', i)}
                                        />
                                    ) : (
                                        <div className="resource-link-row">
                                            <a href={read.url} target="_blank" rel="noopener noreferrer" className="resource-link" style={{ marginBottom: 0, flex: 1 }}>
                                                <BookOpen size={16} />
                                                <span style={{ fontSize: '0.9rem' }}>{read.title}</span>
                                            </a>
                                            <button onClick={() => setEditingLinkId(`read-${i}`)} className="btn-icon-action"><Edit2 size={14} /></button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {item.reads.length === 0 && editingLinkId !== 'new-read' && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No articles listed.</p>}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} /> Personal Notes
                        </h4>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Write your study notes here (Markdown supported)..."
                            style={{
                                width: '100%', minHeight: '150px', padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                                fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: '1.6',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function NursingResources() {
    const [resources, setResources] = usePersistentState('nursing-resources-v2', initialData);
    const [activeTab, setActiveTab] = useState(resources[0]?.id || 'biology');
    const [selectedItemId, setSelectedItemId] = useState(null);

    const activeCategory = resources.find(c => c.id === activeTab);

    // Sync active category if tabs change remotely (though local state usually prevents this issue, helpful for robustness)
    useEffect(() => {
        if (!activeCategory && resources.length > 0) {
            setActiveTab(resources[0].id);
        }
    }, [resources]);

    const handleAddItem = () => {
        const newItem = {
            id: `new-${Date.now()}`,
            label: 'New Topic',
            videos: [],
            reads: []
        };
        const updatedCategory = { ...activeCategory, items: [...activeCategory.items, newItem] };
        setResources(prev => prev.map(c => c.id === activeTab ? updatedCategory : c));

        // Auto open edit
        // To do this properly we'd need to wait for render, but user can just click it.
    };

    const handleDeleteItem = (e, itemId) => {
        e.stopPropagation();
        if (confirm('Delete this topic and all its notes?')) {
            const updatedCategory = { ...activeCategory, items: activeCategory.items.filter(i => i.id !== itemId) };
            setResources(prev => prev.map(c => c.id === activeTab ? updatedCategory : c));
        }
    };

    return (
        <Card className="section-resources">
            <div style={{ marginBottom: 'var(--space-md)' }}>
                <h2><BookOpen size={20} /> Knowledge Gallery</h2>
            </div>

            <div className="gallery-tabs">
                {resources.map(cat => (
                    <button
                        key={cat.id}
                        className={`gallery-tab ${activeTab === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat.id)}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            <div className="gallery-grid">
                {activeCategory && activeCategory.items.map(item => (
                    <div
                        key={item.id}
                        className="gallery-card"
                        onClick={() => setSelectedItemId(item.id)}
                    >
                        <div className={`card-cover ${activeTab}`}></div>

                        {/* Delete Button (Hover) */}
                        <button
                            className="card-delete-btn"
                            onClick={(e) => handleDeleteItem(e, item.id)}
                            title="Delete Topic"
                        >
                            <X size={14} color="white" />
                        </button>

                        <div className="card-content">
                            <div className="card-icon">{item.label[0]}</div>
                            <div className="card-title">{item.label}</div>
                            <div className="card-meta">
                                {item.videos.length} videos • {item.reads.length} reads
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card Button */}
                <button
                    onClick={handleAddItem}
                    className="gallery-card add-card-btn"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', background: 'transparent', border: '2px dashed var(--border-color)', boxShadow: 'none' }}
                >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <Plus size={20} color="var(--text-tertiary)" />
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Add Topic</span>
                </button>
            </div>

            {selectedItemId && (
                <ResourceModal
                    itemId={selectedItemId}
                    allResources={resources}
                    setAllResources={setResources}
                    categoryId={activeTab}
                    onClose={() => setSelectedItemId(null)}
                />
            )}
        </Card>
    );
}
