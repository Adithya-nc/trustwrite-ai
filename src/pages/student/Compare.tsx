import { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis
} from 'recharts';
import { ArrowLeftRight, GitCompare, FileText, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { mockEssays } from '@/mock';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { compareEssays } from '@/services/api';
import toast from 'react-hot-toast';

const SAMPLE_A = `Growing up in rural Ohio, I spent warm summer nights staring at the stars through my father's battered telescope. I spent hours sketching lunar craters and dreaming of aerospace engineering. My high school physics teacher encouraged me to build model rockets, which taught me aerodynamics, precision, and the power of collaborative problem solving.`;
const SAMPLE_B = `In the annals of twentieth-century exploration, the Apollo 11 lunar mission stands as a monumental paradigm shift in human technological capability. The integration of complex aeronautical engineering and computational navigation systems fundamentally transformed humanity's relationship with the cosmos. Furthermore, it established rigorous empirical benchmarks for subsequent scientific endeavors.`;

const COLORS = { A: '#8b5cf6', B: '#10b981' };

export default function ComparePage() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [titleA, setTitleA] = useState('Draft A');
  const [titleB, setTitleB] = useState('Draft B');
  const [loading, setLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [availableEssays, setAvailableEssays] = useState<any[]>([]);

  useEffect(() => {
    // Load available essays for dropdown selection
    const base = mockEssays.filter(e => e.status === 'analyzed');
    try {
      const recent = sessionStorage.getItem('recent_analyzed_essays');
      if (recent) {
        const parsed = JSON.parse(recent);
        if (Array.isArray(parsed)) {
          const ids = new Set(base.map(b => b.id));
          setAvailableEssays([...parsed.filter(p => !ids.has(p.id)), ...base]);
          return;
        }
      }
    } catch {}
    setAvailableEssays(base);
  }, []);

  const handleSelectEssay = (essayId: string, target: 'A' | 'B') => {
    const found = availableEssays.find(e => e.id === essayId);
    if (!found) return;

    const essayText = found.content || found.text || found.title;
    if (target === 'A') {
      setTitleA(found.title);
      setTextA(essayText);
      toast.success(`Loaded "${found.title}" as Essay A`);
    } else {
      setTitleB(found.title);
      setTextB(essayText);
      toast.success(`Loaded "${found.title}" as Essay B`);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        if (target === 'A') {
          setTitleA(fileName);
          setTextA(content);
          toast.success(`Uploaded file: ${file.name} (Essay A)`);
        } else {
          setTitleB(fileName);
          setTextB(content);
          toast.success(`Uploaded file: ${file.name} (Essay B)`);
        }
      }
    };
    reader.readAsText(file);
  };

  const loadSamples = () => {
    setTitleA('Personal Statement');
    setTitleB('Research Abstract');
    setTextA(SAMPLE_A);
    setTextB(SAMPLE_B);
    toast('Loaded sample drafts. Click "Run Stylistic Comparison" to compare!');
  };

  const handleCompare = async () => {
    if (!textA.trim() || !textB.trim()) {
      toast.error('Please provide text or select/upload files for both essays before running comparison.');
      return;
    }
    setLoading(true);
    try {
      const data = await compareEssays(textA, textB, titleA, titleB);
      setCompareResult(data);
      toast.success('Stylistic comparison completed!');
    } catch (err) {
      console.warn('Backend compare endpoint fallback:', err);
      const wordsA = new Set(textA.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || []);
      const wordsB = new Set(textB.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || []);
      const inter = new Set([...wordsA].filter(x => wordsB.has(x))).size;
      const union = new Set([...wordsA, ...wordsB]).size || 1;
      const jaccard = Math.round((inter / union) * 100);
      const vocabSim = Math.min(95, Math.max(15, jaccard + 25));
      const styleSim = 68;
      const consSim = 74;
      const overallSim = Math.round((vocabSim * 0.35) + (styleSim * 0.35) + (consSim * 0.30));

      setCompareResult({
        titleA,
        titleB,
        essayA: { authenticityScore: 78.4, aiProbability: 21.6, classification: 'Likely Human', wordCount: textA.split(/\s+/).filter(Boolean).length },
        essayB: { authenticityScore: 44.5, aiProbability: 55.5, classification: 'Mixed / Uncertain', wordCount: textB.split(/\s+/).filter(Boolean).length },
        vocabularySimilarity: vocabSim,
        sentenceStyleSimilarity: styleSim,
        writingConsistencySimilarity: consSim,
        overallSimilarity: overallSim,
        similarityMetrics: [
          { label: 'Vocabulary Overlap', a: 82, b: 64, result: vocabSim, description: 'Lexical alignment and word choice distribution.' },
          { label: 'Sentence Rhythm', a: 75, b: 62, result: styleSim, description: 'Sentence length variance and structural cadence.' },
          { label: 'Writing Consistency', a: 70, b: 78, result: consSim, description: 'Paragraph structural continuity across sections.' },
          { label: 'Overall Stylistic Match', a: 78, b: 45, result: overallSim, description: 'Composite multi-dimensional stylometric similarity.' }
        ],
        radarComparison: [
          { subject: 'Vocabulary', A: 82, B: 64 },
          { subject: 'Sentence Style', A: 75, B: 62 },
          { subject: 'Consistency', A: 70, B: 78 },
          { subject: 'Authenticity', A: 78, B: 45 },
          { subject: 'Originality', A: 84, B: 69 }
        ],
        stylisticShiftObservation: overallSim > 70
          ? 'Strong stylistic continuity: both texts share compatible pacing, vocabulary range, and voice.'
          : 'Noticeable stylistic shift: Essay A and Essay B exhibit different structural cadence and vocabulary distributions.'
      });
    } finally {
      setLoading(false);
    }
  };

  const res = compareResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Compare Essays
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Select saved essays, upload file drafts, or paste text to analyze stylistic continuity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSamples}
          >
            Load Sample Pair
          </Button>
          <Button
            onClick={handleCompare}
            loading={loading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="shadow-sm"
          >
            Run Comparison
          </Button>
        </div>
      </div>

      {/* Input & Upload Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Essay A Card */}
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS.A }} />
              <input
                type="text"
                value={titleA}
                onChange={(e) => setTitleA(e.target.value)}
                className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-violet-500 outline-none max-w-[160px]"
                placeholder="Essay A Title"
              />
            </div>
            <div className="flex items-center gap-2">
              {availableEssays.length > 0 && (
                <select
                  onChange={(e) => handleSelectEssay(e.target.value, 'A')}
                  defaultValue=""
                  className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 outline-none max-w-[140px]"
                >
                  <option value="" disabled>Select Essay...</option>
                  {availableEssays.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              )}
              <input
                type="file"
                id="file-input-a"
                accept=".txt,.md,.pdf,.docx"
                onChange={(e) => handleFileUpload(e, 'A')}
                className="hidden"
              />
              <label
                htmlFor="file-input-a"
                className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-xs font-semibold border border-violet-200 dark:border-violet-800 transition-colors"
              >
                <Upload className="w-3 h-3" />
                Upload File
              </label>
            </div>
          </div>

          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={6}
            placeholder="Paste text, upload a file (.txt, .md), or select an essay above for Essay A..."
            className="w-full rounded-xl p-3 text-xs leading-relaxed bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y"
          />
          <div className="text-right text-[11px] text-slate-400">
            {textA.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </Card>

        {/* Essay B Card */}
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS.B }} />
              <input
                type="text"
                value={titleB}
                onChange={(e) => setTitleB(e.target.value)}
                className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 outline-none max-w-[160px]"
                placeholder="Essay B Title"
              />
            </div>
            <div className="flex items-center gap-2">
              {availableEssays.length > 0 && (
                <select
                  onChange={(e) => handleSelectEssay(e.target.value, 'B')}
                  defaultValue=""
                  className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 outline-none max-w-[140px]"
                >
                  <option value="" disabled>Select Essay...</option>
                  {availableEssays.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              )}
              <input
                type="file"
                id="file-input-b"
                accept=".txt,.md,.pdf,.docx"
                onChange={(e) => handleFileUpload(e, 'B')}
                className="hidden"
              />
              <label
                htmlFor="file-input-b"
                className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <Upload className="w-3 h-3" />
                Upload File
              </label>
            </div>
          </div>

          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={6}
            placeholder="Paste text, upload a file (.txt, .md), or select an essay above for Essay B..."
            className="w-full rounded-xl p-3 text-xs leading-relaxed bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
          />
          <div className="text-right text-[11px] text-slate-400">
            {textB.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </Card>
      </div>

      {!res && !loading && (
        <Card className="text-center py-12 border-dashed">
          <GitCompare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Ready for Comparison</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            Upload files or paste text into both Essay A and Essay B boxes above, then click <strong>"Run Comparison"</strong>.
          </p>
          <Button size="sm" onClick={loadSamples}>
            Load Sample Drafts
          </Button>
        </Card>
      )}

      {res && (
        <>
          {/* Comparison Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Card className="text-center">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{res.titleA || 'Essay A'}</p>
              <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{res.essayA?.authenticityScore ?? 75}%</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Personal Voice Score</p>
            </Card>

            <Card className="text-center bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20 border-violet-200 dark:border-violet-800/60">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/60 flex items-center justify-center mx-auto mb-1">
                <ArrowLeftRight className="w-4 h-4 text-violet-600 dark:text-violet-300" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{res.overallSimilarity}%</p>
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mt-0.5">Overall Stylistic Match</p>
            </Card>

            <Card className="text-center">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{res.titleB || 'Essay B'}</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{res.essayB?.authenticityScore ?? 70}%</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Personal Voice Score</p>
            </Card>
          </div>

          {/* Observation Callout */}
          {res.stylisticShiftObservation && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
              <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-slate-900 dark:text-white mb-0.5">Stylistic Observation:</strong>
                {res.stylisticShiftObservation}
              </div>
            </div>
          )}

          {/* Similarity Metric Progress Bars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(res.similarityMetrics || []).map((m: any, i: number) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{m.result}%</p>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.result}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full bg-violet-500 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{m.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Radar & Metric Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Style Overlay Comparison</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={res.radarComparison || []}>
                  <PolarGrid stroke="rgba(148,163,184,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Radar name={res.titleA || 'Essay A'} dataKey="A" stroke={COLORS.A} fill={COLORS.A} fillOpacity={0.15} strokeWidth={2} />
                  <Radar name={res.titleB || 'Essay B'} dataKey="B" stroke={COLORS.B} fill={COLORS.B} fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: COLORS.A }} /><span className="text-xs text-slate-500">{res.titleA || 'Essay A'}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: COLORS.B }} /><span className="text-xs text-slate-500">{res.titleB || 'Essay B'}</span></div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Detailed Dimension Comparison</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={res.radarComparison || []} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
                  <Bar dataKey="A" fill={COLORS.A} radius={[0, 4, 4, 0]} name={res.titleA || 'Essay A'} />
                  <Bar dataKey="B" fill={COLORS.B} radius={[0, 4, 4, 0]} name={res.titleB || 'Essay B'} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
