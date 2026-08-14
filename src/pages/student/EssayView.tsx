import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import {
  ArrowLeft, Download, Share2, Printer, ChevronRight, X,
  AlertTriangle, CheckCircle2, HelpCircle, FileCheck, Lightbulb,
  Activity, BookOpen, Fingerprint, Info, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { mockAnalysis, mockEssays, SAMPLE_ESSAY_CONTENT } from '@/mock';
import { SentenceAnalysis, EssayAnalysis } from '@/types';
import { cn, getSentenceColor, formatDateTime, scoreToColor, scoreToLabel } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// ─── Authenticity Score Ring ──────────────────────────────────────────────────

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const offset = circumference - (displayed / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : score >= 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
        <circle
          cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring transition-all duration-100"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{displayed}</span>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

// ─── Explainability Panel ─────────────────────────────────────────────────────

function ExplainabilityPanel({ sentence, onClose }: { sentence: SentenceAnalysis; onClose: () => void }) {
  const colors = getSentenceColor(sentence.label);
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-40 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Why was this flagged?</p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Quote */}
        <blockquote className={cn('rounded-lg px-3 py-2.5 text-xs leading-relaxed border-l-3', colors.bg, colors.border)}>
          <span className="text-slate-700 dark:text-slate-300 italic">"{sentence.text}"</span>
        </blockquote>
      </div>

      <div className="p-5 space-y-5">
        {/* AI Probability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">AI Probability</span>
            <span className={cn('text-xl font-black', colors.text)}>{sentence.aiProbability}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sentence.aiProbability}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full', sentence.label === 'ai' ? 'bg-rose-500' : sentence.label === 'uncertain' ? 'bg-amber-500' : 'bg-emerald-500')}
            />
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <span className="text-sm text-slate-600 dark:text-slate-400">Confidence</span>
          <Badge variant={sentence.confidence === 'high' ? 'danger' : sentence.confidence === 'medium' ? 'warning' : 'default'}>
            {sentence.confidence.charAt(0).toUpperCase() + sentence.confidence.slice(1)}
          </Badge>
        </div>

        {/* Classification */}
        <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          {sentence.label === 'ai' && <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
          {sentence.label === 'human' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
          {sentence.label === 'uncertain' && <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
          <span className={cn('text-sm font-semibold', colors.text)}>
            {sentence.label === 'ai' ? 'Likely AI-Generated' : sentence.label === 'human' ? 'Likely Human-Written' : 'Uncertain'}
          </span>
        </div>

        {/* Detected Patterns */}
        {sentence.patterns.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-3">Detected Patterns</p>
            <div className="space-y-2">
              {sentence.patterns.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">{p.name}</p>
                    {p.description && <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-0.5">{p.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div>
          <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-2">Explanation</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{sentence.explanation}</p>
        </div>

        {/* Suggestion */}
        {sentence.suggestion && (
          <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-800">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">Suggestion</p>
            </div>
            <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">{sentence.suggestion}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Sentence Color Legend ────────────────────────────────────────────────────

function SentenceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs">
      {(['human', 'uncertain', 'ai'] as const).map(label => {
        const c = getSentenceColor(label);
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn('w-2.5 h-2.5 rounded-full', c.dot)} />
            <span className="text-slate-600 dark:text-slate-400">{c.label}</span>
          </div>
        );
      })}
      <span className="text-slate-400 dark:text-slate-500">← Click any sentence</span>
    </div>
  );
}

// ─── Metric Bar ───────────────────────────────────────────────────────────────

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ─── Main Essay View ──────────────────────────────────────────────────────────

export default function EssayView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSentence, setSelectedSentence] = useState<SentenceAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'analytics' | 'fingerprint' | 'improvements'>('analysis');
  const [realAnalysis, setRealAnalysis] = useState<EssayAnalysis | null>(null);
  const [realEssayTitle, setRealEssayTitle] = useState<string>('Submitted Essay');
  const [realWordCount, setRealWordCount] = useState<number>(0);

  useEffect(() => {
    if (id && typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem(`analysis_${id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRealAnalysis(parsed);
          const title = window.sessionStorage.getItem(`essay_title_${id}`) || 'Analyzed Essay';
          const text = window.sessionStorage.getItem(`essay_text_${id}`) || '';
          setRealEssayTitle(title);
          setRealWordCount(text ? text.trim().split(/\s+/).length : (parsed.sentences ? (parsed.sentences as SentenceAnalysis[]).reduce((acc: number, s: SentenceAnalysis) => acc + s.text.split(' ').length, 0) : 0));
          return;
        } catch {}
      }
    }
  }, [id]);

  const essay = realAnalysis ? {
    id: realAnalysis.essayId,
    title: realEssayTitle,
    content: '',
    wordCount: realWordCount || 500,
    uploadedAt: realAnalysis.analyzedAt,
    status: 'analyzed' as const,
    authenticityScore: realAnalysis.authenticityScore,
    aiRisk: realAnalysis.aiProbability > 70 ? ('high' as const) : realAnalysis.aiProbability > 40 ? ('medium' as const) : ('low' as const),
    studentId: 'u1',
    studentName: 'Alex Johnson'
  } : (mockEssays.find(e => e.id === id) || mockEssays[0]);

  const targetScore = essay ? essay.authenticityScore : 87;
  const targetAiProb = 100 - targetScore;
  const targetClass = targetScore >= 75 ? 'Likely Human' : targetScore >= 50 ? 'Mixed / Uncertain' : 'Likely AI-Assisted';

  const analysis: EssayAnalysis = realAnalysis || {
    essayId: essay.id,
    authenticityScore: targetScore,
    aiProbability: targetAiProb,
    confidence: 'high',
    classification: targetClass,
    writingQuality: targetScore >= 75 ? 88 : 72,
    originality: targetScore,
    analyzedAt: essay.uploadedAt,
    sentences: (essay.content || SAMPLE_ESSAY_CONTENT).split(/(?<=[.!?])\s+/).filter(Boolean).map((s: string, idx: number) => {
      let label: 'human' | 'uncertain' | 'ai' = 'human';
      if (targetScore < 60) {
        label = idx % 2 === 0 ? 'ai' : 'uncertain';
      } else if (targetScore < 80) {
        label = idx % 3 === 0 ? 'uncertain' : 'human';
      }
      const aiProb = targetScore < 60 ? (idx % 2 === 0 ? 88 : 55) : 15;
      return {
        id: `s_${idx}`,
        index: idx,
        text: s,
        label,
        aiProbability: aiProb,
        confidence: 'high' as const,
        patterns: label === 'ai' ? [{ name: 'Formal Template Connector' }] : [],
        explanation: label === 'ai' ? 'Elevated syntactic uniformity and formal template connector density.' : label === 'uncertain' ? 'Formal academic phrasing with low first-person register.' : 'Organic sentence length variation and personal narrative voice.',
        paragraphIndex: Math.floor(idx / 3)
      };
    }),
    metrics: {
      vocabularyDiversity: targetScore,
      sentenceVariation: targetScore,
      sentenceComplexity: targetScore >= 75 ? 75 : 85,
      readability: 70,
      grammar: 85,
      passiveVoice: 12,
      emotionalTone: 70,
      vocabularyRichness: targetScore,
      writingConsistency: targetScore
    },
    improvements: [
      { id: 'i1', category: 'authenticity', severity: targetScore < 60 ? 'high' : 'low', issue: targetScore < 60 ? 'High AI transition word density detected' : 'Strong personal narrative voice', suggestion: 'Incorporate more autobiographical context and personal reflection.' }
    ],
    fingerprint: {
      vocabulary: targetScore * 0.9,
      sentenceRhythm: targetScore,
      complexity: targetScore >= 75 ? 70 : 85,
      punctuation: 80,
      formality: targetScore < 60 ? 85 : 45,
      uniqueness: targetScore
    },
    paragraphRisks: [
      { paragraphIndex: 0, aiProbability: targetScore < 60 ? 75 : 15, label: targetScore < 60 ? 'ai' : 'human' }
    ]
  };

  const radarData = [
    { subject: 'Vocabulary', value: analysis.metrics.vocabularyDiversity },
    { subject: 'Sentence Variety', value: analysis.metrics.sentenceVariation },
    { subject: 'Complexity', value: analysis.metrics.sentenceComplexity },
    { subject: 'Originality', value: analysis.originality },
    { subject: 'Readability', value: analysis.metrics.readability },
    { subject: 'Consistency', value: analysis.metrics.writingConsistency },
  ];

  const riskDistData = [
    { name: 'Human', value: analysis.sentences.filter(s => s.label === 'human').length, color: '#10b981' },
    { name: 'Uncertain', value: analysis.sentences.filter(s => s.label === 'uncertain').length, color: '#f59e0b' },
    { name: 'AI', value: analysis.sentences.filter(s => s.label === 'ai').length, color: '#f43f5e' },
  ];

  const tabs = [
    { id: 'analysis', label: 'Essay Analysis', icon: BookOpen },
    { id: 'analytics', label: 'Writing Analytics', icon: Activity },
    { id: 'fingerprint', label: 'Fingerprint', icon: Fingerprint },
    { id: 'improvements', label: 'Improvements', icon: Lightbulb },
  ] as const;

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Report link copied to clipboard!');
    } catch {
      toast('Link: ' + window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const content = `=======================================================
TRUSTWRITE AI — ESSAY ANALYSIS REPORT
=======================================================
Title: ${essay.title}
Analyzed At: ${formatDateTime(analysis.analyzedAt)}
Word Count: ${essay.wordCount} words

OVERVIEW SUMMARY
-------------------------------------------------------
Personal Voice Score: ${analysis.authenticityScore}/100
AI-Like Pattern Signal: ${analysis.aiProbability}%
Classification: ${analysis.classification}
Evidence Strength: ${analysis.evidenceStrength || (analysis.confidence === 'high' ? 'Strong' : 'Moderate')}
Writing Flow: ${analysis.writingQuality}%
Vocabulary Diversity: ${analysis.originality}%

OBSERVATIONS
-------------------------------------------------------
${analysis.whyThisResult || analysis.summary || 'Stylometric analysis complete.'}

${analysis.genreObservation ? `Genre Classification: ${analysis.genreObservation}\n` : ''}
DETAILED METRICS
-------------------------------------------------------
- Vocabulary Diversity: ${analysis.metrics.vocabularyDiversity}%
- Sentence Variation: ${analysis.metrics.sentenceVariation}%
- Readability: ${analysis.metrics.readability}%
- Grammar Flow: ${analysis.metrics.grammar}%
- Writing Consistency: ${analysis.metrics.writingConsistency}%

SENTENCE-BY-SENTENCE BREAKDOWN
-------------------------------------------------------
${analysis.sentences.map((s, i) => `[${s.label.toUpperCase()}] (${s.aiProbability}% AI Signal) Sentence ${i + 1}:
"${s.text}"
Explanation: ${s.explanation}${s.suggestion ? `\nSuggestion: ${s.suggestion}` : ''}
`).join('\n')}

RELIABILITY NOTICE
-------------------------------------------------------
Detection is probabilistic and should not be treated as definitive proof of AI authorship.
=======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${essay.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analysis report downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{essay.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{essay.wordCount} words · {formatDateTime(analysis.analyzedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Share2 className="w-4 h-4" />} onClick={handleShare}>Share</Button>
          <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>Print</Button>
          <Button size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleDownloadReport}>Download Report</Button>
        </div>
      </div>

      {/* Writing Style & Pattern Overview */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            Writing Style & Pattern Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Diagnostic indicators measuring autobiographical voice, sentence variation, and automated language patterns.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Personal Voice / Authenticity */}
          <Card className="col-span-2 lg:col-span-1 flex flex-col items-center justify-center py-6">
            <ScoreRing score={analysis.authenticityScore} />
            <p className="mt-3 font-semibold text-slate-900 dark:text-white text-sm">{scoreToLabel(analysis.authenticityScore)} Voice</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center px-2 mt-0.5">Personal Voice & Natural Variation</p>
            <Badge variant={analysis.confidence === 'high' ? 'success' : analysis.confidence === 'medium' ? 'warning' : 'default'} className="mt-2 text-[11px]">
              {analysis.evidenceStrength ? `${analysis.evidenceStrength} Evidence` : `${analysis.confidence.charAt(0).toUpperCase() + analysis.confidence.slice(1)} Evidence`}
            </Badge>
          </Card>

          {/* Card 2: AI-Like Pattern Signal */}
          <Card className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">AI Pattern Signal</p>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{analysis.aiProbability}%</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {analysis.classification}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-3">
              Resemblance to automated writing patterns (NOT an authorship probability).
            </p>
          </Card>

          {/* Card 3: Writing Flow & Structure */}
          <Card className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Writing Flow</p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{analysis.writingQuality}%</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {scoreToLabel(analysis.writingQuality)}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-3">
              Sentence rhythm, readability ease, and paragraph structural pacing.
            </p>
          </Card>

          {/* Card 4: Vocabulary Diversity */}
          <Card className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Vocabulary Diversity</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{analysis.originality}%</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {scoreToLabel(analysis.originality)}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-3">
              Lexical richness, unique word distribution, and phrase diversity.
            </p>
          </Card>
        </div>

        {/* What Does the Score Mean Guide */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-violet-500" />
            What does the Personal Voice Score ({analysis.authenticityScore} / 100) mean?
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-0.5">80 – 100 / 100 (Likely Human)</p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">Strong autobiographical voice, high sentence burstiness, organic personal vocabulary.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
              <p className="font-semibold text-amber-800 dark:text-amber-300 mb-0.5">50 – 79 / 100 (Uncertain / Formal)</p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">Formal style or mixed voice. Common in Wikipedia reference entries or heavily edited drafts.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <p className="font-semibold text-rose-800 dark:text-rose-300 mb-0.5">0 – 49 / 100 (Likely AI-Assisted)</p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">Elevated AI template connectors ("Furthermore"), uniform sentence lengths, high risk.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Context & Admissions Guidance */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Dynamic Why This Result */}
          <div className="rounded-xl p-4 bg-violet-50/70 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-900 dark:text-violet-300">Why this result?</h4>
              {analysis.genreObservation && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-200/60 dark:bg-violet-900/60 text-violet-800 dark:text-violet-200 font-medium ml-auto">
                  {analysis.genreObservation}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {analysis.whyThisResult || analysis.summary || "Pattern analysis combines sentence length variation, vocabulary richness, and syntactic predictability to evaluate stylistic consistency."}
            </p>
          </div>

          {/* What We Can & Cannot Tell */}
          <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Admissions AI Disclaimer</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] leading-snug">
              <div className="text-slate-600 dark:text-slate-400">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">✓ What we can tell:</strong>
                Stylometric patterns, sentence rhythm, and uniform phrasing.
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <strong className="text-rose-600 dark:text-rose-400 block mb-0.5">✗ What we cannot tell:</strong>
                Authorship identity or whether AI was used as a brainstorming tool.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tabId ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'analysis' && (
          <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-3 gap-6">
            {/* Essay with highlights */}
            <div className="lg:col-span-2 space-y-4">
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Sentence Analysis</h3>
                  <SentenceLegend />
                </div>
                <div className="essay-text space-y-4">
                  {Array.from(new Set(analysis.sentences.map((s: SentenceAnalysis) => s.paragraphIndex))).sort((a: number, b: number) => a - b).map((paraIdx: number) => {
                    const paraSentences = analysis.sentences.filter((s: SentenceAnalysis) => s.paragraphIndex === paraIdx);
                    if (!paraSentences.length) return null;
                    return (
                      <p key={paraIdx} className="leading-relaxed">
                        {paraSentences.map((s: SentenceAnalysis) => {
                          const c = getSentenceColor(s.label);
                          const isSelected = selectedSentence?.id === s.id;
                          return (
                            <span
                              key={s.id}
                              onClick={() => setSelectedSentence(isSelected ? null : s)}
                              className={cn(
                                'inline cursor-pointer rounded px-0.5 transition-all duration-150',
                                `sentence-${s.label}`,
                                isSelected && 'ring-2 ring-offset-1',
                                isSelected && s.label === 'human' && 'ring-emerald-400',
                                isSelected && s.label === 'uncertain' && 'ring-amber-400',
                                isSelected && s.label === 'ai' && 'ring-rose-400',
                              )}
                            >
                              {s.text}{' '}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                </div>
              </Card>

              {/* Paragraph risk chart */}
              <Card>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">AI Probability by Paragraph</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={analysis.paragraphRisks} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
                      formatter={(v: any) => [`${v}%`, 'AI Probability']}
                    />
                    <Bar dataKey="aiProbability" radius={[4, 4, 0, 0]}>
                      {analysis.paragraphRisks.map((entry: any, index: number) => (
                        <Cell key={index} fill={entry.aiProbability > 70 ? '#f43f5e' : entry.aiProbability > 40 ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Risk summary */}
            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Distribution</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={riskDistData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {riskDistData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {riskDistData.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{d.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {selectedSentence ? (
                <Card className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Selected Sentence</p>
                    </div>
                    <Badge variant={selectedSentence.label === 'ai' ? 'danger' : selectedSentence.label === 'uncertain' ? 'warning' : 'success'}>
                      {getSentenceColor(selectedSentence.label).label}
                    </Badge>
                  </div>

                  <div className={cn('rounded-lg p-3 text-xs leading-relaxed border', getSentenceColor(selectedSentence.label).bg, getSentenceColor(selectedSentence.label).border)}>
                    "{selectedSentence.text}"
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span>Pattern Signal</span>
                      <span className={cn('font-bold', getSentenceColor(selectedSentence.label).text)}>{selectedSentence.aiProbability}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-300', selectedSentence.label === 'ai' ? 'bg-rose-500' : selectedSentence.label === 'uncertain' ? 'bg-amber-500' : 'bg-emerald-500')}
                        style={{ width: `${selectedSentence.aiProbability}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
                    <strong className="block text-slate-700 dark:text-slate-200 mb-0.5">Observation:</strong>
                    {selectedSentence.explanation}
                  </div>

                  {selectedSentence.suggestion && (
                    <div className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed bg-violet-50 dark:bg-violet-950/20 p-2.5 rounded-lg border border-violet-100 dark:border-violet-900/50">
                      <strong className="block text-violet-800 dark:text-violet-200 mb-0.5">💡 Tip:</strong>
                      {selectedSentence.suggestion}
                    </div>
                  )}

                  <Button size="sm" className="w-full text-xs" rightIcon={<ChevronRight className="w-3.5 h-3.5" />} onClick={() => {
                    // Triggers the slide-out drawer
                    const drawerElement = document.getElementById('explainability-drawer');
                    if (drawerElement) drawerElement.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    View Deep Breakdown
                  </Button>
                </Card>
              ) : (
                <Card className="text-center py-8">
                  <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">Click any sentence to see its analysis</p>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Writing Style Radar</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Radar name="Writing" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-5">Writing Metrics</h3>
              <div className="space-y-4">
                <MetricBar label="Vocabulary Diversity" value={analysis.metrics.vocabularyDiversity} color="#8b5cf6" />
                <MetricBar label="Sentence Variation" value={analysis.metrics.sentenceVariation} color="#6366f1" />
                <MetricBar label="Sentence Complexity" value={analysis.metrics.sentenceComplexity} color="#8b5cf6" />
                <MetricBar label="Readability" value={analysis.metrics.readability} color="#10b981" />
                <MetricBar label="Grammar Score" value={analysis.metrics.grammar} color="#10b981" />
                <MetricBar label="Emotional Tone" value={analysis.metrics.emotionalTone} color="#f59e0b" />
                <MetricBar label="Writing Consistency" value={analysis.metrics.writingConsistency} color="#6366f1" />
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'fingerprint' && (
          <motion.div key="fingerprint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Your Writing Fingerprint</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">A unique signature of your writing style</p>
                </div>
              </div>
              <div className="space-y-5 max-w-lg">
                {[
                  { label: 'Vocabulary', value: analysis.fingerprint.vocabulary, color: '#8b5cf6', desc: 'Breadth and uniqueness of word choices' },
                  { label: 'Sentence Rhythm', value: analysis.fingerprint.sentenceRhythm, color: '#6366f1', desc: 'Pattern and flow of sentence lengths' },
                  { label: 'Complexity', value: analysis.fingerprint.complexity, color: '#8b5cf6', desc: 'Structural complexity of constructions' },
                  { label: 'Punctuation', value: analysis.fingerprint.punctuation, color: '#10b981', desc: 'Idiosyncrasy of punctuation style' },
                  { label: 'Formality', value: analysis.fingerprint.formality, color: '#f59e0b', desc: 'Register and tone consistency' },
                  { label: 'Uniqueness', value: analysis.fingerprint.uniqueness, color: '#ec4899', desc: 'Overall stylistic distinctiveness' },
                ].map(({ label, value, color, desc }) => (
                  <div key={label}>
                    <div className="flex justify-between items-end mb-1.5">
                      <div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">{desc}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color }}>{value}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full relative"
                        style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
                      >
                        <div className="absolute right-0 top-0 h-full w-1 rounded-r-full" style={{ background: color }} />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'improvements' && (
          <motion.div key="improvements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid sm:grid-cols-2 gap-4">
              {analysis.improvements.map((imp: any, i: number) => (
                <motion.div
                  key={imp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card hover>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        imp.severity === 'high' ? 'bg-rose-50 dark:bg-rose-950/30' : imp.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-slate-100 dark:bg-slate-800'
                      )}>
                        {imp.category === 'authenticity' && <AlertTriangle className={cn('w-4 h-4', imp.severity === 'high' ? 'text-rose-500' : 'text-amber-500')} />}
                        {imp.category === 'vocabulary' && <BookOpen className="w-4 h-4 text-violet-500" />}
                        {imp.category === 'sentence-structure' && <Activity className="w-4 h-4 text-indigo-500" />}
                        {imp.category === 'readability' && <Lightbulb className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">{imp.category.replace('-', ' ')}</span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{imp.issue}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900">
                      <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                        <strong>Suggestion:</strong> {imp.suggestion}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explainability Panel */}
      <AnimatePresence>
        {selectedSentence && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30"
              onClick={() => setSelectedSentence(null)}
            />
            <ExplainabilityPanel sentence={selectedSentence} onClose={() => setSelectedSentence(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
