import { mockFacultyStudents } from '@/mock';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { scoreToColor } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function FacultyStudents() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Student', 'Latest Essay', 'Authenticity', 'Risk', 'Submitted', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockFacultyStudents.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{s.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.essayCount} essays</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 max-w-[160px]"><p className="truncate">{s.latestEssay}</p></td>
                  <td className="px-4 py-3.5"><span className={`font-semibold text-sm ${scoreToColor(s.latestAuthenticity)}`}>{s.latestAuthenticity}%</span></td>
                  <td className="px-4 py-3.5"><RiskBadge risk={s.latestRisk} /></td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{s.submittedAt}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Report</Button>
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
