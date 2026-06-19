import React, { useState, useEffect } from 'react';
import './AICourseLearningWorkspace.css';

function AICourseLearningWorkspace({ courseData, onBack }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [activeExpandedModule, setActiveExpandedModule] = useState(0);

  useEffect(() => {
    if (courseData?._id) {
      const savedTracks = localStorage.getItem(`progress_${courseData._id}`);
      if (savedTracks) {
        setCompletedTopics(JSON.parse(savedTracks));
      }
    }
  }, [courseData]);

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

  // 🚀 HIGH-SPEED EMBED ENGINE (NO AI / NO BACKEND LOAD)
  const getResourceLinks = (topicName) => {
    // Exact topic context and title search term strings combination
    const rawSearchQuery = `${courseData.title} ${topicName} tutorial`;
    const cleanQuery = encodeURIComponent(rawSearchQuery);
    
    return {
      geeksForGeeks: `https://www.geeksforgeeks.org/search/${encodeURIComponent(courseData.title + ' ' + topicName)}`,
      // 📺 New absolute structure uses native standard query mapping to auto-play relevant video content inside iframe 
      youtubeEmbed: `https://www.youtube.com/embed?q=${cleanQuery}&rel=0&modestbranding=1`,
      wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topicName)}`
    };
  };

  const activeLinks = selectedTopic ? getResourceLinks(selectedTopic) : null;

  return (
    <div className="workspace-ambient-wrapper">
      <div className="cyber-ambient-grid-underlay"></div>
      
      <div className="workspace-dual-pane-scaffold">
        
        {/* LEFT PANE: ROADMAP TIMELINE ACCORDION */}
        <div className="left-pane-timeline-sidebar">
          <div className="sidebar-header-branding">
            <button onClick={onBack} className="sidebar-back-button">&larr; Return to Dashboard</button>
            <span className="learning-status-pill">{courseData.contentType || 'Technical'} Track</span>
            <h1 className="course-main-title">{courseData.title}</h1>
            
            <div className="sidebar-progress-card">
              <div className="progress-labels">
                <span className="lbl-progress">Syllabus Progress:</span>
                <span className="val-progress">{progressPercentage}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill-neon" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span className="progress-counts">{completedCount} / {totalTopicsCount} Topics Met</span>
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
                      <p>{module.topics.length} Sub-Topics</p>
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
                            onClick={() => setSelectedTopic(topic)}
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

        {/* RIGHT PANE: CONSOLIDATED CENTRAL VIEWPORT */}
        <div className="right-pane-rich-workspace">
          
          {!selectedTopic && (
            <div className="workspace-idle-onboarding-panel">
              <div className="idle-globe-ambient-neon"></div>
              <h2 className="workspace-welcome-title">Production Study Console</h2>
              <p className="workspace-welcome-sub">Left side panel se kisi bhi topic par click kijiye. Hamara integrated standalone player instantly relevant tutorial video bina website chhode play kar dega!</p>
            </div>
          )}

          {selectedTopic && activeLinks && (
            <div className="study-content-scrollable-canvas" style={{ maxWidth: '100%', padding: '2.5rem' }}>
              
              <div className="study-canvas-header-block mb-6" style={{ display: 'flex', System: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' }}>
                <div>
                  <span className="category-tag-neon">LuminaLearn Active Streaming Console</span>
                  <h1 className="study-main-topic-headline" style={{ fontSize: '1.8rem', marginTop: '0.25rem', color: '#fff' }}>{selectedTopic}</h1>
                </div>
                
                <button 
                  onClick={() => toggleTopicCompletion(selectedTopic)} 
                  className={`mark-done-btn-badge ${completedTopics.includes(selectedTopic) ? 'is-done-active' : ''}`}
                  style={{ marginLeft: 'auto' }}
                >
                  {completedTopics.includes(selectedTopic) ? '✓ Completed' : 'Mark as Complete'}
                </button>
              </div>

              {/* 📺 1. EMBEDDED DYNAMIC TUTORIAL PLAYER CONTAINER (AUTOMATIC SEARCH TARGET) */}
              <div className="code-block-workspace-terminal mb-6" style={{ border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                <div className="terminal-header-top" style={{ background: '#1c0d0d' }}>
                  <div className="terminal-bullets"></div>
                  <span className="terminal-lbl" style={{ color: '#f87171', fontWeight: 'bold' }}>📺 Live Dedicated Tutorial Reference Video</span>
                </div>
                <div style={{ position: 'relative', paddingBottom: '50%', height: 0, overflow: 'hidden', background: '#000' }}>
                  <iframe 
                    src={activeLinks.youtubeEmbed}
                    title="In-House Embedded Video Player"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* 🟩 2. DIRECT STUDY REFERENCE HUB PATHWAYS */}
              <div className="study-takeaways-glowing-card">
                <h3 className="section-sub-title" style={{ color: '#06b6d4' }}>🟩 Core Problem Sets & Archives</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Is particular topic ke original coding variables, step-by-step algorithms, and optimization programs ko padhne ke liye core platform nodes open kijiye:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  
                  <a href={activeLinks.geeksForGeeks} target="_blank" rel="noreferrer" className="package-pill-box" style={{ textDecoration: 'none', display: 'block', background: 'rgba(34,197,94,0.03)', borderColor: 'rgba(34,197,94,0.2)' }}>
                    <div className="pill-type-header" style={{ color: '#22c55e' }}>🟩 GeeksforGeeks Library</div>
                    <h4 style={{ fontSize: '0.85rem', color: '#fff', margin: '0.25rem 0 0 0' }}>Launch Targeted Search</h4>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Open direct optimized implementations & variations &rarr;</span>
                  </a>

                  <a href={activeLinks.wikipedia} target="_blank" rel="noreferrer" className="package-pill-box" style={{ textDecoration: 'none', display: 'block', background: 'rgba(56,189,248,0.03)', borderColor: 'rgba(56,189,248,0.2)' }}>
                    <div className="pill-type-header" style={{ color: '#38bdf8' }}>🟦 Wikipedia Matrix</div>
                    <h4 style={{ fontSize: '0.85rem', color: '#fff', margin: '0.25rem 0 0 0' }}>Theorems & Analysis</h4>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>Review core definitions & asymptotic complexities &rarr;</span>
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