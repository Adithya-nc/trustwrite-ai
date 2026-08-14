import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      {
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300': variant === 'default',
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400': variant === 'success',
        'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400': variant === 'warning',
        'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400': variant === 'danger',
        'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400': variant === 'info',
        'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-transparent': variant === 'outline',
      },
      className
    )}>
      {children}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const config = {
    low: { label: 'Low Risk', variant: 'success' as const },
    medium: { label: 'Medium Risk', variant: 'warning' as const },
    high: { label: 'High Risk', variant: 'danger' as const },
  };
  const { label, variant } = config[risk];
  return (
    <Badge variant={variant}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        risk === 'low' && 'bg-emerald-500',
        risk === 'medium' && 'bg-amber-500',
        risk === 'high' && 'bg-rose-500',
      )} />
      {label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    analyzed: { label: 'Analyzed', variant: 'success' },
    pending: { label: 'Pending', variant: 'warning' },
    processing: { label: 'Processing', variant: 'info' },
    failed: { label: 'Failed', variant: 'danger' },
    reviewed: { label: 'Reviewed', variant: 'success' },
    flagged: { label: 'Flagged', variant: 'danger' },
  };
  const cfg = config[status] || { label: status, variant: 'default' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
