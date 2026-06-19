import React, { useState, useEffect } from 'react';
import './AICourseLearningWorkspace.css';

function AICourseLearningWorkspace({ courseData, onBack }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [activeExpandedModule, setActiveExpandedModule] = useState(0);
  
  // Tavily dynamic query state elements trackers
  const [activeLinksMatrix, setActiveLinksMatrix] = useState(null);
  const [isSearchingTavily, setIsSearchingTavily] = useState(false);

  useEffect(() => {
    if (courseData?._id) {
      const savedTracks = localStorage.getItem(`progress_${courseData._id}`);
      if (savedTracks) {
        setCompletedTopics(JSON.parse(savedTracks));
      }
    }
  }, [courseData]);

  // 🚀 TAVILY DATA AGGREGATION ROUTE ACCESS POINT HOOK
  const handleTopicSelection = async (topicName) => {
    setSelectedTopic(topicName);
    setIsSearchingTavily(true);
    setActiveLinksMatrix(null);

    try {
      const token = localStorage.getItem('token');
      const activeHost = window.location.hostname;

      const response = await fetch(`http://${activeHost}:5000/api/courses/topics/tavily-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          topicName: topicName,
          courseTitle: courseData.title
        })
      });

      const serverPayload = await response.json();
      if (serverPayload.success) {
        setActiveLinksMatrix(serverPayload.data);
      }
    } catch (err) {
      console.error("Tavily dynamic link resolution pipeline fault:", err);
    } finally {
      setIsSearchingTavily(false);
    }
  };

  const toggleTopicCompletion = (topicName) => {
    let updatedList;
    if (completedTopics.includes(topicName)) {
      updatedList = completedTopics.filter(t => t !== topicName);
    } else {
      updatedList = [...completedTopics, topicName];
    }
    setCompletedTopics(updatedList);
    localStorage.setItem(`progress_${courseData._id}`, JSON.stringify(updatedList));
  };

  const getAllTopicsList = () => {
    return courseData?.modules?.reduce((acc, currentModule) => {
      return acc.concat(currentModule.topics);
    }, []) || [];
  };

  const totalTopicsCount = getAllTopicsList().length;
  const completedCount = completedTopics.length;
  const progressPercentage = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="workspace-ambient-wrapper">
      <div className="cyber-ambient-grid-underlay"></div>
      
      <div className="workspace-dual-pane-scaffold">
        
        {/* LEFT PANE: NAVIGATION TIMELINE CHECKLIST */}
        <div className="left-pane-timeline-sidebar">
          <div className="sidebar-header-branding">
            <button onClick={onBack} className="sidebar-back-button">&larr; Return to Dashboard</button>
            <span className="learning-status-pill">{courseData.contentType || 'Technical'} Track</span>
            <h1 className="course-main-title">{courseData.title}</h1>
            
            <div className="sidebar-progress-card">
              <div className="progress-labels">
                <span className="lbl-progress">Syllabus Covered:</span>
                <span className="val-progress">{progressPercentage}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill-neon" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span className="progress-counts">{completedCount} of {totalTopicsCount} topics completed</span>
            </div>
          </div>

          <div className="modules-accordion-stack">
            {courseData.modules.map((module, mIdx) => {
              const isModuleExpanded = activeExpandedModule === mIdx;
              return (
                <div key={module.moduleId || mIdx} className="module-accordion-card">
                  <div 
                    className={`accordion-trigger-row ${isModuleExpanded ? 'is-active' : ''}`}
                    onClick={() => setActiveExpandedModule(isModuleExpanded ? -1 : mIdx)}
                  >
                    <div className="trigger-badge">M_{mIdx + 1}</div>
                    <div className="trigger-info">
                      <h4>{module.moduleName}</h4>
                      <p>{module.topics.length} Target Topics</p>
                    </div>
                  </div>

                  {isModuleExpanded && (
                    <div className="accordion-nested-content-list">
                      {module.topics.map((topic, tIdx) => {
                        const isCompleted = completedTopics.includes(topic);
                        const isCurrentActive = selectedTopic === topic;
                        return (
                          <div 
                            key={tIdx} 
                            onClick={() => handleTopicSelection(topic)}
                            className={`topic-nested-item-row ${isCurrentActive ? 'is-active-highlight' : ''}`}
                          >
                            <div 
                              onClick={(e) => { e.stopPropagation(); toggleTopicCompletion(topic); }}
                              className={`completion-checkbox ${isCompleted ? 'is-checked' : ''}`}
                            >
                              {isCompleted && '✓'}
                            </div>
                            <span className="topic-text-item">{topic}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: ACCURATE TAVILY RESULT INTERFACE CANVASES */}
        <div className="right-pane-rich-workspace">
          
          {!selectedTopic && (
            <div className="workspace-idle-onboarding-panel">
              <div className="idle-globe-ambient-neon"></div>
              <h2 className="workspace-welcome-title">Tavily Powered Reference Lab</h2>
              <p className="workspace-welcome-sub">Left menu parameters timeline se koi bhi target topic click kijiye. Tavily search clusters instantly GeeksforGeeks standard links aur relevant walkthrough streams generate kar dega!</p>
            </div>
          )}

          {isSearchingTavily && (
            <div className="workspace-content-loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div className="glowing-cyber-spinner"></div>
              <p style={{ color: '#06b6d4', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '1rem' }}>Tavily AI Search crawling real-time technical repositories...</p>
            </div>
          )}

          {!isSearchingTavily && selectedTopic && activeLinksMatrix && (
            <div className="study-content-scrollable-canvas" style={{ maxWidth: '100%', padding: '2.5rem' }}>
              
              <div className="study-canvas-header-block mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' }}>
                <div>
                  <span className="category-tag-neon">LuminaLearn Tavily Stream Sync Engine Active</span>
                  <h1 className="study-main-topic-headline" style={{ fontSize: '1.8rem', marginTop: '0.25rem', color: '#fff' }}>{selectedTopic}</h1>
                </div>
                
                <button 
                  onClick={() => toggleTopicCompletion(selectedTopic)} 
                  className={`mark-done-btn-badge ${completedTopics.includes(selectedTopic) ? 'is-done-active' : ''}`}
                >
                  {completedTopics.includes(selectedTopic) ? '✓ Completed' : 'Mark as Complete'}
                </button>
              </div>

              {/* 📺 1. LIVE INTERNAL NATIVE EMBED VIDEO MODULE FRAME CONTAINER */}
              <div className="code-block-workspace-terminal mb-6" style={{ border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                <div className="terminal-header-top" style={{ background: '#1c0d0d' }}>
                  <div className="terminal-bullets"></div>
                  <span className="terminal-lbl" style={{ color: '#f87171', fontWeight: 'bold' }}>📺 Dynamic Reference Instructional Video Block</span>
                </div>
                <div style={{ position: 'relative', paddingBottom: '45%', height: 0, overflow: 'hidden', background: '#000' }}>
                  <iframe 
                    src={activeLinksMatrix.youtubeEmbed}
                    title="In-App Target Stream Player"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* 🟩 2. TAVILY VERIFIED LINKS REDIRECTION MATRIX BOX */}
              <div className="study-takeaways-glowing-card">
                <h3 className="section-sub-title" style={{ color: '#06b6d4' }}>📚 Tavily Verified Direct Study Materials</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Tavily Engine search routers ne is specified concept query ke liye sabse valid code archives link map kiye hain:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  
                  <a href={activeLinksMatrix.geeksForGeeks} target="_blank" rel="noreferrer" className="package-pill-box" style={{ textDecoration: 'none', display: 'block', background: 'rgba(34,197,94,0.03)', borderColor: 'rgba(34,197,94,0.2)' }}>
                    <div className="pill-type-header" style={{ color: '#22c55e' }}>🟩 GeeksforGeeks Original Sheet</div>
                    <h4 style={{ fontSize: '0.85rem', color: '#fff', margin: '0.25rem 0 0 0' }}>Launch Core Documentation</h4>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Open direct optimized coding layouts and logic variations &rarr;</span>
                  </a>

                  <a href={activeLinksMatrix.wikipedia} target="_blank" rel="noreferrer" className="package-pill-box" style={{ textDecoration: 'none', display: 'block', background: 'rgba(56,189,248,0.03)', borderColor: 'rgba(56,189,248,0.2)' }}>
                    <div className="pill-type-header" style={{ color: '#38bdf8' }}>% Wikipedia Theoretical Grid</div>
                    <h4 style={{ fontSize: '0.85rem', color: '#fff', margin: '0.25rem 0 0 0' }}>Theorems & Definitions</h4>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Review asymptotic analysis and usage paradigms &rarr;</span>
                  </a>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AICourseLearningWorkspace;