import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from '@/components/layout/LandingNavbar';
import {
  ArrowRight, CheckCircle2, Brain, Search, Lightbulb, TrendingUp,
  Shield, Zap, BarChart3, BookOpen, Users, Building2, ChevronDown,
  Star, FileText, AlertTriangle, CheckCheck
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { landingDemoSentences } from '@/mock';
import { cn } from '@/lib/utils';

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-violet-950/10 dark:to-slate-950" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 text-xs font-semibold mb-6 border border-violet-200 dark:border-violet-800">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Essay Analysis
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6"
            >
              Understand the story{' '}
              <span className="gradient-text">behind every essay.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-xl"
            >
              TrustWrite AI analyzes admission essays for AI-generated patterns while explaining
              exactly <em>where</em> and <em>why</em> suspicious writing appears — giving admission
              committees confidence, not just scores.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Analyze an Essay
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6"
            >
              {[
                { label: '99.2%', sub: 'Detection Accuracy' },
                { label: '< 30s', sub: 'Analysis Time' },
                { label: '50+', sub: 'Universities' },
              ].map(({ label, sub }) => (
                <div key={sub}>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Interactive Demo */}
          <InteractiveDemoCard />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}

// ─── Interactive Demo Card ────────────────────────────────────────────────────

function InteractiveDemoCard() {
  const [selected, setSelected] = useState<number | null>(null);

  const sentence = selected !== null ? landingDemoSentences[selected] : null;

  const labelConfig = {
    human: { color: 'border-b-2 border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30', dot: 'bg-emerald-500', label: '🟢 Likely Human', badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50' },
    uncertain: { color: 'border-b-2 border-amber-400 bg-amber-50/70 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30', dot: 'bg-amber-500', label: '🟡 Uncertain', badge: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50' },
    ai: { color: 'border-b-2 border-rose-400 bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30', dot: 'bg-rose-500', label: '🔴 Likely AI', badge: 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/50' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">My Engineering Journey.pdf</p>
            <span className="text-xs px-2 py-0.5 bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 rounded-full font-medium">87% Authentic</span>
          </div>
        </div>

        {/* Essay sentences */}
        <div className="p-5 space-y-1 max-h-64 overflow-y-auto">
          {landingDemoSentences.map((s, i) => {
            const cfg = labelConfig[s.label];
            return (
              <motion.span
                key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className={cn(
                  'inline cursor-pointer rounded px-0.5 transition-all duration-200 text-sm text-slate-800 dark:text-slate-200 leading-relaxed',
                  cfg.color,
                  selected === i && 'ring-2 ring-offset-1',
                  selected === i && s.label === 'human' && 'ring-emerald-400',
                  selected === i && s.label === 'uncertain' && 'ring-amber-400',
                  selected === i && s.label === 'ai' && 'ring-rose-400',
                )}
              >
                {s.text}{' '}
              </motion.span>
            );
          })}
        </div>

        {/* Explanation Panel */}
        <AnimatePresence>
          {sentence && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-5 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', labelConfig[sentence.label].badge)}>
                    {labelConfig[sentence.label].label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">AI probability: <strong>{sentence.probability}%</strong></span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sentence.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
          {(['human', 'uncertain', 'ai'] as const).map((l) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', labelConfig[l].dot)} />
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{l === 'ai' ? 'Likely AI' : l === 'uncertain' ? 'Uncertain' : 'Human'}</span>
            </div>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">Click a sentence</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────

function ProblemSection() {
  const problems = [
    { icon: TrendingUp, title: 'AI adoption is exploding', desc: 'Over 40% of students admit to using AI writing tools for academic assignments.' },
    { icon: Search, title: 'Existing detectors fail', desc: 'Traditional AI detectors produce false positives and penalize sophisticated human writing.' },
    { icon: AlertTriangle, title: 'No transparency', desc: 'A score alone doesn\'t tell reviewers what\'s wrong, why it matters, or how to interpret it.' },
    { icon: Shield, title: 'No accountability', desc: 'Without explanation, students cannot improve, and faculty cannot make fair decisions.' },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI writing is invisible — until now.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The rise of generative AI has created a crisis of authenticity in academic admissions.
            Existing tools don't provide the transparency institutions need.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{p.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { step: '01', icon: FileText, title: 'Upload Essay', desc: 'Upload a PDF, DOCX, or TXT file, or paste the essay text directly.', color: 'violet' },
    { step: '02', icon: Brain, title: 'AI Analysis', desc: 'Our NLP models analyze every sentence for AI-generated patterns.', color: 'indigo' },
    { step: '03', icon: Search, title: 'Understand Results', desc: 'See exactly which sentences are flagged and why, with confidence scores.', color: 'violet' },
    { step: '04', icon: Lightbulb, title: 'Take Action', desc: 'Students get specific suggestions. Faculty get transparent reports.', color: 'indigo' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Four steps to complete clarity.
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-4xl font-black text-slate-100 dark:text-slate-800">{s.step}</span>
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    { icon: Brain, title: 'Sentence-Level Detection', desc: 'Every sentence is analyzed individually — not just the essay as a whole.', tag: 'Core' },
    { icon: Search, title: 'Explainability First', desc: 'Every flag includes a human-readable explanation of exactly what was detected.', tag: 'Differentiator' },
    { icon: BarChart3, title: 'Writing Analytics', desc: 'Track vocabulary diversity, sentence variation, readability, and more.', tag: 'Analytics' },
    { icon: FileText, title: 'Writing Fingerprint', desc: 'A unique signature of each writer\'s style patterns.', tag: 'Advanced' },
    { icon: ArrowRight, title: 'Essay Comparison', desc: 'Compare multiple essays for style consistency and similarity.', tag: 'Advanced' },
    { icon: CheckCheck, title: 'Professional Reports', desc: 'Download full PDF reports for institutional records.', tag: 'Reports' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Separate student, faculty, and admin dashboards with appropriate permissions.', tag: 'Security' },
    { icon: Users, title: 'Batch Processing', desc: 'Faculty can analyze entire cohorts at once for efficient review.', tag: 'Efficiency' },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Built for real academic decisions.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Every feature is designed with the needs of students, faculty, and institutions in mind.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-950/50 transition-colors">
                  <f.icon className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" size={18} />
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{f.tag}</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials / University Section ───────────────────────────────────────

function UniversitySection() {
  return (
    <section id="universities" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-3">For Universities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Trusted by admission teams who care about fairness.
            </h2>
            <div className="space-y-4">
              {[
                { icon: Building2, text: 'Institution-wide dashboards for all applicants' },
                { icon: Users, text: 'Faculty review queue with priority flagging' },
                { icon: Shield, text: 'Transparent explainability for every decision' },
                { icon: BookOpen, text: 'Audit trail for compliance and appeals' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { name: 'Dr. Sarah Mitchell', role: 'Director of Admissions', quote: 'TrustWrite AI gives us the confidence to make fair decisions. The explainability panel is a game-changer — we can finally understand why something was flagged.', stars: 5 },
              { name: 'Prof. James Park', role: 'Undergraduate Dean', quote: 'We reviewed 800 essays last cycle. The batch analysis feature alone saved us weeks of manual review time.', stars: 5 },
            ].map((t) => (
              <div key={t.name} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to bring transparency to your admissions?
          </h2>
          <p className="text-violet-200 text-lg mb-8 max-w-xl mx-auto">
            Get started free. No credit card required.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze Your First Essay
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            {['Free to start', 'No credit card', 'FERPA-compliant'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-violet-200 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="text-white font-semibold text-sm">TrustWrite AI</span>
          </div>
          <p className="text-sm">© 2024 TrustWrite AI. Built for academic integrity.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UniversitySection />
      <CTASection />
      <Footer />
    </div>
  );
}
