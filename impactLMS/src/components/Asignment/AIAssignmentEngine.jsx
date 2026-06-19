import React, { useState, useEffect } from 'react';
import { 
  ScreenShare, ShieldAlert, CheckSquare, Award, 
  Activity, CheckCircle2, ArrowLeft, BookOpenCheck, Terminal, 
  Code, Database, Unlock, Cpu, Zap, LayoutGrid
} from 'lucide-react';

// ==========================================
// 🗄️ STATIC DATABASE MATRICES
// ==========================================
const forLoopMCQData = {
  assignmentId: "STATIC-FOR-LOOP-20-MCQ",
  title: "Atlas Verified: Advanced For-Loop Mechanics",
  format: "MCQ Matrix",
  codingQuestion: `Q1. Which statement is true about the initialization block in a standard JavaScript for loop?
A) It executes on every single loop iteration sequence.
B) It executes exactly once before the loop tracking begins.
C) It is strictly mandatory and cannot be left empty.
D) It runs memory allocations tracking inside the stack.

Q2. What causes a loop boundary calculation to drop into an infinite execution state?
A) Using short-circuit return statements inside guards.
B) Setting an expression condition that never resolves to false.`,
  starterCode: "// LuminaLearn Active Terminal\n// Input matrix solutions below:\n",
  theoryQuestion: "Verify and select your options from the challenge view block parameters above."
};

const forLoopQAData = {
  assignmentId: "STATIC-FOR-LOOP-QA",
  title: "Algorithm Core: Array Inversion Protocol",
  format: "Hybrid QA & Code",
  codingQuestion: `[TASK: Array Element Inversion Loop]
Write a function that reverses an input array in-place without using the native array.reverse() method. Provide maximum Big-O efficiency.`,
  starterCode: "function reverseArrayInPlace(arr) {\n  // ⚡ Initialize zero-allocation pointer tracking\n  \n  return arr;\n}",
  theoryQuestion: `[THEORY ARCHITECTURE]
Concept: Variable Memory Isolation Footprints
Contrast the exact variable scoping block boundary allocations mechanics variables structures divergence when creating loop counters keys inside initialization expressions utilizing 'let' versus 'var'.`
};

// ==========================================
// 🌌 GLOBAL CSS INJECTION (For Grid & Scrollbars)
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700;800&display=swap');
    
    body {
      background-color: #020617;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
        linear-gradient(rgba(30, 41, 59, 0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 41, 59, 0.4) 1px, transparent 1px);
      background-size: 100vw 100vh, 32px 32px, 32px 32px;
      font-family: 'Inter', sans-serif;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #06B6D4; box-shadow: 0 0 10px rgba(6,182,212,0.5); }

    .glass-panel {
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(30, 41, 59, 0.8);
    }
    
    .text-glow-cyan { text-shadow: 0 0 12px rgba(6, 182, 212, 0.6); }
    .box-glow-cyan { box-shadow: 0 0 20px rgba(6, 182, 212, 0.15); }
    .box-glow-purple { box-shadow: 0 0 20px rgba(139, 92, 246, 0.15); }
  `}</style>
);

// ==========================================
// 🚀 MAIN APPLICATION COMPONENT
// ==========================================
export default function AIAssignmentEngine() {
  const [activeParams, setActiveParams] = useState(null);

  return (
    <>
      <GlobalStyles />
      <div className="max-w-7xl mx-auto p-6 min-h-screen animate-fadeIn flex flex-col pt-12">
        {!activeParams ? (
          <div className="space-y-12 w-full max-w-5xl mx-auto">
            
            {/* HERO HEADER SECTION */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#06B6D4]/30 text-[#06B6D4] text-xs font-mono font-bold tracking-widest uppercase mb-2 box-glow-cyan">
                <Zap size={14} className="animate-pulse" /> System Online
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f8fafc] to-[#94a3b8]">
                LuminaLearn <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6]">Studio</span>
              </h1>
              <p className="text-[#94a3b8] text-sm md:text-base font-medium max-w-2xl mx-auto">
                Select a high-fidelity evaluation matrix to initialize the secure terminal workspace.
              </p>
            </div>

            {/* ASSIGNMENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CARD 1: MCQ */}
              <div 
                onClick={() => setActiveParams(forLoopMCQData)}
                className="group relative glass-panel rounded-2xl p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#06B6D4]/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
              >
                {/* Neon Top Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-[#020617] border border-[#1e293b] text-[#06B6D4] group-hover:scale-110 transition-transform duration-500">
                    <LayoutGrid size={24} />
                  </div>
                  <span className="px-3 py-1 text-[10px] font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20 rounded-full flex items-center gap-1">
                    <Unlock size={10} /> MODULE 01
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#06B6D4] transition-colors">{forLoopMCQData.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-8">Execute a strict evaluation matrix testing core bounds calculation mechanics and memory allocation rules within the V8 engine.</p>
                
                <div className="w-full text-center bg-[#020617] border border-[#1e293b] text-white text-xs font-mono py-3.5 rounded-full group-hover:bg-[#06B6D4] group-hover:text-[#020617] group-hover:border-[#06B6D4] transition-all duration-300 font-bold uppercase tracking-wider">
                  Initialize Terminal &rarr;
                </div>
              </div>

              {/* CARD 2: QA/CODING */}
              <div 
                onClick={() => setActiveParams(forLoopQAData)}
                className="group relative glass-panel rounded-2xl p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#8B5CF6]/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-[#020617] border border-[#1e293b] text-[#8B5CF6] group-hover:scale-110 transition-transform duration-500">
                    <Code size={24} />
                  </div>
                  <span className="px-3 py-1 text-[10px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-full flex items-center gap-1">
                    <Unlock size={10} /> MODULE 02
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#8B5CF6] transition-colors">{forLoopQAData.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-8">Deploy hybrid architecture combining high-efficiency structural code tasks with deep theoretical system breakdown.</p>
                
                <div className="w-full text-center bg-[#020617] border border-[#1e293b] text-white text-xs font-mono py-3.5 rounded-full group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:border-[#8B5CF6] transition-all duration-300 font-bold uppercase tracking-wider">
                  Initialize Terminal &rarr;
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SecureTerminalWorkspace 
            targetParams={activeParams} 
            onReturn={() => setActiveParams(null)} 
          />
        )}
      </div>
    </>
  );
}

// ==========================================
// 🛡️ ULTRA-PREMIUM TERMINAL WORKSPACE
// ==========================================
function SecureTerminalWorkspace({ targetParams, onReturn }) {
  const [step, setStep] = useState('briefing'); // briefing -> lockdown -> workspace -> evaluation
  const [viewMode, setViewMode] = useState('coding'); 
  const [codeData, setCodeData] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  useEffect(() => {
    setCodeData(targetParams.starterCode);
  }, [targetParams]);

  const simulateProcessing = () => {
    setSubmitting(true);
    setTimeout(() => {
      setEvalResult({
        score: 94,
        feedback: "Exceptional memory isolation footprint. Zero unnecessary heap allocations detected.",
        approach: "O(1) space complexity achieved through bitwise boundary masking."
      });
      setStep('evaluation');
      setSubmitting(false);
    }, 2500);
  };

  // 1. BRIEFING SCREEN
  if (step === 'briefing') return (
    <div className="max-w-3xl mx-auto w-full mt-10">
      <div className="glass-panel rounded-3xl p-10 space-y-8 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#06B6D4] opacity-10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-lg text-[#06B6D4]">
              <BookOpenCheck size={20} />
            </div>
            <h2 className="text-[#06B6D4] font-mono text-sm font-bold tracking-widest uppercase">Mission Briefing</h2>
          </div>
          <span className="px-3 py-1 font-mono text-[10px] text-[#94a3b8] bg-[#020617] border border-[#1e293b] rounded-full">
            ID: {targetParams.assignmentId}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">{targetParams.title}</h1>
          <div className="bg-[#020617] border border-[#1e293b] p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-[#8B5CF6] font-bold uppercase tracking-widest block mb-2">Diagnostic Parameters</span>
            <ul className="text-sm text-[#94a3b8] font-mono space-y-2">
              <li><span className="text-[#f8fafc]">&gt; Format:</span> {targetParams.format}</li>
              <li><span className="text-[#f8fafc]">&gt; Engine:</span> Lumina V8 Sandbox</li>
              <li><span className="text-[#f8fafc]">&gt; Protocol:</span> Strict Screen Lockdown</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={onReturn} className="flex-1 py-4 rounded-full border border-[#1e293b] text-[#94a3b8] font-mono text-xs font-bold uppercase hover:bg-[#1e293b] hover:text-white transition-all">
            Abort
          </button>
          <button onClick={() => setStep('lockdown')} className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-[#020617] font-mono text-xs font-bold uppercase tracking-wider box-glow-cyan hover:opacity-90 transition-all">
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  );

  // 2. LOCKDOWN SCREEN
  if (step === 'lockdown') return (
    <div className="max-w-lg mx-auto w-full mt-20 text-center space-y-8 animate-fadeIn">
      <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-ping" />
        <div className="absolute inset-2 border border-red-500/40 rounded-full animate-pulse" />
        <div className="relative bg-[#020617] border border-red-500/50 w-20 h-20 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <ShieldAlert size={32} />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">Security Override Required</h2>
        <p className="text-[#94a3b8] text-sm">Anti-cheat protocol active. A secure monitor stream link is required to render the terminal workspace.</p>
      </div>
      <button onClick={() => setStep('workspace')} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-2">
        <ScreenShare size={16} /> Authenticate Video Stream
      </button>
    </div>
  );

  // 3. MAIN WORKSPACE
  if (step === 'workspace') return (
    <div className="w-full h-[85vh] flex flex-col gap-4 animate-fadeIn">
      {/* Top Navbar */}
      <div className="glass-panel rounded-2xl p-4 flex justify-between items-center shrink-0">
        <div className="flex gap-4">
          <button onClick={onReturn} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#020617] border border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#8B5CF6] transition-all">
            <ArrowLeft size={16} />
          </button>
          <div className="flex bg-[#020617] border border-[#1e293b] p-1 rounded-full">
            <button onClick={() => setViewMode('coding')} className={`px-6 py-2 rounded-full text-xs font-mono font-bold transition-all ${viewMode === 'coding' ? 'bg-[#1e293b] text-[#06B6D4]' : 'text-[#94a3b8] hover:text-white'}`}>CODING</button>
            <button onClick={() => setViewMode('theory')} className={`px-6 py-2 rounded-full text-xs font-mono font-bold transition-all ${viewMode === 'theory' ? 'bg-[#1e293b] text-[#8B5CF6]' : 'text-[#94a3b8] hover:text-white'}`}>THEORY</button>
          </div>
        </div>
        <button onClick={simulateProcessing} disabled={submitting} className="px-8 py-3 rounded-full bg-[#f8fafc] text-[#020617] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#06B6D4] transition-all flex items-center gap-2">
          {submitting ? <Cpu className="animate-spin" size={16} /> : <Terminal size={16} />} 
          {submitting ? "Compiling..." : "Execute Run"}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left: Problem Spec */}
        <div className="lg:col-span-5 glass-panel rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1e293b] flex items-center gap-2 bg-[#020617]/50">
            <Database size={14} className="text-[#8B5CF6]" />
            <span className="text-xs font-mono font-bold text-[#8B5CF6] uppercase tracking-widest">Documentation</span>
          </div>
          <div className="p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">{targetParams.title}</h2>
            <div className="text-sm text-[#94a3b8] font-mono whitespace-pre-wrap leading-relaxed">
              {viewMode === 'coding' ? targetParams.codingQuestion : targetParams.theoryQuestion}
            </div>
          </div>
        </div>

        {/* Right: Code IDE */}
        <div className="lg:col-span-7 bg-[#020617] rounded-2xl border border-[#1e293b] flex flex-col overflow-hidden focus-within:border-[#06B6D4]/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
          <div className="p-3 border-b border-[#1e293b] flex justify-between items-center bg-[#0f172a]">
            <div className="flex gap-2 items-center">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <span className="text-[10px] font-mono text-[#06B6D4] uppercase tracking-widest">Main.js</span>
          </div>
          <textarea 
            value={codeData} 
            onChange={(e) => setCodeData(e.target.value)}
            className="flex-1 w-full bg-transparent p-6 text-sm font-mono text-[#06B6D4] focus:outline-none resize-none leading-loose tracking-wide"
            spellCheck="false"
          />
        </div>

      </div>
    </div>
  );

  // 4. EVALUATION SCREEN
  if (step === 'evaluation') return (
    <div className="max-w-3xl mx-auto w-full mt-10 animate-fadeIn">
      <div className="glass-panel rounded-3xl p-1 relative overflow-hidden">
        {/* Animated Gradient Border Wrapper */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4] via-transparent to-[#8B5CF6] opacity-30" />
        
        <div className="relative bg-[#020617] rounded-[22px] p-10 h-full flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-6">
            <h3 className="font-mono text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] uppercase flex items-center gap-2">
              <Award size={20} className="text-[#06B6D4]" /> Execution Matrix Generated
            </h3>
            <span className="text-xs font-mono text-[#94a3b8] px-3 py-1 rounded-full border border-[#1e293b]">ID: {evalResult.score}X-V8</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 bg-[#0f172a]/50 p-8 rounded-2xl border border-[#1e293b]">
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-3xl font-black text-white mb-2 tracking-tight">Audit Successful</h4>
              <p className="text-sm text-[#94a3b8]">AI compilation pipeline has completely processed your structural inputs.</p>
            </div>
            <div className="bg-[#020617] border border-[#1e293b] px-8 py-6 rounded-2xl text-center box-glow-cyan">
              <div className="text-[10px] font-mono text-[#06B6D4] uppercase tracking-widest mb-2">Cognitive Score</div>
              <div className="text-6xl font-black font-mono text-white text-glow-cyan">{evalResult.score}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-[#1e293b]">
              <div className="flex items-center gap-2 text-[#8B5CF6] font-mono text-xs font-bold uppercase mb-3"><Activity size={16}/> System Feedback</div>
              <p className="text-sm text-[#cbd5e1] leading-relaxed">{evalResult.feedback}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-[#1e293b]">
              <div className="flex items-center gap-2 text-[#06B6D4] font-mono text-xs font-bold uppercase mb-3"><CheckCircle2 size={16}/> Optimum Architecture</div>
              <p className="text-sm text-[#cbd5e1] leading-relaxed font-mono">{evalResult.approach}</p>
            </div>
          </div>

          <button onClick={onReturn} className="mt-4 py-4 rounded-full bg-[#f8fafc] text-[#020617] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#06B6D4] transition-all">
            Close Link & Return to Base
          </button>
        </div>
      </div>
    </div>
  );
}