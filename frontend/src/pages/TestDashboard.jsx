import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  X, 
  Brain, 
  BarChart3, 
  CalendarDays, 
  Sparkles,
  Zap,
  Download,
  Target,
  Wand2,
  Loader2,
  Bot
} from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function TestDashboard() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  
  const [goalInput, setGoalInput] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) return;
    setIsGenerating(true);
    setGeneratedPlan(null);

    setTimeout(() => {
      setGeneratedPlan({
        habits: [
          { name: "Put shoes by the door", timeOfDay: "Evening", reason: "Removes friction for tomorrow." },
          { name: "Do 5 pushups", timeOfDay: "Morning", reason: "Builds momentum early." },
          { name: "Drink 1 glass of water", timeOfDay: "Morning", reason: "Hydration improves mental clarity." }
        ],
        encouragingMessage: "You don't need a massive overhaul, just a tiny spark. You've got this!"
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      <nav className="fixed w-full top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Habitly</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-[100%] blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-8">
            <Sparkles className="w-4 h-4 mr-2" /> The Modern Habit Tracker
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Build habits that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">actually stick.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            More than just a checklist. Habitly uses AI coaching, mood tracking, and deep behavioral insights to help you build the life you want, one day at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="white" size="lg" className="w-full sm:w-auto font-bold px-8" onClick={() => navigate('/register')}>
              Start your journey <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold px-8" onClick={() => navigate('/register')}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-[#12141a]/50 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to grow</h2>
            <p className="text-slate-400">Powerful tools designed to keep you consistent and motivated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Brain className="w-6 h-6 text-purple-400" />, title: "AI Habit Coach", desc: "Get personalized advice and weekly summaries based on your actual habit data.", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { icon: <Zap className="w-6 h-6 text-amber-400" />, title: "Mood & Energy Logs", desc: "Discover how your daily energy levels impact your ability to maintain streaks.", bg: "bg-amber-500/10", border: "border-amber-500/20" },
              { icon: <BarChart3 className="w-6 h-6 text-emerald-400" />, title: "Deep Insights", desc: "Visualize your consistency trends, success rates, and behavioral patterns.", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { icon: <CalendarDays className="w-6 h-6 text-blue-400" />, title: "Calendar View", desc: "Look back at your journey and see your progress mapped out day by day.", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { icon: <Target className="w-6 h-6 text-rose-400" />, title: "Gamified Challenges", desc: "Push your limits with 7-day streaks, weekend warrior badges, and more.", bg: "bg-rose-500/10", border: "border-rose-500/20" },
              { icon: <Download className="w-6 h-6 text-indigo-400" />, title: "Data Export", desc: "Your data is yours. Export beautiful PDFs or raw CSVs for your own analysis.", bg: "bg-indigo-500/10", border: "border-indigo-500/20" }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-[#161925] border border-slate-800 rounded-3xl hover:border-slate-600 transition-colors">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${feature.bg} ${feature.border}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-[#161925] to-[#0f111a] border border-indigo-500/30 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
              <Bot className="w-48 h-48 text-indigo-400" />
            </div>

            <div className="max-w-2xl relative z-10">
              <Badge variant="outline" className="mb-6">
                <Sparkles className="w-4 h-4 mr-2" /> Try the Pro AI Coach
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Overwhelmed by a big goal? Let AI break it down.
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Tell us what you want to achieve, and our Gemini-powered AI will instantly generate a custom, 3-step micro-habit stack to get you started.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Input 
                  type="text" 
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePlan()}
                  placeholder="e.g., Run a marathon, Write a book..." 
                  className="h-14"
                />
                
                <Button 
                  size="lg"
                  onClick={handleGeneratePlan}
                  disabled={isGenerating || !goalInput.trim()}
                  className="h-14 sm:w-auto w-full font-bold"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Thinking...</>
                  ) : (
                    <><Wand2 className="w-5 h-5 mr-2" /> ✨ Generate</>
                  )}
                </Button>
              </div>

              {generatedPlan && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                    <p className="text-indigo-200 font-medium italic">"{generatedPlan.encouragingMessage}"</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    {generatedPlan.habits.map((habit, idx) => (
                      <div key={idx} className="bg-[#12141a] border border-slate-700/50 p-5 rounded-xl flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{habit.timeOfDay}</span>
                        </div>
                        <h4 className="text-white font-bold mb-2">{habit.name}</h4>
                        <p className="text-slate-400 text-sm mt-auto">{habit.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg bg-slate-800/50 inline-block px-4 py-2 rounded-lg border border-slate-700/50">
              The most proven model for solo devs is freemium — free to sign up, pay for power features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="bg-[#12141a] border border-slate-800 rounded-3xl p-8 flex flex-col relative overflow-hidden">
              <div className="mb-8">
                <Badge variant="outline" className="mb-4 bg-slate-800 border-slate-700 text-slate-300">Starter</Badge>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-white">₹0</span>
                </div>
                <p className="text-slate-400 font-medium">forever</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <FeatureItem text="Up to 3 habits" included={true} />
                <FeatureItem text="Basic streak tracking" included={true} />
                <FeatureItem text="Calendar view" included={true} />
                <FeatureItem text="1 challenge" included={true} />
                <FeatureItem text="AI coach" included={false} />
                <FeatureItem text="Mood tracking" included={false} />
                <FeatureItem text="Export / PDF" included={false} />
              </div>

              <Button size="lg" variant="secondary" className="w-full font-bold h-14" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>

            <div className="bg-[#12141a] border-2 border-indigo-500 rounded-3xl p-8 flex flex-col relative shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Recommended
                </span>
              </div>

              <div className="mb-8">
                <Badge className="mb-4">Pro</Badge>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-white">₹199</span>
                  <span className="text-slate-400 font-medium text-lg">/mo</span>
                </div>
                <p className="text-slate-400 font-medium">or ₹1499/year (save 37%)</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <FeatureItem text="Unlimited habits" included={true} />
                <FeatureItem text="AI habit coach" included={true} />
                <FeatureItem text="Mood + energy log" included={true} />
                <FeatureItem text="Export PDF / CSV" included={true} />
                <FeatureItem text="Accountability partner" included={true} />
                <FeatureItem text="Custom themes" included={true} />
                <FeatureItem text="Priority support" included={true} />
              </div>

              <Button size="lg" className="w-full font-bold h-14" onClick={() => navigate('/register')}>
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-white">Habitly</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Habitly. Built for consistency.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ text, included }) {
  return (
    <div className="flex items-center gap-3">
      {included ? (
        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <X className="w-5 h-5 text-slate-600 shrink-0" />
      )}
      <span className={included ? "text-slate-200" : "text-slate-500"}>
        {text}
      </span>
    </div>
  );
}