import { useState, useEffect } from 'react';
import Dialog from './ui/Dialog.jsx';
import { Play, Pause, Square, CheckCircle2 } from 'lucide-react';

export default function FocusTimerModal({ isOpen, onClose, habit, onComplete }) {
  const targetMinutes = habit?.Time || 15;
  const [timeLeft, setTimeLeft] = useState(targetMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft((habit?.Time || 15) * 60);
      setIsActive(false);
    }
  }, [isOpen, habit]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Auto-complete when timer finishes
      onComplete(habit.id);
      onClose();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, habit, onComplete, onClose]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(targetMinutes * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    onComplete(habit.id);
    onClose();
  };

  if (!habit) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth={400}>
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl text-primary mb-4">
          {habit.icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">Focus Mode</h2>
        <p className="text-muted-foreground mb-8">Time to work on: <strong className="text-foreground">{habit.name}</strong></p>

        {/* Circular Progress / Timer Display */}
        <div className="relative flex items-center justify-center w-48 h-48 mb-8">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
            <circle 
              cx="96" cy="96" r="88" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={88 * 2 * Math.PI} 
              strokeDashoffset={88 * 2 * Math.PI - (progressPct / 100) * (88 * 2 * Math.PI)}
              className="text-primary transition-all duration-1000 ease-linear" 
            />
          </svg>
          <div className="text-5xl font-mono font-bold tracking-tighter text-foreground">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={resetTimer}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:bg-secondary/80 hover:text-foreground active:scale-95"
          >
            <Square size={20} fill="currentColor" />
          </button>
          <button 
            onClick={toggleTimer}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
          >
            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={skipTimer}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:bg-secondary/80 hover:text-foreground active:scale-95"
            title="Mark complete early"
          >
            <CheckCircle2 size={24} />
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Close this window anytime to cancel. Your progress will not be saved.
        </p>
      </div>
    </Dialog>
  );
}
