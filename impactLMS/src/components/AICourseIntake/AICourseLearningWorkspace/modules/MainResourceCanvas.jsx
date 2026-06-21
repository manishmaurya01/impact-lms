import React from 'react';

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
  courseId,    // 🚀 UNPACKING TELEMETRY BINDING
  moduleId     // 🚀 UNPACKING TELEMETRY BINDING
}) {
  
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#02040a', padding: '2rem', overflowY: 'auto', color: '#fff' }}>
      
      {/* Dynamic Tab Matrices */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('video')} style={{ background: activeTab === 'video' ? 'rgba(6,182,212,0.05)' : 'transparent', border: 'none', color: activeTab === 'video' ? '#06b6d4' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          By-Topic Smart Lecture Masterclass
        </button>
        <button onClick={() => setActiveTab('quiz')} style={{ background: activeTab === 'quiz' ? 'rgba(245,158,11,0.05)' : 'transparent', border: 'none', color: activeTab === 'quiz' ? '#f59e0b' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          ⚡ Quiz Evaluation
        </button>
        <button onClick={() => setActiveTab('assignment')} style={{ background: activeTab === 'assignment' ? 'rgba(16,185,129,0.05)' : 'transparent', border: 'none', color: activeTab === 'assignment' ? '#10b981' : '#64748b', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          🛠️ Assignment Challenge
        </button>
      </div>

      <div style={{ flex: 1, background: '#070a12', border: '1px solid rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem' }}>
        
        {activeTab === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', color: '#fff' }}>
              Active Workspace Concept Node: {topicName}
            </h2>
            
            <div style={{ height: '360px', background: '#02040a', borderRadius: '0.5rem', overflow: 'hidden' }}>
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

        {/* 🚀 QUIZ TAB VIEW - DESIGN UPGRADED WITH LAUNCH HOOKS */}
        {activeTab === 'quiz' && (
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: '700' }}>
              ⚡ Module Quiz Evaluation: {quiz?.name || "Topic Verification Quiz"}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 2rem 0' }}>
              This dynamic quiz bounds test constraints mapped explicitly for your verified workspace modules.
            </p>

            <div style={{ background: '#02040a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}><strong>📚 Core Scope Focus:</strong> {quiz?.quizTopic || "Universal Module Concepts"}</div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}><strong>⏳ Expected Speed Cap:</strong> {quiz?.duration || "Unlimited Time Allocations"}</div>
              </div>

              {/* Action Button that switches Component Frame */}
              <button 
                onClick={onLaunchQuiz}
                style={{ background: '#f59e0b', border: 'none', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Proceed To Take Quiz Terminal
              </button>
            </div>
          </div>
        )}

        {activeTab === 'assignment' && (
          <div>
            <h3 style={{ color: '#10b981', margin: '0 0 1rem 0' }}>🛠️ Core Challenge Task: {assignment?.name}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>{assignment?.assignmentObjective}</p>
          </div>
        )}

      </div>
    </div>
  );
}