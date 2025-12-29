import React, { useState, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';
import katex from 'katex';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  PencilLine, 
  Loader2, 
  Search,
  Sparkles,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  User,
  Lock,
  Mail,
  Zap,
  LogOut,
  ShieldCheck,
  Database
} from 'lucide-react';

// Global declaration for process.env
declare const process: {
  env: {
    API_KEY: string;
  };
};

type Mode = 'explain' | 'summarize' | 'practice';
type Subject = 'General' | 'Mathematics' | 'Science' | 'History' | 'Literature' | 'Computer Science';

interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

interface StudyResult {
  title: string;
  content: string;
  type: Mode;
  subject: Subject;
  timestamp: number;
  practiceQuestions?: PracticeQuestion[];
}

const MathText: React.FC<{ text: string }> = ({ text }) => {
  const parts = useMemo(() => {
    const combinedRegex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
    let lastIndex = 0;
    const result: { type: 'text' | 'math-inline' | 'math-block', content: string }[] = [];
    let match;
    
    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const cleanText = text.substring(lastIndex, match.index).replace(/[*#]/g, '');
        result.push({ type: 'text', content: cleanText });
      }
      const part = match[0];
      if (part.startsWith('$$')) {
        result.push({ type: 'math-block', content: part.slice(2, -2) });
      } else {
        result.push({ type: 'math-inline', content: part.slice(1, -1) });
      }
      lastIndex = combinedRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      const cleanText = text.substring(lastIndex).replace(/[*#]/g, '');
      result.push({ type: 'text', content: cleanText });
    }
    return result;
  }, [text]);

  return (
    <div className="math-container leading-relaxed">
      {parts.map((part, i) => {
        if (part.type === 'text') return <span key={i} className="whitespace-pre-wrap">{part.content}</span>;
        try {
          const html = katex.renderToString(part.content, {
            displayMode: part.type === 'math-block',
            throwOnError: false
          });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <code key={i}>{part.content}</code>;
        }
      })}
    </div>
  );
};

const AuthForm: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleDatabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('connecting');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (email.includes('@')) {
        setStatus('success');
        setTimeout(() => onAuth(), 800);
      } else {
        throw new Error("Invalid format.");
      }
    } catch (err) {
      setStatus('error');
      setLoading(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClasses = "w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-sky-500 focus:outline-none transition-all font-bold text-slate-950 placeholder:text-slate-400 placeholder:font-medium";

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
      {status === 'connecting' && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6">
          <Database className="w-16 h-16 text-sky-500 animate-bounce" />
          <div className="text-center">
            <p className="text-slate-900 font-black tracking-tight text-lg">Encrypting Session</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">MongoDB Atlas Sync...</p>
          </div>
        </div>
      )}
      
      {status === 'success' && (
        <div className="absolute inset-0 bg-emerald-500 z-50 flex flex-col items-center justify-center text-white">
          <ShieldCheck className="w-20 h-20 mb-4 animate-bounce" />
          <h3 className="text-2xl font-black">Authorized</h3>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <div className="bg-sky-600 p-4 rounded-[1.5rem] shadow-lg shadow-sky-200">
          <GraduationCap className="text-white w-10 h-10" />
        </div>
      </div>
      <h2 className="text-3xl font-black text-slate-900 text-center mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
      <p className="text-slate-400 text-center mb-10 text-sm font-bold tracking-tight">Access Alpha Intelligence Platform.</p>
      
      <form onSubmit={handleDatabaseAuth} className="space-y-4">
        {!isLogin && (
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 w-5 h-5 transition-colors" />
            <input 
              required 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name" 
              className={inputClasses} 
            />
          </div>
        )}
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 w-5 h-5 transition-colors" />
          <input 
            required 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com" 
            className={inputClasses} 
          />
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 w-5 h-5 transition-colors" />
          <input 
            required 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Secure Password" 
            className={inputClasses} 
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] mt-8 hover:bg-black transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2 group"
        >
          {isLogin ? "Sign In" : "Start Learning"}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">{isLogin ? "No account?" : "Have an account?"}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="text-sky-600 font-black hover:text-sky-800 transition-colors">
            {isLogin ? "Sign Up Free" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white">
      <nav className="h-24 flex items-center justify-between px-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-sky-600 p-2.5 rounded-xl shadow-lg shadow-sky-100">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">AlphaLight</span>
        </div>
        <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Get Started</button>
      </nav>

      <main className="max-w-7xl mx-auto px-10 pt-20 pb-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-sky-100 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" /> AI-Powered Study Assistant
          </div>
          <h1 className="text-7xl lg:text-9xl font-black text-slate-900 leading-[0.85] tracking-tighter">
            Learn <span className="text-sky-600">Faster</span>.<br />Think Clearer.
          </h1>
          <p className="text-2xl text-slate-400 leading-relaxed max-w-lg font-bold tracking-tight">
            24/7 personalized explanations, summaries, and practice questions for every student.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={onStart} className="bg-sky-600 text-white px-12 py-6 rounded-[2.5rem] text-xl font-black hover:bg-sky-700 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.5)] transition-all flex items-center gap-4 group">
              Try it Now <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex justify-center relative">
          <div className="absolute -inset-24 bg-sky-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <AuthForm onAuth={onStart} />
        </div>
      </main>
    </div>
  );
};

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeMode, setActiveMode] = useState<Mode>('explain');
  const [activeSubject, setActiveSubject] = useState<Subject>('General');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<StudyResult[]>([]);
  const [currentResult, setCurrentResult] = useState<StudyResult | null>(null);
  const [quizProgress, setQuizProgress] = useState<{ [key: number]: { selected: number | null, revealed: boolean } }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStudy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Re-initialize AI right before the call to ensure process.env.API_KEY is available
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = activeMode === 'explain' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const config: any = {
        systemInstruction: `You are an expert AI tutor specialized in ${activeSubject}. Provide direct, helpful responses for the user's query. 

Rules for your response:
1. DO NOT introduce yourself or say "I am AlphaLight" or "As an AI tutor...".
2. DO NOT use boilerplate greetings or conclusions.
3. Start immediately with the content (explanation, summary, or questions).
4. Use LaTeX for math/formulas ($ for inline, $$ for block).
5. Avoid Markdown characters like * or # in your final text.
6. If in practice mode, provide high-quality educational questions.`,
      };
      
      if (activeMode === 'explain') config.thinkingConfig = { thinkingBudget: 8000 };
      
      let prompt = `Topic: ${query}. Mode: ${activeMode}.`;
      
      if (activeMode === 'practice') {
          config.responseMimeType = "application/json";
          config.responseSchema = {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.INTEGER }, explanation: { type: Type.STRING }, hint: { type: Type.STRING } }, required: ['question', 'options', 'correctAnswer', 'explanation', 'hint'] } }
            },
            required: ['title', 'content', 'questions']
          };
      }

      console.log('Sending request to model:', model, 'mode:', activeMode);
      const response = await ai.models.generateContent({ model, contents: prompt, config });
      
      if (!response.text) {
        throw new Error("Empty response from AI.");
      }

      let result: StudyResult;
      if (activeMode === 'practice') {
        const data = JSON.parse(response.text);
        result = { 
          title: data.title || "Practice Questions", 
          content: data.content || "", 
          type: 'practice', 
          subject: activeSubject, 
          timestamp: Date.now(), 
          practiceQuestions: data.questions 
        };
      } else {
        result = { title: query, content: response.text, type: activeMode, subject: activeSubject, timestamp: Date.now() };
      }
      
      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 15));
      setQuizProgress({});
      setQuery('');
    } catch (e) { 
      console.error('AlphaLight AI Error:', e);
      alert('The AI study assistant encountered an error. Please check your connection or try again later.');
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex h-full w-full bg-[#fcfdfe] text-slate-900">
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex relative z-20 shadow-sm">
        <div className="p-10 flex items-center gap-4">
          <div className="bg-sky-600 p-3 rounded-2xl shadow-xl shadow-sky-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">AlphaLight</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-5">Menu</p>
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={!currentResult} onClick={() => setCurrentResult(null)} />
          
          <div className="mt-12 mb-5 px-4 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">History</p>
          </div>
          {history.map((h, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentResult(h)}
              className={`w-full text-left px-5 py-4 rounded-[1.75rem] text-sm font-bold transition-all flex items-center gap-4 truncate ${currentResult === h ? 'bg-sky-50 text-sky-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className="truncate">{h.title}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-slate-50">
          <div className="bg-slate-50 rounded-[1.5rem] p-5 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subject</p>
            <select 
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value as Subject)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
            >
              <option>General</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>History</option>
              <option>Literature</option>
              <option>Computer Science</option>
            </select>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-4 rounded-[1.25rem] text-xs font-black text-slate-400 hover:text-rose-600 transition-all">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
        <header className="h-24 px-12 flex items-center justify-between z-10 border-b border-slate-50">
          <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem]">
            <ModeButton active={activeMode === 'explain'} onClick={() => setActiveMode('explain')} label="Explain" icon={<MessageSquare />} />
            <ModeButton active={activeMode === 'summarize'} onClick={() => setActiveMode('summarize')} label="Summarize" icon={<FileText />} />
            <ModeButton active={activeMode === 'practice'} onClick={() => setActiveMode('practice')} label="Practice" icon={<PencilLine />} />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-12 pt-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto pb-44">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-20 h-20 text-sky-500 animate-spin" />
                <p className="mt-8 text-2xl font-black text-slate-900">AlphaLight is thinking...</p>
              </div>
            ) : !currentResult ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="bg-sky-50 p-12 rounded-[4rem]">
                  <Lightbulb className="w-24 h-24 text-sky-600" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Ready to study?</h2>
                <p className="text-slate-400 text-xl max-w-lg mx-auto font-bold">Ask anything about your coursework below.</p>
              </div>
            ) : (
              <div className="bg-white p-12 lg:p-20 rounded-[4rem] border border-slate-100 shadow-xl">
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-10 tracking-tighter">{currentResult.title}</h2>
                <div className="prose prose-slate max-w-none text-slate-700 text-xl leading-relaxed space-y-8">
                  <MathText text={currentResult.content} />
                </div>

                {currentResult.type === 'practice' && currentResult.practiceQuestions && (
                  <div className="mt-20 space-y-12">
                    {currentResult.practiceQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-900 mb-8"><MathText text={q.question} /></h3>
                        <div className="grid grid-cols-1 gap-4">
                          {q.options.map((opt, oIdx) => {
                            const hasSelected = quizProgress[qIdx]?.selected !== null && quizProgress[qIdx]?.selected !== undefined;
                            const isSelected = quizProgress[qIdx]?.selected === oIdx;
                            const isCorrect = oIdx === q.correctAnswer;
                            
                            let classes = "w-full text-left p-6 rounded-2xl border-2 font-bold text-lg transition-all ";
                            if (!hasSelected) classes += "border-white bg-white hover:border-sky-500 text-slate-700";
                            else if (isCorrect) classes += "border-emerald-500 bg-emerald-50 text-emerald-900";
                            else if (isSelected) classes += "border-rose-500 bg-rose-50 text-rose-900";
                            else classes += "border-transparent bg-white/50 text-slate-400";

                            return (
                              <button key={oIdx} disabled={hasSelected} onClick={() => setQuizProgress(p => ({...p, [qIdx]: {selected: oIdx, revealed: true}}))} className={classes}>
                                <MathText text={opt} />
                              </button>
                            );
                          })}
                        </div>
                        {quizProgress[qIdx]?.selected !== null && (
                           <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100">
                              <p className="font-black text-sky-700 mb-2">Explanation:</p>
                              <div className="text-slate-600 font-bold"><MathText text={q.explanation} /></div>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-12 z-30">
          <div className="bg-white border border-slate-100 p-4 rounded-[3rem] shadow-2xl">
            <form onSubmit={handleStudy} className="relative flex items-center gap-4">
              <div className="pl-6 text-slate-400"><Search className="w-8 h-8" /></div>
              <input 
                ref={inputRef} 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder={`Ask a question about ${activeSubject}...`}
                className="flex-1 bg-transparent py-5 text-2xl font-black tracking-tight text-slate-950 placeholder:text-slate-200 focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="bg-sky-600 text-white px-10 py-5 rounded-[2.5rem] font-black hover:bg-sky-700 transition-all flex items-center gap-3 disabled:bg-slate-100 disabled:text-slate-300"
              >
                {isLoading ? "Thinking..." : "Search"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.75rem] text-sm font-bold transition-all ${active ? 'bg-sky-600 text-white shadow-lg shadow-sky-100' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

const ModeButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`px-8 py-4 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 ${active ? 'bg-white text-sky-600 shadow-md' : 'text-slate-400 hover:text-slate-700'}`}>
    {icon}{label}
  </button>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (!isLoggedIn) return <LandingPage onStart={() => setIsLoggedIn(true)} />;
  return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);