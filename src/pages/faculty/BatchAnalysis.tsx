import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type FileStatus = 'pending' | 'processing' | 'completed' | 'failed';
interface UploadedFile { name: string; size: number; status: FileStatus; progress: number; id: string; }

function formatBytes(b: number) { return b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(1) + ' MB'; }

export default function BatchAnalysisPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const completed = files.filter(f => f.status === 'completed').length;
  const failed = files.filter(f => f.status === 'failed').length;
  const processing = files.filter(f => f.status === 'processing').length;

  const addFiles = useCallback((newFiles: File[]) => {
    const entries: UploadedFile[] = newFiles.map(f => ({ name: f.name, size: f.size, status: 'pending', progress: 0, id: Math.random().toString(36).slice(2) }));
    setFiles(prev => [...prev, ...entries]);
  }, []);

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); addFiles(Array.from(e.dataTransfer.files)); };
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) addFiles(Array.from(e.target.files)); };

  const startProcessing = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    for (let i = 0; i < files.length; i++) {
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'processing', progress: 0 } : f));
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
      const success = Math.random() > 0.15;
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: success ? 'completed' : 'failed', progress: 100 } : f));
    }
    setIsProcessing(false);
  };

  const statusIcon = (s: FileStatus) => {
    if (s === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (s === 'failed') return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (s === 'processing') return <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />;
    return <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />;
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Batch Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Upload multiple essays for simultaneous analysis</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'border-2 border-dashed rounded-2xl py-12 text-center transition-all',
          dragOver ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300'
        )}
      >
        <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Drop multiple essay files here</p>
        <p className="text-sm text-slate-400 mb-3">PDF, DOCX, TXT supported</p>
        <label>
          <span className="px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 border border-violet-300 dark:border-violet-700 rounded-xl cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
            Browse Files
          </span>
          <input type="file" multiple accept=".pdf,.docx,.txt" className="sr-only" onChange={onInput} />
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <>
          {/* Progress overview */}
          {isProcessing && (
            <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">Processing...</p>
                <p className="text-sm text-violet-600 dark:text-violet-400">{completed} / {files.length}</p>
              </div>
              <div className="h-2 bg-violet-100 dark:bg-violet-900 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(completed / files.length) * 100}%` }}
                  className="h-full bg-violet-600 dark:bg-violet-500 rounded-full"
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-violet-600 dark:text-violet-400">
                <span>✓ Completed: {completed}</span>
                <span>● Processing: {processing}</span>
                <span>✗ Failed: {failed}</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="font-semibold text-slate-900 dark:text-white">{files.length} files selected</p>
              <Button variant="ghost" size="sm" onClick={() => setFiles([])}>Clear all</Button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {files.map((f) => (
                  <motion.div key={f.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 px-5 py-3">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-slate-100 truncate">{f.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(f.size)}</p>
                    </div>
                    {statusIcon(f.status)}
                    {f.status === 'pending' && (
                      <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="text-slate-300 hover:text-rose-500">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <Button size="lg" className="w-full" loading={isProcessing} onClick={startProcessing} disabled={isProcessing}>
            {isProcessing ? 'Analyzing...' : `Analyze ${files.length} Essays`}
          </Button>
        </>
      )}
    </div>
  );
}
