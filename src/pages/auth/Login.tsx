import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore, useThemeStore, getRoleDefaultPath } from '@/store';
import { mockUsers } from '@/mock';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Moon, Sun } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      toast.error('No account found with that email.');
      return;
    }
    login(user, 'mock-jwt-token-' + user.id);
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    navigate(getRoleDefaultPath(user.role));
  };

  // Quick demo logins
  const demoLogin = async (role: 'student' | 'faculty' | 'admin') => {
    const user = mockUsers.find(u => u.role === role)!;
    login(user, 'mock-jwt-token-' + user.id);
    toast.success(`Logged in as ${user.name}`);
    navigate(getRoleDefaultPath(role));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[44%] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=0.05%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <div className="relative z-10 flex items-center gap-2.5 mb-auto">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-white font-bold text-lg">TrustWrite AI</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Explainable AI detection for academic integrity.
          </h1>
          <p className="text-violet-200 text-sm leading-relaxed mb-8">
            The only platform that tells you not just <em>if</em> an essay was AI-assisted,
            but exactly <em>where</em> and <em>why</em> — with actionable explanations.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Detection Accuracy', value: '99.2%' },
              { label: 'Universities', value: '50+' },
              { label: 'Essays Analyzed', value: '124K+' },
              { label: 'Analysis Time', value: '< 30s' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <p className="text-white text-xl font-bold">{value}</p>
                <p className="text-violet-200 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to your TrustWrite AI account</p>
            </div>

            {/* Demo login buttons */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">⚡ Quick Demo Login</p>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'faculty', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => demoLogin(role)}
                    className="px-3 py-2 rounded-lg text-xs font-medium capitalize bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <div className="relative flex justify-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 px-3">or sign in with email</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@university.edu"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link to="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">Create one</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
