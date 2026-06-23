import { useState, useRef, useEffect } from 'react';
import Dialog from './ui/Dialog.jsx';
import CustomSelect from './ui/CustomSelect.jsx';
import { habitsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

const CATEGORIES = ['health', 'productivity', 'learning', 'mindfulness', 'finance', 'social', 'custom'];
const ENERGY_LEVELS = ['high', 'medium', 'low'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const FREQUENCIES = ['daily', 'weekdays', 'weekends', 'weekly'];
const TIME_OF_DAY = ['morning', 'afternoon', 'evening', 'anytime'];
const ICONS = ['💧', '🏃', '📚', '🧘', '💰', '👥', '⭐', '🎨', '💻', '🏋️', '⏰', '📖', '🧠', '💤'];
const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
];

function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CreateHabitModal({ isOpen, onClose, refresh }) {
  const { showToast } = useToast();
  
  // States
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('⏰');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newCategory, setNewCategory] = useState('custom');
  const [newEnergy, setNewEnergy] = useState('high');
  const [newDifficulty, setNewDifficulty] = useState('easy');
  const [newTime, setNewTime] = useState('');
  const [newFrequency, setNewFrequency] = useState('daily');
  const [newTimeOfDay, setNewTimeOfDay] = useState('anytime');
  const [newColor, setNewColor] = useState('#f97316');

  // References for outside click
  const iconPickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target)) {
        setShowIconPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleCreateHabit(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await habitsApi.create({
        name: newName.trim(),
        category: newCategory,
        frequency: newFrequency,
        difficulty: newDifficulty,
        icon: newIcon,
        time: newTimeOfDay,
        // Safely serialize new fields into description so we don't break DB schema
        description: JSON.stringify({ 
          energyLevel: newEnergy, 
          targetTime: parseInt(newTime) || null, 
          targetUnit: 'minutes',
          color: newColor 
        }),
      });
      
      showToast('Habit created!', '🎉');
      onClose();
      
      // Reset form
      setNewName('');
      setNewIcon('⏰');
      setNewCategory('custom');
      setNewEnergy('high');
      setNewDifficulty('easy');
      setNewTime('');
      setNewFrequency('daily');
      setNewTimeOfDay('anytime');
      setNewColor('#f97316');
      
      if (refresh) refresh();
    } catch (err) {
      showToast('Failed to create habit', '❌');
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth={460}>
      <div className="flex flex-col gap-6 pt-2 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Create Habit</h2>
            <p className="text-sm text-muted-foreground mt-1">Keep it simple. What's the smallest step?</p>
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleCreateHabit}>
          
          {/* Row 1: Icon & Name */}
          <div className="flex gap-4 items-end relative">
            <div className="flex flex-col gap-2 relative" ref={iconPickerRef}>
              <label className="text-xs font-semibold text-foreground/80">Icon</label>
              <button 
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-input bg-card text-2xl transition-all hover:bg-accent focus:ring-2 focus:ring-ring focus:outline-none"
              >
                {newIcon}
              </button>
              
              {showIconPicker && (
                <div className="absolute top-[80px] left-0 z-50 w-64 rounded-xl border border-border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95">
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => { setNewIcon(icon); setShowIconPicker(false); }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent text-xl"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="habit-name" className="text-xs font-semibold text-foreground/80">Habit Name</label>
              <input
                id="habit-name"
                type="text"
                placeholder="e.g. Read 10 mins"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                maxLength={60}
                required
                autoFocus
                className="flex h-[46px] w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Row 2: Category & Energy Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">Category</label>
              <CustomSelect 
                value={newCategory} 
                onChange={setNewCategory} 
                options={CATEGORIES.map(c => ({ value: c, label: capitalize(c) }))} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">Energy Level</label>
              <CustomSelect 
                value={newEnergy} 
                onChange={setNewEnergy} 
                options={ENERGY_LEVELS.map(e => ({ value: e, label: capitalize(e) }))} 
              />
            </div>
          </div>

          {/* Row 3: Difficulty & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">Difficulty</label>
              <CustomSelect 
                value={newDifficulty} 
                onChange={setNewDifficulty} 
                options={DIFFICULTIES.map(d => ({ value: d, label: capitalize(d) }))} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">Time (Minutes)</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 15"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="flex h-[46px] w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Row 4: Frequency & Time of Day */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">Frequency</label>
              <CustomSelect 
                value={newFrequency} 
                onChange={setNewFrequency} 
                options={FREQUENCIES.map(f => ({ value: f, label: capitalize(f) }))} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">Time of Day</label>
              <CustomSelect 
                value={newTimeOfDay} 
                onChange={setNewTimeOfDay} 
                options={[
                  { value: 'anytime', label: 'Any Time' },
                  { value: 'morning', label: 'Morning' },
                  { value: 'afternoon', label: 'Afternoon' },
                  { value: 'evening', label: 'Evening' }
                ]} 
              />
            </div>
          </div>

          {/* Row 5: Color Tag */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-xs font-semibold text-foreground/80">Color Tag</label>
            <div className="rounded-xl border border-input bg-card/50 p-3">
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    style={{ backgroundColor: color }}
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none ${newColor === color ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : ''}`}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="mt-4 flex w-full h-[50px] items-center justify-center rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
            disabled={!newName.trim()}
          >
            Create Habit
          </button>
        </form>
      </div>
    </Dialog>
  );
}
