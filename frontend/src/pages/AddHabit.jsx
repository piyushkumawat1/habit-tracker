import { useState } from 'react';
import { habitsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

const COLORS = ['#8b84ff', '#2dd4bf', '#4ade80', '#fbbf24', '#fb7185', '#38bdf8', '#a78bfa', '#f472b6'];
const ICONS = ['💧', '🧘', '📖', '🏃', '✍️', '🎯', '🧠', '💤', '🍎', '🚴', '🧹', '💻', '🎵', '📸', '🌿', '☕'];

export default function AddHabit({ onNavigate, refresh }) {
  const showToast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [reminder, setReminder] = useState('');
  const [selectedTime, setSelectedTime] = useState('morning');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedColor, setSelectedColor] = useState('#8b84ff');
  const [selectedIcon, setSelectedIcon] = useState('💧');
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Habit name is required';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!category) errs.category = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await habitsApi.create({ name: name.trim(), description: description.trim(), category, frequency, time: selectedTime, reminder, difficulty: selectedDifficulty, color: selectedColor, icon: selectedIcon });
    showToast('Habit created successfully!', '🎉');
    refresh();
    onNavigate('habits');
  }

  const times = [{ key: 'morning', label: '🌅 Morning' }, { key: 'afternoon', label: '☀️ Afternoon' }, { key: 'evening', label: '🌙 Evening' }, { key: 'anytime', label: '⏰ Anytime' }];
  const difficulties = [{ key: 'easy', label: 'Easy', dot: '🟢' }, { key: 'medium', label: 'Medium', dot: '🟡' }, { key: 'hard', label: 'Hard', dot: '🔴' }];

  return (
    <section id="page-add-habit" className="page active">
      <div className="page-header"><div><h1>Add New Habit</h1><p className="page-subtitle">Define your commitment</p></div></div>
      <form className="add-habit-form" onSubmit={handleSubmit}>
        <div className="form-section-title">Basics</div><div className="form-divider" />
        <div className="form-group">
          <label className="form-label" htmlFor="habit-name">Habit Name *</label>
          <input type="text" id="habit-name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="e.g. Morning Meditation" maxLength={60} value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }} />
          {errors.name && <span className="form-error visible">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="habit-description">Description</label>
          <textarea id="habit-description" className="form-input" placeholder="What does this habit involve?" rows="3" maxLength={200} value={description} onChange={e => setDescription(e.target.value)} />
          <span className="char-count">{description.length} / 200</span>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="habit-category">Category *</label>
            <input 
              type="text" 
              list="category-options"
              id="habit-category" 
              className={`form-input ${errors.category ? 'error' : ''}`} 
              placeholder="e.g. Health, Coding, Finance..."
              value={category} 
              onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })); }} 
            />
            <datalist id="category-options">
              <option value="health">health</option>
              <option value="mindfulness">mindfulness</option>
              <option value="learning">learning</option>
              <option value="productivity">productivity</option>
              <option value="social">social</option>
              <option value="fitness">fitness</option>
              <option value="finance">finance</option>
              <option value="hobbies">hobbies</option>
            </datalist>
            {errors.category && <span className="form-error visible">{errors.category}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="habit-frequency">Frequency</label>
            <select id="habit-frequency" className="form-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
              <option value="daily">Daily</option><option value="weekdays">Weekdays</option><option value="weekends">Weekends</option><option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
        <div className="form-section-title">Schedule</div><div className="form-divider" />
        <div className="form-group">
          <label className="form-label">Preferred Time of Day</label>
          <div className="chip-group">{times.map(t => <button key={t.key} type="button" className={`time-chip ${selectedTime === t.key ? 'active' : ''}`} onClick={() => setSelectedTime(t.key)}>{t.label}</button>)}</div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="habit-reminder">Reminder Time</label>
          <input type="time" id="habit-reminder" className="form-input" value={reminder} onChange={e => setReminder(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Difficulty</label>
          <div className="chip-group">{difficulties.map(d => <button key={d.key} type="button" className={`difficulty-chip ${selectedDifficulty === d.key ? 'active' : ''}`} onClick={() => setSelectedDifficulty(d.key)}>{d.dot} {d.label}</button>)}</div>
        </div>
        <div className="form-section-title">Personalize</div><div className="form-divider" />
        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-picker">{COLORS.map(c => <div key={c} className={`color-swatch ${selectedColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setSelectedColor(c)} />)}</div>
        </div>
        <div className="form-group">
          <label className="form-label">Icon</label>
          <div className="icon-picker">{ICONS.map(i => <div key={i} className={`icon-swatch ${selectedIcon === i ? 'active' : ''}`} onClick={() => setSelectedIcon(i)}>{i}</div>)}</div>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Create Habit</button>
      </form>
    </section>
  );
}
