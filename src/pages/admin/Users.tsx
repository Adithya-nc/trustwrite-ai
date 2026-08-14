import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockUsers } from '@/mock';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { UserPlus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { getAdminUsers } from '@/services/api';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [usersList, setUsersList] = useState<any[]>(mockUsers);

  useEffect(() => {
    getAdminUsers()
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setUsersList(data);
        }
      })
      .catch(err => {
        console.warn('Backend admin users fallback:', err);
      });
  }, []);

  const filtered = usersList.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage student, faculty, and administrator accounts</p>
        </div>
        <Button leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => toast.success('Invitation link sent to user email')}>Invite User</Button>
      </div>

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              {['User', 'Role', 'Institution', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((user, i) => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={user.role === 'admin' ? 'info' : user.role === 'faculty' ? 'warning' : 'default'} className="capitalize">
                    {user.role}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{user.institution || '—'}</td>
                <td className="px-5 py-3.5 text-xs text-slate-400">{formatDate(user.createdAt)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Edited ${user.name}`)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600" onClick={() => toast.error(`Suspended account ${user.name}`)}>Suspend</Button>
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
