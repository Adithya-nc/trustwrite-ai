import {
  EssayAnalysis,
  Essay,
  User,
  StudentDashboardStats,
  FacultyDashboardStats,
  AdminDashboardStats,
  Report,
  AuditLog,
} from '../types';

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@university.edu',
    role: 'student',
    institution: 'Stanford University',
    createdAt: '2024-08-01T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'Dr. Sarah Mitchell',
    email: 'smitchell@university.edu',
    role: 'faculty',
    institution: 'Stanford University',
    createdAt: '2023-01-15T09:00:00Z',
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@trustwrite.ai',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'u4',
    name: 'Jamie Rivera',
    email: 'jrivera@university.edu',
    role: 'student',
    institution: 'MIT',
    createdAt: '2024-08-05T11:30:00Z',
  },
  {
    id: 'u5',
    name: 'Casey Thompson',
    email: 'cthompson@university.edu',
    role: 'student',
    institution: 'Harvard University',
    createdAt: '2024-07-20T14:00:00Z',
  },
];

// ─── Sample Essay Content ─────────────────────────────────────────────────────

export const SAMPLE_ESSAY_CONTENT = `I have always been fascinated by the way computers solve problems. Growing up, I spent hours tinkering with broken electronics in my garage, trying to understand why they worked the way they did. My curiosity eventually led me to write my first program at age fourteen—a simple calculator that could add, subtract, multiply, and divide.

In today's rapidly evolving technological landscape, the intersection of artificial intelligence and software engineering presents unprecedented opportunities for innovation and advancement. The integration of machine learning algorithms into modern applications has fundamentally transformed how we approach complex computational challenges.

During my second semester, I built a small web application to help my school track library book loans. It was clunky at first—full of bugs I didn't understand—but fixing each one felt like solving a puzzle. I remember staying up past midnight trying to figure out why my database queries were returning duplicate records. When I finally found the off-by-one error, I jumped out of my chair.

Furthermore, it is essential to acknowledge that the proliferation of data-driven methodologies has significantly impacted various sectors of the economy, enabling organizations to leverage insights derived from large-scale analytics platforms.

My grandfather was a mechanical engineer who built bridges. Every summer, he would walk me through his old blueprints and explain how tension and compression worked. I didn't fully understand the math then, but I understood that he was solving a problem that mattered—that people would cross his bridges safely. That's what I want to do with software.

The opportunity to contribute to a forward-thinking institution such as yours, which has consistently demonstrated leadership in technological innovation and research excellence, represents a pivotal milestone in my academic journey.

Last year, I interned at a local healthcare startup where I helped migrate their patient records system to a cloud-based platform. I made mistakes—I accidentally overwrote a configuration file and caused a two-hour outage on a Saturday. I was terrified. But the team lead, instead of reprimanding me, sat with me and we debugged the issue together. That moment taught me more about professional responsibility than any textbook.`;

// ─── Mock Essays ─────────────────────────────────────────────────────────────

export const mockEssays: Essay[] = [
  {
    id: 'e1',
    title: 'My Journey into Computer Science',
    content: SAMPLE_ESSAY_CONTENT,
    wordCount: 487,
    uploadedAt: '2024-11-20T14:30:00Z',
    status: 'analyzed',
    authenticityScore: 87,
    aiRisk: 'low',
    studentId: 'u1',
    studentName: 'Alex Johnson',
  },
  {
    id: 'e2',
    title: 'Why I Chose Engineering',
    content: '',
    wordCount: 523,
    uploadedAt: '2024-11-18T10:00:00Z',
    status: 'analyzed',
    authenticityScore: 54,
    aiRisk: 'high',
    studentId: 'u1',
    studentName: 'Alex Johnson',
  },
  {
    id: 'e3',
    title: 'Leadership Through Adversity',
    content: '',
    wordCount: 412,
    uploadedAt: '2024-11-15T16:45:00Z',
    status: 'analyzed',
    authenticityScore: 72,
    aiRisk: 'medium',
    studentId: 'u1',
    studentName: 'Alex Johnson',
  },
  {
    id: 'e4',
    title: 'Community Service and Growth',
    content: '',
    wordCount: 398,
    uploadedAt: '2024-11-10T09:20:00Z',
    status: 'analyzed',
    authenticityScore: 91,
    aiRisk: 'low',
    studentId: 'u1',
    studentName: 'Alex Johnson',
  },
  {
    id: 'e5',
    title: 'My Passion for Research',
    content: '',
    wordCount: 445,
    uploadedAt: '2024-11-05T13:00:00Z',
    status: 'analyzed',
    authenticityScore: 63,
    aiRisk: 'medium',
    studentId: 'u1',
    studentName: 'Alex Johnson',
  },
  // Faculty-visible student essays
  {
    id: 'e6',
    title: 'Why I Want to Study Medicine',
    content: '',
    wordCount: 502,
    uploadedAt: '2024-11-19T11:00:00Z',
    status: 'analyzed',
    authenticityScore: 48,
    aiRisk: 'high',
    studentId: 'u4',
    studentName: 'Jamie Rivera',
  },
  {
    id: 'e7',
    title: 'Environmental Science and My Future',
    content: '',
    wordCount: 467,
    uploadedAt: '2024-11-17T15:30:00Z',
    status: 'analyzed',
    authenticityScore: 79,
    aiRisk: 'low',
    studentId: 'u5',
    studentName: 'Casey Thompson',
  },
];





// ─── Mock Analysis ────────────────────────────────────────────────────────────

export const mockAnalysis: EssayAnalysis = {
  essayId: 'e1',
  authenticityScore: 87,
  aiProbability: 23,
  confidence: 'high',
  classification: 'Likely Human',
  writingQuality: 91,
  originality: 88,
  analyzedAt: '2024-11-20T14:35:00Z',
  sentences: [
    {
      id: 's1',
      index: 0,
      text: 'I have always been fascinated by the way computers solve problems.',
      label: 'human',
      aiProbability: 12,
      confidence: 'high',
      patterns: [],
      explanation: 'This sentence has strong personal voice and shows genuine curiosity. The phrasing is direct and emotionally resonant.',
      paragraphIndex: 0,
    },
    {
      id: 's2',
      index: 1,
      text: 'Growing up, I spent hours tinkering with broken electronics in my garage, trying to understand why they worked the way they did.',
      label: 'human',
      aiProbability: 8,
      confidence: 'high',
      patterns: [],
      explanation: 'Specific autobiographical detail with sensory language. Highly characteristic of authentic personal writing.',
      paragraphIndex: 0,
    },
    {
      id: 's3',
      index: 2,
      text: 'My curiosity eventually led me to write my first program at age fourteen—a simple calculator that could add, subtract, multiply, and divide.',
      label: 'human',
      aiProbability: 15,
      confidence: 'high',
      patterns: [],
      explanation: 'Concrete memory with specific age and detail. The em-dash usage is idiosyncratic and personal.',
      paragraphIndex: 0,
    },
    {
      id: 's4',
      index: 3,
      text: "In today's rapidly evolving technological landscape, the intersection of artificial intelligence and software engineering presents unprecedented opportunities for innovation and advancement.",
      label: 'ai',
      aiProbability: 94,
      confidence: 'high',
      patterns: [
        { name: 'Generic opening phrase', description: '"rapidly evolving technological landscape" is a heavily overused AI phrase' },
        { name: 'Formal lexical choices', description: 'Words like "unprecedented", "intersection", "advancement" cluster in AI text' },
        { name: 'Impersonal voice shift', description: 'Sudden shift from personal narrative to impersonal abstract language' },
        { name: 'Uniform sentence rhythm', description: 'Sentence has a perfectly balanced cadence typical of generated text' },
      ],
      explanation: 'This sentence exhibits multiple high-confidence AI patterns. The opening phrase "rapidly evolving technological landscape" appears in thousands of AI-generated essays. The shift from personal narrative to abstract corporate-sounding language is a significant red flag.',
      suggestion: 'Replace with a personal observation or transition that connects your specific experience to the broader field.',
      paragraphIndex: 1,
    },
    {
      id: 's5',
      index: 4,
      text: 'The integration of machine learning algorithms into modern applications has fundamentally transformed how we approach complex computational challenges.',
      label: 'ai',
      aiProbability: 89,
      confidence: 'high',
      patterns: [
        { name: 'Predictable sentence structure', description: 'Subject–verb–object structure with maximum-impact words' },
        { name: 'Generic vocabulary', description: '"fundamentally transformed", "complex computational challenges" are AI clichés' },
        { name: 'No personal anchor', description: 'No first-person perspective or personal experience anchoring the claim' },
      ],
      explanation: 'This sentence continues the AI-generated paragraph. "Fundamentally transformed" paired with "complex computational challenges" is a hallmark pattern of AI writing. The sentence makes a broad claim without any personal connection.',
      suggestion: 'Connect this idea to a specific project or experience you had.',
      paragraphIndex: 1,
    },
    {
      id: 's6',
      index: 5,
      text: 'During my second semester, I built a small web application to help my school track library book loans.',
      label: 'human',
      aiProbability: 11,
      confidence: 'high',
      patterns: [],
      explanation: 'Specific, grounded, personal. The level of concrete detail (specific semester, specific purpose) is strongly human.',
      paragraphIndex: 2,
    },
    {
      id: 's7',
      index: 6,
      text: "It was clunky at first—full of bugs I didn't understand—but fixing each one felt like solving a puzzle.",
      label: 'human',
      aiProbability: 9,
      confidence: 'high',
      patterns: [],
      explanation: 'Honest self-deprecating language and specific simile. The admission of failure is a strong authenticity signal.',
      paragraphIndex: 2,
    },
    {
      id: 's8',
      index: 7,
      text: "I remember staying up past midnight trying to figure out why my database queries were returning duplicate records.",
      label: 'human',
      aiProbability: 7,
      confidence: 'high',
      patterns: [],
      explanation: 'Highly specific technical memory. "Duplicate records" is a very precise detail unlikely to appear in AI-generated essays about passion.',
      paragraphIndex: 2,
    },
    {
      id: 's9',
      index: 8,
      text: 'When I finally found the off-by-one error, I jumped out of my chair.',
      label: 'human',
      aiProbability: 5,
      confidence: 'high',
      patterns: [],
      explanation: 'Vivid physical reaction to a specific technical discovery. Extremely high authenticity signal.',
      paragraphIndex: 2,
    },
    {
      id: 's10',
      index: 9,
      text: 'Furthermore, it is essential to acknowledge that the proliferation of data-driven methodologies has significantly impacted various sectors of the economy, enabling organizations to leverage insights derived from large-scale analytics platforms.',
      label: 'ai',
      aiProbability: 97,
      confidence: 'high',
      patterns: [
        { name: 'Bureaucratic transition', description: '"Furthermore, it is essential to acknowledge" is a typical AI essay transition' },
        { name: 'Business jargon cluster', description: '"leverage insights", "large-scale analytics platforms" are corporate AI buzzwords' },
        { name: 'Topic drift', description: 'The sentence is completely disconnected from the personal narrative' },
        { name: 'Passive construction overload', description: 'Heavy nominalization and passive voice throughout' },
      ],
      explanation: 'This is among the highest AI-probability sentences in the essay. The transition phrase "Furthermore, it is essential to acknowledge" is a textbook AI opener. The sentence drifts completely from the personal story about building a library app and introduces irrelevant corporate jargon.',
      suggestion: 'Remove this sentence entirely. If you want to discuss broader impact, connect it directly to something you personally witnessed.',
      paragraphIndex: 3,
    },
    {
      id: 's11',
      index: 10,
      text: 'My grandfather was a mechanical engineer who built bridges.',
      label: 'human',
      aiProbability: 6,
      confidence: 'high',
      patterns: [],
      explanation: 'Concise, specific family reference. The simplicity and directness are strong human writing signals.',
      paragraphIndex: 4,
    },
    {
      id: 's12',
      index: 11,
      text: 'Every summer, he would walk me through his old blueprints and explain how tension and compression worked.',
      label: 'human',
      aiProbability: 10,
      confidence: 'high',
      patterns: [],
      explanation: 'Specific recurring memory with technical detail. Very authentic.',
      paragraphIndex: 4,
    },
    {
      id: 's13',
      index: 12,
      text: "I didn't fully understand the math then, but I understood that he was solving a problem that mattered—that people would cross his bridges safely.",
      label: 'human',
      aiProbability: 14,
      confidence: 'high',
      patterns: [],
      explanation: 'Mature reflection on a childhood memory. The emotional nuance and specific purpose ("cross his bridges safely") is deeply personal.',
      paragraphIndex: 4,
    },
    {
      id: 's14',
      index: 13,
      text: "That's what I want to do with software.",
      label: 'human',
      aiProbability: 8,
      confidence: 'high',
      patterns: [],
      explanation: 'Short, punchy sentence with strong personal conviction. Stylistically distinctive.',
      paragraphIndex: 4,
    },
    {
      id: 's15',
      index: 14,
      text: 'The opportunity to contribute to a forward-thinking institution such as yours, which has consistently demonstrated leadership in technological innovation and research excellence, represents a pivotal milestone in my academic journey.',
      label: 'ai',
      aiProbability: 91,
      confidence: 'high',
      patterns: [
        { name: 'Generic institution flattery', description: '"forward-thinking institution" and "research excellence" are overused AI compliments' },
        { name: 'Overly formal register', description: 'Tone is inconsistent with the personal voice established elsewhere' },
        { name: 'No specific detail', description: 'Could apply to any university — no specific program, professor, or detail mentioned' },
      ],
      explanation: 'This sentence is a textbook AI-generated compliment to the institution. It uses generic flattery without any specific reason why this particular institution was chosen. The phrase "pivotal milestone in my academic journey" is frequently generated by AI tools.',
      suggestion: 'Replace with specific reasons you are interested in this program — name a professor, a lab, a course, or a specific opportunity.',
      paragraphIndex: 5,
    },
    {
      id: 's16',
      index: 15,
      text: 'Last year, I interned at a local healthcare startup where I helped migrate their patient records system to a cloud-based platform.',
      label: 'human',
      aiProbability: 16,
      confidence: 'high',
      patterns: [],
      explanation: 'Specific internship with concrete technical task. Highly authentic.',
      paragraphIndex: 6,
    },
    {
      id: 's17',
      index: 16,
      text: 'I made mistakes—I accidentally overwrote a configuration file and caused a two-hour outage on a Saturday.',
      label: 'human',
      aiProbability: 7,
      confidence: 'high',
      patterns: [],
      explanation: 'Extremely specific mistake with consequences. Very few AI models generate genuine admissions of specific failures with this level of detail.',
      paragraphIndex: 6,
    },
    {
      id: 's18',
      index: 17,
      text: 'I was terrified.',
      label: 'human',
      aiProbability: 4,
      confidence: 'high',
      patterns: [],
      explanation: 'Three-word sentence with raw emotional honesty. Near-impossible to mistake for AI.',
      paragraphIndex: 6,
    },
    {
      id: 's19',
      index: 18,
      text: 'But the team lead, instead of reprimanding me, sat with me and we debugged the issue together.',
      label: 'human',
      aiProbability: 11,
      confidence: 'high',
      patterns: [],
      explanation: 'Specific interpersonal narrative with a mentor figure. Strong human voice.',
      paragraphIndex: 6,
    },
    {
      id: 's20',
      index: 19,
      text: 'That moment taught me more about professional responsibility than any textbook.',
      label: 'uncertain',
      aiProbability: 42,
      confidence: 'medium',
      patterns: [
        { name: 'Common closing formula', description: 'Lesson-from-experience conclusions appear in both human and AI writing' },
      ],
      explanation: 'This sentence uses a common reflective formula that appears in both human and AI-written essays. The personal context makes it plausible, but the phrasing is generic enough to warrant a moderate flag.',
      paragraphIndex: 6,
    },
  ],
  metrics: {
    vocabularyDiversity: 84,
    sentenceVariation: 78,
    sentenceComplexity: 72,
    readability: 88,
    grammar: 96,
    passiveVoice: 82,
    emotionalTone: 74,
    vocabularyRichness: 81,
    writingConsistency: 69,
  },
  fingerprint: {
    vocabulary: 84,
    sentenceRhythm: 72,
    complexity: 68,
    punctuation: 90,
    formality: 61,
    uniqueness: 88,
  },
  paragraphRisks: [
    { paragraphIndex: 0, label: 'Para 1', aiProbability: 12 },
    { paragraphIndex: 1, label: 'Para 2', aiProbability: 91 },
    { paragraphIndex: 2, label: 'Para 3', aiProbability: 8 },
    { paragraphIndex: 3, label: 'Para 4', aiProbability: 97 },
    { paragraphIndex: 4, label: 'Para 5', aiProbability: 10 },
    { paragraphIndex: 5, label: 'Para 6', aiProbability: 91 },
    { paragraphIndex: 6, label: 'Para 7', aiProbability: 9 },
  ],
  improvements: [
    {
      id: 'i1',
      category: 'authenticity',
      issue: '4 sentences detected as AI-generated',
      suggestion: 'Paragraphs 2, 4, and 6 contain generic phrasing. Replace with specific personal experiences or observations.',
      severity: 'high',
    },
    {
      id: 'i2',
      category: 'vocabulary',
      issue: 'Inconsistent vocabulary register',
      suggestion: 'The essay shifts between casual personal language and formal corporate jargon. Maintain a consistent, personal academic voice throughout.',
      severity: 'medium',
    },
    {
      id: 'i3',
      category: 'sentence-structure',
      issue: 'AI-generated sections use very long, complex sentences',
      suggestion: 'Consider breaking the long sentences in paragraphs 2 and 4 into shorter, more direct statements.',
      severity: 'medium',
    },
    {
      id: 'i4',
      category: 'readability',
      issue: 'Generic institution paragraph (Para 6) adds no value',
      suggestion: 'The paragraph complimenting the institution is generic. Replace with specific program details, faculty you want to work with, or research you find compelling.',
      severity: 'high',
    },
  ],
};

// ─── Student Dashboard Stats ──────────────────────────────────────────────────

export const mockStudentStats: StudentDashboardStats = {
  essaysAnalyzed: 5,
  averageAuthenticity: 73,
  flaggedSections: 8,
  writingScore: 84,
};

// ─── Faculty Dashboard Stats ──────────────────────────────────────────────────

export const mockFacultyStats: FacultyDashboardStats = {
  totalEssays: 127,
  totalStudents: 48,
  highRisk: 14,
  mediumRisk: 31,
  lowRisk: 82,
};

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────

export const mockAdminStats: AdminDashboardStats = {
  totalUsers: 342,
  totalEssays: 1247,
  totalStudents: 298,
  totalFaculty: 41,
  reportsGenerated: 856,
};

// ─── Admin Chart Data ─────────────────────────────────────────────────────────

export const mockDailyEssayData = [
  { day: 'Mon', essays: 42 },
  { day: 'Tue', essays: 58 },
  { day: 'Wed', essays: 73 },
  { day: 'Thu', essays: 61 },
  { day: 'Fri', essays: 89 },
  { day: 'Sat', essays: 34 },
  { day: 'Sun', essays: 27 },
];

export const mockUserGrowthData = [
  { month: 'Jun', users: 142 },
  { month: 'Jul', users: 198 },
  { month: 'Aug', users: 234 },
  { month: 'Sep', users: 289 },
  { month: 'Oct', users: 312 },
  { month: 'Nov', users: 342 },
];

export const mockRiskDistributionData = [
  { name: 'Low Risk', value: 64, color: '#10b981' },
  { name: 'Medium Risk', value: 24, color: '#f59e0b' },
  { name: 'High Risk', value: 12, color: '#f43f5e' },
];

// ─── Faculty Students ─────────────────────────────────────────────────────────

export const mockFacultyStudents = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@university.edu',
    essayCount: 5,
    latestEssay: 'My Journey into Computer Science',
    latestAuthenticity: 87,
    latestRisk: 'low' as const,
    submittedAt: '2024-11-20',
    status: 'reviewed' as const,
  },
  {
    id: 'u4',
    name: 'Jamie Rivera',
    email: 'jrivera@university.edu',
    essayCount: 2,
    latestEssay: 'Why I Want to Study Medicine',
    latestAuthenticity: 48,
    latestRisk: 'high' as const,
    submittedAt: '2024-11-19',
    status: 'flagged' as const,
  },
  {
    id: 'u5',
    name: 'Casey Thompson',
    email: 'cthompson@university.edu',
    essayCount: 3,
    latestEssay: 'Environmental Science and My Future',
    latestAuthenticity: 79,
    latestRisk: 'low' as const,
    submittedAt: '2024-11-17',
    status: 'reviewed' as const,
  },
  {
    id: 'u6',
    name: 'Morgan Lee',
    email: 'mlee@university.edu',
    essayCount: 1,
    latestEssay: 'Why I Chose Business Administration',
    latestAuthenticity: 61,
    latestRisk: 'medium' as const,
    submittedAt: '2024-11-16',
    status: 'pending' as const,
  },
  {
    id: 'u7',
    name: 'Taylor Brooks',
    email: 'tbrooks@university.edu',
    essayCount: 4,
    latestEssay: 'Art as Communication',
    latestAuthenticity: 93,
    latestRisk: 'low' as const,
    submittedAt: '2024-11-15',
    status: 'reviewed' as const,
  },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const mockAuditLogs: AuditLog[] = [
  { id: 'al1', userId: 'u3', userName: 'Admin User', action: 'USER_CREATED', resource: 'User: smitchell@university.edu', timestamp: '2024-11-20T14:32:00Z', ipAddress: '192.168.1.1' },
  { id: 'al2', userId: 'u2', userName: 'Dr. Sarah Mitchell', action: 'ESSAY_ANALYZED', resource: 'Essay: e6', timestamp: '2024-11-20T14:28:00Z', ipAddress: '10.0.0.42' },
  { id: 'al3', userId: 'u1', userName: 'Alex Johnson', action: 'REPORT_DOWNLOADED', resource: 'Report: r1', timestamp: '2024-11-20T14:20:00Z', ipAddress: '10.0.0.18' },
  { id: 'al4', userId: 'u4', userName: 'Jamie Rivera', action: 'ESSAY_UPLOADED', resource: 'Essay: e6', timestamp: '2024-11-19T11:05:00Z', ipAddress: '10.0.0.55' },
  { id: 'al5', userId: 'u3', userName: 'Admin User', action: 'USER_ROLE_CHANGED', resource: 'User: jrivera@university.edu', timestamp: '2024-11-19T10:00:00Z', ipAddress: '192.168.1.1' },
  { id: 'al6', userId: 'u5', userName: 'Casey Thompson', action: 'ESSAY_UPLOADED', resource: 'Essay: e7', timestamp: '2024-11-17T15:32:00Z', ipAddress: '10.0.0.71' },
  { id: 'al7', userId: 'u2', userName: 'Dr. Sarah Mitchell', action: 'BATCH_ANALYSIS_STARTED', resource: 'Batch: 12 essays', timestamp: '2024-11-17T09:00:00Z', ipAddress: '10.0.0.42' },
];

// ─── Mock Report ──────────────────────────────────────────────────────────────

export const mockReport: Report = {
  id: 'r1',
  essayId: 'e1',
  essayTitle: 'My Journey into Computer Science',
  studentName: 'Alex Johnson',
  generatedAt: '2024-11-20T14:40:00Z',
  authenticityScore: 87,
  aiRisk: 'low',
  summary: 'The essay demonstrates strong authentic personal writing with 4 sentences flagged as potentially AI-generated. The personal narrative sections are highly convincing and specific. The AI-generated sections are concentrated in transitional paragraphs and can be improved by replacing generic language with specific personal experiences.',
  analysis: mockAnalysis,
};

// ─── Landing Page Demo Sentences ──────────────────────────────────────────────

export const landingDemoSentences = [
  {
    text: 'I have always been fascinated by the way computers solve problems.',
    label: 'human' as const,
    probability: 12,
    explanation: 'Strong personal voice with specific, authentic curiosity.',
  },
  {
    text: "In today's rapidly evolving technological landscape, the intersection of artificial intelligence presents unprecedented opportunities.",
    label: 'ai' as const,
    probability: 94,
    explanation: '"Rapidly evolving technological landscape" is a hallmark AI phrase. Impersonal and generic.',
  },
  {
    text: 'During my second semester, I built a small web app for my school library—full of bugs I had to fix at midnight.',
    label: 'human' as const,
    probability: 9,
    explanation: 'Specific memory with concrete detail. Highly authentic.',
  },
  {
    text: 'Furthermore, it is essential to acknowledge the proliferation of data-driven methodologies in modern contexts.',
    label: 'ai' as const,
    probability: 97,
    explanation: '"Furthermore, it is essential to acknowledge" is a textbook AI transition phrase.',
  },
  {
    text: "My grandfather built bridges. I didn't understand the math, but I understood they had to hold people safely.",
    label: 'human' as const,
    probability: 7,
    explanation: 'Vivid family memory with simple, direct emotional insight.',
  },
  {
    text: 'The opportunity to contribute to your forward-thinking institution represents a pivotal milestone in my academic journey.',
    label: 'uncertain' as const,
    probability: 68,
    explanation: 'Generic institutional compliment. Could be human but lacks specific detail.',
  },
];
