import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useRazorpay } from '../hooks/useRazorpay.js';
import { ArrowRight, TrendingUp, Edit2, Zap, BarChart, Calendar, Smile, Brain, Download, Check, X, Star, Database, Terminal } from 'lucide-react';
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
<nav className="w-full top-0 sticky z-50 bg-[#f8f9ff]/80 backdrop-blur-md border-b border-[#c7c6d9]/20">
<div className="flex justify-between items-center max-w-[1200px] mx-auto px-[20px] py-4">
<div className="font-[Inter] text-[32px] text-[#4648d4] tracking-tight">Habitly</div>
<div className="hidden md:flex items-center gap-[24px]">
<a className="text-[#46464f] font-medium hover:text-[#4648d4] transition-colors duration-300" href="#methodology">How it Works</a>
<a className="text-[#46464f] font-medium hover:text-[#4648d4] transition-colors duration-300" href="#features">Features</a>
<a className="text-[#46464f] font-medium hover:text-[#4648d4] transition-colors duration-300" href="#pricing">Pricing</a>
<a className="text-[#46464f] font-medium hover:text-[#4648d4] transition-colors duration-300" href="#community">Insights</a>
</div>
<button className="bg-[#4648d4] text-[#ffffff] px-6 py-2.5 rounded-lg font-[Inter] transition-all active:scale-95 hover:shadow-lg hover:shadow-[#4648d4]/20" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
            Get Started
        </button>
</div>
</nav>
<main>
{/* Hero Section */}
<section className="relative overflow-hidden pt-16 md:pt-[120px] pb-[120px] px-[20px] transition-all duration-700 opacity-100">
<div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-center">
<div className="lg:col-span-6 z-10">
<h1 className="font-[Inter] text-[40px] md:text-[64px] text-[#1a1b23] mb-6 leading-tight">
                    Analyze &amp; <br /><span className="text-[#4648d4]">Optimize Your Life</span>
</h1>
<p className="font-[Inter] text-[18px] text-[#46464f] mb-10 max-w-md">
                    Master your routine with high-performance tracking. Build consistency through data-driven insights and professional optimization tools.
                </p>
<div className="flex flex-col sm:flex-row gap-4">
<button className="bg-[#4648d4] text-[#ffffff] px-8 py-4 rounded-lg font-[Inter] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#4648d4]/20" onClick={() => navigate('/register')}>
                        Start Optimizing
                        <ArrowRight size={16} />
</button>
<a href="#methodology" className="border-2 border-[#c7c6d9] text-[#1a1b23] px-8 py-4 rounded-lg font-[Inter] hover:bg-[#eff4ff] transition-all text-center flex items-center justify-center">
                        View Dashboard
                    </a>
</div>
</div>
<div className="lg:col-span-6 relative mt-12 lg:mt-0">
<div className="relative w-full aspect-[4/3] max-w-[600px] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#c7c6d9]/30">
<img className="w-full h-full object-cover" alt="Dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHfbvPA5QcbbrL6sszXoC91nYjN1FFRmoss79oGMJmaq7yeWHHI075Q-WuEk93uL4IpnkH8fSP68Uj5oZHvnyUWjg8Fjm2y2RA2DRgsiobpd6Edy5fku0TfrJziZthyJF16p11_45RPbx7w7Yp2TzOuCns7fux7F_HtJACBU_hgl8Ln0gsxcIIrmEdbAetrCAOR1bfMz59xwnrr_XL1sZ1NVGDh36jmoMNhtl_OLNBFqtJLDJGXk-KuPJ9bgDtoYqXNGDmOFr7X8Rc" />
{/* Floating Micro-UI element */}
<div className="absolute -right-4 top-1/4 bg-[#4648d4] p-4 rounded-xl shadow-2xl z-20 border border-white/10 hidden md:block">
<div className="flex items-center gap-3 text-white">
<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
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
<section className="py-[120px] bg-[#f1f3f9] relative transition-all duration-700 opacity-100" id="methodology">
<div className="absolute inset-0 ui-pattern"></div>
<div className="max-w-[1200px] mx-auto px-[20px] relative z-10">
<div className="text-center mb-16">
<h2 className="font-[Inter] text-[32px] text-[#1a1b23] mb-4">How it works</h2>
<div className="w-16 h-1.5 bg-[#4648d4] mx-auto rounded-full"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
{/* Step 1 */}
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-[#e0e1ff] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg">
<Edit2 className="text-primary" size={32} />
</div>
<h3 className="font-[Inter] text-[24px] text-[#1a1b23] mb-3">Set</h3>
<p className="font-[Inter] text-[#46464f]">Define high-impact routines. Map your daily actions to long-term performance goals.</p>
</div>
{/* Step 2 */}
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-[#4648d4] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-[#4648d4]/30">
<Zap className="text-white" size={32} />
</div>
<h3 className="font-[Inter] text-[24px] text-[#1a1b23] mb-3">Act</h3>
<p className="font-[Inter] text-[#46464f]">Execute with precision. Use smart notifications and time-of-day prompts to maintain flow.</p>
</div>
{/* Step 3 */}
<div className="flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-[#e0e1ff] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-lg">
<BarChart className="text-primary" size={32} />
</div>
<h3 className="font-[Inter] text-[24px] text-[#1a1b23] mb-3">Analyze</h3>
<p className="font-[Inter] text-[#46464f]">Review the data. Visualize your trajectory and iterate on your systems for maximum results.</p>
</div>
</div>
</div>
</section>
{/* Features Section */}
<section className="py-[120px] bg-[#1a1b23] text-white transition-all duration-700 opacity-100" id="features">
<div className="max-w-[1200px] mx-auto px-[20px]">
<div className="mb-16">
<span className="text-[#4648d4] font-bold tracking-widest uppercase text-xs">Capabilities</span>
<h2 className="font-[Inter] text-[32px] mt-2">Professional Optimization Suite</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Feature 1 */}
<div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<Calendar className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-white">Flexible habit scheduling</h3>
<p className="text-[#46464f] text-sm leading-relaxed text-white/70">Daily, weekly, time-of-day specific. Match the cadence your life actually has.</p>
</div>
{/* Feature 2 */}
<div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<Smile className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-white">Mood &amp; Energy Tracking</h3>
<p className="text-[#46464f] text-sm leading-relaxed text-white/70">Habits don't happen in a vacuum. Track how your daily habits correlate directly to how you feel.</p>
</div>
{/* Feature 3 */}
<div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<TrendingUp className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-white">Consistency Visualizer</h3>
<p className="text-[#46464f] text-sm leading-relaxed text-white/70">View performance heatmaps and streak trajectories. Replace guesswork with visual evidence of growth.</p>
</div>
{/* Feature 4 */}
<div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<BarChart className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-white">Deep analytics</h3>
<p className="text-[#46464f] text-sm leading-relaxed text-white/70">Per-habit completion, time-of-day patterns, consistency heatmaps, and beautiful category charts.</p>
</div>
{/* Feature 5 */}
<div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<Brain className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-white">AI coach</h3>
<p className="text-[#46464f] text-sm leading-relaxed text-white/70">Personalized advice based on your real data. It spots patterns, suggests tweaks, and celebrates the wins.</p>
</div>
{/* Feature 6 */}
<div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<Download className="text-primary mb-6" size={32} />
<h3 className="font-[Inter] mb-3 text-white">Data Export PRO</h3>
<p className="text-[#46464f] text-sm leading-relaxed text-white/70">Your habits are yours. Export your full history securely to CSV or generate professional PDF reports.</p>
</div>
</div>
</div>
</section>
{/* Pricing Section */}
<section className="py-[120px] bg-[#f8f9ff] transition-all duration-700 opacity-100" id="pricing">
<div className="max-w-[1200px] mx-auto px-[20px]">
<div className="text-center max-w-2xl mx-auto mb-16">
<h2 className="font-[Inter] text-[32px] text-[#1a1b23] mb-4">Plans for Performance</h2>
<p className="font-[Inter] text-[#46464f]">Professional tools for personal optimization.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] max-w-4xl mx-auto">
{/* Standard Plan */}
<div className="bg-white p-10 rounded-2xl border border-[#c7c6d9]/30 organic-shadow hover:-translate-y-2 transition-transform duration-500">
<h4 className="font-[Inter] text-[#46464f] mb-2 uppercase tracking-widest">Personal</h4>
<div className="text-[32px] font-[Inter] text-[#1a1b23] mb-6">Free</div>
<ul className="space-y-4 mb-10 text-[#46464f]">
<li className="flex items-center gap-2"><Check className="text-primary" size={20} /> 5 Routine Tracks</li>
<li className="flex items-center gap-2"><Check className="text-primary" size={20} /> Basic Performance Logs</li>
<li className="flex items-center gap-2"><Check className="text-primary" size={20} /> Community Insights</li>
<li className="flex items-center gap-2 opacity-40"><X size={20} /> Advanced AI Coaching</li>
</ul>
<button className="w-full border-2 border-[#4648d4] text-[#4648d4] py-3 rounded-lg font-[Inter] hover:bg-[#4648d4]/5 transition-all" onClick={() => navigate('/register')}>Get Started</button>
</div>
{/* PRO Plan */}
<div className="bg-[#4648d4] text-[#ffffff] p-10 rounded-2xl organic-shadow relative overflow-hidden transform md:scale-105 hover:-translate-y-2 transition-transform duration-500 shadow-2xl shadow-[#4648d4]/30">
<div className="absolute top-6 right-6 bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-sm">Most Popular</div>
<h4 className="font-[Inter] text-[#bec2ff] mb-2 uppercase tracking-widest">Habitly PRO</h4>
<div className="text-[32px] font-[Inter] mb-2">$4.99<span className="text-[16px] font-[Inter]">/mo</span></div>
<p className="text-[#bec2ff] text-sm mb-6">Unlimited tracking &amp; analytics</p>
<ul className="space-y-4 mb-10">
<li className="flex items-center gap-2"><Star className="text-white" size={20} /> Unlimited Routine Tracks</li>
<li className="flex items-center gap-2"><Star className="text-white" size={20} /> Advanced AI Optimization</li>
<li className="flex items-center gap-2"><Star className="text-white" size={20} /> Full Data Export Suite</li>
<li className="flex items-center gap-2"><Star className="text-white" size={20} /> Priority Support</li>
</ul>
<button className="w-full bg-white text-[#4648d4] py-3 rounded-lg font-[Inter] hover:bg-white/90 transition-all font-bold" onClick={handleProClick} disabled={upgrading}>{upgrading ? 'Processing...' : 'Upgrade to Pro'}</button>
</div>
</div>
</div>
</section>
{/* Testimonials */}
<section className="py-[120px] bg-[#f1f3f9] transition-all duration-700 opacity-100">
<div className="max-w-[1200px] mx-auto px-[20px]">
<div className="text-center mb-16">
<h2 className="font-[Inter] text-[32px] text-[#1a1b23]">Trusted by High Performers</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Testimonial 1 */}
<div className="bg-white p-8 rounded-2xl border border-[#c7c6d9]/20 shadow-sm">
<div className="flex text-[#4648d4] mb-4">
<Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
</div>
<p className="text-[#46464f] mb-6">"The analytics in Habitly are unmatched. I finally have a clear picture of how my sleep habits affect my output at work."</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[#4648d4]/10 flex items-center justify-center text-[#4648d4] font-bold">DK</div>
<div>
<p className="font-[Inter] text-[#1a1b23]">David K.</p>
<p className="text-xs text-[#46464f]">Operations Lead</p>
</div>
</div>
</div>
{/* Testimonial 2 */}
<div className="bg-white p-8 rounded-2xl border border-[#c7c6d9]/20 shadow-sm">
<div className="flex text-[#4648d4] mb-4">
<Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
</div>
<p className="text-[#46464f] mb-6">"Replacing generic streaks with the AI Coach transformed my routine. The suggestions are actually based on my specific data."</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[#4648d4]/10 flex items-center justify-center text-[#4648d4] font-bold">SM</div>
<div>
<p className="font-[Inter] text-[#1a1b23]">Sarah M.</p>
<p className="text-xs text-[#46464f]">Data Scientist</p>
</div>
</div>
</div>
{/* Testimonial 3 */}
<div className="bg-white p-8 rounded-2xl border border-[#c7c6d9]/20 shadow-sm">
<div className="flex text-[#4648d4] mb-4">
<Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
</div>
<p className="text-[#46464f] mb-6">"Professional, clean, and incredibly efficient. It's the only productivity tool that doesn't feel like a distraction."</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[#4648d4]/10 flex items-center justify-center text-[#4648d4] font-bold">JL</div>
<div>
<p className="font-[Inter] text-[#1a1b23]">James L.</p>
<p className="text-xs text-[#46464f]">Founder</p>
</div>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-[#1a1b23] text-white w-full border-t border-white/5">
<div className="max-w-[1200px] mx-auto px-[20px] py-[64px]">
<div className="flex flex-col md:flex-row justify-between items-center gap-8">
<div className="flex flex-col items-center md:items-start">
<div className="font-[Inter] text-[24px] text-[#4648d4] mb-2 tracking-tight">Habitly</div>
<p className="text-[#46464f] font-[Inter] text-center md:text-left max-w-xs text-sm">
                    © 2024 Habitly. High-performance routine optimization for modern professionals.
                </p>
</div>
<div className="flex flex-wrap justify-center gap-[24px] text-sm font-medium">
<a className="text-[#46464f] hover:text-white transition-colors" href="#">Privacy</a>
<a className="text-[#46464f] hover:text-white transition-colors" href="#">Terms</a>
<a className="text-[#46464f] hover:text-white transition-colors" href="#">Documentation</a>
<a className="text-[#46464f] hover:text-white transition-colors" href="#">API</a>
</div>
<div className="flex gap-4">
<div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#4648d4] transition-colors cursor-pointer">
<Database size={20} />
</div>
<div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#4648d4] transition-colors cursor-pointer">
<Terminal size={20} />
</div>
</div>
</div>
</div>
</footer>

    </div>
  );
}
