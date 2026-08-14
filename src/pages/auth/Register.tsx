import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, GraduationCap, BookOpen, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore, getRoleDefaultPath } from '@/store';
import { User as UserType, UserRole } from '@/types';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'faculty', 'admin']),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const roles: { value: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'student', label: 'Student', desc: 'Analyze and improve your essays', icon: GraduationCap },
  { value: 'faculty', label: 'Faculty', desc: 'Review and manage student essays', icon: BookOpen },
  { value: 'admin', label: 'Admin', desc: 'Full system access and management', icon: Shield },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1200));
    const newUser: UserType = {
      id: 'new-' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role,
      institution: 'Your University',
      createdAt: new Date().toISOString(),
    };
    login(newUser, 'mock-jwt-new-user');
    toast.success(`Welcome to TrustWrite AI, ${data.name.split(' ')[0]}!`);
    navigate(getRoleDefaultPath(data.role));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">TrustWrite AI</span>
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create your account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Join TrustWrite AI — free to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@university.edu"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, desc, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setSelectedRole(value); setValue('role', value); }}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all',
                      selectedRole === value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 mb-1.5', selectedRole === value ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400')} />
                    <p className={cn('text-xs font-semibold', selectedRole === value ? 'text-violet-700 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300')}>{label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
