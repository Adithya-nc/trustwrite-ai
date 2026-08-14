import { mockAuditLogs } from '@/mock';
import { formatDateTime } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

const actionColors: Record<string, 'success' | 'danger' | 'info' | 'warning' | 'default'> = {
  USER_CREATED: 'success',
  ESSAY_ANALYZED: 'info',
  REPORT_DOWNLOADED: 'default',
  ESSAY_UPLOADED: 'info',
  USER_ROLE_CHANGED: 'warning',
  BATCH_ANALYSIS_STARTED: 'info',
};

export default function AuditLogs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['User', 'Action', 'Resource', 'Timestamp', 'IP'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
              {mockAuditLogs.map((log, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-slate-100">{log.userName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={actionColors[log.action] || 'default'}>{log.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.resource}</td>
                  <td className="px-4 py-3 text-slate-400 font-sans">{formatDateTime(log.timestamp)}</td>
                  <td className="px-4 py-3 text-slate-400">{log.ipAddress}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
