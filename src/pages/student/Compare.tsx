import { useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ArrowLeftRight } from 'lucide-react';
import { mockEssays } from '@/mock';
import { Card } from '@/components/ui/Card';

const essayA = { ...mockEssays[0], metrics: { vocabulary: 84, sentenceStyle: 72, writingConsistency: 69, overall: 75 } };
const essayB = { ...mockEssays[4], metrics: { vocabulary: 71, sentenceStyle: 68, writingConsistency: 74, overall: 71 } };

const radarA = [
  { subject: 'Vocabulary', A: 84, B: 71 },
  { subject: 'Sentence Style', A: 72, B: 68 },
  { subject: 'Consistency', A: 69, B: 74 },
  { subject: 'Authenticity', A: 87, B: 63 },
  { subject: 'Originality', A: 88, B: 71 },
];

const COLORS = { A: '#8b5cf6', B: '#10b981' };

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Compare Essays</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Analyze stylistic similarities between your essays</p>
      </div>

      {/* Essay headers */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <Card className="text-center">
          <p className="text-xs text-slate-400 mb-1">Essay A</p>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{essayA.title}</p>
          <p className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-2">{essayA.authenticityScore}%</p>
          <p className="text-xs text-slate-400">authenticity</p>
        </Card>
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-slate-500" />
          </div>
        </div>
        <Card className="text-center">
          <p className="text-xs text-slate-400 mb-1">Essay B</p>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{essayB.title}</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{essayB.authenticityScore}%</p>
          <p className="text-xs text-slate-400">authenticity</p>
        </Card>
      </div>

      {/* Similarity metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vocabulary Similarity', a: 84, b: 71, result: 75 },
          { label: 'Sentence Style', a: 72, b: 68, result: 68 },
          { label: 'Writing Consistency', a: 69, b: 74, result: 71 },
          { label: 'Overall Similarity', a: 87, b: 63, result: 73 },
        ].map(({ label, result }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{result}%</p>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full bg-violet-500 rounded-full"
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Radar comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Style Comparison</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarA}>
              <PolarGrid stroke="rgba(148,163,184,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Radar name="Essay A" dataKey="A" stroke={COLORS.A} fill={COLORS.A} fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Essay B" dataKey="B" stroke={COLORS.B} fill={COLORS.B} fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: COLORS.A }} /><span className="text-xs text-slate-500">Essay A</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: COLORS.B }} /><span className="text-xs text-slate-500">Essay B</span></div>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Metric Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={radarA} layout="vertical" margin={{ left: 60, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
              <Bar dataKey="A" fill={COLORS.A} radius={[0, 4, 4, 0]} name="Essay A" />
              <Bar dataKey="B" fill={COLORS.B} radius={[0, 4, 4, 0]} name="Essay B" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
