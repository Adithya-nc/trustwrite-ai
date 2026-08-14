import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockEssays } from '@/mock';
import { RiskBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Download, Eye, FileText, Search } from 'lucide-react';
import { scoreToColor, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function FacultyReports() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleDownload = (essay: any) => {
    const reportText = `=======================================================
TRUSTWRITE AI — FACULTY ADMISSIONS REPORT
=======================================================
Report ID: FAC-REP-${essay.id.toUpperCase()}
Essay Title: ${essay.title}
Applicant Name: ${essay.studentName || 'Applicant'}
Submission Date: ${formatDate(essay.uploadedAt)}
Word Count: ${essay.wordCount || 450} words

ADMISSIONS STYLOMETRIC SCORES
-------------------------------------------------------
Personal Voice & Authenticity: ${essay.authenticityScore}/100
AI Pattern Signal: ${essay.aiProbability || (100 - essay.authenticityScore)}%
Assigned Risk Tier: ${essay.aiRisk.toUpperCase()}
Writing Quality Score: ${essay.writingQuality || 85}/100

STYLOMETRIC PROFILE
-------------------------------------------------------
Analysis completed across sentence-level burstiness, vocabulary diversity, and syntactic formality metrics.

RELIABILITY NOTICE
-------------------------------------------------------
Detection is probabilistic stylometry and should not be used as the sole determinant in admissions decisions.
=======================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty_report_${essay.id}_${essay.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Faculty report for "${essay.title}" downloaded!`);
  };

  const essays = mockEssays
    .filter(e => e.status === 'analyzed')
    .filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.studentName && e.studentName.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institutional Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Review, audit, and export applicant essay reports.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search essays or applicants..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {['Essay Title', 'Applicant', 'Personal Voice', 'Risk Tier', 'Submission Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {essays.map((essay, i) => (
                <motion.tr key={essay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{essay.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{essay.studentName}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-semibold ${scoreToColor(essay.authenticityScore)}`}>{essay.authenticityScore}%</span>
                  </td>
                  <td className="px-5 py-3.5"><RiskBadge risk={essay.aiRisk} /></td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{formatDate(essay.uploadedAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => navigate(`/faculty/essays/${essay.id}`)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
