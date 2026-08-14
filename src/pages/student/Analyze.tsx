import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle2, ClipboardType, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEssayStore } from '@/store';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type Mode = 'upload' | 'paste';

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const MAX_SIZE_MB = 10;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function AnalyzePage() {
  const navigate = useNavigate();
  const { setUploadedFile, setPastedText } = useEssayStore();
  const [mode, setMode] = useState<Mode>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [text, setText] = useState('');
  const [textError, setTextError] = useState('');

  const validateFile = (f: File): string => {
    if (!ALLOWED_TYPES.includes(f.type) && !f.name.endsWith('.txt')) return 'Only PDF, DOCX, and TXT files are supported.';
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File size exceeds ${MAX_SIZE_MB}MB limit.`;
    return '';
  };

  const handleFileDrop = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) { setFileError(err); setFile(null); return; }
    setFileError('');
    setFile(f);
    setUploadedFile(f);
  }, [setUploadedFile]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileDrop(f);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileDrop(f);
  };

  const handleAnalyze = async () => {
    if (mode === 'upload' && !file) { setFileError('Please upload a file first.'); return; }
    if (mode === 'paste') {
      if (!text.trim()) { setTextError('Please paste or type your essay.'); return; }
      if (countWords(text) < 50) { setTextError('Essay must be at least 50 words.'); return; }
      setPastedText(text);
    }
    toast.loading('Preparing essay...', { id: 'analyze' });
    await new Promise(r => setTimeout(r, 500));
    toast.dismiss('analyze');
    navigate('/student/essays/e1'); // Navigate to mock analysis
  };

  const wordCount = countWords(text);
  const charCount = text.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Analyze an Essay</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Upload a file or paste your essay text to get started.</p>
      </motion.div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {([['upload', Upload, 'Upload File'], ['paste', ClipboardType, 'Paste Text']] as const).map(([m, Icon, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              mode === m ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'upload' ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Drag-drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                'relative border-2 border-dashed rounded-2xl transition-all duration-200 text-center',
                dragOver ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600',
                file ? 'py-6' : 'py-16',
              )}
            >
              {!file ? (
                <>
                  <motion.div
                    animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Drag and drop your essay here
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">or <label className="text-violet-600 dark:text-violet-400 cursor-pointer hover:underline">browse files <input type="file" className="sr-only" accept=".pdf,.docx,.txt" onChange={onFileInput} /></label></p>
                    </div>
                    <div className="flex gap-2">
                      {['PDF', 'DOCX', 'TXT'].map(t => (
                        <span key={t} className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">{t}</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Max {MAX_SIZE_MB}MB</p>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 px-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <button
                      onClick={() => { setFile(null); setUploadedFile(null); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            {fileError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-500 text-sm mt-2">
                <AlertCircle className="w-4 h-4" /> {fileError}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div key="paste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Textarea
              placeholder="Paste or type your essay here..."
              value={text}
              onChange={e => { setText(e.target.value); if (textError) setTextError(''); }}
              className="min-h-64 font-[Georgia,serif] text-[15px] leading-relaxed"
              error={textError}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              {wordCount > 0 && wordCount < 50 && (
                <p className="text-xs text-amber-500">Minimum 50 words required</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAnalyze}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        disabled={mode === 'upload' ? !file : wordCount < 50}
      >
        Analyze Essay
      </Button>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500">
        Your essay is analyzed securely. We do not store or share your content.
      </p>
    </div>
  );
}
