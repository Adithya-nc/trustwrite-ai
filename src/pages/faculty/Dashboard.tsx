import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { mockFacultyStats, mockFacultyStudents, mockDailyEssayData, mockRiskDistributionData } from '@/mock';
import { StatCard } from '@/components/ui/Card';
import { Card } from '@/components/ui/Card';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { scoreToColor, formatDate } from '@/lib/utils';

export default function FacultyDashboard() {
  const stats = mockFacultyStats;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Faculty Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor student submissions and essay authenticity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Essays" value={stats.totalEssays} icon={<FileText className="w-5 h-5" />} color="violet" index={0} />
        <StatCard title="Students" value={stats.totalStudents} icon={<Users className="w-5 h-5" />} color="slate" index={1} />
        <StatCard title="High Risk" value={stats.highRisk} subtitle="Flagged essays" icon={<AlertTriangle className="w-5 h-5" />} color="rose" index={2} />
        <StatCard title="Medium Risk" value={stats.mediumRisk} icon={<Activity className="w-5 h-5" />} color="amber" index={3} />
        <StatCard title="Low Risk" value={stats.lowRisk} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" index={4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Daily Essay Submissions</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mockDailyEssayData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
                <Bar dataKey="essays" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={mockRiskDistributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {mockRiskDistributionData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {mockRiskDistributionData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: d.color }} /><span className="text-slate-500">{d.name}</span></div>
                <span className="font-semibold text-slate-900 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Students table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Student', 'Essay', 'Authenticity', 'Risk', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockFacultyStudents.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 max-w-[180px]">
                    <p className="truncate">{s.latestEssay}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`font-semibold text-sm ${scoreToColor(s.latestAuthenticity)}`}>{s.latestAuthenticity}%</span>
                  </td>
                  <td className="px-4 py-3.5"><RiskBadge risk={s.latestRisk} /></td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{s.submittedAt}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
