import React, { useState, useEffect } from 'react';
import './AICourseIntake.css';

function AICourseIntake() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);
  
  const [savedCoursesList, setSavedCoursesList] = useState([]);
  const [activeViewportCourse, setActiveViewportCourse] = useState(null);
  const [currentActiveDashboardTab, setCurrentActiveDashboardTab] = useState('generate'); 

  // 🚀 DYNAMIC IP RESOLVER FOR MULTI-COMPUTER LOCAL NETWORKS
  const getApiUrl = (endpoint) => {
    const activeHost = window.location.hostname;
    return `http://${activeHost}:5000${endpoint}`;
  };

  useEffect(() => {
    fetchSavedCoursesFromDatabase();
  }, []);

  const fetchSavedCoursesFromDatabase = async () => {
    try {
      const activeSessionToken = localStorage.getItem('token');
      if (!activeSessionToken) return;

      const response = await fetch(getApiUrl('/api/courses'), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${activeSessionToken}` }
      });
      const dataPayload = await response.json();
      if (response.ok && dataPayload.success) {
        setSavedCoursesList(dataPayload.data);
      }
    } catch (err) {
      console.error("Historical cluster syncing error:", err);
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorLogs(null);

    try {
      const activeSessionToken = localStorage.getItem('token');
      if (!activeSessionToken) throw new Error("Authorization missing. Re-login to setup session identifier context tokens.");

      const response = await fetch(getApiUrl('/api/courses/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeSessionToken}`
        },
        body: JSON.stringify({ prompt: inputPrompt, level: selectedLevel })
      });

      const serverPayload = await response.json();
      if (!response.ok || !serverPayload.success) throw new Error(serverPayload.error || "Generation error exceptions loop trace.");

      setActiveViewportCourse(serverPayload.data);
      fetchSavedCoursesFromDatabase(); 
      setIsGenerating(false);
    } catch (err) {
      setErrorLogs(err.message || "Failed to establish communication layers handshake.");
      setIsGenerating(false);
    }
  };

  const handleCourseDeletionNode = async (courseId, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this roadmap node from memory?")) return;

    try {
      const activeSessionToken = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/courses/${courseId}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeSessionToken}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (activeViewportCourse?._id === courseId) setActiveViewportCourse(null);
        fetchSavedCoursesFromDatabase();
      }
    } catch (err) {
      alert("Failed to clear course data element payload from database collection server.");
    }
  };

  return (
    <div className="centralized-prompt-matrix-viewport">
      <div className="cyber-ambient-grid-underlay"></div>

      {/* DASHBOARD NAVIGATION PANEL */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '1rem', width: '100%', maxWidth: '76rem', margin: '0 auto 2rem auto', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
        <button 
          onClick={() => { setCurrentActiveDashboardTab('generate'); setActiveViewportCourse(null); }} 
          className={`pill-selector-item ${currentActiveDashboardTab === 'generate' ? 'is-active' : ''}`}
        >
          ✨ Generate Course Path
        </button>
        <button 
          onClick={() => setCurrentActiveDashboardTab('manage')} 
          className={`pill-selector-item ${currentActiveDashboardTab === 'manage' ? 'is-active' : ''}`}
        >
          📂 Manage Courses ({savedCoursesList.length})
        </button>
      </div>

      {/* INPUT PROMPT VIEWPORT */}
      {currentActiveDashboardTab === 'generate' && !activeViewportCourse && (
        <div className="roadmap-master-scaffold-container max-w-xl">
          <form onSubmit={handleGenerateSubmit} className="interactive-glass-card">
            <h2 className="gradient-heading-text" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>AI Intelligent Syllabus Architect</h2>
            
            {errorLogs && (
              <div style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '12px', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {errorLogs}
              </div>
            )}

            <div className="form-input-wrapper-node" style={{ marginBottom: '1.5rem' }}>
              <label className="input-field-terminal-label">Technology, Topic, or Activity Subject</label>
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Example: Full Java Stack development OR Professional Football Defense tactics and postures..."
                required
                disabled={isGenerating}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="pill-selector-mesh">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`pill-selector-item ${selectedLevel === lvl ? 'is-active' : ''}`}
                    onClick={() => !isGenerating && setSelectedLevel(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <button type="submit" className="prompt-matrix-submit-btn" disabled={isGenerating}>
                {isGenerating ? 'Analyzing Domain...' : 'Generate and Commit to DB'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REPOSITORY LIST VIEWPORT */}
      {currentActiveDashboardTab === 'manage' && !activeViewportCourse && (
        <div className="roadmap-master-scaffold-container max-w-4xl w-full">
          <div className="interactive-glass-card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>Saved Roadmap Repository Logs</h2>
            {savedCoursesList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No persistent structures recorded inside your cloud workspace profile nodes index. Go generate a path first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {savedCoursesList.map((course) => (
                  <div 
                    key={course._id} 
                    onClick={() => setActiveViewportCourse(course)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(15,23,42,0.6)', border: '1px solid #1e293b', borderRadius: '0.75rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    className="hover:border-cyan-500/40"
                  >
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{course.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Domain Class: {course.contentType} | Tracks: {course.modules.length} Modules</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', background: '#1e1b4b', border: '1px solid #312e81', color: '#a78bfa', padding: '0.25rem 0.5rem', borderRadius: '0.35rem', fontWeight: 'bold' }}>{course.level}</span>
                      <button 
                        onClick={(e) => handleCourseDeletionNode(course._id, e)}
                        className="pill-selector-item" 
                        style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.05)', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE INTEGRATED ROADMAP DISPLAY VIEWPORT */}
      {activeViewportCourse && (
        <div className="roadmap-master-scaffold-container animate-fadeIn">
          <div className="interactive-glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Cloud Storage Engine Registry Identity Verified [Sync_OK]
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0 0 0' }}>{activeViewportCourse.title}</h1>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                <span style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#06b6d4' }}>
                  Depth: {activeViewportCourse.level}
                </span>
                <span style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                  Timeframe: {activeViewportCourse.estimatedTime}
                </span>
                <button onClick={() => { setActiveViewportCourse(null); if (currentActiveDashboardTab === 'generate') setCurrentActiveDashboardTab('manage'); }} className="pill-selector-item" style={{ color: '#fff', borderColor: '#374151' }}>Back to Grid</button>
              </div>
            </div>

            <div className="module-timeline-wrapper-node">
              {activeViewportCourse.modules.map((moduleItem, idx) => (
                <div key={moduleItem.moduleId || idx} className="module-timeline-node-card">
                  <div className="timeline-bullet-counter">{idx + 1}</div>
                  
                  <div className="node-card-inner-box">
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>{moduleItem.moduleName}</h2>
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: '1.6', margin: '0 0 1.25rem 0' }}>{moduleItem.shortSummary}</p>

                    {/* DYNAMIC VISUAL GUIDELINES FOR NON-TECHNICAL COURSES */}
                    {activeViewportCourse.contentType === "Non-Technical" && moduleItem.visualGuidelines && (
                      <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.15)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#06b6d4', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>🖼️ AI Visual Blueprint / Performance Posture Map:</span>
                        <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, fontStyle: 'italic' }}>{moduleItem.visualGuidelines}</p>
                      </div>
                    )}

                    <div style={{ marginBottom: '1.25rem' }}>
                      <span className="lbl-stat" style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Target Topic Parameters:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {moduleItem.topics.map((topic, tIdx) => (
                          <span key={tIdx} style={{ fontSize: '0.75rem', background: '#0f172a', border: '1px solid #1e293b', padding: '0.35rem 0.75rem', borderRadius: '0.35rem', color: '#cbd5e1', fontWeight: 600 }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="meta-packages-asymmetric-row">
                      
                      {/* QUIZ CARD */}
                      <div className="package-pill-box">
                        <div className="pill-type-header quiz-theme">⚡ Scheduled Quiz Evaluation</div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fff' }}>{moduleItem.quiz.name}</h4>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                          <div>Topic Scope: {moduleItem.quiz.quizTopic}</div>
                          <div>Duration: {moduleItem.quiz.duration}</div>
                        </div>
                      </div>

                      {/* ASSIGNMENT CARD */}
                      <div className="package-pill-box">
                        <div className="pill-type-header assignment-theme">🛠️ Core Module Assignment</div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fff' }}>{moduleItem.assignment.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>{moduleItem.assignment.assignmentObjective}</p>
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', color: '#fbbf24', fontWeight: 'bold', marginTop: '0.5rem' }}>
                          Complexity: {moduleItem.assignment.complexity}
                        </span>
                      </div>

                      {/* CURATED STREAM PLATFORM CARD */}
                      <div className="package-pill-box">
                        <div className="pill-type-header youtube-theme">📺 Curated Stream Platform</div>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 0.5rem 0' }}>Relevant video tracking queries for live session validation study:</p>
                        <a 
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(moduleItem.youtubeSearchQuery)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="youtube-search-embed-link"
                        >
                          Launch Reference Tutorial Video
                        </a>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AICourseIntake;