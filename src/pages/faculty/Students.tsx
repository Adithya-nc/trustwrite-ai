import { useNavigate } from 'react-router-dom';
import { mockFacultyStudents } from '@/mock';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { scoreToColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function FacultyStudents() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Student Submissions</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Faculty view for assigned student essays and authenticity status</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                {['Student', 'Latest Essay', 'Personal Voice', 'Risk Tier', 'Submitted', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockFacultyStudents.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{s.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.essayCount} essays</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400 max-w-[180px]"><p className="truncate">{s.latestEssay}</p></td>
                  <td className="px-5 py-3.5"><span className={`font-bold text-sm ${scoreToColor(s.latestAuthenticity)}`}>{s.latestAuthenticity}%</span></td>
                  <td className="px-5 py-3.5"><RiskBadge risk={s.latestRisk} /></td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{s.submittedAt}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/faculty/essays/e1`)}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.success(`Generated report for ${s.name}`)}>Report</Button>
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
