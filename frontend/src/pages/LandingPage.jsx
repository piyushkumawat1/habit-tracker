import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useRazorpay } from '../hooks/useRazorpay.js';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  ArrowRight, Sun, Moon, TrendingUp, Edit2, Zap, BarChart,
  Calendar, Smile, Brain, Download, Check, X, Star, Sparkles,
  Leaf, Menu
} from 'lucide-react';
import '../landing.css';

const Twitter = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Github = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const Linkedin = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleCheckout, upgrading } = useRazorpay();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleProClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/register?intent=pro');
    } else {
      handleCheckout(() => navigate('/dashboard'));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ld-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.ld-section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('.ld-section').forEach(s => observer.unobserve(s));
    };
  }, []);

  return (
    <div className="landing-page-root">

      {/* ════════════════════ NAVBAR ════════════════════ */}
      <nav className="ld-nav">
        <div className="max-w-[1200px] mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Habitley Logo" className="w-8 h-8 object-contain" />
            <span className="text-[17px] font-bold text-[var(--ld-text)] tracking-tight">Habitley</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#methodology" className="text-[var(--ld-text-secondary)] text-sm font-medium hover:text-[var(--ld-text)] transition-colors duration-200">How it works</a>
            <a href="#features" className="text-[var(--ld-text-secondary)] text-sm font-medium hover:text-[var(--ld-text)] transition-colors duration-200">Features</a>
            <a href="#pricing" className="text-[var(--ld-text-secondary)] text-sm font-medium hover:text-[var(--ld-text)] transition-colors duration-200">Pricing</a>
            <a href="#reviews" className="text-[var(--ld-text-secondary)] text-sm font-medium hover:text-[var(--ld-text)] transition-colors duration-200">Reviews</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-[var(--ld-text-secondary)] hover:text-[var(--ld-text)] transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="text-[var(--ld-text-secondary)] text-sm font-medium hover:text-[var(--ld-text)] transition-colors hidden sm:block" onClick={() => navigate('/login')}>
              Sign in
            </button>
            <button className="ld-btn-primary !py-2 !px-5 !text-[13px]" onClick={() => navigate('/register')}>
              Get Started <ArrowRight size={14} />
            </button>
            <button className="md:hidden p-2 text-[var(--ld-text-secondary)] hover:text-[var(--ld-text)]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--ld-nav-bg)] border-b border-[var(--ld-border)] px-5 py-4 flex flex-col gap-4 backdrop-blur-xl absolute top-[100%] left-0 w-full shadow-lg">
            <a href="#methodology" className="text-[var(--ld-text)] font-medium py-2 border-b border-[var(--ld-border)]" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
            <a href="#features" className="text-[var(--ld-text)] font-medium py-2 border-b border-[var(--ld-border)]" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-[var(--ld-text)] font-medium py-2 border-b border-[var(--ld-border)]" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#reviews" className="text-[var(--ld-text)] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
            <div className="flex flex-col gap-3 mt-2">
              <button className="ld-btn-outline w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>Sign in</button>
              <button className="ld-btn-primary w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      <main>

        {/* ════════════════════ HERO ════════════════════ */}
        <section className="ld-section ld-visible pt-16 md:pt-24 pb-24 px-5">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--ld-border)] bg-[var(--ld-card)] text-sm text-[var(--ld-text-secondary)] mb-8">
                <Sparkles size={14} className="text-[var(--ld-primary-light)]" />
                Now with AI coaching v2
              </div>

              <h1 className="text-[40px] md:text-[52px] lg:text-[60px] font-bold leading-[1.08] mb-6 text-[var(--ld-text)]">
                Analyze &<br />
                <span className="text-[var(--ld-primary-light)]">Optimize Your<br />Life</span>
              </h1>

              <p className="text-[var(--ld-text-secondary)] text-[17px] leading-relaxed mb-10 max-w-[480px]">
                Master your routine with high-performance tracking. Build consistency through data-driven insights and professional optimization tools built for modern operators.
              </p>

              <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
                <button className="ld-btn-primary" onClick={() => navigate('/register')}>
                  Start Optimizing <ArrowRight size={16} />
                </button>
                <a href="#dashboard-preview" className="ld-btn-outline">View Dashboard</a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-5 flex-wrap justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="ld-avatar-stack">
                    <div style={{ background: '#7C3AED' }} />
                    <div style={{ background: '#3B82F6' }} />
                    <div style={{ background: '#10B981' }} />
                    <div style={{ background: '#F43F5E' }} />
                  </div>
                  <span className="text-sm text-[var(--ld-text-secondary)]">12,000+ operators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FBBF24" className="text-[#FBBF24]" />)}
                  </div>
                  <span className="text-sm text-[var(--ld-text-secondary)]">4.9 rating</span>
                </div>
              </div>
            </div>

            {/* Right — Analytics Card */}
            <div className="bg-[var(--ld-card)] border border-[var(--ld-border)] rounded-2xl p-6 ld-float ld-shadow-card">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ld-text-muted)] mb-1">Daily Analytics</p>
                  <p className="text-xl font-bold text-[var(--ld-text)]">Consistency</p>
                </div>
                <span className="text-xs font-medium text-[var(--ld-text-secondary)] bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full border border-[var(--ld-border)]">7 days</span>
              </div>

              <div className="relative h-[130px] my-4">
                <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  <path d="M0,95 C50,85 80,72 130,55 C170,42 190,52 230,43 C270,34 310,28 350,18 C375,12 395,16 400,14 L400,120 L0,120 Z" fill="url(#heroChartGrad)" />
                  <path d="M0,95 C50,85 80,72 130,55 C170,42 190,52 230,43 C270,34 310,28 350,18 C375,12 395,16 400,14" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Data dots */}
                  <circle cx="0" cy="95" r="3" fill="#7C3AED" />
                  <circle cx="130" cy="55" r="3" fill="#7C3AED" />
                  <circle cx="230" cy="43" r="3" fill="#7C3AED" />
                  <circle cx="350" cy="18" r="4" fill="#7C3AED" stroke="#fff" strokeWidth="1.5" />
                </svg>

                {/* Efficiency badge */}
                <div className="absolute right-2 top-2 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-xl px-3 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--ld-green)] mb-0.5">Efficiency</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={13} className="text-[var(--ld-green)]" />
                    <span className="text-sm font-bold text-[var(--ld-green)]">94% (+12%)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between px-2 mb-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="text-[11px] text-[var(--ld-text-muted)]">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[rgba(255,255,255,0.03)] border border-[var(--ld-border)] rounded-xl p-4">
                  <p className="text-xs text-[var(--ld-text-muted)] mb-1">Streak</p>
                  <p className="text-lg font-bold text-[var(--ld-text)]">12 days</p>
                </div>
                <div className="bg-[rgba(255,255,255,0.03)] border border-[var(--ld-border)] rounded-xl p-4">
                  <p className="text-xs text-[var(--ld-text-muted)] mb-1">Completion</p>
                  <p className="text-lg font-bold text-[var(--ld-text)]">87%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ HOW IT WORKS ════════════════════ */}
        <section className="ld-section py-24 px-5" id="methodology">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-[var(--ld-primary)] text-xs font-bold uppercase tracking-[0.15em] mb-3">Process</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[var(--ld-text)] mb-12 leading-tight">How it works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { icon: <Edit2 size={18} />, step: 'Step 01', title: 'Set', desc: 'Define high-impact routines. Map your daily actions to long-term performance goals.' },
                { icon: <Zap size={18} />, step: 'Step 02', title: 'Act', desc: 'Execute with precision. Use smart notifications and time-of-day prompts to maintain flow.' },
                { icon: <BarChart size={18} />, step: 'Step 03', title: 'Analyze', desc: 'Review the data. Visualize your trajectory and iterate on your systems for maximum results.' },
              ].map((item, i) => (
                <div key={i} className="bg-[var(--ld-card)] border border-[var(--ld-border)] rounded-2xl p-8 hover:border-[var(--ld-border-hover)] hover:-translate-y-1 transition-all duration-300 ld-shadow-card hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--ld-primary)] flex items-center justify-center text-white">{item.icon}</div>
                    <span className="text-xs font-semibold text-[var(--ld-text-muted)] uppercase tracking-wider">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ld-text)] mb-3">{item.title}</h3>
                  <p className="text-sm text-[var(--ld-text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ DASHBOARD PREVIEW ════════════════════ */}
        <section className="ld-section py-24 px-5" id="dashboard-preview">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-[var(--ld-primary)] text-xs font-bold uppercase tracking-[0.15em] mb-3">Dashboard</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-white mb-4 leading-tight">See It In Action</h2>
            <p className="text-[var(--ld-text-secondary)] text-base mb-12 max-w-lg">
              Experience the professional dark-mode dashboard. Track habits, grow your virtual garden, and get AI-powered insights all in one place.
            </p>

            <div className="bg-[#09090b] rounded-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden flex shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Sidebar */}
              <div className="w-[180px] hidden md:flex flex-col border-r border-[#1a1a2e] p-4 bg-[#09090b]">
                <div className="flex items-center gap-2 mb-8">
                  <img src="/logo.png" alt="Habitley Logo" className="w-6 h-6 object-contain" />
                  <span className="text-white font-bold text-sm">Habitley</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="px-3 py-2 bg-[#1a1a2e] rounded-lg text-white text-xs font-medium flex items-center gap-2"><Calendar size={14} /> Dashboard</div>
                  <div className="px-3 py-2 text-[#6b7280] text-xs font-medium flex items-center gap-2 hover:text-white transition-colors"><BarChart size={14} /> Analytics</div>
                  <div className="px-3 py-2 text-[#6b7280] text-xs font-medium flex items-center gap-2 hover:text-white transition-colors"><Brain size={14} /> AI Coach</div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 sm:p-5 md:p-6 bg-[#09090b]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Today's Focus</h3>
                    <p className="text-[#6b7280] text-xs">Thursday, Oct 24 · You're on a 12-day streak!</p>
                  </div>
                  <div className="bg-[rgba(16,185,129,0.15)] text-[var(--ld-green)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[rgba(16,185,129,0.2)]">Pro Member</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-3">
                    {/* Habit: Completed */}
                    <div className="bg-[#111118] border border-[#1a1a2e] p-3.5 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0"><Check size={13} className="text-white" /></div>
                      <div>
                        <p className="text-white text-sm font-medium line-through opacity-60">Morning Meditation</p>
                        <p className="text-[#6b7280] text-[11px]">Morning · <span className="text-[var(--ld-amber)]">14 days</span></p>
                      </div>
                    </div>
                    {/* Habit: Completed */}
                    <div className="bg-[#111118] border border-[#1a1a2e] p-3.5 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0"><Check size={13} className="text-white" /></div>
                      <div>
                        <p className="text-white text-sm font-medium line-through opacity-60">Read 20 Pages</p>
                        <p className="text-[#6b7280] text-[11px]">Afternoon · <span className="text-[var(--ld-amber)]">8 days</span></p>
                      </div>
                    </div>
                    {/* Habit: Pending */}
                    <div className="bg-[#111118] border border-[#1a1a2e] p-3.5 rounded-xl flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-transparent border-2 border-[#374151] shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">Deep Work Block</p>
                        <p className="text-[#6b7280] text-[11px]">Afternoon · <span className="text-[var(--ld-amber)]">3 days</span></p>
                      </div>
                    </div>
                    {/* AI Coach */}
                    <div className="mt-3 bg-gradient-to-br from-[#1e1b4b] to-[#2e1065] border border-[#4338ca]/40 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#4f46e5] rounded-lg text-white shrink-0"><Brain size={16} /></div>
                        <div>
                          <h4 className="text-[#e0e7ff] font-bold text-xs mb-1">AI Coach Insight</h4>
                          <p className="text-[#c7d2fe] text-[11px] leading-relaxed">You've consistently completed your morning meditation. Your energy levels average 20% higher on days you meditate. Keep it up!</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right sidebar */}
                  <div className="space-y-4">
                    {/* Virtual Garden */}
                    <div className="bg-[#111118] border border-[#1a1a2e] p-5 rounded-xl text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-4">Virtual Garden</p>
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(16,185,129,0.08)] flex items-center justify-center mb-4">
                        <Leaf size={28} className="text-[var(--ld-green)]" />
                      </div>
                      <p className="text-white font-bold text-sm mb-2">Level 12 · Blooming Tree</p>
                      <div className="w-full bg-[#1a1a2e] h-1.5 rounded-full overflow-hidden mb-1.5">
                        <div className="bg-[var(--ld-green)] h-full rounded-full" style={{ width: '75%' }} />
                      </div>
                      <p className="text-[#6b7280] text-[10px]">750 / 1000 XP to next stage</p>
                    </div>
                    {/* Weekly Consistency */}
                    <div className="bg-[#111118] border border-[#1a1a2e] p-4 rounded-xl">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-3">Weekly Consistency</p>
                      <div className="flex items-end justify-between h-16 gap-1.5">
                        {[85, 65, 78, 100, 90, 55, 70].map((h, i) => (
                          <div key={i} className="w-full rounded-t-sm" style={{ height: `${h}%`, background: i === 3 ? '#7C3AED' : '#6D28D9', opacity: i === 3 ? 1 : 0.7 }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                          <span key={i} className={`text-[10px] ${i === 3 ? 'text-white font-bold' : 'text-[#6b7280]'}`}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ FEATURES ════════════════════ */}
        <section className="ld-section py-24 px-5" id="features">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-[var(--ld-primary)] text-xs font-bold uppercase tracking-[0.15em] mb-3">Capabilities</p>
            <h2 className="text-[36px] md:text-[42px] font-bold text-[var(--ld-text)] mb-12 leading-tight">Professional Optimization<br className="hidden md:block" /> Suite</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { icon: <Calendar size={22} />, title: 'Flexible habit scheduling', desc: 'Daily, weekly, or time-of-day specific. Match the cadence your life actually has.' },
                { icon: <Smile size={22} />, title: 'Mood & energy tracking', desc: "Habits don't happen in a vacuum. Track how your daily habits correlate with how you feel." },
                { icon: <TrendingUp size={22} />, title: 'Consistency visualizer', desc: 'View performance heatmaps and streak trajectories. Replace guesswork with evidence.' },
                { icon: <BarChart size={22} />, title: 'Deep analytics', desc: 'Per-habit completion, time-of-day patterns, consistency heatmaps, and beautiful charts.' },
                { icon: <Brain size={22} />, title: 'AI coach', desc: 'Personalized advice based on your real data. Spot patterns, suggest tweaks, celebrate wins.' },
                { icon: <Download size={22} />, title: 'Data Export PRO', desc: 'Your habits are yours. Export your full history securely to CSV or generate PDF reports.' },
              ].map((f, i) => (
                <div key={i} className="bg-[var(--ld-card)] border border-[var(--ld-border)] rounded-2xl p-7 hover:border-[var(--ld-border-hover)] hover:-translate-y-1 transition-all duration-300 ld-shadow-card hover:shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-[var(--ld-primary-soft)] flex items-center justify-center text-[var(--ld-primary-light)] mb-5">{f.icon}</div>
                  <h3 className="text-[15px] font-bold text-[var(--ld-text)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--ld-text-secondary)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ PRICING ════════════════════ */}
        <section className="ld-section py-24 px-5" id="pricing">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <p className="text-[var(--ld-primary)] text-xs font-bold uppercase tracking-[0.15em] mb-3">Pricing</p>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[var(--ld-text)] mb-4">Plans for Performance</h2>
              <p className="text-[var(--ld-text-secondary)] max-w-md mx-auto">Professional tools for personal optimization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Personal */}
              <div className="bg-[var(--ld-card)] border border-[var(--ld-border)] rounded-2xl p-8 hover:border-[var(--ld-border-hover)] transition-all duration-300 ld-shadow-card hover:shadow-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ld-text-muted)] mb-3">Personal</p>
                <p className="text-[36px] font-bold text-[var(--ld-text)] mb-6">Free</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-[var(--ld-text-secondary)]"><Check size={16} className="text-[var(--ld-primary-light)] shrink-0" /> 5 Routine Tracks</li>
                  <li className="flex items-center gap-3 text-sm text-[var(--ld-text-secondary)]"><Check size={16} className="text-[var(--ld-primary-light)] shrink-0" /> Basic Performance Logs</li>
                  <li className="flex items-center gap-3 text-sm text-[var(--ld-text-secondary)]"><Check size={16} className="text-[var(--ld-primary-light)] shrink-0" /> Community Insights</li>
                  <li className="flex items-center gap-3 text-sm text-[var(--ld-text-muted)] opacity-50"><X size={16} className="shrink-0" /> Advanced AI Coaching</li>
                </ul>
                <button className="w-full py-3 rounded-full ld-btn-outline justify-center" onClick={() => navigate('/register')}>Get Started</button>
              </div>

              {/* PRO */}
              <div className="ld-pro-card rounded-2xl p-8 text-white hover:-translate-y-1 transition-all duration-300 ld-shadow-card hover:shadow-[0_20px_40px_rgba(124,58,237,0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">Habitley PRO</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">Most Popular</span>
                </div>
                <div className="mb-1">
                  <span className="text-[36px] font-bold">₹899</span>
                  <span className="text-base text-white/70 ml-1">/lifetime</span>
                </div>
                <p className="text-sm text-white/60 mb-6">Unlimited tracking & analytics</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm"><Star size={16} className="text-white shrink-0" /> Unlimited Routine Tracks</li>
                  <li className="flex items-center gap-3 text-sm"><Star size={16} className="text-white shrink-0" /> Advanced AI Optimization</li>
                  <li className="flex items-center gap-3 text-sm"><Star size={16} className="text-white shrink-0" /> Full Data Export Suite</li>
                  <li className="flex items-center gap-3 text-sm"><Star size={16} className="text-white shrink-0" /> Priority Support</li>
                </ul>
                <button className="w-full py-3 rounded-full bg-[#1a1a2e] text-white font-bold text-sm hover:bg-[#111118] transition-all duration-300 relative z-10" onClick={handleProClick} disabled={upgrading}>
                  {upgrading ? 'Processing...' : 'Upgrade to Pro'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <section className="ld-section py-24 px-5" id="reviews">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <p className="text-[var(--ld-primary)] text-xs font-bold uppercase tracking-[0.15em] mb-3">Reviews</p>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[var(--ld-text)]">Trusted by High Performers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { quote: '"The analytics in Habitley are unmatched. I finally have a clear picture of how my sleep habits affect my output at work."', name: 'David K.', role: 'Operations Lead', initials: 'DK' },
                { quote: '"Replacing generic streaks with the AI Coach transformed my routine. The suggestions are actually based on my specific data."', name: 'Sarah M.', role: 'Data Scientist', initials: 'SM' },
                { quote: '"Professional, clean, and incredibly efficient. It\'s the only productivity tool that doesn\'t feel like a distraction."', name: 'James L.', role: 'Founder', initials: 'JL' },
              ].map((t, i) => (
                <div key={i} className="bg-[var(--ld-card)] border border-[var(--ld-border)] rounded-2xl p-7 hover:border-[var(--ld-border-hover)] hover:-translate-y-1 transition-all duration-300 ld-shadow-card hover:shadow-xl">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#FBBF24" className="text-[#FBBF24]" />)}
                  </div>
                  <p className="text-sm text-[var(--ld-text-secondary)] leading-relaxed mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--ld-primary-soft)] flex items-center justify-center text-[var(--ld-primary-light)] text-xs font-bold">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ld-text)]">{t.name}</p>
                      <p className="text-xs text-[var(--ld-text-muted)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ CTA ════════════════════ */}
        <section className="ld-section py-24 px-5">
          <div className="max-w-[900px] mx-auto">
            <div className="ld-cta-card px-6 md:px-16 py-16 md:py-20 text-center">
              <h2 className="text-[32px] md:text-[42px] font-bold text-[var(--ld-text)] mb-4 leading-tight">Ready to optimize your life?</h2>
              <p className="text-[var(--ld-text-secondary)] text-base mb-8 max-w-md mx-auto">Join 12,000+ operators building consistency with data. No credit card required.</p>
              <button className="ld-btn-primary" onClick={() => navigate('/register')}>
                Start Optimizing <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="border-t border-[var(--ld-border)] mt-8">
        <div className="max-w-[1200px] mx-auto px-5 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="Habitley Logo" className="w-8 h-8 object-contain" />
                <span className="text-[17px] font-bold text-[var(--ld-text)] tracking-tight">Habitley</span>
              </div>
              <p className="text-sm text-[var(--ld-text-secondary)] leading-relaxed max-w-xs mb-6">
                High-performance routine optimization for modern professionals. Track, analyze, and iterate on the systems that shape your life.
              </p>
              <div className="flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg border border-[var(--ld-border)] flex items-center justify-center text-[var(--ld-text-muted)] hover:text-[var(--ld-text)] hover:border-[var(--ld-border-hover)] transition-all duration-200">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold text-[var(--ld-text)] mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="ld-footer-link">Features</a></li>
                <li><a href="#pricing" className="ld-footer-link">Pricing</a></li>
                <li><a href="#" className="ld-footer-link">Changelog</a></li>
                <li><a href="#" className="ld-footer-link">Roadmap</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold text-[var(--ld-text)] mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="ld-footer-link">About</a></li>
                <li><a href="#" className="ld-footer-link">Privacy</a></li>
                <li><a href="#" className="ld-footer-link">Terms</a></li>
                <li><a href="#" className="ld-footer-link">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[var(--ld-border)] mt-12 pt-6">
            <p className="text-xs text-[var(--ld-text-muted)]">© 2026 Habitley. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
