// ─── User & Auth Types ──────────────────────────────────────────────────────

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Essay Types ─────────────────────────────────────────────────────────────

export type EssayStatus = 'pending' | 'processing' | 'analyzed' | 'failed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Essay {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  uploadedAt: string;
  status: EssayStatus;
  authenticityScore: number;
  aiRisk: RiskLevel;
  studentId: string;
  studentName?: string;
}

// ─── Sentence Analysis ───────────────────────────────────────────────────────

export type SentenceLabel = 'human' | 'uncertain' | 'ai';

export interface SentencePattern {
  name: string;
  description?: string;
}

export interface SentenceAnalysis {
  id: string;
  index: number;
  text: string;
  label: SentenceLabel;
  aiProbability: number;
  confidence: 'low' | 'medium' | 'high';
  patterns: SentencePattern[];
  explanation: string;
  suggestion?: string;
  paragraphIndex: number;
}

// ─── Writing Metrics ─────────────────────────────────────────────────────────

export interface WritingMetrics {
  vocabularyDiversity: number;     // 0–100
  sentenceVariation: number;       // 0–100
  sentenceComplexity: number;      // 0–100
  readability: number;             // 0–100
  grammar: number;                 // 0–100
  passiveVoice: number;            // 0–100 (lower = more passive)
  emotionalTone: number;           // 0–100
  vocabularyRichness: number;      // 0–100
  writingConsistency: number;      // 0–100
}

// ─── Writing Fingerprint ─────────────────────────────────────────────────────

export interface WritingFingerprint {
  vocabulary: number;
  sentenceRhythm: number;
  complexity: number;
  punctuation: number;
  formality: number;
  uniqueness: number;
}

// ─── Essay Analysis ──────────────────────────────────────────────────────────

export interface ParagraphRisk {
  paragraphIndex: number;
  label: string;
  aiProbability: number;
}

export interface EssayAnalysis {
  essayId: string;
  authenticityScore: number;      // 0–100
  aiProbability: number;          // 0–100
  confidence: 'low' | 'medium' | 'high';
  classification: string;          // e.g. "Likely Human", "Likely AI"
  writingQuality: number;          // 0–100
  originality: number;             // 0–100
  sentences: SentenceAnalysis[];
  metrics: WritingMetrics;
  fingerprint: WritingFingerprint;
  paragraphRisks: ParagraphRisk[];
  improvements: Improvement[];
  analyzedAt: string;
}

// ─── Improvements ────────────────────────────────────────────────────────────

export type ImprovementCategory =
  | 'vocabulary'
  | 'sentence-structure'
  | 'readability'
  | 'authenticity';

export interface Improvement {
  id: string;
  category: ImprovementCategory;
  issue: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface StudentDashboardStats {
  essaysAnalyzed: number;
  averageAuthenticity: number;
  flaggedSections: number;
  writingScore: number;
}

export interface FacultyDashboardStats {
  totalEssays: number;
  totalStudents: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalEssays: number;
  totalStudents: number;
  totalFaculty: number;
  reportsGenerated: number;
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  essayId: string;
  essayTitle: string;
  studentName: string;
  generatedAt: string;
  authenticityScore: number;
  aiRisk: RiskLevel;
  summary: string;
  analysis: EssayAnalysis;
}

// ─── Essay Comparison ────────────────────────────────────────────────────────

export interface ComparisonResult {
  essayAId: string;
  essayBId: string;
  vocabularySimilarity: number;
  sentenceStyleSimilarity: number;
  writingConsistency: number;
  overallSimilarity: number;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
}

// ─── Chart Data ──────────────────────────────────────────────────────────────

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface LineDataPoint {
  name: string;
  value: number;
}
