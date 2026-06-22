import React, { useState } from 'react';
import { Terminal, Code, Cpu, Monitor, Clock, ChevronLeft, Send, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export default function TakeAssignmentView({ assignment, topicName, courseId, moduleId, onBackToWorkspace, onAssignmentFinished }) {
  // States Matrix: 'DETAILS' | 'STREAM_ENFORCE' | 'LAB_WORKSPACE' | 'COMPLETED_SUMMARY'
  const [labPhase, setLabPhase] = useState('DETAILS');
  const [streamInstance, setStreamInstance] = useState(null);
  const [streamError, setStreamError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic Compiler Inputs
  const [selectedLang, setSelectedLang] = useState("java");
  const [editorText, setEditorText] = useState("");
  const [aiReportOutput, setAiReportOutput] = useState(null);

  // Determine configuration bounds directly from payload content
  const assignmentTypeMode = assignment?.complexity ? "CODING" : "CODING"; // Fallback structural tags check logic

  const startSecureLabStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setStreamInstance(stream);
      stream.getVideoTracks()[0].onended = () => window.location.reload();
      setLabPhase('LAB_WORKSPACE');
    } catch (err) {
      setStreamError("⚠️ Telemetry verification faulted. Active screen capture stream required.");
    }
  };

  const dispatchToAiEvaluator = async () => {
    if (!editorText.trim()) return alert("Workspace payload string can't be blank.");
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assignment/evaluate-via-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          courseId, moduleId, topicName,
          assignmentType: assignmentTypeMode,
          selectedLanguage: selectedLang,
          codeOrText: editorText
        })
      });
      const json = await response.json();
      if (json.success) {
        setAiReportOutput(json.submissionData.aiEvaluationLog);
        
        // Clean media screen sharing hardware feeds immediately
        if (streamInstance) streamInstance.getTracks().forEach(t => t.stop());
        
        setLabPhase('COMPLETED_SUMMARY');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 99999, fontFamily: '"Inter", sans-serif' }}>
      
      {/* HUD CONSOLE TOP BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyBwteen: 'space-between', justifyContent: 'space-between', padding: '1rem 2.5rem', borderBottom: '1px solid #1e293b', background: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBackToWorkspace} disabled={labPhase === 'LAB_WORKSPACE'} style={{ background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}><ChevronLeft size={14}/> Escape Lab</button>
          <div style={{ fontSize: '0.82rem', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 'bold' }}>LUMINA_CORE://ASSIGNMENT_SANDBOX_v1</div>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Context Node: <span style={{ color: '#10b981', fontWeight: '700' }}>{topicName}</span></div>
      </div>

      {/* LAB INTERFACE STAGES CONTENT CONSOLE */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* PHASE 1: STANDARD CARD INFORMATION DETAILS */}
        {labPhase === 'DETAILS' && (
          <div style={{ margin: 'auto', width: '560px', background: '#0f172a', padding: '2.5rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '800' }}>SANDBOX DIRECTIVE HANDSHAKE</span>
            <h2 style={{ fontSize: '1.4rem', margin: '0.5rem 0 1rem 0' }}>{assignment?.name || "Practical Application Lab Execution"}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '2rem' }}>This engine maps secure real-time compiler variables to cross-examine core algorithmic approach constraints.</p>
            <button onClick={() => setLabPhase('STREAM_ENFORCE')} style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.85rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Proceed To Sandbox Enforcer</button>
          </div>
        )}

        {/* PHASE 2: SECURITY COMPLIANCE HANDSHAKE */}
        {labPhase === 'STREAM_ENFORCE' && (
          <div style={{ margin: 'auto', width: '520px', background: '#0f172a', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', textAlign: 'center' }}>
            <Monitor size={36} color="#8B5CF6" style={{ marginBottom: '1rem' }} />
            <h3>Terminal Monitor Loop Intercept</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0 2rem 0' }}>Authorize full dashboard frame projection streaming parameters to safely unlock compiler code sheets panels.</p>
            {streamError && <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{streamError}</div>}
            <button onClick={startSecureLabStream} style={{ width: '100%', background: 'linear-gradient(135deg, #8B5CF6, #7c3aed)', border: 'none', color: '#fff', padding: '0.85rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Grant Projection Access</button>
          </div>
        )}

        {/* PHASE 3: INDUSTRIAL HIGH-END IDE GRID LAYOUT PANEL */}
        {labPhase === 'LAB_WORKSPACE' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '400px 1fr', height: '100%' }}>
            
            {/* LEFT AREA PANEL: DIRECTIVES TASK OBJECTIVES */}
            <div style={{ background: '#0f172a', borderRight: '1px solid #1e293b', padding: '2rem', display: 'flex', flexDirection: 'column', justifyBwteen: 'space-between', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#06B6D4', fontWeight: '700', letterSpacing: '0.05em' }}>LAB REQUIREMENT BOUNDS</span>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0.5rem 0 1.5rem 0' }}>{assignment?.name}</h3>
                
                <div style={{ background: '#020617', border: '1px solid #1e293b', padding: '1.25rem', borderRadius: '8px', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <strong>🎯 Goal Instruction:</strong><br/>
                  {assignment?.assignmentObjective}
                </div>
              </div>

              {/* Bottom Compiler Trigger Tool */}
              <button onClick={dispatchToAiEvaluator} disabled={isProcessing} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.9rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isProcessing ? "Transmitting Snippet Matrix..." : "Transmit To AI Critic Node"} <Send size={14}/>
              </button>
            </div>

            {/* RIGHT AREA PANEL: THE COMPILER SHEET EDITOR PANES */}
            <div style={{ display: 'flex', flexDirection: 'column', background: '#020617' }}>
              
              {/* Language Toolbar Select Grid */}
              <div style={{ padding: '0.75rem 1.5rem', background: '#090d16', borderBottom: '1px solid #1e293b', display: 'flex', justifyBwteen: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}><Code size={14}/> ENVIRONMENT CORE COMPILER SHEET</div>
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#06B6D4', padding: '0.35rem 1rem', borderRadius: '6px', outline: 'none', fontSize: '0.82rem', fontWeight: '700', fontFamily: 'monospace' }}>
                  <option value="java">Java Development Kit (JDK 21)</option>
                  <option value="cpp">C++ Compiler Graph (GCC 13)</option>
                  <option value="python">Python Runtime Environment (v3.11)</option>
                  <option value="javascript">JavaScript V8 Sandbox (ECMAScript 2026)</option>
                </select>
              </div>

              {/* Code input text pane workspace */}
              <textarea 
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                placeholder={`// Write your complete structured approach program framework here...\n// System logs compilation variables directly. Ensure algorithm matches criteria.\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("LuminaLearn Engine Active");\n    }\n}`}
                style={{ flex: 1, background: '#02040a', border: 'none', resize: 'none', padding: '2rem', color: '#a7f3d0', fontFamily: '"Fira Code", "Courier New", monospace', fontSize: '0.92rem', lineHeight: '1.6', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* PHASE 4: HIGH RETENTION REPORT CONSOLE GRAPH FROM REALTIME ANALYSIS */}
        {labPhase === 'COMPLETED_SUMMARY' && aiReportOutput && (
          <div style={{ margin: 'auto', width: '100%', maxWidth: '720px', background: '#0f172a', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3rem', borderRadius: '16px', overflowY: 'auto', maxHeight: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06B6D4', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1rem' }}><Sparkles size={14}/> AUTOMATED AI REVIEW HANDSHAKE COMPLETE</div>
            
            <div style={{ display: 'flex', alignSelf: 'center', justifyBwteen: 'space-between', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>Laboratory Analytics Log</h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Pipeline transaction metrics successfully locked into cloud records warehouse collections.</span>
              </div>
              <div style={{ padding: '1rem', background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700' }}>APPROACH RATING</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#10b981', fontFamily: 'monospace', marginTop: '0.15rem' }}>{aiReportOutput.approachScore}<span style={{ fontSize: '0.9rem', color: '#334155' }}>/100</span></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <div>
                <h4 style={{ color: '#8B5CF6', margin: '0 0 0.35rem 0', fontSize: '0.85rem', fontWeight: '700' }}>📊 DATA STRUCTURE & COMPLEXITY ANALYSIS</h4>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', background: '#020617', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b', lineHeight: '1.5' }}>{aiReportOutput.complexityAnalysis}</p>
              </div>
              <div>
                <h4 style={{ color: '#f59e0b', margin: '0 0 0.35rem 0', fontSize: '0.85rem', fontWeight: '700' }}>💡 ARCHITECTURAL CRITIQUE & APPROACH EVALUATION</h4>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', background: '#020617', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b', lineHeight: '1.5' }}>{aiReportOutput.architecturalCritique}</p>
              </div>
              <div>
                <h4 style={{ color: '#06B6D4', margin: '0 0 0.35rem 0', fontSize: '0.85rem', fontWeight: '700' }}>🛠️ RECOMMENDED REFACTORED ALTERNATIVE</h4>
                <pre style={{ fontSize: '0.85rem', color: '#34d399', background: '#02040a', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', fontFamily: 'monospace', lineHeight: '1.5' }}>{aiReportOutput.betterAlternativeTemplate}</pre>
              </div>
            </div>

            <button onClick={onBackToWorkspace} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e293b', color: '#fff', padding: '1rem', borderRadius: '8px', fontWeight: '700', marginTop: '2.5rem', cursor: 'pointer' }}>Close Laboratory View & Return</button>
          </div>
        )}

      </div>
    </div>
  );
}