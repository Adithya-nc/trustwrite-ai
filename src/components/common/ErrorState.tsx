import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, FileX, Lock, RefreshCw } from 'lucide-react';

type ErrorType =
  | 'api-unavailable'
  | 'analysis-failed'
  | 'no-essays'
  | 'permission-denied'
  | 'file-invalid'
  | 'session-expired'
  | 'generic';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

const presets: Record<ErrorType, { icon: React.ElementType; title: string; message: string; color: string }> = {
  'api-unavailable': {
    icon: WifiOff,
    title: 'Unable to connect to server',
    message: 'The TrustWrite AI service is currently unavailable. Please check your connection and try again.',
    color: 'text-amber-500',
  },
  'analysis-failed': {
    icon: AlertTriangle,
    title: 'Analysis failed',
    message: 'Something went wrong while analyzing this essay. Please try again or upload a different file.',
    color: 'text-rose-500',
  },
  'no-essays': {
    icon: FileX,
    title: 'No essays found',
    message: "You haven't uploaded any essays yet. Start by analyzing your first essay.",
    color: 'text-slate-400',
  },
  'permission-denied': {
    icon: Lock,
    title: 'Access denied',
    message: "You don't have permission to view this resource.",
    color: 'text-rose-500',
  },
  'file-invalid': {
    icon: FileX,
    title: 'Invalid file',
    message: 'The uploaded file could not be processed. Please upload a PDF, DOCX, or TXT file.',
    color: 'text-amber-500',
  },
  'session-expired': {
    icon: Lock,
    title: 'Session expired',
    message: 'Your session has expired. Please log in again to continue.',
    color: 'text-violet-500',
  },
  'generic': {
    icon: AlertTriangle,
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    color: 'text-rose-500',
  },
};

export default function ErrorState({ type = 'generic', title, message, action }: ErrorStateProps) {
  const preset = presets[type];
  const Icon = preset.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className={`w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${preset.color}`} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title || preset.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-6">
        {message || preset.message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
