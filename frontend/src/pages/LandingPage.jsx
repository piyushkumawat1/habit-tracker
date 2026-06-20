import { useEffect, useState } from 'react';
import '../landing.css';

// Reusable SVG Icons
const Icons = {
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  ArrowRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Smile: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
  Tree: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-8"/><path d="M12 14c-2.5 0-4.5-2-4.5-4.5S9.5 5 12 5s4.5 2 4.5 4.5S14.5 14 12 14z"/><path d="M8 8.5C8 6.5 9 5 12 5s4 1.5 4 3.5"/></svg>,
  BarChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  Brain: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
};

export default function LandingPage({ onNavigate }) {
  // Ensure we mount at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [habits, setHabits] = useState({
    meditation: true,
    workout: false
  });

  const toggleHabit = (id) => {
    setHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(habits).filter(Boolean).length;
  const progressPercent = (completedCount / Object.keys(habits).length) * 100;

  return (
    <div className="landing-body">
      <div className="landing-container">
        {/* Navigation */}
        <nav className="landing-nav">
          <a href="#" className="landing-brand">
            <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, background: 'var(--primary-foreground)', borderRadius: '50%' }}></div>
            </div>
            Habitly
          </a>
          <ul className="landing-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#ai">AI Coach</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="landing-nav-actions">
            <button className="sh-btn sh-btn-ghost" onClick={() => onNavigate('login')}>Sign in</button>
            <button className="sh-btn sh-btn-primary" onClick={() => onNavigate('register')}>
              Get Habitly <Icons.ArrowRight />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg-grid"></div>
          <div className="hero-content">
            <div className="hero-badge-container">
              <span className="sh-badge sh-badge-outline">
                <span style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>
                New • AI Coach v2 is here
              </span>
            </div>
            <h1 className="hero-title">
              The habit tracker built for <span>consistency</span>
            </h1>
            <p className="hero-subtitle">
              Habitly helps you design routines, log your mood in seconds, and see the patterns that actually move the needle. Smart gamification, deep analytics, and an AI coach — designed beautifully.
            </p>
            <div className="hero-actions">
              <button className="sh-btn sh-btn-primary" style={{ height: 44, padding: '0 24px', fontSize: '1rem' }} onClick={() => onNavigate('register')}>
                Start free — no card required <Icons.ArrowRight />
              </button>
              <button className="sh-btn sh-btn-outline" style={{ height: 44, padding: '0 24px', fontSize: '1rem' }} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                See all features
              </button>
            </div>
            <div className="hero-checkmarks">
              <span><Icons.Check /> Free forever plan</span>
              <span><Icons.Check /> End-to-end encrypted</span>
            </div>
          </div>

          {/* Dynamic Mockup */}
          <div className="hero-mockup">
            <div className="sh-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              
              <div style={{ background: 'var(--secondary)', padding: 16, borderRadius: 'var(--radius)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Today</span>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>{progressPercent}% complete</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--primary)', borderRadius: 999, transition: 'width 0.3s ease-out' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Habit 1 */}
                <div 
                  className="dynamic-item"
                  style={{ border: '1px solid var(--border)', padding: 12, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}
                  onClick={() => toggleHabit('meditation')}
                >
                  <div className={`checkbox-dynamic ${habits.meditation ? 'checkbox-checked' : 'checkbox-unchecked'}`} style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Check />
                  </div>
                  <div style={{ flex: 1, opacity: habits.meditation ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', textDecoration: habits.meditation ? 'line-through' : 'none' }}>Morning meditation</div>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>7:00 AM • 🧠 Mind</div>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600 }}>🔥 47</div>
                </div>
                
                {/* Habit 2 */}
                <div 
                  className="dynamic-item"
                  style={{ border: '1px solid var(--border)', padding: 12, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}
                  onClick={() => toggleHabit('workout')}
                >
                  <div className={`checkbox-dynamic ${habits.workout ? 'checkbox-checked' : 'checkbox-unchecked'}`} style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Check />
                  </div>
                  <div style={{ flex: 1, opacity: habits.workout ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', textDecoration: habits.workout ? 'line-through' : 'none' }}>Workout · push day</div>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>6:30 PM • 🏋️ Health</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Social Proof */}
      <section className="stats-banner">
        <div className="stats-grid">
          <div className="stat-item dynamic-item">
            <h3>120k+</h3>
            <p>Active habit builders</p>
          </div>
          <div className="stat-item dynamic-item">
            <h3>9.2M</h3>
            <p>Habits checked off</p>
          </div>
          <div className="stat-item dynamic-item">
            <h3>4.9★</h3>
            <p>App Store rating</p>
          </div>
          <div className="stat-item dynamic-item">
            <h3>78%</h3>
            <p>Stick past 60 days</p>
          </div>
        </div>
      </section>

      <div className="landing-container">
        {/* Features */}
        <section id="features" className="features-section">
          <div className="section-header">
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything a serious habit tracker should be.</h2>
            <p className="section-subtitle">Built for people who care about follow-through. No fluff, no gimmicks — just the tools that make showing up easier.</p>
          </div>

          <div className="feature-grid">
            <div className="sh-card sh-card-hover feature-card">
              <div className="feature-icon"><Icons.Calendar /></div>
              <h4>Flexible habit scheduling</h4>
              <p>Daily, weekly, time-of-day specific. Match the cadence your life actually has.</p>
            </div>
            <div className="sh-card sh-card-hover feature-card">
              <div className="feature-icon"><Icons.Smile /></div>
              <h4>Mood & Energy Tracking</h4>
              <p>Habits don't happen in a vacuum. Track how your daily habits correlate directly to how you feel.</p>
            </div>
            <div className="sh-card sh-card-hover feature-card">
              <div className="feature-icon"><Icons.Tree /></div>
              <h4>Virtual Garden</h4>
              <p>Visual streaks, freeze days, and your own digital plant that grows with your consistency.</p>
            </div>
            <div className="sh-card sh-card-hover feature-card">
              <div className="feature-icon"><Icons.BarChart /></div>
              <h4>Deep analytics</h4>
              <p>Per-habit completion, time-of-day patterns, consistency heatmaps, and beautiful category charts.</p>
            </div>
            <div className="sh-card sh-card-hover feature-card">
              <div className="feature-icon"><Icons.Brain /></div>
              <h4>AI coach</h4>
              <p>Personalized advice based on your real data. It spots patterns, suggests tweaks, and celebrates the wins.</p>
            </div>
            <div className="sh-card sh-card-hover feature-card">
              <div className="feature-icon"><Icons.Download /></div>
              <h4>Data Export PRO</h4>
              <p>Your habits are yours. Export your full history securely to CSV or generate beautiful PDF reports.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Analytics Section */}
      <section id="analytics" className="split-section">
        <div className="landing-container split-container">
          <div className="split-content">
            <div className="section-label">Analytics</div>
            <h2 className="section-title">See exactly what's working — and what isn't.</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>Habitly turns every check-in into a data point. Consistency heatmaps, completion rates, and time-of-day breakdowns let you tune your routine like a system, not a guessing game.</p>
            
            <div className="checklist-item"><Icons.Check className="checklist-icon" /> 12-week consistency heatmap with day-level detail</div>
            <div className="checklist-item"><Icons.Check className="checklist-icon" /> Per-habit completion rate, best streak, and best day</div>
            <div className="checklist-item"><Icons.Check className="checklist-icon" /> Time-of-day analysis: when you actually follow through</div>
          </div>
          <div className="split-visual">
             <div className="sh-card sh-card-hover" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Consistency · 12 weeks</span>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>86% on-track</span>
                </div>
                {/* Simulated Heatmap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
                  {Array.from({length: 84}).map((_, i) => {
                    const isActive = Math.random() > 0.3;
                    const opacity = isActive ? (Math.random() * 0.5 + 0.5) : 1;
                    return (
                      <div 
                        key={i} 
                        className="dynamic-item"
                        style={{ 
                          width: '100%', 
                          paddingBottom: '100%',
                          borderRadius: 3, 
                          background: isActive ? 'var(--primary)' : 'var(--secondary)', 
                          opacity 
                        }}
                      />
                    );
                  })}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section id="ai" className="split-section" style={{ background: 'var(--muted)' }}>
        <div className="landing-container split-container" style={{ flexDirection: 'row-reverse' }}>
          <div className="split-content">
            <div className="section-label">AI Coach</div>
            <h2 className="section-title">A coach that actually reads your data.</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>Habitly's AI looks at your check-ins, mood, and timing — then tells you what to change next. No generic tips, no fluff. Just the next move.</p>
            <button className="sh-btn sh-btn-ghost" style={{ padding: 0 }}>Try AI Coach with Pro <Icons.ArrowRight /></button>
          </div>
          <div className="split-visual">
             <div className="sh-card sh-card-hover" style={{ padding: 24, display: 'flex', gap: 16, marginBottom: 16 }}>
               <div style={{ width: 32, height: 32, background: 'var(--secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', flexShrink: 0 }}>
                 <Icons.BarChart />
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Pattern detected</div>
                 <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5 }}>Your completion rate drops 38% on Fridays. Try moving 'Workout' to mornings — it's the only weekday it sticks.</div>
               </div>
             </div>
             <div className="sh-card sh-card-hover" style={{ padding: 24, display: 'flex', gap: 16 }}>
               <div style={{ width: 32, height: 32, background: 'var(--secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', flexShrink: 0 }}>
                 <Icons.Smile />
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Mood correlation</div>
                 <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: 1.5 }}>Mood is +30% on days you meditate before 8 AM. Want me to set a reminder for tomorrow?</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="landing-container">
          <div className="pricing-header">
            <div className="section-label">Pricing</div>
            <h2 className="section-title">Simple, honest pricing.</h2>
            <p className="section-subtitle">Start free. Upgrade when you want deeper insights and the AI coach.</p>
          </div>

          <div className="pricing-grid">
            <div className="sh-card pricing-card">
              <h3 className="pricing-tier">Free</h3>
              <div className="pricing-price">$0 <span>/ forever</span></div>
              <p className="pricing-desc">Everything you need to start building momentum.</p>
              <ul className="pricing-features">
                <li><Icons.Check /> Up to 5 active habits</li>
                <li><Icons.Check /> Basic mood & energy logging</li>
                <li><Icons.Check /> 7-day consistency view</li>
                <li><Icons.Check /> Virtual Garden (Sprout stage)</li>
              </ul>
              <button className="sh-btn sh-btn-outline" style={{ width: '100%', marginTop: 'auto' }} onClick={() => onNavigate('register')}>Get started</button>
            </div>

            <div className="sh-card pricing-card popular">
              <div className="popular-badge">Most popular</div>
              <h3 className="pricing-tier">Pro</h3>
              <div className="pricing-price">$4.99 <span>/ per month</span></div>
              <p className="pricing-desc">For people serious about the long game.</p>
              <ul className="pricing-features">
                <li><Icons.Check /> Unlimited habits</li>
                <li><Icons.Check /> AI Coach with deep correlations</li>
                <li><Icons.Check /> Full analytics & lifetime heatmaps</li>
                <li><Icons.Check /> Virtual Garden (Blooming Tree)</li>
                <li><Icons.Check /> CSV / PDF data export</li>
              </ul>
              <button className="sh-btn sh-btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => onNavigate('register')}>Start 14-day trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <p>© {new Date().getFullYear()} Habitly. Build better habits. Find your balance.</p>
        </div>
      </footer>
    </div>
  );
}
