import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, CheckCircle2, Search, Filter } from 'lucide-react';
import { mockEssays } from '@/mock';
import { RiskBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, scoreToColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [essaysList, setEssaysList] = useState<any[]>([]);

  useEffect(() => {
    // Collect base analyzed essays
    const base = mockEssays.filter(e => e.studentId === 'u1' && e.status === 'analyzed');
    
    // Check if any recent session analysis was saved
    try {
      const recent = sessionStorage.getItem('recent_analyzed_essays');
      if (recent) {
        const parsed = JSON.parse(recent);
        if (Array.isArray(parsed)) {
          // Merge avoiding duplicates by id
          const existingIds = new Set(base.map(b => b.id));
          const additions = parsed.filter(p => !existingIds.has(p.id));
          setEssaysList([...additions, ...base]);
          return;
        }
      }
    } catch {}

    setEssaysList(base);
  }, []);

  const handleDownload = (essay: any) => {
    const reportText = `=======================================================
TRUSTWRITE AI — ESSAY ANALYSIS REPORT
=======================================================
Report ID: REP-${essay.id.toUpperCase()}
Title: ${essay.title}
Student: ${essay.studentName || 'Student'}
Submission Date: ${formatDate(essay.uploadedAt)}
Word Count: ${essay.wordCount || 450} words

EVALUATION SCORES
-------------------------------------------------------
Personal Voice & Authenticity: ${essay.authenticityScore}/100
AI Pattern Signal: ${essay.aiProbability || (100 - essay.authenticityScore)}%
Assigned Risk Level: ${essay.aiRisk.toUpperCase()}
Overall Quality: ${essay.writingQuality || 85}/100

EXPLAINABILITY SUMMARY
-------------------------------------------------------
The essay was evaluated across 20+ stylometric dimensions including sentence length variation (burstiness), vocabulary diversity, and transition word frequencies. 

RELIABILITY NOTICE
-------------------------------------------------------
Detection is probabilistic stylometry and should not be treated as proof of AI authorship.
=======================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${essay.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Report for "${essay.title}" downloaded!`);
  };

  const filteredEssays = essaysList.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            View, review, and download official stylometric analysis reports.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
            Available Reports ({filteredEssays.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {['Essay Title', 'Personal Voice', 'Risk Level', 'Date Analyzed', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEssays.length > 0 ? (
                filteredEssays.map((essay, i) => (
                  <motion.tr
                    key={essay.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{essay.title}</p>
                          <p className="text-[11px] text-slate-400">{essay.wordCount || 450} words</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-bold text-sm ${scoreToColor(essay.authenticityScore)}`}>
                        {essay.authenticityScore}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <RiskBadge risk={essay.aiRisk} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(essay.uploadedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/student/essays/${essay.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                          onClick={() => handleDownload(essay)}
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                    No matching reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
