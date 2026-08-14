import { mockEssays } from '@/mock';
import { RiskBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { scoreToColor, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function FacultyReports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Essay', 'Student', 'Authenticity', 'Risk', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockEssays.filter(e => e.status === 'analyzed').map((essay, i) => (
                <motion.tr key={essay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100">{essay.title}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">{essay.studentName}</td>
                  <td className="px-4 py-3.5"><span className={`font-semibold ${scoreToColor(essay.authenticityScore)}`}>{essay.authenticityScore}%</span></td>
                  <td className="px-4 py-3.5"><RiskBadge risk={essay.aiRisk} /></td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(essay.uploadedAt)}</td>
                  <td className="px-4 py-3.5">
                    <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={() => toast.success('Report downloaded')}>Download</Button>
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
