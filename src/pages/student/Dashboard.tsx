import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileSearch, FileText, BarChart3, TrendingUp, Search, ArrowRight, Eye, SortAsc } from 'lucide-react';
import { useAuthStore } from '@/store';
import { mockEssays, mockStudentStats } from '@/mock';
import { StatCard } from '@/components/ui/Card';
import { Badge, RiskBadge, StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, scoreToColor } from '@/lib/utils';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'risk'>('date');

  const myEssays = mockEssays.filter(e => e.studentId === 'u1');

  const filtered = myEssays
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sortBy === 'score') return b.authenticityScore - a.authenticityScore;
      if (sortBy === 'risk') {
        const riskOrder = { high: 0, medium: 1, low: 2 };
        return riskOrder[a.aiRisk] - riskOrder[b.aiRisk];
      }
      return 0;
    });

  const stats = mockStudentStats;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Welcome back 👋</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{firstName}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analyze your essay and understand your writing patterns.
          </p>
        </div>
        <Button onClick={() => navigate('/student/analyze')} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Analyze New Essay
        </Button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Essays Analyzed"
          value={stats.essaysAnalyzed}
          subtitle="All time"
          icon={<FileText className="w-5 h-5" />}
          color="violet"
          index={0}
        />
        <StatCard
          title="Avg. Authenticity"
          value={`${stats.averageAuthenticity}%`}
          subtitle="Across all essays"
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          index={1}
        />
        <StatCard
          title="AI Flagged Sections"
          value={stats.flaggedSections}
          subtitle="Sections detected"
          icon={<BarChart3 className="w-5 h-5" />}
          color="amber"
          index={2}
        />
        <StatCard
          title="Writing Score"
          value={`${stats.writingScore}/100`}
          subtitle="Quality assessment"
          icon={<FileSearch className="w-5 h-5" />}
          color="slate"
          index={3}
        />
      </div>

      {/* Essays Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Essays</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search essays..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="risk">Sort by Risk</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Essay Title', 'Authenticity', 'AI Risk', 'Date', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((essay, i) => (
                <motion.tr
                  key={essay.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {essay.title}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{essay.wordCount} words</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold ${scoreToColor(essay.authenticityScore)}`}>
                      {essay.authenticityScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <RiskBadge risk={essay.aiRisk} />
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(essay.uploadedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={essay.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/student/essays/${essay.id}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            No essays match your search.
          </div>
        )}
      </div>
    </div>
  );
}
