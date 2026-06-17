import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { templatesApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import Dialog from '../components/ui/Dialog.jsx';

export default function Templates() {
  const { user } = useAuth();
  const showToast = useToast();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Builder state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentHabits, setCurrentHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health');

  const categories = ['Health', 'Learning', 'Productivity', 'Mindfulness', 'Fitness', 'Other'];

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const data = await templatesApi.getAll();
      setTemplates(data || []);
    } catch (err) {
      showToast('Failed to load templates.', '❌');
    } finally {
      setLoading(false);
    }
  }

  const addHabitToPack = () => {
    if (!newHabitName.trim()) return;
    setCurrentHabits([
      ...currentHabits, 
      { name: newHabitName.trim(), category: newHabitCategory }
    ]);
    setNewHabitName('');
  };

  const removeHabitFromPack = (index) => {
    setCurrentHabits(currentHabits.filter((_, i) => i !== index));
  };

  const handleSaveTemplate = async () => {
    if (!title.trim() || currentHabits.length === 0) {
      showToast('Please add a title and at least one habit.', '⚠️');
      return;
    }
    
    setIsSaving(true);
    try {
      await templatesApi.create({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        habits: currentHabits
      });
      
      showToast('Template pack saved successfully!', '🎉');
      setTitle('');
      setDescription('');
      setCurrentHabits([]);
      setIsBuilderOpen(false);
      loadTemplates(); // Refresh the list
    } catch (error) {
      showToast('Failed to save template pack.', '❌');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async (template) => {
    if (!confirm(`Deploy ${template.title} to your Dashboard?`)) return;
    
    try {
      await templatesApi.apply(user.id, template.habits);
      showToast(`${template.title} habits added to your dashboard!`, '🚀');
    } catch (error) {
      showToast('Failed to deploy template.', '❌');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete template "${title}"?`)) return;
    try {
      await templatesApi.delete(id);
      showToast('Template deleted', '🗑️');
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      showToast('Failed to delete template', '❌');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Habit Templates</h1>
          <p className="page-subtitle">Build custom habit packs and deploy them instantly.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsBuilderOpen(true)}>
          + New Pack
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="empty-state">
          <h3>No Templates Yet</h3>
          <p>Create your first custom habit pack to quickly deploy sets of habits.</p>
        </div>
      ) : (
        <div className="habits-grid" style={{ marginTop: '24px' }}>
          {templates.map(template => (
            <div key={template.id} className="habit-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 600 }}>{template.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    {template.description || 'No description provided.'}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(template.id, template.title)}
                  className="btn"
                  style={{ background: 'transparent', color: 'var(--red)', padding: '4px 8px', fontSize: '1rem' }}
                  title="Delete Template"
                >
                  🗑️
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', flex: 1 }}>
                {template.habits.map((h, i) => (
                  <span key={i} style={{ 
                    background: 'var(--bg-base)', 
                    color: 'var(--text-primary)', 
                    padding: '4px 10px', 
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    border: '1px solid var(--border)'
                  }}>
                    {h.name}
                  </span>
                ))}
              </div>

              <button 
                className="btn btn-primary" 
                onClick={() => handleApply(template)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
              >
                <span>🚀</span> Deploy Pack
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog 
        isOpen={isBuilderOpen} 
        onClose={() => setIsBuilderOpen(false)} 
        title="Build Custom Pack"
      >
        <div className="form-group">
          <label>Pack Title</label>
          <input 
            className="form-input" 
            placeholder="e.g., Morning Routine" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Description (Optional)</label>
          <input 
            className="form-input" 
            placeholder="e.g., 5 habits to start the day right" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <label>Add Habits to Pack</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              className="form-input" 
              placeholder="Habit Name" 
              value={newHabitName} 
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHabitToPack()}
              style={{ flex: 1 }}
            />
            <select 
              className="form-input" 
              value={newHabitCategory} 
              onChange={(e) => setNewHabitCategory(e.target.value)}
              style={{ width: '140px' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" onClick={addHabitToPack} type="button">
              Add
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentHabits.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
                No habits added yet.
              </p>
            ) : (
              currentHabits.map((habit, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  background: 'var(--bg-raised)', 
                  padding: '8px 12px', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 500 }}>{habit.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>• {habit.category}</span>
                  </div>
                  <button 
                    onClick={() => removeHabitFromPack(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleSaveTemplate} 
          disabled={isSaving}
          style={{ width: '100%', marginTop: '16px' }}
        >
          {isSaving ? 'Saving...' : 'Save Template Pack'}
        </button>
      </Dialog>
    </div>
  );
}
