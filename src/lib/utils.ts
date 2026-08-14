import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'low': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50';
    case 'medium': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50';
    case 'high': return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50';
  }
}

export function getSentenceColor(label: 'human' | 'uncertain' | 'ai') {
  switch (label) {
    case 'human': return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-300 dark:border-emerald-700',
      highlight: 'bg-emerald-100 dark:bg-emerald-900/50',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-400',
      label: 'Likely Human',
    };
    case 'uncertain': return {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-300 dark:border-amber-700',
      highlight: 'bg-amber-100 dark:bg-amber-900/50',
      dot: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-400',
      label: 'Uncertain',
    };
    case 'ai': return {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-300 dark:border-rose-700',
      highlight: 'bg-rose-100 dark:bg-rose-900/50',
      dot: 'bg-rose-500',
      text: 'text-rose-700 dark:text-rose-400',
      label: 'Likely AI',
    };
  }
}

export function scoreToLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Needs Work';
}

export function scoreToColor(score: number): string {
  if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 70) return 'text-indigo-600 dark:text-indigo-400';
  if (score >= 55) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
