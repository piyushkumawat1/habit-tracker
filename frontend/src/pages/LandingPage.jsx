import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useRazorpay } from '../hooks/useRazorpay.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { ArrowRight, Sun, Moon, TrendingUp, Edit2, Zap, BarChart, Calendar, Smile, Brain, Download, Check, X, Star, Database, Terminal } from 'lucide-react';
import '../landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleCheckout, upgrading } = useRazorpay();
  const { theme, toggleTheme } = useTheme();

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
                entry.target.classList.add('opacity-100');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });
    
    return () => {
      document.querySelectorAll('section').forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="landing-page-root">
<nav className="w-full top-0 sticky z-50 bg-[var(--ld-surface)]/80 backdrop-blur-md border-b border-[var(--ld-outline-variant)]/20">
<div className="flex justify-between items-center max-w-[1200px] mx-auto px-[20px] py-4">
<div className="font-[Inter] text-[32px] text-[var(--ld-primary)] tracking-tight">Habitly</div>
<div className="hidden md:flex items-center gap-[24px]">
<a className="text-[var(--ld-on-surface-variant)] font-medium hover:text-[var(--ld-primary)] transition-colors duration-300" href="#methodology">How it Works</a>
<a className="text-[var(--ld-on-surface-variant)] font-medium hover:text-[var(--ld-primary)] transition-colors duration-300" href="#features">Features</a>
<a className="text-[var(--ld-on-surface-variant)] font-medium hover:text-[var(--ld-primary)] transition-colors duration-300" href="#pricing">Pricing</a>
</div>
<div className="flex items-center gap-4">
<button onClick={toggleTheme} className="p-2 text-[var(--ld-on-surface-variant)] hover:text-[var(--ld-primary)] transition-colors">
  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
</button>
<button className="text-[var(--ld-on-surface)] font-bold hover:text-[var(--ld-primary)] transition-colors" onClick={() => navigate('/login')}>
  Sign In
</button>
<button className="bg-[var(--ld-primary)] text-[var(--ld-on-primary)] px-6 py-2.5 rounded-lg font-[Inter] font-bold transition-all active:scale-95 hover:shadow-lg hover:shadow-[var(--ld-primary)]/20" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
    Get Started
</button>
</div>
</div>
</nav>
<main>
{/* Hero Section */}
<section className="relative overflow-hidden pt-16 md:pt-[120px] pb-[120px] px-[20px] transition-all duration-700 opacity-100">
<div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-center">
<div className="lg:col-span-6 z-10">
<h1 className="font-[Inter] text-[40px] md:text-[64px] text-[var(--ld-on-surface)] mb-6 leading-tight">
                    Analyze &amp; <br /><span className="text-[var(--ld-primary)]">Optimize Your Life</span>
</h1>
<p className="font-[Inter] text-[18px] text-[var(--ld-on-surface-variant)] mb-10 max-w-md">
                    Master your routine with high-performance tracking. Build consistency through data-driven insights and professional optimization tools.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<button className="bg-[var(--ld-primary)] text-[var(--ld-on-primary)] px-8 py-4 rounded-lg font-[Inter] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[var(--ld-primary)]/20" onClick={() => navigate('/register')}>
                        Start Optimizing
                        <ArrowRight size={16} />
</button>
<a href="#dashboard-preview" className="border-2 border-[var(--ld-outline-variant)] text-[var(--ld-on-surface)] px-8 py-4 rounded-lg font-[Inter] hover:bg-[var(--ld-surface-container)] transition-all text-center flex items-center justify-center">
                        View Dashboard
                    </a>
</div>
</div>
<div className="lg:col-span-6 relative mt-12 lg:mt-0">
<div className="relative w-full aspect-[4/3] max-w-[600px] mx-auto bg-[var(--ld-card)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--ld-outline-variant)]/30">
<img className="w-full h-full object-cover" alt="Dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHfbvPA5QcbbrL6sszXoC91nYjN1FFRmoss79oGMJmaq7yeWHHI075Q-WuEk93uL4IpnkH8fSP68Uj5oZHvnyUWjg8Fjm2y2RA2DRgsiobpd6Edy5fku0TfrJziZthyJF16p11_45RPbx7w7Yp2TzOuCns7fux7F_HtJACBU_hgl8Ln0gsxcIIrmEdbAetrCAOR1bfMz59xwnrr_XL1sZ1NVGDh36jmoMNhtl_OLNBFqtJLDJGXk-KuPJ9bgDtoYqXNGDmOFr7X8Rc" />
{/* Floating Micro-UI element */}
<div className="absolute -right-4 top-1/4 bg-[var(--ld-primary)] p-4 rounded-xl shadow-2xl z-20 border border-white/10 hidden md:block">
<div className="flex items-center gap-3 text-[var(--ld-on-primary)]">
<div className="w-10 h-10 rounded-lg bg-[var(--ld-card)]/20 flex items-center justify-center">
<TrendingUp />
</div>
<div>
<p className="font-[Inter] opacity-80">Efficiency Score</p>
<p className="font-[Inter] font-bold text-lg">94% (+12%)</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Methodology (Set, Act, Analyze) */}
<section className="py-[120px] bg-[var(--ld-surface-container-low)] relative transition-all duration-700 opacity-100" id="methodology">
<div className="absolute inset-0 ui-pattern"></div>
<div className="max-w-[1200px] mx-auto px-[20px] relative z-10">
<div className="text-center mb-16">
<h2 className="font-[Inter] text-[32px] text-[var(--ld-on-surface)] mb-4">How it works</h2>
<div className="w-16 h-1.5 bg-[var(--ld-primary)] mx-auto rounded-full"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
{/* Step 1 */}
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-[var(--ld-primary-container)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg">
<Edit2 className="text-primary" size={32} />
</div>
<h3 className="font-[Inter] text-[24px] text-[var(--ld-on-surface)] mb-3">Set</h3>
<p className="font-[Inter] text-[var(--ld-on-surface-variant)]">Define high-impact routines. Map your daily actions to long-term performance goals.</p>
</div>
{/* Step 2 */}
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-[var(--ld-primary)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-[var(--ld-primary)]/30 hover:shadow-[var(--ld-primary)]/50 hover:-translate-y-3 transition-all duration-500">
<Zap className="text-[var(--ld-on-primary)]" size={32} />
</div>
<h3 className="font-[Inter] text-[24px] text-[var(--ld-on-surface)] mb-3">Act</h3>
<p className="font-[Inter] text-[var(--ld-on-surface-variant)]">Execute with precision. Use smart notifications and time-of-day prompts to maintain flow.</p>
</div>
{/* Step 3 */}
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-[var(--ld-primary-container)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg">
<BarChart className="text-primary" size={32} />
</div>
<h3 className="font-[Inter] text-[24px] text-[var(--ld-on-surface)] mb-3">Analyze</h3>
<p className="font-[Inter] text-[var(--ld-on-surface-variant)]">Review the data. Visualize your trajectory and iterate on your systems for maximum results.</p>
</div>
</div>
</div>
</section>
{/* Dashboard Preview Section */}
<section className="py-[120px] bg-[var(--ld-surface)] transition-all duration-700 opacity-100" id="dashboard-preview">
  <div className="max-w-[1200px] mx-auto px-[20px]">
    <div className="text-center mb-16">
      <h2 className="font-[Inter] text-[32px] font-bold text-[var(--ld-on-surface)] mb-4">See It In Action</h2>
      <p className="font-[Inter] text-[var(--ld-on-surface-variant)] max-w-2xl mx-auto">Experience the professional dark mode dashboard. Track habits, grow your virtual garden, and get AI-powered insights all in one place.</p>
    </div>
    
    <div className="relative w-full max-w-[1000px] mx-auto bg-[#09090b] rounded-2xl shadow-2xl overflow-hidden border border-[#27272a] flex shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Sidebar Mockup */}
      <div className="w-[200px] hidden md:flex flex-col border-r border-[#27272a] p-4 bg-[#09090b]">
        <div className="font-[Inter] text-[#f8f9ff] font-bold text-lg mb-8 flex items-center gap-2"><span className="text-[var(--ld-primary)]">🌿</span> Habitly</div>
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2 bg-[#27272a] rounded-lg text-[#f8f9ff] text-sm font-medium flex items-center gap-2"><Calendar size={16}/> Dashboard</div>
          <div className="px-3 py-2 text-[#a1a1aa] hover:text-[#f8f9ff] rounded-lg text-sm font-medium flex items-center gap-2"><BarChart size={16}/> Analytics</div>
          <div className="px-3 py-2 text-[#a1a1aa] hover:text-[#f8f9ff] rounded-lg text-sm font-medium flex items-center gap-2"><Brain size={16}/> AI Coach</div>
        </div>
      </div>
      
      {/* Main Content Mockup */}
      <div className="flex-1 p-6 bg-[#09090b]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#f8f9ff] font-[Inter]">Today's Focus</h3>
            <p className="text-[#a1a1aa] text-sm font-[Inter]">Thursday, Oct 24 • You're on a 12-day streak!</p>
          </div>
          <div className="bg-gradient-to-r from-[#d4972f] to-[#e8b04b] text-[#3a2706] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider font-[Inter]">Pro Member</div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Habit Rows */}
            <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[var(--ld-primary)] flex items-center justify-center text-white"><Check size={14}/></div>
                <div>
                  <div className="text-[#f8f9ff] font-medium text-sm line-through opacity-70 font-[Inter]">Morning Meditation</div>
                  <div className="text-xs text-[#a1a1aa] font-[Inter]">Morning • <span className="text-[#e8b04b]">🔥 14 days</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[var(--ld-primary)] flex items-center justify-center text-white"><Check size={14}/></div>
                <div>
                  <div className="text-[#f8f9ff] font-medium text-sm line-through opacity-70 font-[Inter]">Read 20 Pages</div>
                  <div className="text-xs text-[#a1a1aa] font-[Inter]">Afternoon • <span className="text-[#e8b04b]">🔥 8 days</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md bg-[#27272a] flex items-center justify-center border border-[#3f3f46]"></div>
                <div>
                  <div className="text-[#f8f9ff] font-medium text-sm font-[Inter]">Deep Work Block</div>
                  <div className="text-xs text-[#a1a1aa] font-[Inter]">Afternoon • <span className="text-[#e8b04b]">🔥 3 days</span></div>
                </div>
              </div>
            </div>
            
            {/* AI Coach Card */}
            <div className="mt-6 bg-gradient-to-br from-[#1e1b4b] to-[#312e81] border border-[#4338ca] p-4 rounded-xl relative overflow-hidden">
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-[#4f46e5] rounded-lg text-white"><Brain size={18}/></div>
                <div>
                  <h4 className="text-[#e0e7ff] font-bold text-sm mb-1 font-[Inter]">AI Coach Insight</h4>
                  <p className="text-[#c7d2fe] text-xs leading-relaxed font-[Inter]">You've consistently completed your morning meditation! Your energy levels average 20% higher on days you meditate. Keep it up!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Virtual Garden Card */}
            <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl flex flex-col items-center text-center">
              <h4 className="text-[#f8f9ff] font-bold text-sm mb-4 font-[Inter]">Virtual Garden</h4>
              <div className="text-6xl mb-4 animate-pulse">🌳</div>
              <div className="text-[var(--ld-primary)] font-bold text-sm mb-2 font-[Inter]">Level 12 • Blooming Tree</div>
              <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-[var(--ld-primary)] h-full w-[75%]"></div>
              </div>
              <div className="text-[#a1a1aa] text-xs font-[Inter]">750 / 1000 XP to next stage</div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
              <h4 className="text-[#f8f9ff] font-bold text-sm mb-3 font-[Inter]">Weekly Consistency</h4>
              <div className="flex justify-between items-end h-16 gap-1">
                <div className="w-full bg-[var(--ld-primary)] rounded-t-sm h-[100%] opacity-80"></div>
                <div className="w-full bg-[var(--ld-primary)] rounded-t-sm h-[80%] opacity-80"></div>
                <div className="w-full bg-[var(--ld-primary)] rounded-t-sm h-[90%] opacity-80"></div>
                <div className="w-full bg-[var(--ld-primary)] rounded-t-sm h-[100%] opacity-100"></div>
                <div className="w-full bg-[#27272a] rounded-t-sm h-[20%]"></div>
                <div className="w-full bg-[#27272a] rounded-t-sm h-[20%]"></div>
                <div className="w-full bg-[#27272a] rounded-t-sm h-[20%]"></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-[#a1a1aa] font-[Inter]">
                <span>M</span><span>T</span><span>W</span><span className="text-[#f8f9ff] font-bold">T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Features Section */}
<section className="py-[120px] bg-[var(--ld-inverted-surface)] text-[var(--ld-on-primary)] transition-all duration-700 opacity-100" id="features">
<div className="max-w-[1200px] mx-auto px-[20px]">
<div className="mb-16">
<span className="text-[var(--ld-primary)] font-bold tracking-widest uppercase text-xs">Capabilities</span>
<h2 className="font-[Inter] text-[32px] mt-2">Professional Optimization Suite</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Feature 1 */}
<div className="p-8 rounded-2xl bg-[var(--ld-card)]/5 border border-white/10 hover:bg-[var(--ld-card)]/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
<Calendar className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-[var(--ld-on-primary)]">Flexible habit scheduling</h3>
<p className="text-[var(--ld-on-surface-variant)] text-sm leading-relaxed text-[var(--ld-on-primary)]/70">Daily, weekly, time-of-day specific. Match the cadence your life actually has.</p>
</div>
{/* Feature 2 */}
<div className="p-8 rounded-2xl bg-[var(--ld-card)]/5 border border-white/10 hover:bg-[var(--ld-card)]/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
<Smile className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-[var(--ld-on-primary)]">Mood &amp; Energy Tracking</h3>
<p className="text-[var(--ld-on-surface-variant)] text-sm leading-relaxed text-[var(--ld-on-primary)]/70">Habits don't happen in a vacuum. Track how your daily habits correlate directly to how you feel.</p>
</div>
{/* Feature 3 */}
<div className="p-8 rounded-2xl bg-[var(--ld-card)]/5 border border-white/10 hover:bg-[var(--ld-card)]/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
<TrendingUp className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-[var(--ld-on-primary)]">Consistency Visualizer</h3>
<p className="text-[var(--ld-on-surface-variant)] text-sm leading-relaxed text-[var(--ld-on-primary)]/70">View performance heatmaps and streak trajectories. Replace guesswork with visual evidence of growth.</p>
</div>
{/* Feature 4 */}
<div className="p-8 rounded-2xl bg-[var(--ld-card)]/5 border border-white/10 hover:bg-[var(--ld-card)]/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
<BarChart className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-[var(--ld-on-primary)]">Deep analytics</h3>
<p className="text-[var(--ld-on-surface-variant)] text-sm leading-relaxed text-[var(--ld-on-primary)]/70">Per-habit completion, time-of-day patterns, consistency heatmaps, and beautiful category charts.</p>
</div>
{/* Feature 5 */}
<div className="p-8 rounded-2xl bg-[var(--ld-card)]/5 border border-white/10 hover:bg-[var(--ld-card)]/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
<Brain className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-[var(--ld-on-primary)]">AI coach</h3>
<p className="text-[var(--ld-on-surface-variant)] text-sm leading-relaxed text-[var(--ld-on-primary)]/70">Personalized advice based on your real data. It spots patterns, suggests tweaks, and celebrates the wins.</p>
</div>
{/* Feature 6 */}
<div className="p-8 rounded-2xl bg-[var(--ld-card)]/5 border border-white/10 hover:bg-[var(--ld-card)]/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
<Download className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-[var(--ld-on-primary)]">Data Export PRO</h3>
<p className="text-[var(--ld-on-surface-variant)] text-sm leading-relaxed text-[var(--ld-on-primary)]/70">Your habits are yours. Export your full history securely to CSV or generate professional PDF reports.</p>
</div>
</div>
</div>
</section>
{/* Pricing Section */}
<section className="py-[120px] bg-[var(--ld-surface)] transition-all duration-700 opacity-100" id="pricing">
<div className="max-w-[1200px] mx-auto px-[20px]">
<div className="text-center max-w-2xl mx-auto mb-16">
<h2 className="font-[Inter] text-[32px] text-[var(--ld-on-surface)] mb-4">Plans for Performance</h2>
<p className="font-[Inter] text-[var(--ld-on-surface-variant)]">Professional tools for personal optimization.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] max-w-4xl mx-auto">
{/* Standard Plan */}
<div className="bg-[var(--ld-card)] p-10 rounded-2xl border border-[var(--ld-outline-variant)]/30 organic-shadow hover:-translate-y-3 hover:shadow-2xl hover:shadow-[var(--ld-on-surface)]/10 transition-all duration-500">
<h4 className="font-[Inter] text-[var(--ld-on-surface-variant)] mb-2 uppercase tracking-widest">Personal</h4>
<div className="text-[32px] font-[Inter] text-[var(--ld-on-surface)] mb-6">Free</div>
<ul className="space-y-4 mb-10 text-[var(--ld-on-surface-variant)]">
<li className="flex items-center gap-2"><Check className="text-primary" size={20} /> 5 Routine Tracks</li>
<li className="flex items-center gap-2"><Check className="text-primary" size={20} /> Basic Performance Logs</li>
<li className="flex items-center gap-2"><Check className="text-primary" size={20} /> Community Insights</li>
<li className="flex items-center gap-2 opacity-40"><X size={20} /> Advanced AI Coaching</li>
</ul>
<button className="w-full border-2 border-[var(--ld-primary)] text-[var(--ld-primary)] py-3 rounded-lg font-[Inter] hover:bg-[var(--ld-primary)] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300" onClick={() => navigate('/register')}>Get Started</button>
</div>
{/* PRO Plan */}
<div className="bg-[var(--ld-primary)] text-[var(--ld-on-primary)] p-10 rounded-2xl organic-shadow relative overflow-hidden transform md:scale-105 hover:-translate-y-2 transition-transform duration-500 shadow-2xl shadow-[var(--ld-primary)]/30 hover:shadow-[var(--ld-primary)]/50 hover:-translate-y-3 transition-all duration-500">
<div className="absolute top-6 right-6 bg-[var(--ld-card)]/20 text-[var(--ld-on-primary)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-sm">Most Popular</div>
<h4 className="font-[Inter] text-[var(--ld-inverse-primary)] mb-2 uppercase tracking-widest">Habitly PRO</h4>
<div className="text-[32px] font-[Inter] mb-2">₹399<span className="text-[16px] font-[Inter]">/mo</span></div>
<p className="text-[var(--ld-inverse-primary)] text-sm mb-6">Unlimited tracking &amp; analytics</p>
<ul className="space-y-4 mb-10">
<li className="flex items-center gap-2"><Star className="text-[var(--ld-on-primary)]" size={20} /> Unlimited Routine Tracks</li>
<li className="flex items-center gap-2"><Star className="text-[var(--ld-on-primary)]" size={20} /> Advanced AI Optimization</li>
<li className="flex items-center gap-2"><Star className="text-[var(--ld-on-primary)]" size={20} /> Full Data Export Suite</li>
<li className="flex items-center gap-2"><Star className="text-[var(--ld-on-primary)]" size={20} /> Priority Support</li>
</ul>
<button className="w-full bg-white text-[#4648d4] py-3 rounded-lg font-[Inter] hover:bg-white/90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-bold" onClick={handleProClick} disabled={upgrading}>{upgrading ? 'Processing...' : 'Upgrade to Pro'}</button>
</div>
</div>
</div>
</section>
{/* Testimonials */}
<section className="py-[120px] bg-[var(--ld-surface-container-low)] transition-all duration-700 opacity-100">
<div className="max-w-[1200px] mx-auto px-[20px]">
<div className="text-center mb-16">
<h2 className="font-[Inter] text-[32px] text-[var(--ld-on-surface)]">Trusted by High Performers</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Testimonial 1 */}
<div className="bg-[var(--ld-card)] p-8 rounded-2xl border border-[var(--ld-outline-variant)]/20 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
<div className="flex text-[var(--ld-primary)] mb-4">
<Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
</div>
<p className="text-[var(--ld-on-surface-variant)] mb-6">"The analytics in Habitly are unmatched. I finally have a clear picture of how my sleep habits affect my output at work."</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[var(--ld-primary)]/10 flex items-center justify-center text-[var(--ld-primary)] font-bold">DK</div>
<div>
<p className="font-[Inter] text-[var(--ld-on-surface)]">David K.</p>
<p className="text-xs text-[var(--ld-on-surface-variant)]">Operations Lead</p>
</div>
</div>
</div>
{/* Testimonial 2 */}
<div className="bg-[var(--ld-card)] p-8 rounded-2xl border border-[var(--ld-outline-variant)]/20 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
<div className="flex text-[var(--ld-primary)] mb-4">
<Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
</div>
<p className="text-[var(--ld-on-surface-variant)] mb-6">"Replacing generic streaks with the AI Coach transformed my routine. The suggestions are actually based on my specific data."</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[var(--ld-primary)]/10 flex items-center justify-center text-[var(--ld-primary)] font-bold">SM</div>
<div>
<p className="font-[Inter] text-[var(--ld-on-surface)]">Sarah M.</p>
<p className="text-xs text-[var(--ld-on-surface-variant)]">Data Scientist</p>
</div>
</div>
</div>
{/* Testimonial 3 */}
<div className="bg-[var(--ld-card)] p-8 rounded-2xl border border-[var(--ld-outline-variant)]/20 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
<div className="flex text-[var(--ld-primary)] mb-4">
<Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
</div>
<p className="text-[var(--ld-on-surface-variant)] mb-6">"Professional, clean, and incredibly efficient. It's the only productivity tool that doesn't feel like a distraction."</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[var(--ld-primary)]/10 flex items-center justify-center text-[var(--ld-primary)] font-bold">JL</div>
<div>
<p className="font-[Inter] text-[var(--ld-on-surface)]">James L.</p>
<p className="text-xs text-[var(--ld-on-surface-variant)]">Founder</p>
</div>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-[var(--ld-inverted-surface)] text-[var(--ld-on-primary)] w-full border-t border-white/5">
<div className="max-w-[1200px] mx-auto px-[20px] py-[64px]">
<div className="flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col items-center md:items-start">
<div className="font-[Inter] text-[24px] text-[var(--ld-primary)] mb-2 tracking-tight">Habitly</div>
<p className="text-[var(--ld-on-surface-variant)] font-[Inter] text-center md:text-left max-w-xs text-sm">
                    © 2024 Habitly. High-performance routine optimization for modern professionals.
                </p>
</div>
<div className="flex flex-wrap justify-center gap-[24px] text-sm font-medium">
<a className="text-[var(--ld-on-surface-variant)] hover:text-[var(--ld-on-primary)] transition-colors" href="#">Privacy</a>
<a className="text-[var(--ld-on-surface-variant)] hover:text-[var(--ld-on-primary)] transition-colors" href="#">Terms</a>
<a className="text-[var(--ld-on-surface-variant)] hover:text-[var(--ld-on-primary)] transition-colors" href="#">Documentation</a>
<a className="text-[var(--ld-on-surface-variant)] hover:text-[var(--ld-on-primary)] transition-colors" href="#">API</a>
</div>
<div className="flex gap-4">
<div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[var(--ld-primary)] transition-colors cursor-pointer">
<Database size={20} />
</div>
<div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[var(--ld-primary)] transition-colors cursor-pointer">
<Terminal size={20} />
</div>
</div>
</div>
</div>
</footer>

    </div>
  );
}
