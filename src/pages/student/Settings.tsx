import { useAuthStore } from '@/store';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <Card>
        <h2 className="font-semibold text-slate-900 dark:text-white mb-5">Profile Information</h2>
        <div className="space-y-4">
          <Input label="Full Name" defaultValue={user?.name} leftIcon={<User size={16} />} />
          <Input label="Email" defaultValue={user?.email} leftIcon={<Mail size={16} />} />
          <Input label="Institution" defaultValue={user?.institution || ''} leftIcon={<Building2 size={16} />} />
          <Button onClick={() => toast.success('Profile updated')}>Save Changes</Button>
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-slate-900 dark:text-white mb-5">Security</h2>
        <div className="space-y-4">
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <Input label="New Password" type="password" placeholder="••••••••" />
          <Button onClick={() => toast.success('Password updated')}>Update Password</Button>
        </div>
      </Card>
    </div>
  );
}
