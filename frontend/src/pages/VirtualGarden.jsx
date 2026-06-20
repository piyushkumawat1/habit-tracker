import { useState, useEffect } from 'react';
import { gardenApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function VirtualGarden() {
  const { user } = useAuth();
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    loadGarden();
  }, []);

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

  async function handleShare() {
    const text = `I've grown my Virtual Garden to ${garden.xp} XP on Habitly! 🌱 Start your habit journey today.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Habitly Garden',
          text: text,
          url: window.location.origin,
        });
        showToast('Thanks for sharing!', '🌱');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', '📋');
    }
  }

  if (loading) {
    return (
      <section id="page-garden" className="page active">
        <div className="page-header">
          <div>
            <h1>Virtual Garden</h1>
            <p className="page-subtitle">Loading your plant...</p>
          </div>
        </div>
      </section>
    );
  }

  const xp = garden?.xp || 0;
  let stage = 'Seed';
  let emoji = '🌰';
  let nextThreshold = 100;
  let prevThreshold = 0;

  if (xp >= 600 && user?.is_pro) {
    stage = 'Blooming Tree';
    emoji = '🌸';
    nextThreshold = 1000;
    prevThreshold = 600;
  } else if (xp >= 300 && user?.is_pro) {
    stage = 'Small Plant';
    emoji = '🌿';
    nextThreshold = 600;
    prevThreshold = 300;
  } else if (xp >= 100) {
    stage = 'Sprout';
    emoji = '🌱';
    nextThreshold = user?.is_pro ? 300 : xp; // Cap at current XP visually for free users
    prevThreshold = 100;
  }

  const progress = user?.is_pro 
    ? Math.max(0, Math.min(100, ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
    : (xp >= 300 ? 100 : Math.max(0, Math.min(100, ((xp - prevThreshold) / (300 - prevThreshold)) * 100)));

  return (
    <section id="page-garden" className="page active">
      <div className="page-header">
        <div>
          <h1>Virtual Garden</h1>
          <p className="page-subtitle">Grow your plant by completing daily habits.</p>
        </div>
        <button className="btn btn-primary" onClick={handleShare}>
          Share Growth
        </button>
      </div>

      <div className="card glass-card" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '6rem', animation: 'float 6s ease-in-out infinite' }}>
          {emoji}
        </div>
        
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{garden?.plant_name || 'My Little Sprout'}</h2>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600 }}>
            Stage: {stage}
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>{xp} XP</span>
            <span>{user?.is_pro ? nextThreshold : 'Max XP (Free)'}</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'var(--bg-raised)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--success)', transition: 'width 0.5s ease', borderRadius: '10px' }} />
          </div>
          {!user?.is_pro && xp >= 100 && (
            <div style={{ marginTop: '16px', background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                🌟 Your plant is ready to grow! Upgrade to Pro to unlock the Small Plant and Blooming Tree stages.
              </p>
            </div>
          )}
          <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Complete habits to earn XP and water your plant!</p>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
          <div className="stat-card" style={{ padding: '16px', minWidth: '120px' }}>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>💧</div>
            <div className="stat-body">
              <span className="stat-value">{garden?.water_level || 0}%</span>
              <span className="stat-label">Water Level</span>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '16px', minWidth: '120px' }}>
            <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>✨</div>
            <div className="stat-body">
              <span className="stat-value">{xp}</span>
              <span className="stat-label">Total XP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
