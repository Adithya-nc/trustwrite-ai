import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, FileText } from 'lucide-react';
import { mockEssays } from '@/mock';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, scoreToColor } from '@/lib/utils';

export default function EssaysPage() {
  const navigate = useNavigate();
  const essays = mockEssays.filter(e => e.studentId === 'u1');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">My Essays</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{essays.length} essays analyzed</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {essays.map((essay, i) => (
          <motion.div
            key={essay.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(`/student/essays/${essay.id}`)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <StatusBadge status={essay.status} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-sm mb-1 leading-snug">
              {essay.title}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{essay.wordCount} words · {formatDate(essay.uploadedAt)}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black ${scoreToColor(essay.authenticityScore)}`}>{essay.authenticityScore}%</span>
                <span className="text-xs text-slate-400">authentic</span>
              </div>
              <RiskBadge risk={essay.aiRisk} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
