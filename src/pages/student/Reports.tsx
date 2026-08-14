import { motion } from 'framer-motion';
import { Download, FileText, Eye } from 'lucide-react';
import { mockEssays } from '@/mock';
import { RiskBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, scoreToColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Generated Reports</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {['Essay', 'Authenticity', 'Risk', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockEssays.filter(e => e.studentId === 'u1' && e.status === 'analyzed').map((essay, i) => (
              <motion.tr key={essay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{essay.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`font-semibold text-sm ${scoreToColor(essay.authenticityScore)}`}>{essay.authenticityScore}%</span>
                </td>
                <td className="px-4 py-3.5"><RiskBadge risk={essay.aiRisk} /></td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{formatDate(essay.uploadedAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />} onClick={() => {}}>View</Button>
                    <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={() => toast.success('Report downloaded')}>Download</Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
