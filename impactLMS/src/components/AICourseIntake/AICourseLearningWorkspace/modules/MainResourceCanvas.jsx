import React from 'react';
import { BarChart3, Lock, Cpu, Clock, BookOpen, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

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
  courseId,          
  moduleId,          
  activeQuizResult   // 🚀 Score metadata received from parent cache state
}) {
  
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  // 🚀 AUTOMATED TELEMETRY MATH INJECTIONS
  const totalQuestions = activeQuizResult?.total || 10;
  const correctAnswers = activeQuizResult?.correct || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracyPercentage = activeQuizResult?.percentage || 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#02040a', padding: '2rem', overflowY: 'auto', color: '#fff', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Dynamic Tab Control Matrices */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('video')} 
          style={{ background: activeTab === 'video' ? 'rgba(6,182,212,0.05)' : 'transparent', border: 'none', color: activeTab === 'video' ? '#06b6d4' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
        >
          By-Topic Smart Lecture Masterclass
        </button>
        <button 
          onClick={() => setActiveTab('quiz')} 
          style={{ background: activeTab === 'quiz' ? 'rgba(245,158,11,0.05)' : 'transparent', border: 'none', color: activeTab === 'quiz' ? '#f59e0b' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
        >
          ⚡ Quiz Evaluation
        </button>
        <button 
          onClick={() => setActiveTab('assignment')} 
          style={{ background: activeTab === 'assignment' ? 'rgba(16,185,129,0.05)' : 'transparent', border: 'none', color: activeTab === 'assignment' ? '#10b981' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
        >
          🛠️ Assignment Challenge
        </button>
      </div>

      {/* Main Terminal Screen Canvas */}
      <div style={{ flex: 1, background: '#070a12', border: '1px solid rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem' }}>
        
        {/* TAB 1: VIDEO MASTERCLASS LECTURE */}
        {activeTab === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
              Active Workspace Concept Node: {topicName}
            </h2>
            
            <div style={{ height: '360px', background: '#02040a', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <iframe width="100%" height="100%" src={getEmbedUrl(videoSearchQuery)} title="Video Console" frameBorder="0" allowFullScreen />
            </div>

            {materialNotes && materialNotes.htmlContent ? (
              <div 
                className="dynamic-rich-unconstrained-article"
                style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.75', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                dangerouslySetInnerHTML={{ __html: materialNotes.htmlContent }} 
              />
            ) : (
              <div style={{ color: '#475569', fontSize: '0.88rem', padding: '4rem 2rem', textAlign: 'center', border: '1px dashed #1e293b', borderRadius: '0.5rem' }}>
                🔄 Awaiting server handshake... Stream compiling raw concept blocks blueprints.
              </div>
            )}

            <button onClick={onComplete} style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '2rem' }}>
              Mark Concept Finished
            </button>
          </div>
        )}

        {/* ⚡ TAB 2: SECURE STUDIO QUIZ EVALUATION (WITH EXTENDED COMPREHENSIVE SCORECARD) */}
        {activeTab === 'quiz' && (
          <div style={{ maxWidth: '700px' }}>
            <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              ⚡ Module Quiz Evaluation: {quiz?.name || "Topic Verification Quiz"}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 2rem 0', lineHeight: '1.4' }}>
              This dynamic quiz bounds test constraints mapped explicitly for your verified workspace modules.
            </p>

            {/* Premium Obsidian Glass Card */}
            <div style={{ background: '#020617', border: activeQuizResult ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid #1e293b', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              
              {/* 🔒 Dynamic Environmental Absolute Lock Badge */}
              {activeQuizResult && (
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Lock size={12} /> COMPLETED & LOCKED
                </div>
              )}

              {/* Assessment Telemetry Metadata Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: '#070a12', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} color="#8b5cf6" /> <strong>Core Scope Focus:</strong> <span style={{ color: '#06b6d4' }}>{quiz?.quizTopic || "Universal Module Concepts"}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="#ef4444" /> <strong>Expected Speed Cap:</strong> <span>{quiz?.duration || "10 Minutes standard allotment"}</span>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button 
                onClick={onLaunchQuiz}
                disabled={!!activeQuizResult} 
                style={{ 
                  background: activeQuizResult ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  border: activeQuizResult ? '1px solid #1e293b' : 'none', 
                  color: activeQuizResult ? '#475569' : '#020617', 
                  padding: '0.8rem 1.75rem', 
                  borderRadius: '8px', 
                  fontSize: '0.9rem',
                  fontWeight: '800', 
                  cursor: activeQuizResult ? 'not-allowed' : 'pointer', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem'
                }}
              >
                {activeQuizResult ? "Assessment Token Cleared" : "Proceed To Take Quiz Terminal"}
              </button>

              {/* 🚀 EXTENSIVE PERFORMANCE OUTPUT LOG CARD FOR MANISH */}
              {activeQuizResult && (
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid #1e293b', paddingTop: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                    <BarChart3 size={16} /> Secure Verification Performance Output
                  </div>
                  
                  {/* Next Level 4-Column Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    
                    {/* Metric 1: Accuracy Percentage */}
                    <div style={{ background: '#070a12', border: '1px solid #1e293b', padding: '1.25rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>ACCURACY RATIO</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: accuracyPercentage >= 70 ? '#10b981' : '#f59e0b', marginTop: '0.25rem', fontFamily: '"Orbitron", monospace' }}>
                          {accuracyPercentage.toFixed(0)}%
                        </div>
                      </div>
                      <BarChart3 size={24} color={accuracyPercentage >= 70 ? '#10b981' : '#f59e0b'} style={{ opacity: 0.25 }} />
                    </div>

                    {/* Metric 2: Total Items */}
                    <div style={{ background: '#070a12', border: '1px solid #1e293b', padding: '1.25rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>TOTAL MATRIX ITEMS</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#06b6d4', marginTop: '0.25rem', fontFamily: '"Orbitron", monospace' }}>
                          {totalQuestions}
                        </div>
                      </div>
                      <HelpCircle size={24} color="#06b6d4" style={{ opacity: 0.25 }} />
                    </div>

                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    
                    {/* Metric 3: Correct Items (Verified) */}
                    <div style={{ background: '#070a12', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>CORRECT / WRITTEN</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem', fontFamily: '"Orbitron", monospace' }}>
                          {correctAnswers} <span style={{ fontSize: '0.85rem', color: '#475569' }}>VALID</span>
                        </div>
                      </div>
                      <CheckCircle2 size={24} color="#10b981" style={{ opacity: 0.3 }} />
                    </div>

                    {/* Metric 4: Wrong Items (Dropped) */}
                    <div style={{ background: '#070a12', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '1.25rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '700' }}>WRONG / DROPPED</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444', marginTop: '0.25rem', fontFamily: '"Orbitron", monospace' }}>
                          {wrongAnswers} <span style={{ fontSize: '0.85rem', color: '#475569' }}>FLAWED</span>
                        </div>
                      </div>
                      <XCircle size={24} color="#ef4444" style={{ opacity: 0.3 }} />
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENT CORE CHALLENGE */}
        {activeTab === 'assignment' && (
          <div>
            <h3 style={{ color: '#10b981', margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '700' }}>
              🛠️ Core Challenge Task: {assignment?.name}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {assignment?.assignmentObjective}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}