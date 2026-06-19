import { useState, useEffect } from 'react';
import { gardenApi } from '../lib/api.js';

export default function WelcomeModal({ onClose }) {
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGarden() {
      try {
        const res = await gardenApi.get();
        if (res.data) setGarden(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGarden();
  }, []);

  if (loading) return null;

  const xp = garden?.xp || 0;
  let stage = 'Seed';
  let emoji = '🌰';
  let nextThreshold = 100;
  let prevThreshold = 0;

  if (xp >= 600) {
    stage = 'Blooming Tree';
    emoji = '🌸';
    nextThreshold = 1000;
    prevThreshold = 600;
  } else if (xp >= 300) {
    stage = 'Small Plant';
    emoji = '🌿';
    nextThreshold = 600;
    prevThreshold = 300;
  } else if (xp >= 100) {
    stage = 'Sprout';
    emoji = '🌱';
    nextThreshold = 300;
    prevThreshold = 100;
  }

  const progress = Math.max(0, Math.min(100, ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px', animation: 'fadeIn 0.3s ease'
    }}>
      <div className="card glass-card" style={{
        maxWidth: '400px', width: '100%', textAlign: 'center', padding: '40px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--text-primary)' }}>Welcome Back!</h2>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Your garden missed you.</p>
        </div>

        <div style={{ fontSize: '5rem', animation: 'float 6s ease-in-out infinite', margin: '10px 0' }}>
          {emoji}
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{garden?.plant_name || 'My Little Sprout'}</h3>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
            Stage: {stage}
          </span>
        </div>

        <div style={{ width: '100%', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>{xp} XP</span>
            <span>{nextThreshold} XP</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'var(--bg-raised)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--success)', transition: 'width 0.5s ease', borderRadius: '10px' }} />
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '1rem' }}>
          Let's Get to Work 💪
        </button>
      </div>
    </div>
  );
}
