import React from 'react';
import { 
  BarChart3, Lock, Cpu, Clock, BookOpen, CheckCircle2, 
  XCircle, HelpCircle, Terminal, Sparkles 
} from 'lucide-react';

export default function MainResourceCanvas({ 
  topicName, 
  activeTab, 
  setActiveTab, 
  videoSearchQuery, 
  materialNotes, 
  quiz, 
  assignment, 
  onComplete, 
  onLaunchQuiz, 
  onLaunchAssignment, // 🚀 Trigger callback linked to parent overlay
  courseId, 
  moduleId, 
  activeQuizResult,
  activeAssignmentResult // 🚀 Cached AI feedback object data directly from server check
}) {

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  // 🚀 AUTOMATED TELEMETRY MATH INJECTIONS FOR QUIZ SECTION
  const totalQuestions = activeQuizResult?.total || 10;
  const correctAnswers = activeQuizResult?.correct || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracyPercentage = activeQuizResult?.percentage || 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#02040a', padding: '2rem', overflowY: 'auto', color: '#fff', fontFamily: '"Inter", sans-serif' }}>
      
      {/* 🚀 Dynamic Navigation Tabs Navbar Header Element */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('video')} 
          style={{ background: activeTab === 'video' ? 'rgba(6,182,212,0.05)' : 'transparent', border: 'none', color: activeTab === 'video' ? '#06b6d4' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', transition: 'all 200ms ease' }}
        >
          By-Topic Smart Lecture Masterclass
        </button>
        <button 
          onClick={() => setActiveTab('quiz')} 
          style={{ background: activeTab === 'quiz' ? 'rgba(245,158,11,0.05)' : 'transparent', border: 'none', color: activeTab === 'quiz' ? '#f59e0b' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', transition: 'all 200ms ease' }}
        >
          ⚡ Quiz Evaluation
        </button>
        <button 
          onClick={() => setActiveTab('assignment')} 
          style={{ background: activeTab === 'assignment' ? 'rgba(16,185,129,0.05)' : 'transparent', border: 'none', color: activeTab === 'assignment' ? '#10b981' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', transition: 'all 200ms ease' }}
        >
          🛠️ Assignment Challenge
        </button>
      </div>

      {/* Main Control Console Canvas Board */}
      <div style={{ flex: 1, background: '#070a12', border: '1px solid rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem' }}>
        
        {/* 📺 TAB 1: SMART VIDEO MASTERCLASS LECTURES */}
        {activeTab === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
              Active Workspace Concept Node: {topicName}
            </h2>
            
            <div style={{ height: '360px', background: '#02040a', overflow: 'hidden', border: '1px solid #1e293b', borderRadius: '8px' }}>
              <iframe width="100%" height="100%" src={getEmbedUrl(videoSearchQuery)} title="Video Console" frameBorder="0" allowFullScreen />
            </div>

            {materialNotes?.htmlContent ? (
              <div 
                className="dynamic-rich-article" 
                style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.75', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} 
                dangerouslySetInnerHTML={{ __html: materialNotes.htmlContent }} 
              />
            ) : (
              <div style={{ color: '#475569', textAlign: 'center', padding: '4rem', border: '1px dashed #1e293b', borderRadius: '8px' }}>
                🔄 Compiling raw concept blueprints logs from server mesh...
              </div>
            )}

            <button onClick={onComplete} style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
              Mark Concept Finished
            </button>
          </div>
        )}

        {/* ⚡ TAB 2: SECURE SYSTEM QUIZ METRICS EVALUATOR */}
        {activeTab === 'quiz' && (
          <div style={{ maxWidth: '700px' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              ⚡ Module Quiz Evaluation: {quiz?.name || "Topic Verification Quiz"}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              This dynamic quiz bounds test constraints mapped explicitly for your verified workspace modules.
            </p>

            <div style={{ background: '#020617', border: activeQuizResult ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid #1e293b', padding: '2rem', borderRadius: '12px', marginTop: '1.5rem', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              
              {/* Absolute Static Safe Environmental Lock Tag */}
              {activeQuizResult && (
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: '#f87171', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase' }}>
                  <Lock size={12}/> COMPLETED & LOCKED
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}><strong>📚 Core Scope Focus:</strong> <span style={{ color: '#06b6d4' }}>{quiz?.quizTopic || "Universal Module Concepts"}</span></div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}><strong>⏳ Expected Speed Cap:</strong> <span>{quiz?.duration || "10 Minutes standard allotment"}</span></div>
              </div>

              <button 
                onClick={onLaunchQuiz} 
                disabled={!!activeQuizResult} 
                style={{ 
                  background: activeQuizResult ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  color: activeQuizResult ? '#475569' : '#000', 
                  border: activeQuizResult ? '1px solid #1e293b' : 'none',
                  padding: '0.8rem 1.75rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.9rem',
                  cursor: activeQuizResult ? 'not-allowed' : 'pointer', transition: 'all 200ms ease'
                }}
              >
                {activeQuizResult ? "Assessment Token Cleared" : "Proceed To Take Quiz Terminal"}
              </button>
              
              {/* 📊 Accurate Scorecard Render Area */}
              {activeQuizResult && (
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid #1e293b', paddingTop: '2rem' }}>
                  <div style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                    <BarChart3 size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'text-bottom' }}/> Secure Verification Performance Output
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>ACCURACY RATIO</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: accuracyPercentage >= 70 ? '#10b981' : '#f59e0b', marginTop: '0.25rem', fontFamily: 'monospace' }}>{accuracyPercentage.toFixed(0)}%</div>
                    </div>
                    <div style={{ background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>TOTAL MATRIX ITEMS</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#06b6d4', marginTop: '0.25rem', fontFamily: 'monospace' }}>{totalQuestions}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>CORRECT / VALID</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem', fontFamily: 'monospace' }}>{correctAnswers}</div>
                    </div>
                    <div style={{ background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '700' }}>WRONG / FLAWED</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444', marginTop: '0.25rem', fontFamily: 'monospace' }}>{wrongAnswers}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🛠️ TAB 3: AI-CRITIC INTEGRATED LABORATORY SANDBOX PANELS */}
        {activeTab === 'assignment' && (
          <div style={{ maxWidth: '750px', animation: 'fadeIn 0.2s ease-out' }}>
            <h3 style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              🛠️ Laboratory Assignment Challenge
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
              Automated AI static compilation models will critique code structure metrics and design patterns live via proctor streams.
            </p>

            <div style={{ background: '#020617', border: activeAssignmentResult ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid #1e293b', padding: '2.5rem 2rem', borderRadius: '12px', marginTop: '1.5rem', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              
              {/* Hard Security Compliance Check Tag */}
              {activeAssignmentResult && (
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: '#10b981', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase' }}>
                  <Lock size={12}/> EVALUATED & LOCKED
                </div>
              )}
              
              <div style={{ background: '#070a12', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.01)', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🎯 Goal Instruction Objective:</strong> 
                  {assignment?.assignmentObjective || "Design an automated isolation architecture schema mapping local thread hooks loops constraints."}
                </div>
              </div>

              {/* 🚀 Dynamic Interceptor Action Launch Configuration Button */}
              <button 
                onClick={onLaunchAssignment}
                disabled={!!activeAssignmentResult}
                style={{ 
                  background: activeAssignmentResult ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, #10b981, #059669)', 
                  color: activeAssignmentResult ? '#475569' : '#fff', 
                  border: activeAssignmentResult ? '1px solid #1e293b' : 'none',
                  padding: '0.8rem 1.75rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.88rem',
                  cursor: activeAssignmentResult ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeAssignmentResult ? 'none' : '0 8px 16px rgba(16, 185, 129, 0.15)'
                }}
              >
                <Terminal size={16}/> {activeAssignmentResult ? "Sandbox Vault Closed" : "Proceed To Take Assignment Terminal"}
              </button>

              {/* 🚀 Dynamic Inline Readout Dashboard Blocks of AI Critic Logs */}
              {activeAssignmentResult && (
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid #1e293b', paddingTop: '2rem', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <Sparkles size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'text-bottom' }}/> Verified Engine Metrics Output
                    </div>
                    <div style={{ background: '#070a12', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      RATING: <span style={{ color: '#10b981', fontWeight: '800' }}>{activeAssignmentResult.approachScore} / 100</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                    <div style={{ background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.01)', lineHeight: '1.5' }}>
                      <strong style={{ color: '#8b5cf6', display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>📊 Complexity Parameters Analysis:</strong>
                      {activeAssignmentResult.complexityAnalysis}
                    </div>
                    
                    <div style={{ background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.01)', lineHeight: '1.5' }}>
                      <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>💡 Architectural Critique Node:</strong>
                      {activeAssignmentResult.architecturalCritique}
                    </div>
                    
                    <div style={{ background: '#02040a', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Refactored Ideal Template Alternative:</strong>
                      <pre style={{ color: '#a7f3d0', fontFamily: '"Fira Code", monospace', fontSize: '0.85rem', marginTop: '0.5rem', overflowX: 'auto', lineHeight: '1.5', background: '#070a12', padding: '1rem', borderRadius: '6px' }}>
                        {activeAssignmentResult.betterAlternativeTemplate}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}