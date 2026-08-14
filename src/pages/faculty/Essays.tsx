import { useNavigate } from 'react-router-dom';
import { mockEssays } from '@/mock';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import { scoreToColor, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function FacultyEssays() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Submissions</h1>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {['Essay Title', 'Student', 'Personal Voice', 'Risk Tier', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockEssays.map((essay, i) => (
                <motion.tr key={essay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 max-w-[200px]"><p className="truncate">{essay.title}</p></td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400">{essay.studentName}</td>
                  <td className="px-5 py-3.5"><span className={`font-bold text-sm ${scoreToColor(essay.authenticityScore)}`}>{essay.authenticityScore}%</span></td>
                  <td className="px-5 py-3.5"><RiskBadge risk={essay.aiRisk} /></td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{formatDate(essay.uploadedAt)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={essay.status} /></td>
                  <td className="px-5 py-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/faculty/essays/${essay.id}`)}
                    >
                      View
                    </Button>
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
