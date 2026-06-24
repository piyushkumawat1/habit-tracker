import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useRazorpay } from '../hooks/useRazorpay.js';
import '../landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleCheckout, upgrading } = useRazorpay();

  const handleProClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/register?intent=pro');
    } else {
      handleCheckout(() => navigate('/dashboard'));
    }
  };

  const [habits, setHabits] = useState({
    water: true,
    read: true,
    meditate: true,
    walk: false
  });

  const toggleHabit = (id) => {
    setHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), (i % 4) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    
    revealEls.forEach(el => observer.observe(el));
    
    return () => {
      revealEls.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="landing-page-root">
<header>
  <div className="wrap">
    <nav>
      <a href="#" className="logo">
        <span className="logo-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 21C12 21 4 16 4 9.5C4 6.46 6.46 4 9.5 4C10.96 4 12 5 12 5C12 5 13.04 4 14.5 4C17.54 4 20 6.46 20 9.5C20 16 12 21 12 21Z" fill="white" opacity="0.95"/>
            <path d="M12 21V11M12 13L9 10M12 15L15 12" stroke="#2f6b48" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </span>
        Habitly
      </a>
      <div className="nav-links">
        <a href="#features" className="link">Features</a>
        <a href="#how" className="link">How it Works</a>
        <a href="#pricing" className="link">Pricing</a>
        <a href="#stories" className="link">Stories</a>
        <a href="#cta" className="btn btn-primary" style="padding:0.7rem 1.5rem;" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Start Free</a>
      </div>
    </nav>
  </div>
</header>

<section className="hero">
  <div className="wrap">
    <div className="hero-grid">
      <div className="hero-copy reveal">
        <span className="eyebrow">🌱 Your AI-powered growth companion</span>
        <h1>Plant the Seeds of a <span className="accent">Better You.</span></h1>
        <p className="sub">Habitly isn't just another checklist. It's a beautifully designed, AI-powered companion that helps you build life-changing routines, track your daily energy, and watch your progress blossom into a digital garden.</p>
        <div className="hero-cta">
          <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">Start Your Journey for Free</button>
          <a href="#how" className="btn btn-ghost btn-lg">See How It Works</a>
        </div>
        <div className="hero-note">✅ No credit card required &nbsp;·&nbsp; Free forever plan</div>
      </div>

      <div className="hero-visual reveal">
        <div className="phone-wrap">
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-notch"></div>
              <div className="app-greeting">Good morning, Alex 👋</div>
              <div className="app-title">Today's Routine</div>

              <div className="plant-card">
                <span className="plant-emoji">🌳</span>
                <div className="xp">Level 7 · Blooming Tree</div>
                <div className="progress-track"><div className="progress-fill" style={{ width: '72%', transition: 'width 1.4s ease' }}></div></div>
                <div className="xp" style={{ marginTop: '0.4rem' }}>720 / 1000 XP to next stage</div>
              </div>

              <div className={`habit-row ${habits.water ? 'done' : ''}`} onClick={() => toggleHabit('water')} style={{ cursor: 'pointer' }}><span className={`check ${habits.water ? 'done' : 'todo'}`}>{habits.water ? '✓' : ''}</span><span>Drink water 💧</span></div>
              <div className={`habit-row ${habits.read ? 'done' : ''}`} onClick={() => toggleHabit('read')} style={{ cursor: 'pointer' }}><span className={`check ${habits.read ? 'done' : 'todo'}`}>{habits.read ? '✓' : ''}</span><span>Read 10 pages 📖</span></div>
              <div className={`habit-row ${habits.meditate ? 'done' : ''}`} onClick={() => toggleHabit('meditate')} style={{ cursor: 'pointer' }}><span className={`check ${habits.meditate ? 'done' : 'todo'}`}>{habits.meditate ? '✓' : ''}</span><span>Meditate 🧘</span></div>
              <div className={`habit-row ${habits.walk ? 'done' : ''}`} onClick={() => toggleHabit('walk')} style={{ cursor: 'pointer' }}><span className={`check ${habits.walk ? 'done' : 'todo'}`}>{habits.walk ? '✓' : ''}</span><span>Evening walk 🚶</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="trust reveal">
      <div className="trust-stats">
        <div className="stat"><strong>50K+</strong><span>Habits tracked daily</span></div>
        <div className="stat"><strong>4.9★</strong><span>Average rating</span></div>
        <div className="stat"><strong>12M+</strong><span>Plants grown</span></div>
        <div className="stat"><strong>89%</strong><span>Keep their streak</span></div>
      </div>
    </div>
  </div>
</section>

<section id="features">
  <div className="wrap">
    <div className="section-head reveal">
      <div className="section-tag">Features</div>
      <h2>Features That Actually Work</h2>
      <p>Everything you need to build momentum, understand yourself, and grow — wrapped in a design you'll actually want to open every day.</p>
    </div>

    <div className="features">
      <div className="feature-card reveal">
        <div className="feature-icon">🗓️</div>
        <h3>Your Routine, Mastered</h3>
        <p>Stop feeling overwhelmed. Organize your day into simple Morning, Afternoon, and Evening routines so you can focus on what matters right now.</p>
      </div>

      <div className="feature-card spotlight reveal">
        <div>
          <div className="feature-icon">🌱</div>
          <h3>Grow Your Virtual Garden</h3>
          <p>Every completed habit earns water and XP for your digital plant. Watch it grow from a tiny seed into a blooming tree as you string together perfect days. Miss a day? Your plant is resilient — just like you.</p>
        </div>
        <div className="garden-visual">
          <span>🌱</span><span>🌿</span><span>🪴</span><span>🌳</span>
        </div>
      </div>

      <div className="feature-card reveal">
        <div className="feature-icon">🧠</div>
        <h3>Know Yourself Better</h3>
        <p>Habits affect how you feel. Habitly tracks your daily mood and energy alongside your tasks, so you discover exactly which routines make you feel vibrant — and which drain you.</p>
      </div>

      <div className="feature-card reveal">
        <div className="feature-icon">🤖</div>
        <h3>Meet Your Personal AI Coach</h3>
        <p>What if your habit tracker could talk to you? Our AI Coach analyzes your consistency, mood, and energy data to give you personalized, actionable advice every single day.</p>
      </div>

      <div className="feature-card reveal">
        <div className="feature-icon">📊</div>
        <h3>Insights That Tell a Story</h3>
        <p>Visualize your journey with stunning data — a 12-week consistency heatmap, longest streaks, and beautiful donut charts. See exactly how far you've come.</p>
      </div>
    </div>
  </div>
</section>

<section id="how" style={{ background: 'linear-gradient(180deg,#fff,var(--cream))' }}>
  <div className="wrap">
    <div className="section-head reveal">
      <div className="section-tag">Simple by design</div>
      <h2>Growth in Three Small Steps</h2>
      <p>Big change doesn't need a big plan. Just a few intentional taps a day.</p>
    </div>
    <div className="steps">
      <div className="step reveal">
        <div className="step-num">1</div>
        <h3>Plant Your Habits</h3>
        <p>Add the routines that matter and sort them into your morning, afternoon, and evening flow.</p>
      </div>
      <div className="step reveal">
        <div className="step-num">2</div>
        <h3>Show Up Daily</h3>
        <p>Check off habits, log your mood and energy, and earn water for your growing garden.</p>
      </div>
      <div className="step reveal">
        <div className="step-num">3</div>
        <h3>Watch Yourself Grow</h3>
        <p>Let your AI Coach and insights reveal your patterns as your plant blossoms into a tree.</p>
      </div>
    </div>
  </div>
</section>

<section id="pricing" className="pricing-section">
  <div className="wrap">
    <div className="section-head reveal">
      <div className="section-tag">Pricing</div>
      <h2>Simple Plans for Steady Growth</h2>
      <p>Building good habits should be accessible to everyone — with advanced tools for those ready to take total control of their lives.</p>
    </div>

    <div className="pricing">
      <div className="plan reveal">
        <div className="plan-name">🌱 The Sprout Plan</div>
        <div className="plan-tagline">Everything you need to start building momentum.</div>
        <div className="plan-price">Free<small> forever</small></div>
        <div className="plan-price-sub">No credit card. No catch.</div>
        <ul>
          <li><span className="tick">✓</span> Track up to 5 active habits at once</li>
          <li><span className="tick">✓</span> Grow your Virtual Garden to the "Sprout" stage</li>
          <li><span className="tick">✓</span> Log your daily mood and energy</li>
          <li><span className="tick">✓</span> View your 7-day consistency heatmap</li>
        </ul>
        <button className="btn btn-ghost" onClick={() => navigate('/register')}>Get Started Free</button>
      </div>

      <div className="plan pro reveal">
        <div className="plan-badge">Most Popular</div>
        <div className="plan-name">🌳 Habitly PRO</div>
        <div className="plan-tagline">For deep insights, infinite growth, and complete control.</div>
        <div className="plan-price">₹10<small> lifetime</small></div>
        <div className="plan-price-sub">One-time payment. Yours forever.</div>
        <ul>
          <li><span className="tick">✓</span> <strong>Unlimited Habits</strong> — track every aspect of your routine</li>
          <li><span className="tick">✓</span> <strong>Unlock the AI Coach</strong> for personalized daily advice</li>
          <li><span className="tick">✓</span> <strong>The Blooming Tree</strong> — exclusive, massive plants</li>
          <li><span className="tick">✓</span> <strong>Advanced Insights</strong> — lifetime heatmaps & streak history</li>
          <li><span className="tick">✓</span> <strong>Data Export</strong> to CSV or beautiful PDF reports</li>
        </ul>
        <button className="btn btn-primary" onClick={handleProClick} disabled={upgrading}>{upgrading ? 'Processing...' : 'Go PRO - ₹10'}</button>
      </div>
    </div>
  </div>
</section>

<section id="stories">
  <div className="wrap">
    <div className="section-head reveal">
      <div className="section-tag">Real stories</div>
      <h2>Loved by People Who Grow Daily</h2>
      <p>Thousands of small wins, one blooming garden at a time.</p>
    </div>

    <div className="testimonials-grid">
      <div className="testimonial reveal">
        <div className="stars">★★★★★</div>
        <blockquote>"Habitly changed how I approach my day. I used to hate tracking habits, but watching my little digital tree grow every time I read a book has completely rewired my brain."</blockquote>
        <div className="testimonial-author">
          <div className="avatar">SJ</div>
          <div>
            <div className="name">Sarah J.</div>
            <div className="role">Designer & daily reader</div>
          </div>
        </div>
      </div>

      <div className="testimonial reveal">
        <div className="stars">★★★★★</div>
        <blockquote>"The AI Coach is mind-blowing. It noticed that my mood was consistently lower on days I skipped my morning walk, and it nudged me to get back on track. Incredible app."</blockquote>
        <div className="testimonial-author">
          <div className="avatar">MT</div>
          <div>
            <div className="name">Mark T.</div>
            <div className="role">Founder & early riser</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="cta">
  <div className="wrap">
    <div className="final-cta reveal">
      <h2>Don't wait for tomorrow to become the person you want to be today.</h2>
      <p>Plant your first habit in under a minute. It's free to start, and your garden is waiting.</p>
      <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')} style={{ background: '#fff', color: 'var(--green-700)' }}>Get Started Free</button>
    </div>
  </div>
</section>

<footer>
  <div className="wrap">
    <div className="footer-grid">
      <div className="footer-brand">
        <a href="#" className="logo">
          <span className="logo-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 4 16 4 9.5C4 6.46 6.46 4 9.5 4C10.96 4 12 5 12 5C12 5 13.04 4 14.5 4C17.54 4 20 6.46 20 9.5C20 16 12 21 12 21Z" fill="white" opacity="0.95"/>
              <path d="M12 21V11M12 13L9 10M12 15L15 12" stroke="#2f6b48" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
          Habitly
        </a>
        <p>Build better habits. Find your balance. Watch yourself grow. 🌱</p>
      </div>
      <div className="footer-cols">
        <div className="footer-col">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#how">How it Works</a>
          <a href="#stories">Stories</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">© 2026 Habitly. Made with 🌿 for people who grow a little every day.</div>
  </div>
</footer>
    </div>
  );
}
