import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import LandingNavbar from '@/components/layout/LandingNavbar';
import {
  ArrowRight, CheckCircle2, Brain, Search, Lightbulb, TrendingUp,
  Shield, Zap, BarChart3, BookOpen, Users, Building2, ChevronDown,
  Star, FileText, AlertTriangle, CheckCheck, Upload, ScanLine,
  GraduationCap, ClipboardList, Download, Eye, Check, X,
  Sparkles, Globe, Award, Clock,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { landingDemoSentences } from '@/mock';
import { cn } from '@/lib/utils';

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  // Kick off counting once in view
  useState(() => {
    if (!isInView) return;
  });

  // Simple CSS counter via framer motion
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ textContent: '0' } as never}
        animate={isInView ? { textContent: value.toString() } as never : {}}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        onUpdate={(latest: Record<string, number>) => {
          if (ref.current) {
            const v = Math.round(latest.textContent ?? 0);
            ref.current.textContent = v + suffix;
            setDisplayed(v);
          }
        }}
      />
      {displayed === 0 ? '0' + suffix : ''}
    </motion.span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/40 to-indigo-50/50 dark:from-slate-950 dark:via-violet-950/15 dark:to-slate-950" />
      {/* Mesh blobs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-violet-400/10 dark:bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-400/5 dark:bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 text-xs font-semibold border border-violet-200 dark:border-violet-800">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Essay Analysis
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                <Award className="w-3.5 h-3.5" />
                FERPA Compliant
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6"
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
              TrustWrite AI detects AI-generated patterns in admission essays and explains{' '}
              <em>exactly where</em> and <em>why</em> — giving admission committees clarity,
              not just a score.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-lg shadow-violet-500/20"
              >
                Analyze an Essay
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8"
            >
              {[
                { label: '99.2%', sub: 'Detection Accuracy' },
                { label: '< 30s', sub: 'Analysis Time' },
                { label: '50+', sub: 'Universities' },
              ].map(({ label, sub }) => (
                <div key={sub} className="flex flex-col">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
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
    human: {
      color: 'border-b-2 border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
      dot: 'bg-emerald-500',
      label: '🟢 Likely Human',
      badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50',
    },
    uncertain: {
      color: 'border-b-2 border-amber-400 bg-amber-50/70 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30',
      dot: 'bg-amber-500',
      label: '🟡 Uncertain',
      badge: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50',
    },
    ai: {
      color: 'border-b-2 border-rose-400 bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30',
      dot: 'bg-rose-500',
      label: '🔴 Likely AI',
      badge: 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/50',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-3xl blur-2xl pointer-events-none" />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    AI probability: <strong>{sentence.probability}%</strong>
                  </span>
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
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {l === 'ai' ? 'Likely AI' : l === 'uncertain' ? 'Uncertain' : 'Human'}
              </span>
            </div>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">Click a sentence</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stats / Social Proof Bar ─────────────────────────────────────────────────

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { icon: FileText, value: '1.2M+', label: 'Essays Analyzed', color: 'text-violet-500' },
    { icon: Globe, value: '50+', label: 'Partner Universities', color: 'text-indigo-500' },
    { icon: Award, value: '99.2%', label: 'Detection Accuracy', color: 'text-emerald-500' },
    { icon: Clock, value: '< 30s', label: 'Average Analysis Time', color: 'text-amber-500' },
    { icon: Users, value: '14K+', label: 'Active Users', color: 'text-rose-500' },
  ];

  return (
    <section ref={ref} className="py-12 bg-gradient-to-r from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-violet-200 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From upload to actionable insights in under 30 seconds.
          </p>
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
              className="relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all"
            >
              {/* Connector line (not last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-gradient-to-r from-violet-300 to-transparent dark:from-violet-700 dark:to-transparent z-10" />
              )}
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

// ─── Operations Section ───────────────────────────────────────────────────────

type OperationsRole = 'student' | 'faculty' | 'admin';

const operationsData: Record<OperationsRole, {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  accent: string;
  steps: { icon: React.ElementType; title: string; desc: string }[];
  highlight: { label: string; value: string }[];
}> = {
  student: {
    title: 'For Students',
    subtitle: 'Get actionable feedback on your writing authenticity before submission.',
    icon: GraduationCap,
    color: 'violet',
    accent: 'bg-violet-500',
    steps: [
      { icon: Upload, title: 'Upload Your Essay', desc: 'Drag and drop a PDF, DOCX, or TXT file, or paste your text directly.' },
      { icon: ScanLine, title: 'Instant Analysis', desc: 'Every sentence is analyzed individually by our NLP models in under 30 seconds.' },
      { icon: Eye, title: 'Review Highlights', desc: 'See exactly which sentences raised flags and understand why with clear explanations.' },
      { icon: Lightbulb, title: 'Improve Your Writing', desc: 'Follow specific, actionable suggestions to rewrite flagged sections in your own voice.' },
      { icon: Download, title: 'Export Your Report', desc: 'Download a full PDF authenticity report to keep on record.' },
    ],
    highlight: [
      { label: 'Avg. improvement', value: '+24%' },
      { label: 'Time to results', value: '< 30s' },
      { label: 'Student satisfaction', value: '4.9★' },
    ],
  },
  faculty: {
    title: 'For Faculty',
    subtitle: 'Review entire cohorts efficiently with transparent, explainable AI analysis.',
    icon: Users,
    color: 'indigo',
    accent: 'bg-indigo-500',
    steps: [
      { icon: ClipboardList, title: 'Access Student Queue', desc: 'Your review queue shows all submitted essays with automatic risk prioritization.' },
      { icon: ScanLine, title: 'Batch Analysis', desc: 'Analyze entire cohorts at once — no individual uploads needed for bulk review.' },
      { icon: Eye, title: 'Deep-Dive Explanations', desc: 'Click any flagged sentence to read exactly what patterns were detected and why.' },
      { icon: BarChart3, title: 'Writing Analytics', desc: 'View vocabulary diversity, sentence variation, and writing fingerprint for each student.' },
      { icon: Download, title: 'Generate Reports', desc: 'Export professional PDF reports for institutional records and appeals processes.' },
    ],
    highlight: [
      { label: 'Time saved per cohort', value: '40hrs' },
      { label: 'Essays per batch', value: '500+' },
      { label: 'Faculty satisfaction', value: '4.8★' },
    ],
  },
  admin: {
    title: 'For Administrators',
    subtitle: 'Institution-wide oversight with audit trails and compliance-ready reporting.',
    icon: Building2,
    color: 'fuchsia',
    accent: 'bg-fuchsia-500',
    steps: [
      { icon: Users, title: 'Manage Users', desc: 'Create and manage student and faculty accounts with role-based access controls.' },
      { icon: BarChart3, title: 'Institution Dashboard', desc: 'View aggregate analytics across all departments, cohorts, and submission periods.' },
      { icon: Shield, title: 'Audit Logs', desc: 'Every analysis, login, and report download is logged for compliance and appeals.' },
      { icon: Globe, title: 'Policy Configuration', desc: 'Set institution-wide thresholds, notification rules, and review workflows.' },
      { icon: Download, title: 'Compliance Exports', desc: 'Export full audit trails and anonymized datasets for FERPA-compliant reporting.' },
    ],
    highlight: [
      { label: 'Users managed', value: '300+' },
      { label: 'Audit events', value: '100%' },
      { label: 'FERPA compliance', value: '✓ Full' },
    ],
  },
};

function OperationsSection() {
  const [activeRole, setActiveRole] = useState<OperationsRole>('student');
  const data = operationsData[activeRole];

  const roleKeys: OperationsRole[] = ['student', 'faculty', 'admin'];
  const roleLabels: Record<OperationsRole, string> = {
    student: 'Students',
    faculty: 'Faculty',
    admin: 'Administrators',
  };

  const accentColors: Record<OperationsRole, string> = {
    student: 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-300 dark:border-violet-700',
    faculty: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700',
    admin: 'bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-300 dark:border-fuchsia-700',
  };

  const iconBgColors: Record<OperationsRole, string> = {
    student: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
    faculty: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400',
    admin: 'bg-fuchsia-50 dark:bg-fuchsia-950/30 text-fuchsia-600 dark:text-fuchsia-400',
  };

  const highlightColors: Record<OperationsRole, string> = {
    student: 'text-violet-600 dark:text-violet-400',
    faculty: 'text-indigo-600 dark:text-indigo-400',
    admin: 'text-fuchsia-600 dark:text-fuchsia-400',
  };

  return (
    <section id="operations" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-3">Operations</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Built for every role.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            TrustWrite AI adapts to the specific workflow of each person in the admissions process.
          </p>
        </motion.div>

        {/* Role tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {roleKeys.map((role) => {
              const Icon = operationsData[role].icon;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
                    activeRole === role
                      ? cn('shadow-md border', accentColors[role])
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {roleLabels[role]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-8 items-start"
          >
            {/* Left: Description + highlight stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', iconBgColors[activeRole])}>
                  <data.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{data.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{data.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {data.highlight.map((h) => (
                  <div key={h.label} className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{h.label}</span>
                    <span className={cn('text-lg font-black', highlightColors[activeRole])}>{h.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Step-by-step workflow */}
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {data.steps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all group"
                  >
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform', iconBgColors[activeRole])}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm mb-0.5">{step.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
    { icon: Sparkles, title: 'Essay Comparison', desc: 'Compare multiple essays for style consistency and similarity.', tag: 'Advanced' },
    { icon: CheckCheck, title: 'Professional Reports', desc: 'Download full PDF reports for institutional records.', tag: 'Reports' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Separate student, faculty, and admin dashboards with appropriate permissions.', tag: 'Security' },
    { icon: Users, title: 'Batch Processing', desc: 'Faculty can analyze entire cohorts at once for efficient review.', tag: 'Efficiency' },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
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
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-950/50 group-hover:scale-110 transition-all">
                  <f.icon className="text-violet-600 dark:text-violet-400" size={18} />
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

// ─── Pricing Section ──────────────────────────────────────────────────────────

function PricingSection() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      tagline: 'Perfect for trying out TrustWrite AI.',
      highlight: false,
      cta: 'Get Started Free',
      ctaVariant: 'outline' as const,
      features: [
        { text: '5 essay analyses per month', included: true },
        { text: 'Sentence-level detection', included: true },
        { text: 'Basic writing analytics', included: true },
        { text: 'PDF report export', included: false },
        { text: 'Essay comparison', included: false },
        { text: 'Writing fingerprint', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      tagline: 'For serious students and individual faculty.',
      highlight: true,
      badge: 'Most Popular',
      cta: 'Start Free Trial',
      ctaVariant: 'primary' as const,
      features: [
        { text: 'Unlimited essay analyses', included: true },
        { text: 'Sentence-level detection', included: true },
        { text: 'Full writing analytics suite', included: true },
        { text: 'PDF report export', included: true },
        { text: 'Essay comparison (up to 5)', included: true },
        { text: 'Writing fingerprint', included: true },
        { text: 'Priority support', included: false },
      ],
    },
    {
      name: 'Institution',
      price: 'Custom',
      period: 'contact us',
      tagline: 'For universities and admissions departments.',
      highlight: false,
      cta: 'Contact Sales',
      ctaVariant: 'outline' as const,
      features: [
        { text: 'Unlimited analyses (all users)', included: true },
        { text: 'Sentence-level detection', included: true },
        { text: 'Full writing analytics suite', included: true },
        { text: 'PDF + bulk report export', included: true },
        { text: 'Unlimited essay comparisons', included: true },
        { text: 'Writing fingerprint', included: true },
        { text: 'Dedicated support + SLA', included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free. Scale as you grow. No hidden fees, no credit card required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative rounded-2xl border p-7 transition-all',
                plan.highlight
                  ? 'bg-gradient-to-b from-violet-600 to-indigo-700 border-violet-500 shadow-2xl shadow-violet-500/25 scale-105'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md',
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={cn('text-sm font-semibold mb-1', plan.highlight ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400')}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className={cn('text-4xl font-black', plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white')}>
                    {plan.price}
                  </span>
                  <span className={cn('text-sm mb-1', plan.highlight ? 'text-violet-300' : 'text-slate-400 dark:text-slate-500')}>
                    / {plan.period}
                  </span>
                </div>
                <p className={cn('text-sm leading-relaxed', plan.highlight ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400')}>
                  {plan.tagline}
                </p>
              </div>

              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check className={cn('w-4 h-4 flex-shrink-0', plan.highlight ? 'text-emerald-300' : 'text-emerald-500')} />
                    ) : (
                      <X className={cn('w-4 h-4 flex-shrink-0', plan.highlight ? 'text-violet-400' : 'text-slate-300 dark:text-slate-600')} />
                    )}
                    <span className={cn(
                      'text-sm',
                      f.included
                        ? plan.highlight ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                        : plan.highlight ? 'text-violet-400' : 'text-slate-400 dark:text-slate-600',
                    )}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? 'primary' : plan.ctaVariant}
                className={cn(
                  'w-full',
                  plan.highlight && 'bg-white text-violet-700 hover:bg-violet-50 shadow-lg',
                )}
                onClick={() => navigate(plan.name === 'Institution' ? '/login' : '/register')}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-400 dark:text-slate-500 mt-8"
        >
          All plans include FERPA-compliant data handling. No essay content is stored after analysis.
        </motion.p>
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
              {
                name: 'Dr. Sarah Mitchell',
                role: 'Director of Admissions',
                quote: 'TrustWrite AI gives us the confidence to make fair decisions. The explainability panel is a game-changer — we can finally understand why something was flagged.',
                stars: 5,
              },
              {
                name: 'Prof. James Park',
                role: 'Undergraduate Dean',
                quote: 'We reviewed 800 essays last cycle. The batch analysis feature alone saved us weeks of manual review time.',
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-700 to-violet-800 dark:from-violet-800 dark:via-indigo-900 dark:to-violet-900" />
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-xs font-semibold mb-6 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Start free — no credit card required
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to bring transparency to your admissions?
          </h2>
          <p className="text-violet-200 text-lg mb-8 max-w-xl mx-auto">
            Join 14,000+ students and faculty who trust TrustWrite AI for fair, explainable analysis.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50 shadow-xl"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze Your First Essay
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/30"
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
  const footerLinks = {
    Product: ['Features', 'How It Works', 'Operations', 'Pricing', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Universities: ['For Admissions', 'For Faculty', 'Enterprise', 'Contact Sales'],
    Legal: ['Privacy Policy', 'Terms of Service', 'FERPA Compliance', 'Cookie Policy'],
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">
                TrustWrite <span className="text-violet-400">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Explainable AI for academic integrity. Built for fairness, not just scores.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', 'gh'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{category}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2024 TrustWrite AI. Built for academic integrity.</p>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
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
      <StatsSection />
      <ProblemSection />
      <HowItWorksSection />
      <OperationsSection />
      <FeaturesSection />
      <PricingSection />
      <UniversitySection />
      <CTASection />
      <Footer />
    </div>
  );
}
